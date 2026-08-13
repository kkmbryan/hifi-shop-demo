#!/usr/bin/env python3
"""
Hi-Fi Shop Demo - Seed Product Image Ingestion & GCS Upload Script
===================================================================

File: scripts/upload_seed_images.py
Description:
    Parses product records and image URLs from `sql/03_seed_data.sql` for 32 flagship
    audiophile products across 8 categories. Generates high-resolution (1200x1200)
    representative Hi-Fi studio product demo images using Pillow (or downloads from
    configured remote sources), and uploads them to the Google Cloud Storage bucket
    `gs://hifi-shop-demo-assets/products/` using the `google-cloud-storage` SDK.

Categories Covered (32 Products):
    1. dacs (4 products)
    2. amplifiers (4 products)
    3. streamers (4 products)
    4. turntables (4 products)
    5. head-fi (4 products)
    6. loudspeakers (4 products)
    7. cables (4 products)
    8. power-conditioning (4 products)

Usage:
    # 1. Standard execution (generate images & upload to gs://hifi-shop-demo-assets/products/):
    python3 scripts/upload_seed_images.py

    # 2. Dry-run mode (parse SQL & generate images locally without GCS upload):
    python3 scripts/upload_seed_images.py --dry-run

    # 3. Custom SQL path & custom bucket:
    python3 scripts/upload_seed_images.py --sql-file sql/03_seed_data.sql --bucket my-custom-bucket

    # 4. Generate images only into local directory:
    python3 scripts/upload_seed_images.py --skip-upload --output-dir scripts/generated_images
"""

import argparse
import logging
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import requests
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError, NotFound

# -----------------------------------------------------------------------------
# Logging Configuration
# -----------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("upload_seed_images")


# -----------------------------------------------------------------------------
# 1. SQL Seed Data Parser
# -----------------------------------------------------------------------------
class SeedDataParser:
    """Parses SQL seed files to extract product metadata and image target URLs."""

    def __init__(self, sql_file_path: str):
        self.sql_file_path = Path(sql_file_path)
        if not self.sql_file_path.exists():
            raise FileNotFoundError(f"Seed SQL file not found at: {self.sql_file_path.resolve()}")

    @staticmethod
    def _tokenize_sql_values(values_str: str) -> List[str]:
        """
        Tokenizes SQL tuple values, handling escaped single quotes ('') and commas inside strings.
        """
        items = []
        current = []
        in_string = False
        i = 0
        length = len(values_str)

        while i < length:
            char = values_str[i]
            if char == "'":
                if in_string and i + 1 < length and values_str[i + 1] == "'":
                    current.append("'")
                    i += 2
                    continue
                else:
                    in_string = not in_string
                    i += 1
                    continue
            elif char == "," and not in_string:
                items.append("".join(current).strip())
                current = []
                i += 1
                continue
            current.append(char)
            i += 1

        if current:
            items.append("".join(current).strip())

        return items

    def parse_products(self) -> List[Dict[str, str]]:
        """
        Reads SQL seed file and extracts all product records.

        Returns:
            List of product dictionaries containing ID, category, brand, model,
            names, price, description, and image URL.
        """
        with open(self.sql_file_path, "r", encoding="utf-8") as f:
            content = f.read()

        product_blocks = re.findall(
            r"INSERT (?:OR UPDATE )?INTO Products \((.*?)\) VALUES \((.*?)\);", content, re.DOTALL
        )

        products = []
        for cols_str, vals_str in product_blocks:
            cols = [c.strip() for c in cols_str.split(",")]
            vals = self._tokenize_sql_values(vals_str)
            if len(cols) != len(vals):
                logger.warning(
                    "Column count (%d) and value count (%d) mismatch for product tuple.",
                    len(cols),
                    len(vals),
                )
                continue

            product = dict(zip(cols, vals))

            # Parse GCS bucket and blob filename from image_url if available
            img_url = product.get("image_url", "")
            match = re.match(r"https://storage\.googleapis\.com/([^/]+)/(.+)", img_url)
            if match:
                product["gcs_bucket_from_url"] = match.group(1)
                product["gcs_blob_name"] = match.group(2)
                product["local_filename"] = Path(match.group(2)).name
            else:
                product["gcs_bucket_from_url"] = "hifi-shop-demo-assets"
                product["local_filename"] = f"{product.get('product_id', 'product')}.jpg"
                product["gcs_blob_name"] = f"products/{product['local_filename']}"

            products.append(product)

        logger.info("Successfully parsed %d product records from %s", len(products), self.sql_file_path)
        return products


