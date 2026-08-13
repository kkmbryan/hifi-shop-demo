import re
import json

with open('sql/03_seed_data.sql', 'r', encoding='utf-8') as f:
    sql = f.read()

categories = [
    {
        "id": "dacs",
        "nameEn": "DACs (Digital-to-Analog Converters)",
        "nameZh": "解碼器 (DACs)",
        "slug": "dacs",
        "descriptionEn": "High-resolution Digital-to-Analog Converters converting PCM and DSD streams into pure analog sound.",
        "descriptionZh": "高解析度數碼至模擬解碼器，將 PCM 與 DSD 數位訊號完美轉換為純淨類比音訊。",
        "icon": "Disc"
    },
    {
        "id": "amplifiers",
        "nameEn": "Amplifiers",
        "nameZh": "擴音機 (Amplifiers)",
        "slug": "amplifiers",
        "descriptionEn": "Integrated, pre-amplifiers, power amplifiers, and vacuum tube amplifiers delivering pristine audio power.",
        "descriptionZh": "合併式、前級、後級及真空管擴音機，提供純正無瑕的音訊擴大驅動力。",
        "icon": "Zap"
    },
    {
        "id": "streamers",
        "nameEn": "Network Streamers",
        "nameZh": "網絡播放器 (Streamers)",
        "slug": "streamers",
        "descriptionEn": "High-fidelity digital transports and network music streamers with ultra-low jitter.",
        "descriptionZh": "高保真網絡音樂播放器與數位轉盤，具備極低時基誤差與高清串流能力。",
        "icon": "Wifi"
    },
    {
        "id": "turntables",
        "nameEn": "Turntables",
        "nameZh": "黑膠唱機 (Turntables)",
        "slug": "turntables",
        "descriptionEn": "Precision analog vinyl disc record players, tonearms, and moving magnet/moving coil cartridges.",
        "descriptionZh": "精密類比黑膠唱片機、唱臂及動磁/動圈唱頭，還原最真實的黑膠韻味。",
        "icon": "CircleDot"
    },
    {
        "id": "head-fi",
        "nameEn": "Headphones / Head-Fi",
        "nameZh": "耳機 / 入耳式耳機 (Head-Fi)",
        "slug": "head-fi",
        "descriptionEn": "Flagship open-back dynamic, planar magnetic, electrostatic headphones, and custom IEMs.",
        "descriptionZh": "旗艦級開放式動圈、平板振膜、靜電耳機及專業入耳式監聽耳機。",
        "icon": "Headphones"
    },
    {
        "id": "loudspeakers",
        "nameEn": "Loudspeakers",
        "nameZh": "音箱 / 喇叭 (Loudspeakers)",
        "slug": "loudspeakers",
        "descriptionEn": "High-end stereo floorstanding, bookshelf, and active studio monitor loudspeakers.",
        "descriptionZh": "高級立體聲落地式音箱、書架式喇叭及主動式專業監聽音箱。",
        "icon": "Volume2"
    },
    {
        "id": "cables",
        "nameEn": "Audio Cables",
        "nameZh": "線材 (Cables)",
        "slug": "cables",
        "descriptionEn": "Audiophile-grade speaker cables, balanced XLR/RCA interconnects, USB data cables, and power cords.",
        "descriptionZh": "發燒級喇叭線、平衡 XLR/RCA 訊號線、高傳真 USB 數據線及大電流電源線。",
        "icon": "Cable"
    },
    {
        "id": "power-conditioning",
        "nameEn": "Power Conditioning",
        "nameZh": "電源處理 (Power Conditioning)",
        "slug": "power-conditioning",
        "descriptionEn": "Ultra-low noise AC power noise dissipation systems, power regenerators, and linear DC supplies.",
        "descriptionZh": "超低雜訊交流電源淨化器、正弦波電源重組再生器及平衡直流線性電源。",
        "icon": "ShieldCheck"
    }
]

prod_blocks = re.split(r'INSERT (?:OR UPDATE )?INTO Products \(', sql)
products = []

