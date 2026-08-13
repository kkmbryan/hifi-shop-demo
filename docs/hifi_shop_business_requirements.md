# Business Requirements Document (BRD)
## Hi-Fi Shop Demo Platform (Inspired by Pro Audio 雅詠音響)

| Document Attribute | Details |
| :--- | :--- |
| **Document Title** | Business Requirements Document (BRD) – Premium Hi-Fi E-Commerce Demo Platform |
| **Target Document Path** | `docs/hifi_shop_business_requirements.md` |
| **Author** | Senior Business Analyst & Lead Product Manager |
| **Target Audience** | Executive Stakeholders, Engineering Team, Technical Architects, UI/UX Designers |
| **Version** | 1.3.0 |
| **Status** | Final Draft |
| **Last Updated** | August 13, 2026 |

---

## Executive Summary

The **Hi-Fi Shop Demo Platform** is a flagship digital demonstration platform designed to showcase modern, high-performance e-commerce capabilities tailored specifically for the luxury audiophile and high-end audio market. Inspired by **Pro Audio (雅詠音響)**, a premier Hong Kong audio equipment dealer, this project aims to address the unique challenges of marketing and searching complex audiophile hardware—such as Digital-to-Analog Converters (DACs), Tube Amplifiers, High-End Streamers, Turntables, and Power Conditioners.

Standard e-commerce search engines rely exclusively on keyword matches (e.g., exact part numbers or brand names). However, audiophile purchasing behavior is driven heavily by **acoustic characteristics** (e.g., *"warm tube-like sound stage"*, *"analytical sound with tight bass response"*), **budget parameters** strictly in local currency (Hong Kong Dollars - HKD), and **interface compatibility** (e.g., *Balanced XLR, I2S, Optical, AES/EBU*). 

To solve this, the Hi-Fi Shop Demo Platform introduces a **Hybrid Search Engine** powered by **Google Cloud Spanner**, combining traditional **Full-Text Keyword Search (BM25 / N-gram tokenization)** with **Dense Vector Semantic Search (embeddings)**. Furthermore, the platform features native **Dual-Language Support (English `en-US` and Traditional Chinese `zh-HK`)** operating under a **strict single-currency (HKD) rule**, alongside a **Future Phase AI Conversational Shopping Assistant** equipped with text and voice capabilities for natural audio discovery.

---

## 1. Project Vision & Business Goals

### 1.1 Business Goals
1. **Showcase Acoustic-Aware Product Search**: Deliver high precision when users search using subjective acoustic descriptions (e.g., *"smooth vocals with wide soundstage"*) alongside rigid hardware specs.
2. **Authentic Regionalized Experience**: Provide native dual-language capabilities (`en-US` and `zh-HK`), strictly honoring authentic Hong Kong audiophile terminology while operating exclusively in Hong Kong Dollars (HKD).
3. **Enterprise-Grade Infrastructure**: Demonstrate zero-downtime, global consistency, and low-latency hybrid search using **Google Cloud Spanner** with native vector embedding storage and nearest-neighbor search.
4. **AI-Driven Customer Engagement**: Layout requirements for a future-phase text and voice AI Shopping Assistant capable of acting as an expert audio consultant.

### 1.2 System Scope
The platform operates in **Guest Shopping Mode** by default. Users can seamlessly browse the full product catalog, perform acoustic and keyword hybrid search queries, apply multi-faceted hardware filters, and manage items in their shopping cart without any requirement to create an account or log in. User authentication, account creation, and user login workflows are strictly out-of-scope for Phase 1.

---

## 2. Target Audience & User Personas

### 2.1 Detailed User Personas
* **Persona 1: The Purist Audiophile ("Master Chan / 陳師兄")** (`zh-HK`): Veteran audiophile seeking vinyl-like warmth ("溫暖膽味解碼器") from digital DAC upgrades.
* **Persona 2: The Modern Digital Streamer ("Alex Tech")** (`en-US` / `zh-HK`): High-res lossy/lossless streaming enthusiast seeking Network Streamers with I2S outputs under $40,000 HKD.
* **Persona 3: The Desktop Head-Fi Explorer ("Chloe")** (`zh-HK`): Headphone enthusiast searching for compact desktop DAC/Amp combos under $10,000 HKD.

---

## 3. Localization & Language Requirements (EN / zh-HK)