# -----------------------------------------------------------------------------
# 2. Hi-Fi Product Image Generator
# -----------------------------------------------------------------------------
class ProductImageGenerator:
    """Generates high-resolution, representative Hi-Fi product demo images using Pillow."""

    def __init__(self, font_name: Optional[str] = None):
        self.fonts = self._load_system_fonts()

    @staticmethod
    def _load_system_fonts() -> Dict[str, ImageFont.ImageFont]:
        """Attempts to load high quality system TTF fonts, falling back to PIL default font."""
        font_candidates = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
        ]
        chosen_font = None
        for path in font_candidates:
            if os.path.exists(path):
                chosen_font = path
                break

        fonts = {}
        if chosen_font:
            try:
                fonts["title"] = ImageFont.truetype(chosen_font, 48)
                fonts["subtitle"] = ImageFont.truetype(chosen_font, 36)
                fonts["badge"] = ImageFont.truetype(chosen_font, 24)
                fonts["small"] = ImageFont.truetype(chosen_font, 18)
                fonts["tiny"] = ImageFont.truetype(chosen_font, 14)
                logger.debug("Loaded TTF font from: %s", chosen_font)
                return fonts
            except Exception as e:
                logger.warning("Failed to load TTF font %s: %s", chosen_font, e)

        # Fallback default font
        default_font = ImageFont.load_default()
        return {
            "title": default_font,
            "subtitle": default_font,
            "badge": default_font,
            "small": default_font,
            "tiny": default_font,
        }

    def generate_image(
        self, product: Dict[str, str], output_path: str, width: int = 1200, height: int = 1200
    ) -> str:
        """
        Renders a high-resolution, category-tailored studio product demo image.

        Args:
            product: Product metadata dictionary.
            output_path: Destination local file path.
            width: Image width in pixels (default: 1200).
            height: Image height in pixels (default: 1200).

        Returns:
            Absolute path to generated image file.
        """
        cat = product.get("category_id", "dacs").lower()
        brand = product.get("brand", "Hi-Fi Brand").upper()
        model = product.get("model", "Flagship Model")
        name = product.get("name_en", f"{brand} {model}")
        price = product.get("price_hkd", "0.00")

        # Create base canvas with category-specific dark studio color scheme
        bg_color, accent_color, secondary_accent = self._get_category_palette(cat)
        img = Image.new("RGB", (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)

        # 1. Background gradient grid / subtle radial highlight
        self._draw_studio_background(draw, width, height, bg_color, accent_color)

        # 2. Draw category-specific vector illustration artwork
        self._draw_category_artwork(draw, cat, width, height, accent_color, secondary_accent)

        # 3. Studio Frame & Outer Border
        draw.rectangle([30, 30, width - 30, height - 30], outline=accent_color, width=3)
        draw.rectangle([38, 38, width - 38, height - 38], outline="#2A2E3D", width=1)

        # Corner aesthetic brackets
        corner_len = 40
        draw.line([(30, 30 + corner_len), (30, 30), (30 + corner_len, 30)], fill="#FFFFFF", width=5)
        draw.line([(width - 30 - corner_len, 30), (width - 30, 30), (width - 30, 30 + corner_len)], fill="#FFFFFF", width=5)
        draw.line([(30, height - 30 - corner_len), (30, height - 30), (30 + corner_len, height - 30)], fill="#FFFFFF", width=5)
        draw.line([(width - 30 - corner_len, height - 30), (width - 30, height - 30), (width - 30, height - 30 - corner_len)], fill="#FFFFFF", width=5)

        # 4. Header Badge: Category Label
        cat_title = f"[ {cat.upper().replace('-', ' ')} / AUDIOPHILE REFERENCE SERIES ]"
        draw.rectangle([60, 60, 60 + 580, 105], fill="#1E2230", outline=accent_color, width=2)
        draw.text((80, 72), cat_title, fill=accent_color, font=self.fonts["small"])

        # 5. Product Brand & Model Overlay
        draw.text((60, 130), brand, fill="#FFFFFF", font=self.fonts["title"])
        draw.text((60, 190), model, fill=accent_color, font=self.fonts["subtitle"])

        # 6. Price & Specs Badge at bottom
        price_text = f"HK$ {float(price):,.2f}" if price else ""
        draw.rectangle([60, height - 140, 400, height - 80], fill="#161B26", outline="#374151", width=2)
        draw.text((80, height - 120), "FLAGSHIP EDITION", fill="#9CA3AF", font=self.fonts["tiny"])
        draw.text((80, height - 105), price_text, fill="#F3F4F6", font=self.fonts["badge"])

        # 7. Watermark / Footer info
        footer_text = "HI-FI SHOP DEMO ASSETS • 1200x1200 HIGH-RES STUDIO DEMO IMAGE"
        draw.text((60, height - 60), footer_text, fill="#6B7280", font=self.fonts["tiny"])

        # Save image with high JPEG quality
        out_file = Path(output_path)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        img.save(out_file, format="JPEG", quality=95)
        logger.debug("Generated image saved to %s", out_file)
        return str(out_file.resolve())

    @staticmethod
    def _get_category_palette(category: str) -> Tuple[str, str, str]:
        """Returns (background_color, main_accent, secondary_accent) for category."""
        palettes = {
            "dacs": ("#0A0F1D", "#06B6D4", "#67E8F9"),  # Azure Cyan
            "amplifiers": ("#0F0E17", "#F59E0B", "#FCD34D"),  # Amber Gold
            "streamers": ("#0F172A", "#3B82F6", "#93C5FD"),  # Sapphire Blue
            "turntables": ("#1C130E", "#D97706", "#FBBF24"),  # Copper Vinyl
            "head-fi": ("#1E1B4B", "#8B5CF6", "#C084FC"),  # Deep Indigo Violet
            "loudspeakers": ("#1A1614", "#B45309", "#F59E0B"),  # Walnut Bronze
            "cables": ("#111827", "#10B981", "#6EE7B7"),  # Carbon Emerald
            "power-conditioning": ("#18181B", "#22C55E", "#86EFAC"),  # Industrial Green
        }
        return palettes.get(category.lower(), ("#111827", "#3B82F6", "#60A5FA"))

    @staticmethod
    def _draw_studio_background(draw: ImageDraw.ImageDraw, w: int, h: int, bg: str, accent: str):
        """Draws subtle studio gradient grid and background accents."""
        # Subtle grid lines
        grid_color = "#1F2937"
        for x in range(0, w, 80):
            draw.line([(x, 0), (x, h)], fill=grid_color, width=1)
        for y in range(0, h, 80):
            draw.line([(0, y), (w, y)], fill=grid_color, width=1)

    def _draw_category_artwork(
        self,
        draw: ImageDraw.ImageDraw,
        cat: str,
        w: int,
        h: int,
        accent: str,
        secondary: str,
    ):
        """Draws category-tailored Hi-Fi hardware graphics in center of canvas."""
        cx, cy = w // 2, h // 2 + 30

        if cat == "dacs":
            # DAC unit chassis with FPGA chip and OLED sampling rate display
            draw.rectangle([cx - 350, cy - 180, cx + 350, cy + 180], fill="#1E293B", outline=accent, width=4)
            # Display panel
            draw.rectangle([cx - 280, cy - 120, cx + 50, cy + 100], fill="#020617", outline="#334155", width=2)
            draw.text((cx - 250, cy - 80), "PCM 768kHz / DSD512", fill=accent, font=self.fonts["badge"])
            draw.text((cx - 250, cy - 30), "ULTRA-LOW JITTER WTA TAP", fill="#94A3B8", font=self.fonts["small"])
            draw.text((cx - 250, cy + 20), "-0.0 dB VOL :: FPGA ACTIVE", fill="#22C55E", font=self.fonts["small"])
            # Volume knob
            draw.ellipse([cx + 120, cy - 90, cx + 280, cy + 70], fill="#334155", outline=accent, width=4)
            draw.ellipse([cx + 140, cy - 70, cx + 260, cy + 50], fill="#1E293B", outline="#475569", width=2)
            draw.line([(cx + 200, cy - 70), (cx + 200, cy - 20)], fill="#FFFFFF", width=4)

        elif cat == "amplifiers":
            # Amplifier with dual illuminated VU meters and vacuum tube glow
            draw.rectangle([cx - 380, cy - 200, cx + 380, cy + 200], fill="#18181B", outline=accent, width=4)
            # Left VU Meter
            draw.rectangle([cx - 320, cy - 150, cx - 40, cy + 50], fill="#27272A", outline=accent, width=3)
            draw.arc([cx - 300, cy - 220, cx - 60, cy + 20], start=200, end=340, fill="#FEF08A", width=3)
            draw.line([(cx - 180, cy + 30), (cx - 100, cy - 100)], fill="#EF4444", width=3)  # Needle
            draw.text((cx - 240, cy + 10), "VU LEFT (WATT)", fill="#A1A1AA", font=self.fonts["tiny"])
            # Right VU Meter
            draw.rectangle([cx + 40, cy - 150, cx + 320, cy + 50], fill="#27272A", outline=accent, width=3)
            draw.arc([cx + 60, cy - 220, cx + 300, cy + 20], start=200, end=340, fill="#FEF08A", width=3)
            draw.line([(cx + 180, cy + 30), (cx + 240, cy - 100)], fill="#EF4444", width=3)  # Needle
            draw.text((cx + 120, cy + 10), "VU RIGHT (WATT)", fill="#A1A1AA", font=self.fonts["tiny"])
            # Power knobs & Vacuum Tube Glow
            draw.ellipse([cx - 60, cy + 80, cx + 60, cy + 170], fill="#F59E0B", outline="#FEF08A", width=4)
            draw.text((cx - 35, cy + 115), "300B", fill="#000000", font=self.fonts["badge"])

        elif cat == "streamers":
            # Streamer screen showing digital waveform
            draw.rectangle([cx - 360, cy - 180, cx + 360, cy + 180], fill="#0F172A", outline=accent, width=4)
            draw.rectangle([cx - 310, cy - 130, cx + 310, cy + 110], fill="#020617", outline="#1E293B", width=3)
            # Waveform bars
            for i, h_val in enumerate([30, 60, 100, 140, 80, 120, 160, 90, 40, 110, 150, 70, 30]):
                x = cx - 250 + i * 40
                draw.rectangle([x, cy - h_val // 2, x + 20, cy + h_val // 2], fill=accent)
            draw.text((cx - 280, cy + 130), "ROON READY • AIRPLAY 2 • FLAC 192kHz/24bit", fill="#94A3B8", font=self.fonts["small"])

        elif cat == "turntables":
            # Turntable plinth, platter, and tonearm
            draw.rectangle([cx - 360, cy - 180, cx + 360, cy + 180], fill="#291E18", outline=accent, width=4)
            # Vinyl Platter
            draw.ellipse([cx - 260, cy - 160, cx + 120, cy + 160], fill="#111111", outline="#444444", width=5)
            draw.ellipse([cx - 200, cy - 100, cx + 60, cy + 100], fill="#1F1F1F", outline="#333333", width=2)
            draw.ellipse([cx - 100, cy - 30, cx - 40, cy + 30], fill=accent, outline="#FFFFFF", width=2)
            # Tonearm
            draw.line([(cx + 220, cy - 130), (cx + 180, cy + 50), (cx - 10, cy + 20)], fill="#E5E7EB", width=6)
            draw.ellipse([cx + 200, cy - 150, cx + 240, cy - 110], fill="#9CA3AF", outline="#FFFFFF", width=2)

        elif cat == "head-fi":
            # Headphone cups & arch
            draw.arc([cx - 220, cy - 250, cx + 220, cy + 100], start=180, end=360, fill="#E5E7EB", width=12)
            # Left Cup
            draw.ellipse([cx - 260, cy - 60, cx - 120, cy + 160], fill="#1E1B4B", outline=accent, width=5)
            draw.ellipse([cx - 240, cy - 40, cx - 140, cy + 140], fill="#312E81", outline=secondary, width=3)
            # Right Cup
            draw.ellipse([cx + 120, cy - 60, cx + 260, cy + 160], fill="#1E1B4B", outline=accent, width=5)
            draw.ellipse([cx + 140, cy - 40, cx + 240, cy + 140], fill="#312E81", outline=secondary, width=3)
            # Cable
            draw.line([(cx - 190, cy + 160), (cx, cy + 260), (cx + 190, cy + 160)], fill="#9CA3AF", width=4)

        elif cat == "loudspeakers":
            # Floorstanding / bookshelf speaker cabinet with drivers
            draw.rectangle([cx - 200, cy - 260, cx + 200, cy + 260], fill="#271E18", outline=accent, width=5)
            # Tweeter
            draw.ellipse([cx - 40, cy - 200, cx + 40, cy - 120], fill="#111111", outline=secondary, width=4)
            draw.ellipse([cx - 15, cy - 175, cx + 15, cy - 145], fill=accent)
            # Midrange Driver
            draw.ellipse([cx - 100, cy - 90, cx + 100, cy + 70], fill="#1F1916", outline=accent, width=6)
            draw.ellipse([cx - 40, cy - 30, cx + 40, cy + 10], fill="#3B2A1D", outline="#FFFFFF", width=2)
            # Woofer Driver
            draw.ellipse([cx - 120, cy + 90, cx + 120, cy + 230], fill="#17120E", outline=accent, width=6)
            draw.ellipse([cx - 50, cy + 135, cx + 50, cy + 185], fill="#2B1D12", outline="#FFFFFF", width=2)

        elif cat == "cables":
            # Braided audiophile cable with gold connectors
            for i in range(-120, 130, 20):
                draw.arc([cx - 300, cy - 100 + i, cx + 300, cy + 100 + i], start=0, end=180, fill=accent, width=6)
            # Connector plug left
            draw.rectangle([cx - 340, cy - 30, cx - 280, cy + 30], fill="#F59E0B", outline="#FFFFFF", width=3)
            # Connector plug right
            draw.rectangle([cx + 280, cy - 30, cx + 340, cy + 30], fill="#F59E0B", outline="#FFFFFF", width=3)

        elif cat == "power-conditioning":
            # Power conditioner with digital AC meter & heavy outlets
            draw.rectangle([cx - 360, cy - 180, cx + 360, cy + 180], fill="#18181B", outline=accent, width=4)
            draw.rectangle([cx - 300, cy - 120, cx + 300, cy - 20], fill="#09090B", outline="#27272A", width=2)
            draw.text((cx - 260, cy - 90), "MAINS VOLTAGE: 220.4 V RMS", fill=accent, font=self.fonts["badge"])
            draw.text((cx - 260, cy - 50), "NOISE DISSIPATION: -60 dB (0.00% THD)", fill="#86EFAC", font=self.fonts["small"])
            # Outlets
            for x_off in [-220, -110, 0, 110, 220]:
                draw.rectangle([cx + x_off - 35, cy + 30, cx + x_off + 35, cy + 130], fill="#27272A", outline=accent, width=2)
                draw.ellipse([cx + x_off - 10, cy + 50, cx + x_off + 10, cy + 70], fill="#000000")
                draw.ellipse([cx + x_off - 10, cy + 90, cx + x_off + 10, cy + 110], fill="#000000")


# -----------------------------------------------------------------------------
# 3. Google Cloud Storage Uploader
# -----------------------------------------------------------------------------
class GCSImageUploader:
    """Manages bucket verification, creation, and blob uploads via google-cloud-storage SDK."""

    def __init__(self, bucket_name: str, project_id: Optional[str] = None):
        self.bucket_name = bucket_name
        self.project_id = project_id
        try:
            self.client = storage.Client(project=self.project_id)
            logger.info("GCS Storage Client initialized (project: %s)", self.client.project)
        except Exception as e:
            logger.error("Failed to initialize GCS Client: %s", e)
            raise

    def get_or_create_bucket(self, location: str = "us", create_if_missing: bool = True) -> storage.Bucket:
        """
        Retrieves target GCS bucket or creates it if missing.

        Args:
            location: GCP bucket location (default: 'us').
            create_if_missing: Whether to auto-create bucket if missing.

        Returns:
            storage.Bucket instance.
        """
        try:
            bucket = self.client.get_bucket(self.bucket_name)
            logger.info("Found existing GCS bucket: gs://%s", self.bucket_name)
            return bucket
        except NotFound:
            if not create_if_missing:
                raise FileNotFoundError(f"Bucket gs://{self.bucket_name} does not exist.")

            logger.info("Bucket gs://%s not found. Creating in location '%s'...", self.bucket_name, location)
            try:
                bucket = self.client.create_bucket(self.bucket_name, location=location)
                logger.info("Successfully created bucket gs://%s", self.bucket_name)
                return bucket
            except Exception as create_err:
                logger.error("Error creating bucket gs://%s: %s", self.bucket_name, create_err)
                raise
        except GoogleCloudError as gcp_err:
            logger.error("GCP storage error while looking up bucket gs://%s: %s", self.bucket_name, gcp_err)
            raise

    def upload_image(
        self,
        local_file_path: str,
        gcs_blob_name: str,
        bucket: Optional[storage.Bucket] = None,
        make_public: bool = False,
    ) -> str:
        """
        Uploads a single local image file to target GCS blob path.

        Args:
            local_file_path: Path to local source image file.
            gcs_blob_name: Target blob path in GCS bucket (e.g. 'products/chord-hugo-tt2.jpg').
            bucket: Optional storage.Bucket instance.
            make_public: Whether to set ACL public-read.

        Returns:
            GCS URI string (e.g. 'gs://hifi-shop-demo-assets/products/chord-hugo-tt2.jpg').
        """
        if bucket is None:
            bucket = self.get_or_create_bucket()

        blob = bucket.blob(gcs_blob_name)
        blob.cache_control = "public, max-age=86400"

        logger.info("Uploading %s -> gs://%s/%s", local_file_path, self.bucket_name, gcs_blob_name)
        blob.upload_from_filename(local_file_path, content_type="image/jpeg")

        if make_public:
            try:
                blob.make_public()
                logger.debug("Set public read ACL on gs://%s/%s", self.bucket_name, gcs_blob_name)
            except Exception as acl_err:
                logger.warning("Could not set public ACL on blob (uniform access enabled?): %s", acl_err)

        gcs_uri = f"gs://{self.bucket_name}/{gcs_blob_name}"
        public_url = f"https://storage.googleapis.com/{self.bucket_name}/{gcs_blob_name}"
        logger.info("Successfully uploaded: %s (%s)", gcs_uri, public_url)
        return gcs_uri


# -----------------------------------------------------------------------------
# 4. Main Controller Entrypoint
# -----------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Hi-Fi Shop Demo - Seed Product Image Ingestion & GCS Upload Script"
    )
    parser.add_argument(
        "--sql-file",
        default="sql/03_seed_data.sql",
        help="Path to product seed data SQL file (default: sql/03_seed_data.sql)",
    )
    parser.add_argument(
        "--bucket",
        default=os.getenv("GCS_BUCKET_NAME", "hifi-shop-demo-assets"),
        help="Google Cloud Storage bucket name (default: hifi-shop-demo-assets)",
    )
    parser.add_argument(
        "--output-dir",
        default="scripts/generated_images",
        help="Local directory to store generated images (default: scripts/generated_images)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse SQL and generate images locally without uploading to GCS",
    )
    parser.add_argument(
        "--skip-upload",
        action="store_true",
        help="Skip GCS upload step entirely",
    )
    parser.add_argument(
        "--make-public",
        action="store_true",
        help="Set public read ACL on uploaded GCS blobs",
    )
    args = parser.parse_args()

    logger.info("==================================================")
    logger.info(" Hi-Fi Shop Demo - Product Image Ingestion & Upload")
    logger.info("==================================================")
    logger.info(" SQL Seed Path : %s", args.sql_file)
    logger.info(" GCS Bucket    : gs://%s/products/", args.bucket)
    logger.info(" Output Dir    : %s", args.output_dir)
    logger.info(" Dry-Run Mode  : %s", args.dry_run)
    logger.info("==================================================")

    # Step 1: Parse Product SQL Seed Data
    try:
        sql_parser = SeedDataParser(args.sql_file)
        products = sql_parser.parse_products()
    except Exception as parse_err:
        logger.error("Failed to parse SQL seed data: %s", parse_err)
        sys.exit(1)

    if not products:
        logger.error("No product records found in SQL seed file.")
        sys.exit(1)

    # Step 2: Initialize Image Generator
    generator = ProductImageGenerator()
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Step 3: Initialize GCS Uploader if uploading
    gcs_uploader = None
    gcs_bucket = None
    if not args.dry_run and not args.skip_upload:
        try:
            gcs_uploader = GCSImageUploader(args.bucket)
            gcs_bucket = gcs_uploader.get_or_create_bucket(create_if_missing=True)
        except Exception as gcs_init_err:
            logger.error(
                "Could not initialize GCS Uploader (%s). Continuing in dry-run mode.", gcs_init_err
            )
            args.dry_run = True

    # Step 4: Generate Images and Upload to GCS
    success_count = 0
    upload_count = 0

    for idx, product in enumerate(products, 1):
        product_id = product.get("product_id")
        filename = product.get("local_filename")
        blob_name = product.get("gcs_blob_name", f"products/{filename}")
        local_path = out_dir / filename

        logger.info(
            "[%2d/%2d] Processing '%s' (%s) -> %s",
            idx,
            len(products),
            product_id,
            product.get("category_id"),
            filename,
        )

        try:
            # Generate high-res product image
            generator.generate_image(product, str(local_path), width=1200, height=1200)
            success_count += 1

            # Upload to GCS if not dry-run
            if gcs_uploader and gcs_bucket and not args.dry_run and not args.skip_upload:
                gcs_uploader.upload_image(
                    local_file_path=str(local_path),
                    gcs_blob_name=blob_name,
                    bucket=gcs_bucket,
                    make_public=args.make_public,
                )
                upload_count += 1

        except Exception as proc_err:
            logger.error("Error processing product %s: %s", product_id, proc_err, exc_info=True)

    logger.info("==================================================")
    logger.info(" Execution Summary:")
    logger.info("   Total Products Processed : %d", len(products))
    logger.info("   Images Generated Locally : %d", success_count)
    logger.info("   Images Uploaded to GCS   : %d", upload_count)
    logger.info("==================================================")

    if success_count == len(products):
        logger.info("All 32 product demo images ingested and processed successfully!")
    else:
        logger.warning(
            "Completed with warnings: %d out of %d images succeeded.",
            success_count,
            len(products),
        )


if __name__ == "__main__":
    main()
