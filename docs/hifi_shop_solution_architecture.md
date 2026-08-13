# Solution Architecture Overview
## Hi-Fi Shop Demo Platform (Inspired by Pro Audio 雅詠音響)

| Attribute | Specification |
| :--- | :--- |
| **Document Title** | Solution Architecture Overview – Premium Hi-Fi E-Commerce Demo Platform |
| **Target Path** | `docs/hifi_shop_solution_architecture.md` |
| **Author** | Principal Solution Architect |
| **Status** | Approved Specification |
| **Version** | 2.2.0 |
| **Date** | August 13, 2026 |

---

## Executive Summary & System Overview

The **Hi-Fi Shop Demo Platform** is an enterprise-grade digital demonstration e-commerce application engineered specifically for high-end luxury audiophile equipment (inspired by **Pro Audio 雅詠音響**). Audiophile purchasing decisions diverge significantly from conventional retail; customers evaluate products based on complex physical interface compatibility (e.g., *Balanced XLR, I2S HDMI/RJ45, AES/EBU, RCA, Impedance matching*) and subjective acoustic sound signatures (e.g., *"warm tube soundstage"*, *"analytical sound with tight bass response"*, *"smooth vocals"*).

To address these domain-specific challenges, the platform implements a **Hybrid Search Engine Architecture** powered **100% by Google Cloud Spanner**, seamlessly fusing traditional **BM25 N-gram Full-Text Keyword Search** with **768-dimensional Vector Cosine Similarity Search** (via Vertex AI Text Embeddings).

The system operates in **Guest Shopping Mode** by default, allowing users to browse the catalog, perform acoustic/spec hybrid queries, verify component synergy, and manage shopping carts without user login or authentication requirements. The platform strictly enforces a **Single-Currency Rule (Hong Kong Dollars - HKD)** while offering seamless **Dual-Language UI switching (`en-US` and `zh-HK`)**.

---

## 1. Google Cloud Well-Architected Framework (WAF) Alignment

The architecture of the Hi-Fi Shop Demo Platform is systematically structured around the five core pillars of the **Google Cloud Well-Architected Framework (WAF)** to ensure operational excellence, security, resilience, performance, and fiscal efficiency.

### 1.1 Operational Excellence
- **Infrastructure as Code (IaC)**: All GCP resources (Cloud Run, Cloud Spanner, Cloud Storage buckets, Cloud Armor security policies, and Load Balancers) are declaratively provisioned and version-controlled via Terraform.
- **Automated CI/CD Pipelines**: Automated container builds (via Cloud Build / GitHub Actions) enforce linting, unit testing, vector query validation, and blue/green deployments to Cloud Run with automatic rollback capabilities.
- **Comprehensive Observability**: Microservices integrate with Google Cloud Observability (Cloud Logging, Cloud Monitoring, Cloud Trace, and Error Reporting). Telemetry includes p95/p99 query latency tracing, hybrid RRF score distributions, and real-time container metrics.
- **Zero-Downtime Operations**: Stateless Cloud Run service deployments support revision traffic splitting and rolling updates with zero user-facing downtime.

### 1.2 Security & Privacy
- **Zero-Trust Architecture & Defense-in-Depth**: Inter-service communications operate over TLS 1.3 encryption with Google Cloud IAM service account authentication. Network access to Cloud Spanner and Vertex AI APIs is restricted via private VPC Service Controls and IAM roles following the Principle of Least Privilege.
- **Perimeter Security**: Public-facing traffic is fronted by Google Cloud Armor WAF and HTTP(S) External Load Balancing, enforcing DDoS protection, SQL injection/XSS protection, rate-limiting, and strict Content Security Policy (CSP) and CORS headers.
- **Privacy-First Guest Session Management**: The platform operates in Guest Shopping Mode by default. Cart state and user preferences (locale `en-US`/`zh-HK`, currency HKD) are stored on the client side in encrypted, HTTP-only `SameSite=Strict` cookies. No personally identifiable information (PII) is stored or tracked on backend servers during guest browsing and cart operations.
- **Data Protection at Rest & In-Transit**: All data stored within Cloud Spanner, GCS buckets, and container caches is encrypted at rest using Google-managed AES-256 keys. All network transit strictly requires HTTPS/TLS 1.3.