### 3.1 Single-Currency & Dual-Language Operating Rules
- **Strict HKD Single-Currency Rule**: The platform exclusively operates in Hong Kong Dollars (HKD) for all product listings, catalog prices, cart calculations, and checkout operations. Language switching between English (`en-US`) and Traditional Chinese (`zh-HK`) MUST NOT change or convert the currency; all prices remain strictly in HKD (e.g., `$39,800 HKD`).
- **Dual-Language UI**: The application provides seamless dual-language UI switching (`en-US` and `zh-HK`) for header navigation, technical specifications, UI strings, and product metadata without altering selected cart items or product pricing.

### 3.2 Hong Kong Hi-Fi Domain Glossary

| English Term | Hong Kong Traditional Chinese (`zh-HK`) | Context |
| :--- | :--- | :--- |
| **Digital-to-Analog Converter (DAC)** | **解碼器** | Hardware converting PCM/DSD to analog. |
| **Amplifier** | **擴音機** | Power, pre, or integrated amplifiers. |
| - *Integrated Amplifier* | *合併式擴音機* | Pre-amp and power amp in one chassis. |
| - *Vacuum Tube Amp* | *膽機 (真空管擴音機)* | Valve-based thermionic amplifier. |
| **Network Streamer** | **網絡播放器** | Network-connected digital transport. |
| **Turntable** | **黑膠唱機** | Analog vinyl disc record system. |
| **Headphones / IEMs** | **耳機 / 入耳式耳機** | Over-ear headphones & IEMs. |
| **Loudspeakers** | **音箱 / 喇叭** | Stereo loudspeakers (Bookshelf / Floorstanding). |
| **Cables** | **線材** | Speaker cables, XLR/RCA interconnects. |
| **Power Conditioning** | **電源處理** | AC noise filters, power regenerators. |

---

## 4. Seed Dataset Specification (32 Products across 8 Categories)

### 4.1 Taxonomy Overview
1. **解碼器 (DACs)**: Chord Hugo TT 2, Denafrips Venus II 12th, Topping D90 III, iFi Neo iDSD 2.
2. **擴音機 (Amplifiers)**: McIntosh MA8950, Accuphase E-380, Feliks Audio Envy, Rega Elex MK4.
3. **網絡播放器 (Streamers)**: Aurender N200, Lumin T3, Eversolo DMP-A8, WiiM Pro Plus.
4. **黑膠唱機 (Turntables)**: Linn Sondek LP12, Technics SL-1200G, Rega Planar 6, Pro-Ject Debut PRO.
5. **耳機 / 入耳式耳機 (Head-Fi)**: Sennheiser HD 800 S, Focal Utopia (2022), Vision Ears EXT, Campfire Andromeda 2020.
6. **音箱 / 喇叭 (Loudspeakers)**: B&W 804 D4, KEF LS50 Wireless II, Harbeth Monitor 30.2 XD, Genelec 8341A SAM.
7. **線材 (Cables)**: Nordost Frey 2, AudioQuest Dragon Tail XLR, Shunyata Venom HC, Inakustik Referenz USB.
8. **電源處理 (Power Conditioning)**: AudioQuest Niagara 5000, IsoTek V5 Aquarius, PS Audio DirectStream P12, Plixir Elite BDC.

---

## 5. Cloud Spanner Hybrid Search Architecture

### 5.1 Hybrid Search Mechanics
Combines **BM25 / N-gram Full-Text Search** for exact SKU/brand queries with **768-dim Dense Vector Similarity Search** for subjective acoustic queries (e.g., *"warm sound stage"*).

### 5.2 Reciprocal Rank Fusion (RRF)
$$RRF\_Score(p) = \frac{0.4}{60 + Rank_{BM25}(p)} + \frac{0.6}{60 + Rank_{Vector}(p)}$$

---

## 6. Future Phase: AI Conversational Shopping Assistant

- **Voice & Text Interface**: Native Hong Kong Cantonese (`zh-HK`) speech recognition with Hi-Fi brand code-switching.
- **System Matching Guidance**: Verifies amplifier power vs speaker sensitivity and output impedance.

---

## 7. Non-Functional & Performance Requirements

### 7.1 Performance & Latency SLAs
- **Search Response Latency**: Hybrid search (BM25 + Vector KNN) queries must return top results in under 150ms (p95).
- **Page Load Time**: Core catalog pages and product detail pages (PDP) must render within 1.2 seconds globally.
- **Concurrent Users**: System must maintain sub-200ms API response time under concurrent loads of up to 1,000 requests/second.

### 7.2 Scalability & Availability
- **Database Availability**: Cloud Spanner multi-region deployment target of 99.999% availability with zero scheduled downtime.
- **Vector Search Indexing**: Asynchronous embedding creation pipeline for new catalog items within 5 seconds of creation.