for block in prod_blocks[1:]:
    val_part = block.split('VALUES (')[1].split(');')[0]
    val_part_clean = val_part.replace("''", '"')

    items = []
    curr = []
    in_quote = False
    i = 0
    while i < len(val_part_clean):
        ch = val_part_clean[i]
        if ch == "'" and not in_quote:
            in_quote = True
            curr = []
        elif ch == "'" and in_quote:
            in_quote = False
            items.append(''.join(curr))
            curr = []
        elif in_quote:
            curr.append(ch)
        elif ch in ', \n\r\t':
            pass
        elif not in_quote and (ch.isdigit() or ch == '.'):
            num_str = []
            while i < len(val_part_clean) and (val_part_clean[i].isdigit() or val_part_clean[i] == '.'):
                num_str.append(val_part_clean[i])
                i += 1
            items.append(float(''.join(num_str)))
            continue
        i += 1

    if len(items) >= 12:
        prod_id = items[0]
        cat_id = items[1]
        brand = items[2]
        model = items[3]
        name_en = items[4]
        name_zh = items[5]
        price = items[6]
        desc_en = items[7]
        desc_zh = items[8]
        ac_en = items[9]
        ac_zh = items[10]
        img = items[11]

        tags = []
        interfaces = []
        is_tube = False
        impedance = None
        sensitivity = None
        power_output = None

        if "FPGA" in desc_en or "FPGA" in desc_zh:
          tags.append("FPGA Filter")
        if "R-2R" in desc_en or "R-2R" in desc_zh or "Resistor" in desc_en:
          tags.append("R-2R Ladder")
        if "ESS" in desc_en or "SABRE" in desc_en or "ES9039" in desc_en:
          tags.append("ESS Sabre")
        if "300B" in desc_en or "300B" in desc_zh or "Tube" in name_en or "膽機" in name_zh:
          is_tube = True
          tags.append("Vacuum Tube 膽機")
        if "I2S" in desc_en or "I2S" in desc_zh or "DMP-A8" in name_en:
          interfaces.append("I2S")
        if "XLR" in desc_en or "XLR" in desc_zh or "Balanced" in name_en or "平衡" in name_zh:
          interfaces.append("XLR")
        if "RCA" in desc_en or "RCA" in desc_zh:
          interfaces.append("RCA")
        if "USB" in desc_en or "USB" in desc_zh:
          interfaces.append("USB")

        if prod_id == "prod-feliks-envy":
          impedance = 300
          power_output = "5W Class-A Single-Ended 300B"
          tags.extend(["300B Tube", "Class-A", "High Output Impedance"])
        elif prod_id == "prod-sennheiser-hd800s":
          impedance = 300
          sensitivity = 102
          tags.extend(["300Ω High-Impedance", "Open-Back Dynamic", "3D Soundstage"])
        elif prod_id == "prod-focal-utopia-2022":
          impedance = 80
          sensitivity = 104
          tags.extend(["Pure Beryllium", "High Current Requirement", "Flagship Dynamic"])
        elif prod_id == "prod-mcintosh-ma8950":
          power_output = "200W/Ch Autoformer"
          tags.extend(["200W/Ch", "Autoformer", "Blue Meters"])
        elif prod_id == "prod-accuphase-e380":
          power_output = "120W/Ch Class-AB"
          tags.extend(["AAVA Volume", "Silky Treble", "MOS-FET"])
        elif prod_id == "prod-denafrips-venus-ii":
          tags.extend(["R-2R Discrete", "TCXO Clock", "Warm Vocal"])
        elif prod_id == "prod-aurender-n200":
          interfaces.extend(["USB Audio Class 2.0", "Coaxial"])
          tags.extend(["NVMe Caching", "Ultra-Low Jitter", "Supercap UPS"])

        item_dict = {
            "id": prod_id,
            "categoryId": cat_id,
            "brand": brand,
            "model": model,
            "nameEn": name_en,
            "nameZh": name_zh,
            "priceHkd": price,
            "descriptionEn": desc_en,
            "descriptionZh": desc_zh,
            "acousticSignatureEn": ac_en,
            "acousticSignatureZh": ac_zh,
            "imageUrl": img,
            "tags": list(set(tags)),
            "interfaces": list(set(interfaces)),
            "isTube": is_tube
        }
        if impedance is not None:
          item_dict["impedance"] = impedance
        if sensitivity is not None:
          item_dict["sensitivity"] = sensitivity
        if power_output is not None:
          item_dict["powerOutput"] = power_output

        products.append(item_dict)

print(f"Extracted {len(products)} products")

ts_content = f"""// Generated Hi-Fi Product Catalog Dataset

export interface Product {{
  id: string;
  categoryId: string;
  brand: string;
  model: string;
  nameEn: string;
  nameZh: string;
  priceHkd: number;
  descriptionEn: string;
  descriptionZh: string;
  acousticSignatureEn: string;
  acousticSignatureZh: string;
  imageUrl: string;
  tags: string[];
  interfaces: string[];
  isTube?: boolean;
  impedance?: number;
  sensitivity?: number;
  powerOutput?: string;
}}

export interface Category {{
  id: string;
  nameEn: string;
  nameZh: string;
  slug: string;
  descriptionEn: string;
  descriptionZh: string;
  icon: string;
}}

export const CATEGORIES: Category[] = {json.dumps(categories, indent=2, ensure_ascii=False)};

export const PRODUCTS: Product[] = {json.dumps(products, indent=2, ensure_ascii=False)};
"""

with open('src/frontend/src/data/products.ts', 'w', encoding='utf-8') as out:
    out.write(ts_content)

print("Updated src/frontend/src/data/products.ts")
