# Hi-Fi Equipment E-Commerce Demo Platform
> **Inspired by Aria Audio (雅詠音響)** | High-Performance Audiophile Retail & Acoustic Hybrid Search

[![Google Cloud Platform](https://img.shields.io/badge/Google_Cloud-Cloud_Run_%7C_Cloud_Spanner_%7C_Vertex_AI-4285F4?logo=google-cloud)](https://cloud.google.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![i18n](https://img.shields.io/badge/i18n-EN_%7C_zh--HK-green.svg)](#localization--dual-language-support)

---

## 📌 Executive Summary

The **Hi-Fi Equipment E-Commerce Demo Platform** is a flagship digital e-commerce application designed specifically for high-end luxury audiophile hardware—such as Digital-to-Analog Converters (DACs), Vacuum Tube Amplifiers, High-Resolution Network Streamers, Turntables, Headphones/IEMs, Loudspeakers, Cables, and Power Conditioners.

Unlike generic retail platforms, purchasing audiophile equipment requires matching rigid hardware parameters (*Balanced XLR, I2S HDMI/RJ45, AES/EBU, Impedance $\Omega$*) with subjective acoustic sound signatures (*"warm tube soundstage"*, *"analytical sound with tight bass response"*, *"smooth vocal presence"*).

This platform demonstrates a **Hybrid Search Engine** built on **Google Cloud Spanner**, seamlessly fusing traditional **BM25 N-gram Full-Text Keyword Search** with **768-dimensional Vector Cosine Similarity Search** (via Vertex AI Text Embeddings) using Reciprocal Rank Fusion (RRF).

---

## ✨ Key Features

- 🔍 **Hybrid Acoustic & Technical Search**: Search by exact SKU, technical interface specs, or natural language sound characteristics (e.g. *"溫暖人聲 解碼器 3萬以下"* / *"Warm tube sound DAC under $30,000 HKD"*).
- 🌐 **Hong Kong Localization (`zh-HK` & `en-US`)**: Dual-language UI switching honoring authentic Hong Kong audiophile terminology (解碼器, 擴音機, 膽機, 網絡播放器, 黑膠唱機, 入耳式耳機, 線材).
- 💲 **Strict Single-Currency Rule (HKD)**: Operates exclusively in Hong Kong Dollars (`HKD $`). Toggling the UI language to English translates text while preserving prices strictly in HKD without conversion.
- 🛍️ **Guest Shopping Mode**: Seamless catalog browsing, hybrid search, hardware spec filtering, and shopping cart management without requiring user login or account registration.
- ⚡ **Electrical Component Synergy Engine**: Real-time electrical compatibility checks between amplifiers (output impedance/power) and headphones/speakers (impedance/sensitivity) to warn against gain staging mismatches.

---

## 🏗️ Google Cloud Solution Architecture

The application is architected around the **Google Cloud Well-Architected Framework (WAF)**:

![GCP System Architecture Diagram](docs/assets/hifi_architecture_diagram.jpg)

### Architecture Highlights
* **Compute Layer**: Stateless Next.js (React SSR) Frontend & Node.js/Python REST API microservices deployed on **Google Cloud Run** with scale-to-zero serverless execution.
* **Database & Vector Search**: **Google Cloud Spanner** providing 99.999% multi-region availability, hosting relational schema, BM25 N-gram full-text index, and 768-dim vector cosine KNN index in a single unified storage tier (`100 PUs` demo baseline in `asia-east2`).
* **VPC Networking**: Custom VPC (`hifi-shop-vpc`), subnetwork (`hifi-shop-subnet` `10.0.1.0/24` in `asia-east2`), and Serverless VPC Access Connector (`hifi-shop-vpc-connector`).
* **AI Embeddings**: **Vertex AI Text Embeddings API** (`text-embedding-004`) generating dense vector embeddings asynchronously.
* **Asset Storage & CDN**: Lossless product images and static assets served from **Google Cloud Storage (GCS)** public buckets cached globally via **Google Cloud CDN**.

---

## 📁 Documentation Index

Detailed project requirements, architecture decision records, database schemas, cost estimations, and quality audits are available in the [`docs/`](docs/) directory:

- 📋 [**Business Requirements Document (BRD)**](docs/hifi_shop_business_requirements.md) — Executive summary, user personas, HK Hi-Fi domain glossary, 32 seed product taxonomy, and Given/When/Then acceptance criteria.
- 📐 [**Solution Architecture Overview**](docs/hifi_shop_solution_architecture.md) — GCP architectural specification, 5 WAF pillars, 2-column ADR tables (ADR-001 to ADR-004), Mermaid component topology, sequence diagrams, and NFR latency SLAs.
- 💰 [**GCP Monthly Cost Estimation & Deployment Guide**](docs/hifi_shop_gcp_cost_estimation.md) — Detailed cost breakdown for project `bryanko-hifi-shop-demo` in `asia-east2` (~$78–$85/month total for 100 PUs Spanner, VPC, Cloud Run, GCS), ADR-005, step-by-step deployment guide, and idle cost optimization commands.
- 🗄️ [**Database Schema Specification**](docs/hifi_shop_database_schema.md) — Cloud Spanner GoogleSQL DDL, interleaving strategy, BM25 N-gram indexes, 768-dim vector cosine distance indexes, and ER diagram.
- 🔍 [**Code Review & Quality Audit Report**](docs/hifi_shop_code_review_report.md) — Code quality audit report evaluating type safety, maintainability, performance optimizations, and test coverage (49/49 tests passing).

---

## 📂 Project Repository Structure

```
hifi-shop-demo/
├── docs/
│   ├── assets/
│   │   └── hifi_architecture_diagram.jpg   # GCP System Architecture Diagram
│   ├── hifi_shop_business_requirements.md  # Business Requirements Document (BRD)
│   ├── hifi_shop_solution_architecture.md # Solution Architecture Overview & ADRs
│   ├── hifi_shop_database_schema.md        # Cloud Spanner Schema & Index Specs
│   ├── hifi_shop_gcp_cost_estimation.md    # GCP Cost Breakdown & Deploy Guide
│   └── hifi_shop_code_review_report.md     # Code Quality & Maintainability Audit
├── scripts/                               # Image generation, bucket setup & deploy scripts
│   ├── deploy_to_gcp.sh                   # Automated GCP deployment execution script
│   ├── setup_gcs_bucket.sh                # GCS bucket provisioning & CORS script
│   └── upload_seed_images.py              # Synthetic image generation & GCS uploader
├── sql/                                   # Cloud Spanner DDL & DML seed scripts
│   ├── 01_create_tables.sql
│   ├── 02_create_indexes.sql
│   └── 03_seed_data.sql
├── src/                                   # Application codebase
│   ├── backend/                           # Node.js/TypeScript REST API (Cloud Run)
│   └── frontend/                          # Next.js/React SSR Web UI (Cloud Run)
├── terraform/                             # Terraform IaC manifests (VPC, Spanner 100 PUs, GCS)
├── tests/                                 # Automated Jest & RTL unit/integration tests
├── .gitignore                             # Git ignore rules
└── README.md                              # Project documentation entry point
```

---

## 🚀 One-Command Deployment to GCP

To deploy the entire infrastructure, database, and microservices into your GCP project `bryanko-hifi-shop-demo` in `asia-east2`:

```bash
# Execute automated GCP deployment script
./scripts/deploy_to_gcp.sh
```

---

## 📜 License

This demo project is released under the [MIT License](LICENSE). Inspired by [Aria Audio (雅詠音響)](https://aria-audio.com).
