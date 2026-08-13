# Hi-Fi Equipment E-Commerce Demo Platform
> **Inspired by Pro Audio (雅詠音響)** | High-Performance Audiophile Retail & Acoustic Hybrid Search

[![Google Cloud Platform](https://img.shields.io/badge/Google_Cloud-Cloud_Run_%7C_Cloud_Spanner_%7C_Vertex_AI-4285F4?logo=google-cloud)](https://cloud.google.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![i18n](https://img.shields.io/badge/i18n-EN_%7C_zh--HK-green.svg)](#localization--dual-language-support)

---

## 📌 Executive Summary

The **Hi-Fi Equipment E-Commerce Demo Platform** is a flagship digital e-commerce application designed specifically for high-end luxury audiophile hardware—such as Digital-to-Analog Converters (DACs), Vacuum Tube Amplifiers, High-Resolution Network Streamers, Turntables, Headphones/IEMs, Loudspeakers, Cables, and Power Conditioners.

Unlike generic retail platforms, purchasing audiophile equipment requires matching rigid hardware parameters (*Balanced XLR, I2S HDMI/RJ45, AES/EBU, Impedance $\Omega$*) with subjective acoustic sound signatures (*"warm tube soundstage"*, *"analytical sound with tight bass response"*, *"smooth vocal presence"*).

This platform demonstrates a **Hybrid Search Engine** built **100% on Google Cloud Spanner**, seamlessly fusing traditional **BM25 N-gram Full-Text Keyword Search** with **768-dimensional Vector Cosine Similarity Search** (via Vertex AI Text Embeddings) using Reciprocal Rank Fusion (RRF).

---

## ✨ Key Features

- 🔍 **100% Cloud Spanner Native Engine**: All catalog listings, product details, faceted hardware filters, and hybrid search queries execute 100% live against Google Cloud Spanner.
- ⚡ **Live Spanner Query Showcase (`Cache-Control: no-store`)**: Compute microservices use explicit no-cache response headers to bypass CDN caching, ensuring every customer interaction showcases real-time Cloud Spanner sub-10ms query execution.
- 🔢 **Optimized SQL Float Projection**: Uses `CAST(price_hkd AS FLOAT64)` in GoogleSQL queries for seamless IEEE 754 float serialization without numeric object overhead.
- 🌐 **Hong Kong Localization (`zh-HK` & `en-US`)**: Dual-language UI switching honoring authentic Hong Kong audiophile terminology (解碼器, 擴音機, 膽機, 網絡播放器, 黑膠唱機, 入耳式耳機, 線材).
- 💲 **Strict Single-Currency Rule (HKD)**: Operates exclusively in Hong Kong Dollars (`HKD $`). Toggling the UI language to English translates text while preserving prices strictly in HKD without conversion.
- 🛍️ **Guest Shopping Mode**: Seamless catalog browsing, hybrid search, hardware spec filtering, and shopping cart management without requiring user login or account registration.
- 🛡️ **Electrical Component Synergy Engine**: Real-time electrical compatibility checks between amplifiers (output impedance/power) and headphones/speakers (impedance/sensitivity) to warn against gain staging mismatches.

---

## 🏗️ Google Cloud Solution Architecture

The application is architected around the **Google Cloud Well-Architected Framework (WAF)**:

![GCP System Architecture Diagram](docs/assets/hifi_architecture_diagram.jpg)

### Architecture Highlights
* **Compute Layer**: Stateless Next.js (React SSR) Frontend & Node.js REST API microservices deployed on **Google Cloud Run** with scale-to-zero serverless execution.
* **Database & Vector Search Engine**: **Google Cloud Spanner** providing 99.999% multi-region availability, hosting relational schema, BM25 N-gram full-text index, and 768-dim vector cosine KNN index in a single unified storage tier (`100 PUs` demo baseline in `asia-east2`).
* **VPC Networking**: Custom VPC (`hifi-shop-vpc`), subnetwork (`hifi-shop-subnet` `10.0.1.0/24` in `asia-east2`), and Serverless VPC Access Connector (`hifi-shop-vpc-connector`).
* **AI Embeddings**: **Vertex AI Text Embeddings API** (`text-embedding-004`) generating dense vector embeddings asynchronously.
* **Asset Storage**: Lossless product images served directly from **Google Cloud Storage (GCS)** public buckets.

---

## 📁 Documentation Index

Detailed project requirements, architecture decision records, database schemas, cost estimations, and quality audits are available in the [`docs/`](docs/) directory:

- 📋 [**Business Requirements Document (BRD)**](docs/hifi_shop_business_requirements.md) — Executive summary, user personas, HK Hi-Fi domain glossary, 32 seed product taxonomy, and Given/When/Then acceptance criteria.
- 📐 [**Solution Architecture Overview**](docs/hifi_shop_solution_architecture.md) — GCP architectural specification, 5 WAF pillars, 2-column ADR tables (ADR-001 to ADR-004), Mermaid component topology, sequence diagrams, and NFR latency SLAs.
- 💰 [**GCP Monthly Cost Estimation & Deployment Guide**](docs/hifi_shop_gcp_cost_estimation.md) — Detailed cost breakdown for project `bryanko-hifi-shop-demo` in `asia-east2` (~$78–$85/month total for 100 PUs Spanner, VPC, Cloud Run, GCS), ADR-005, step-by-step deployment guide, and idle cost optimization commands.
- 🗄️ [**Database Schema Specification**](docs/hifi_shop_database_schema.md) — Cloud Spanner GoogleSQL DDL, interleaving strategy, BM25 N-gram indexes, 768-dim vector cosine distance indexes, `CAST(price_hkd AS FLOAT64)` projection guidelines, and ER diagram.
- 🔍 [**Code Review & Quality Audit Report**](docs/hifi_shop_code_review_report.md) — Code quality audit report evaluating type safety, maintainability, performance optimizations, and test coverage (56/56 tests passing).

---

## 📂 Project Repository Structure

```
hifi-shop-demo/
├── docs/                       # Comprehensive Architecture & Requirements Docs
├── sql/                        # Cloud Spanner DDL Schema & DML Seed Scripts
├── terraform/                  # Infrastructure as Code (VPC, Connector, Spanner, GCS)
├── scripts/                    # Image Ingestion & GCP Automated Deployment Scripts
├── src/
│   ├── backend/                # Node.js REST API (Spanner BM25 + Vector KNN Engine)
│   └── frontend/               # Next.js SSR Web Application (Pro Audio UI)
└── tests/                      # Automated Unit & Integration Test Suites (56/56 Pass)
```

---

## 🚀 Quick Deployment Guide

```bash
# 1. Clone repository
git clone https://github.com/kkmbryan/hifi-shop-demo.git
cd hifi-shop-demo

# 2. Run automated GCP deployment to project bryanko-hifi-shop-demo (asia-east2)
bash scripts/deploy_to_gcp.sh
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