---

## 8. Security, Data Privacy & Infrastructure

- **Encryption**: TLS 1.3 in transit and AES-256 at rest for all customer and catalog data in Cloud Spanner.
- **Data Privacy**: Compliance with HK PDPO (Personal Data Privacy Ordinance) and GDPR.
- **Session Management**: Operates in **Guest Shopping Mode** by default. Guest session management utilizes secure, encrypted cookie/session state for preserving dual-language preference (`en-US` / `zh-HK`), strict HKD single-currency state, and active shopping cart items without requiring user login, account registration, or authentication.

---

## 9. Scope & Out-of-Scope Boundaries

### 9.1 In-Scope (Phase 1)
- **Guest Shopping Mode**: Default operational mode enabling users to browse the catalog, perform hybrid search, apply hardware filters, and manage shopping cart items without account creation or login.
- Dual-language (`en-US` / `zh-HK`) product catalog and search experience operating strictly under HKD single currency.
- Cloud Spanner hybrid search with BM25 keyword matching and 768-dim vector embeddings.
- Component spec filtering (I2S, XLR, RCA, impedance, tube/solid-state).
- System synergy & component compatibility warnings.

### 9.2 Out-of-Scope (Phase 1)
- User authentication, account creation/registration, user login, and user profile management (platform operates strictly in Guest Shopping Mode for Phase 1).
- Special Order / Pre-Order workflows requiring authenticated user accounts.
- Multi-currency support or real-time currency conversion mechanisms (platform exclusively operates in HKD).
- Native mobile iOS/Android app development (web-responsive application only).
- Live payment gateway processing (demo mode with simulated checkout).
- Full real-time voice streaming audio input (scheduled for Future Phase AI Assistant).

---

## 10. Acceptance Criteria (Given / When / Then)

### Scenario 1: Acoustic Sound Characteristics in `zh-HK`
* **Given** a guest user navigating the storefront in `zh-HK` locale
* **When** the user enters the natural language query *"溫暖人聲 解碼器 3萬以下"* into the hybrid search bar
* **Then** the system applies structural filters (`Price <= 30000 HKD` AND `Category = 解碼器 (DAC)`) combined with 768-dimensional vector embedding similarity for *"溫暖人聲"* (warm vocals), returning vector-matched products (**Denafrips Venus II 12th**, **iFi Neo iDSD 2**) in the top 3 search positions within an end-to-end latency of $\le 150\text{ms}$.

### Scenario 2: Multi-Faceted Hardware Specification Filtering & Hybrid Search
* **Given** an audiophile guest user browsing the DACs & Streamers category with active filters (`Category = Network Streamers`, `Max Budget = $50,000 HKD`)
* **When** the user applies precise multi-interface parameters selecting `Output Interfaces = I2S` and `Balanced XLR`, and types query *"ultra-low jitter transport"*
* **Then** the hybrid search engine evaluates exact BM25 keyword matching for hardware specs alongside vector proximity for acoustic transport clarity, returning matching products (**Aurender N200**, **Lumin T3**) displaying complete physical I/O metadata badges (`I2S RJ45/HDMI`, `Dual XLR`) and updating the results list within $\le 200\text{ms}$.

### Scenario 3: Language Switching & Single-Currency (HKD) Persistence
* **Given** a guest user with **Chord Hugo TT 2** (`$39,800 HKD`) in cart in `zh-HK` locale
* **When** switching header language selector to English (`en-US`)
* **Then** all UI strings update to English (e.g., *"解碼器"* to *"DAC"*), cart item persistence is maintained in the guest session, and cart item price remains strictly `$39,800 HKD` without currency conversion.

### Scenario 4: Audio System Component Synergy & Impedance Compatibility Warning
* **Given** a guest user with a desktop tube amplifier (**Feliks Audio Envy**, output impedance $16-300\,\Omega$, $5\text{W}$ output) in their active shopping cart
* **When** the user attempts to add low-sensitivity planar magnetic headphones (**Focal Utopia (2022)** or high-impedance headphones like **Sennheiser HD 800 S**, $300\,\Omega$, $102\text{dB/mW}$) to their system configuration
* **Then** the system executes a real-time electrical synergy check, triggers a non-blocking "Component Synergy & Power Recommendation" banner warning the user about gain staging / driving power requirements, and recommends an optimal matching DAC/Amp configuration or impedance adapter within $\le 100\text{ms}$.