### 1.3 Reliability
- **High Availability (99.999% Database SLA)**: Google Cloud Spanner provides a multi-region/multi-zone deployment guaranteeing 99.999% uptime SLA with synchronous, multi-region replication and zero maintenance downtime.
- **Fault-Tolerant Compute**: Microservices are deployed across multiple availability zones in Google Cloud Run with automated instance healing and multi-region failover via Cloud Load Balancing (99.95% compute SLA).
- **Decoupled Asynchronous Processing**: Product catalog updates and vector embedding generation are decoupled. Write transactions execute immediately in Cloud Spanner ($\le 20\text{ms}$ write path), while Vertex AI vector embedding generation is processed asynchronously in the background.

### 1.4 Performance Efficiency
- **Serverless Compute Scaling**: Cloud Run dynamically scales stateless frontend and backend containers from 0 up to 100 instances based on inbound request concurrency.
- **Sub-150ms Hybrid Search Engine**: Fuses exact BM25 keyword matching with 768-dim dense vector cosine KNN distance using Reciprocal Rank Fusion (RRF).
- **Hybrid Caching Architecture**: Dynamic compute routes (API/SSR) enforce `Cache-Control: no-store` to force 100% live Cloud Spanner database hits on every request to showcase sub-10ms query performance. Static GCS product assets use `Cache-Control: public, max-age=86400, immutable` edge caching at global Cloud CDN Points of Presence (PoPs), delivering sub-30ms static content latency. Cloud Spanner `image_url` attributes remain the 100% canonical database source of truth.

### 1.5 Cost Optimization
- **Scale-to-Zero Serverless Billing**: Deployed microservices scale down to zero instances during non-peak or idle hours.
- **Unified Storage Tier**: Cloud Spanner eliminates the operational cost and infrastructure overhead of running separate relational databases, full-text search clusters, and vector databases.
- **Edge Asset Offloading**: Cloud CDN edge caching (`Cache-Control: public, max-age=86400`) absorbs >85% of static asset traffic, drastically reducing compute container bandwidth consumption, while Cloud Spanner maintains canonical `image_url` database storage.

---

## 2. Structured Architecture Decision Records (ADRs)

### ADR-001: Serverless Compute via Cloud Run
| Decision Aspect | Architectural Details |
| :--- | :--- |
| **ADR ID & Title** | **ADR-001**: Cloud Run for Stateless Compute |
| **Context & Drivers** | High traffic variability between promotional launches; requirement for scale-to-zero compute. |
| **Decision Outcome** | Deploy Next.js SSR frontend and Express API backend as containerized microservices on Cloud Run. |
| **Rationale** | Native container support, zero infrastructure management overhead, scale-to-zero pricing. |

---

### ADR-002: Google Cloud Spanner for Unified Relational & Vector Search
| Decision Aspect | Architectural Details |
| :--- | :--- |
| **ADR ID & Title** | **ADR-002**: Unified Storage in Cloud Spanner with 100% Live DB Queries |
| **Context & Drivers** | Requirement for strong transactional consistency alongside vector search and full-text keyword indexing. |
| **Decision Outcome** | Use Cloud Spanner (100 PUs baseline in `asia-east2`) as the unified database engine. All catalog, search, and detail requests execute 100% live against Cloud Spanner. Compute endpoints enforce `Cache-Control: no-store` to disable API CDN caching and showcase live sub-10ms query execution. |
| **Rationale** | Eliminates multi-database sync pipelines. SQL projections (`CAST(price_hkd AS FLOAT64)`) ensure direct IEEE 754 float serialization. |

---

### ADR-003: Hybrid Caching Strategy — GCS Media Edge Caching & Canonical Spanner Storage
| Decision Aspect | Architectural Details |
| :--- | :--- |
| **ADR ID & Title** | **ADR-003**: GCS Media Asset Edge Caching with Canonical Spanner Metadata |
| **Context & Drivers** | High-resolution audiophile product photos must load instantly ($\le 30\text{ms}$) globally without adding latency or bandwidth overhead to compute containers or database queries. |
| **Decision Outcome** | GCS product image assets in `gs://bryanko-hifi-shop-demo-assets/products/` use `Cache-Control: public, max-age=86400, immutable` edge caching via Google Cloud CDN. Cloud Spanner `image_url` fields remain the 100% canonical database source of truth. |
| **Rationale** | Offloads >85% of media bandwidth to Google edge PoPs, eliminates cold-start media latency on initial page loads, and maintains relational metadata integrity in Cloud Spanner. |

