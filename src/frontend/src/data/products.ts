// Generated Hi-Fi Product Catalog Dataset

export interface Product {
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
}

export interface Category {
  id: string;
  nameEn: string;
  nameZh: string;
  slug: string;
  descriptionEn: string;
  descriptionZh: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
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
];

export const PRODUCTS: Product[] = [
  {
    "id": "prod-chord-hugo-tt2",
    "categoryId": "dacs",
    "brand": "Chord Electronics",
    "model": "Hugo TT 2",
    "nameEn": "Chord Hugo TT 2 Desktop DAC / Headphone Amplifier",
    "nameZh": "Chord Hugo TT 2 桌面級解碼器 / 耳機擴音機",
    "priceHkd": 39800.0,
    "descriptionEn": "The Hugo TT 2 is a ground-breaking desktop DAC and headphone amplifier equipped with custom FPGA filtering and 98,304-tap WTA filter algorithm delivering unmatched acoustic depth.",
    "descriptionZh": "Hugo TT 2 是一款突破性的桌面級解碼耳擴一體機，配備客製化 FPGA 濾波器及 98,304 Tap WTA 演算法，提供無可比擬的聲學深度與動態展現。",
    "acousticSignatureEn": "Crystal-clear soundstage, ultra-fast transient response, articulate micro-detail rendering, and explosive dynamic headroom.",
    "acousticSignatureZh": "音場極度廣闊清晰，瞬態響應速度極快，微細節豐富，動態起伏澎湃有力。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/chord-hugo-tt2.jpg",
    "tags": [
      "FPGA Filter"
    ],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-denafrips-venus-ii",
    "categoryId": "dacs",
    "brand": "Denafrips",
    "model": "Venus II 12th",
    "nameEn": "Denafrips Venus II 12th Anniversary R-2R Ladder DAC",
    "nameZh": "Denafrips Venus II 12週年紀念版 R-2R 電阻陣列解碼器",
    "priceHkd": 24800.0,
    "descriptionEn": "True balanced discrete R-2R architecture featuring high-precision resistor networks and TCXO ultra-low phase noise clocks.",
    "descriptionZh": "採用真平衡分立式 R-2R 架構，配備高精度金屬膜電阻網絡與 TCXO 超低相位雜訊晶振。",
    "acousticSignatureEn": "Warm analog-like musicality, lush natural vocals, rich body, smooth liquid treble without digital glare.",
    "acousticSignatureZh": "具備濃郁黑膠般溫暖人聲，聲音厚實自然，高頻順滑流暢，完全沒有數位味。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/denafrips-venus-ii.jpg",
    "tags": [
      "TCXO Clock",
      "R-2R Discrete",
      "R-2R Ladder",
      "Warm Vocal"
    ],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-topping-d90-iii",
    "categoryId": "dacs",
    "brand": "Topping",
    "model": "D90 III SABRE",
    "nameEn": "Topping D90 III SABRE Fully Balanced Flagship DAC",
    "nameZh": "Topping D90 III SABRE 旗艦全平衡解碼器",
    "priceHkd": 7980.0,
    "descriptionEn": "Flagship dual ESS ES9039SPRO DAC implementation with ultra-low jitter CPLD clock processing and Bluetooth 5.1 LDAC support.",
    "descriptionZh": "搭載雙 ESS ES9039SPRO 旗艦晶片，配合 CPLD 超低時基誤差時鐘處理及藍芽 5.1 LDAC 無損傳輸。",
    "acousticSignatureEn": "Extremely analytical, ultra-low background noise floor, precise instrument separation, and neutral uncolored presentation.",
    "acousticSignatureZh": "極具分析力，底噪極低，樂器定位精確，聲音中性無渲染。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/topping-d90-iii.jpg",
    "tags": [
      "ESS Sabre"
    ],
    "interfaces": [
      "XLR"
    ],
    "isTube": false
  },
  {
    "id": "prod-ifi-neo-idosd-2",
    "categoryId": "dacs",
    "brand": "iFi Audio",
    "model": "NEO iDSD 2",
    "nameEn": "iFi Audio NEO iDSD 2 Lossless Bluetooth & Headphone DAC/Amp",
    "nameZh": "iFi Audio NEO iDSD 2 無損藍芽解碼耳擴一體機",
    "priceHkd": 6480.0,
    "descriptionEn": "Versatile desktop DAC and headphone amplifier featuring aptX Lossless Bluetooth, ultra-low jitter GMT clock, and 5,551mW drive power.",
    "descriptionZh": "全能型桌面解碼耳擴一體機，支援 aptX Lossless 無損藍芽，配備 GMT 超低時基誤差時鐘及 5,551mW 強勁輸出。",
    "acousticSignatureEn": "Energetic sound profile, warm-tilted mid-bass response, engaging vocals, and versatile headphone drive power.",
    "acousticSignatureZh": "聲音充滿活力，中低頻包圍感強，人聲感染力高，耳機推力強勁。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/ifi-neo-idsd-2.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-mcintosh-ma8950",
    "categoryId": "amplifiers",
    "brand": "Mcintosh",
    "model": "MA8950",
    "nameEn": "McIntosh MA8950 Integrated Amplifier (200W/Ch)",
    "nameZh": "McIntosh MA8950 合併式擴音機 (每聲道200瓦)",
    "priceHkd": 78000.0,
    "descriptionEn": "200 Watts per channel high-end stereo integrated amplifier featuring McIntosh Autoformer technology, DA2 digital audio module, and iconic blue meters.",
    "descriptionZh": "每聲道 200 瓦高級立體聲合併式擴音機，配備麥景圖專利 Autoformer 輸出變壓器、DA2 數碼模組及經典藍眼睛錶板。",
    "acousticSignatureEn": "Authoritative dynamic impact, warm velvet midrange, expansive bass control, and legendary McIntosh musical presence.",
    "acousticSignatureZh": "音色雄渾大氣，中頻如絲絨般溫暖，低頻控制力極佳，展現麥景圖經典音樂味。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/mcintosh-ma8950.jpg",
    "tags": [
      "Blue Meters",
      "Autoformer",
      "200W/Ch"
    ],
    "interfaces": [],
    "isTube": false,
    "powerOutput": "200W/Ch Autoformer"
  },
  {
    "id": "prod-accuphase-e380",
    "categoryId": "amplifiers",
    "brand": "Accuphase",
    "model": "E-380",
    "nameEn": "Accuphase E-380 Stereo Integrated Amplifier",
    "nameZh": "Accuphase E-380 立體聲合併式擴音機",
    "priceHkd": 42000.0,
    "descriptionEn": "Japanese high-end integrated amplifier with AAVA volume control, Instrumentation Amplifier configuration, and MOS-FET switches.",
    "descriptionZh": "日本頂級合併式擴音機，配備 AAVA 革命性音量控制系統、儀錶級放大電路及 MOS-FET 靜音開關。",
    "acousticSignatureEn": "Delicate, silky high frequencies, refined acoustic texturing, highly stable damping, and sweet articulate vocals.",
    "acousticSignatureZh": "高頻細緻如絲，樂器質感極佳，阻尼係數高且控制力好，人聲甜美耐聽。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/accuphase-e380.jpg",
    "tags": [
      "MOS-FET",
      "Silky Treble",
      "AAVA Volume"
    ],
    "interfaces": [],
    "isTube": false,
    "powerOutput": "120W/Ch Class-AB"
  },
  {
    "id": "prod-feliks-envy",
    "categoryId": "amplifiers",
    "brand": "Feliks Audio",
    "model": "Envy",
    "nameEn": "Feliks Audio Envy Flagship 300B Vacuum Tube Headphone Amp",
    "nameZh": "Feliks Audio Envy 旗艦 300B 真空管耳機擴音機",
    "priceHkd": 58000.0,
    "descriptionEn": "Flagship Single-Ended Class-A transformer-coupled headphone amplifier driven by iconic 300B vacuum tubes and solid oak chassis.",
    "descriptionZh": "旗艦級 Class-A 單端變壓器耦合耳機擴音機，採用傳奇 300B 真空管驅動，配以橡木機身。",
    "acousticSignatureEn": "Sublime 300B tube warmth, holographic 3D soundstage depth, intoxicating vocal emotion, and liquid texture.",
    "acousticSignatureZh": "300B膽味極致溫暖，3D立體聲場深邃，人聲情感豐富，音色流暢連貫。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/feliks-envy.jpg",
    "tags": [
      "300B Tube",
      "High Output Impedance",
      "Class-A",
      "Vacuum Tube 膽機"
    ],
    "interfaces": [],
    "isTube": true,
    "impedance": 300,
    "powerOutput": "5W Class-A Single-Ended 300B"
  },
  {
    "id": "prod-rega-elex-mk4",
    "categoryId": "amplifiers",
    "brand": "Rega",
    "model": "Elex MK4",
    "nameEn": "Rega Elex MK4 Integrated Stereo Amplifier with DAC",
    "nameZh": "Rega Elex MK4 整合式立體聲擴音機 (附設解碼)",
    "priceHkd": 11800.0,
    "descriptionEn": "Award-winning British stereo amplifier with integrated DAC, built-in MM phono stage, and dedicated headphone output.",
    "descriptionZh": "屢獲殊榮的英國立體聲擴音機，內置 DAC 解碼、高品質 MM 黑膠唱頭放大器及耳機輸出。",
    "acousticSignatureEn": "Rhythmic drive, snappy timing, natural acoustic tone, and engaging punchy bass performance.",
    "acousticSignatureZh": "節奏感強勁，瞬態時間準確，樂器音色自然，低頻彈跳力十足。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/rega-elex-mk4.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-aurender-n200",
    "categoryId": "streamers",
    "brand": "Aurender",
    "model": "N200",
    "nameEn": "Aurender N200 High-Performance Caching Music Server & Transport",
    "nameZh": "Aurender N200 高效能緩存音樂伺服器與轉盤",
    "priceHkd": 49800.0,
    "descriptionEn": "High-performance digital audio streamer featuring NVMe SSD caching system, isolated USB Audio Class 2.0 output, and supercapacitor UPS.",
    "descriptionZh": "高效能數位音訊串流播放器，採用 NVMe SSD 緩存系統、獨立隔離 USB Audio 2.0 輸出及超大電容 UPS 保護。",
    "acousticSignatureEn": "Ultra-low jitter, pitch-black silence background, deep low-level retrieval, and pure uncompressed digital clarity.",
    "acousticSignatureZh": "極低時基誤差，背景漆黑一片，微細細節還原度極高，數位訊號純淨無瑕。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/aurender-n200.jpg",
    "tags": [
      "Supercap UPS",
      "Ultra-Low Jitter",
      "NVMe Caching"
    ],
    "interfaces": [
      "USB Audio Class 2.0",
      "Coaxial",
      "USB"
    ],
    "isTube": false
  },
  {
    "id": "prod-lumin-t3",
    "categoryId": "streamers",
    "brand": "Lumin",
    "model": "T3",
    "nameEn": "Lumin T3 Digital Music Player with Internal Dual SABRE DAC",
    "nameZh": "Lumin T3 網絡串流播放器 (內置雙SABRE解碼)",
    "priceHkd": 38500.0,
    "descriptionEn": "All-new processing system combining dual ESS SABRE ES9028PRO DACs, Leedh Processing lossless volume control, and CNC aluminum chassis.",
    "descriptionZh": "全新晶片處理系統，結合雙 ESS SABRE ES9028PRO 解碼、Leedh Processing 無損數碼音量控制及 CNC 鋁合金機身。",
    "acousticSignatureEn": "Smooth analog fluidity, expansive high-res imaging, articulate bass definition, and effortless streaming dynamics.",
    "acousticSignatureZh": "具備類比音效順滑度，高解析度聲像遼闊，低頻線條清晰，串流動態輕鬆自然。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/lumin-t3.jpg",
    "tags": [
      "ESS Sabre"
    ],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-eversolo-dmp-a8",
    "categoryId": "streamers",
    "brand": "Eversolo",
    "model": "DMP-A8",
    "nameEn": "Eversolo DMP-A8 Network Streamer, DAC & Preamp",
    "nameZh": "Eversolo DMP-A8 網絡數播解碼前級一體機",
    "priceHkd": 15800.0,
    "descriptionEn": "Flagship streamer with AK4191EQ + AK4499EX DAC separation, I2S HDMI output, R-2R analog volume control, and 6-inch touch screen.",
    "descriptionZh": "旗艦級數播，採用 AK4191EQ + AK4499EX 數位模擬分離解碼、I2S HDMI 輸出、R-2R 類比音量控制及 6吋觸摸屏。",
    "acousticSignatureEn": "Transparent dynamic presentation, crisp clarity, versatile sound tuning options, and robust bass presence.",
    "acousticSignatureZh": "通透動態，細節高分辨，音色可調性高，低頻紮實有量感。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/eversolo-dmp-a8.jpg",
    "tags": [
      "R-2R Ladder"
    ],
    "interfaces": [
      "I2S"
    ],
    "isTube": false
  },
  {
    "id": "prod-wiim-pro-plus",
    "categoryId": "streamers",
    "brand": "WiiM",
    "model": "Pro Plus",
    "nameEn": "WiiM Pro Plus High-Res Audio Streamer with Premium AKM DAC",
    "nameZh": "WiiM Pro Plus 高解析度網絡音訊串流播放器",
    "priceHkd": 1880.0,
    "descriptionEn": "Affordable high-res streamer featuring AKM AK4493SEQ DAC, AirPlay 2, Chromecast, and Roon Ready certification.",
    "descriptionZh": "超值高清串流播放器，內置 AKM AK4493SEQ DAC，支援 AirPlay 2、Chromecast 及 Roon Ready 認證。",
    "acousticSignatureEn": "Surprisingly clean and articulate sound, smooth neutral balance, excellent cost-performance entry transport.",
    "acousticSignatureZh": "聲音出奇乾淨清晰，中性平衡，性價比極高的串流入門選擇。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/wiim-pro-plus.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-linn-sondek-lp12",
    "categoryId": "turntables",
    "brand": "Linn",
    "model": "Sondek LP12 Majik",
    "nameEn": "Linn Sondek LP12 Majik Precision Turntable Package",
    "nameZh": "Linn Sondek LP12 Majik 精密黑膠唱機套裝",
    "priceHkd": 36800.0,
    "descriptionEn": "The definitive benchmark turntable featuring Karousel single-point bearing, Krane tonearm, and Majik MM cartridge.",
    "descriptionZh": "黑膠唱機標桿產品，配備 Karousel 單點軸承、Krane 精密唱臂及 Majik MM 唱頭。",
    "acousticSignatureEn": "Legendary musical pace, rhythm and timing (PRaT), organic warmth, emotional vocal focus, and natural instrument resonance.",
    "acousticSignatureZh": "傳奇般的音樂節奏與旋律感 (PRaT)，人聲溫暖貼耳，樂器共鳴極具生命力。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/linn-sondek-lp12.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-technics-sl1200g",
    "categoryId": "turntables",
    "brand": "Technics",
    "model": "SL-1200G",
    "nameEn": "Technics SL-1200G Grand Class Direct Drive Turntable",
    "nameZh": "Technics SL-1200G 旗艦直驅黑膠唱盤",
    "priceHkd": 32000.0,
    "descriptionEn": "Grand Class coreless direct-drive turntable featuring 3-layer brass and aluminium platter, lightweight magnesium tonearm.",
    "descriptionZh": "Grand Class 無鐵芯直接驅動唱盤，採用三層黃銅鋁合金黃金轉盤及輕量化鎂合金唱臂。",
    "acousticSignatureEn": "Rock-solid speed stability, explosive bass speed, pitch perfection, precise micro-dynamics, and dead-silent background.",
    "acousticSignatureZh": "轉速絕對穩定，低頻反應迅捷紮實，音高精確，微動態豐富，背景寧靜。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/technics-sl1200g.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-rega-planar-6",
    "categoryId": "turntables",
    "brand": "Rega",
    "model": "Planar 6",
    "nameEn": "Rega Planar 6 Turntable with Neo PSU & Ania MC Cartridge",
    "nameZh": "Rega Planar 6 黑膠唱機 (配備 Neo 電源與 Ania MC 唱頭)",
    "priceHkd": 14500.0,
    "descriptionEn": "Lightweight Tancast 8 aerospace foam core turntable equipped with RB330 tonearm, Neo MK2 PSU, and factory-fitted Ania MC cartridge.",
    "descriptionZh": "採用 Tancast 8 航天泡綿夾層超輕機身，配備 RB330 精密唱臂、Neo MK2 電源及原廠 Ania MC 唱頭。",
    "acousticSignatureEn": "Energetic timing, lively soundstage, agile bass response, and detailed stringed instrument clarity.",
    "acousticSignatureZh": "節奏明快活力充沛，聲場開揚，低頻迅捷，弦樂細節清晰。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/rega-planar-6.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-project-debut-pro",
    "categoryId": "turntables",
    "brand": "Pro-Ject",
    "model": "Debut PRO",
    "nameEn": "Pro-Ject Debut PRO Audiophile Manual Turntable",
    "nameZh": "Pro-Ject Debut PRO 發燒級手動黑膠唱盤",
    "priceHkd": 7800.0,
    "descriptionEn": "30th Anniversary turntable with 8.6-inch carbon-aluminium one-piece tonearm, nickel-plated aluminum components, and Pick it PRO cartridge.",
    "descriptionZh": "30 週年紀念版唱盤，配備 8.6 吋碳纖維鋁合金一體式唱臂、鍍鎳鋁金屬部件及 Pick it PRO 唱頭。",
    "acousticSignatureEn": "Well-balanced analogue tonality, tight acoustic focus, warm midrange, and clean stereo separation.",
    "acousticSignatureZh": "類比音色平衡自然，樂器定位清晰，中頻溫和，聲道分離度高。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/project-debut-pro.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-sennheiser-hd800s",
    "categoryId": "head-fi",
    "brand": "Sennheiser",
    "model": "HD 800 S",
    "nameEn": "Sennheiser HD 800 S Open-Back Dynamic Flagship Headphones",
    "nameZh": "Sennheiser HD 800 S 開放式動圈旗艦耳機",
    "priceHkd": 14200.0,
    "descriptionEn": "The iconic benchmark open-back reference headphones featuring 56mm Ring Radiator transducers and Absorber Technology.",
    "descriptionZh": "業界開放式參考級耳機標桿，採用 56mm 環形振膜單元及專利吸收器技術。",
    "acousticSignatureEn": "Industry-benchmark 3D soundstage width, surgical instrument isolation, airy micro-detail, reference transparency.",
    "acousticSignatureZh": "業界標桿級 3D 開揚音場，樂器分離度如外科手術般精確，高頻通透空氣感十足。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/sennheiser-hd800s.jpg",
    "tags": [
      "Open-Back Dynamic",
      "300Ω High-Impedance",
      "3D Soundstage"
    ],
    "interfaces": [],
    "isTube": false,
    "impedance": 300,
    "sensitivity": 102
  },
  {
    "id": "prod-focal-utopia-2022",
    "categoryId": "head-fi",
    "brand": "Focal",
    "model": "Utopia (2022)",
    "nameEn": "Focal Utopia (2022 Edition) Beryllium Open-Back Headphones",
    "nameZh": "Focal Utopia (2022新版) 純鈹振膜開放式耳機",
    "priceHkd": 39800.0,
    "descriptionEn": "French luxury open-back flagship headphones equipped with 40mm Pure Beryllium \"M\"-shaped dome drivers and copper-aluminum voice coils.",
    "descriptionZh": "法國奢華開放式旗艦耳機，採用 40mm 純鈹 \"M\" 形穹頂單元與銅鋁合金音圈。",
    "acousticSignatureEn": "Unmatched dynamic speed, visceral physical impact, luxurious vocal detail, pinpoint spatial imaging.",
    "acousticSignatureZh": "無可比擬的動態反應速度，衝擊力強，人聲細緻華麗，聲像定位極為精準。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/focal-utopia-2022.jpg",
    "tags": [
      "High Current Requirement",
      "Pure Beryllium",
      "Flagship Dynamic"
    ],
    "interfaces": [],
    "isTube": false,
    "impedance": 80,
    "sensitivity": 104
  },
  {
    "id": "prod-vision-ears-ext",
    "categoryId": "head-fi",
    "brand": "Vision Ears",
    "model": "EXT",
    "nameEn": "Vision Ears EXT Universal Hybrid In-Ear Monitors",
    "nameZh": "Vision Ears EXT 圈鐵靜電混合入耳式耳機",
    "priceHkd": 22800.0,
    "descriptionEn": "German hand-crafted hybrid IEMs combining 2 dynamic drivers and 4 electrostatic drivers for breathtaking vocal warmth and high extension.",
    "descriptionZh": "德國手工打造混合單元入耳式耳機，結合 2 動圈與 4 靜電單元，人聲溫暖潤澤且高頻延伸驚人。",
    "acousticSignatureEn": "Deep thunderous sub-bass impact, lush organic vocals, extended electrostatic shimmer without harshness.",
    "acousticSignatureZh": "低頻下潛深遂有力，人聲溫暖潤澤，靜電高頻延伸極佳且毫無刺耳感。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/vision-ears-ext.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-campfire-andromeda-2020",
    "categoryId": "head-fi",
    "brand": "Campfire Audio",
    "model": "Andromeda 2020",
    "nameEn": "Campfire Audio Andromeda 2020 5-BA In-Ear Monitors",
    "nameZh": "Campfire Audio Andromeda 2020 五動鐵入耳式耳機",
    "priceHkd": 8500.0,
    "descriptionEn": "Iconic emerald green anodized aluminum IEM with 5 balanced armature drivers and Solid-Body acoustic chamber.",
    "descriptionZh": "經典翠綠陽極氧化鋁耳機，配備 5 動鐵單元及實心一體化聲學腔體。",
    "acousticSignatureEn": "Holographic spatial expansion, sparkling treble detail, sweet forward mid-range, iconically musical tuning.",
    "acousticSignatureZh": "聲場空間感絕佳，高頻亮麗通透，中頻人聲甜美靠前，經典發燒調音。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/campfire-andromeda-2020.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-bw-804-d4",
    "categoryId": "loudspeakers",
    "brand": "Bowers & Wilkins",
    "model": "804 D4",
    "nameEn": "Bowers & Wilkins 804 D4 Diamond Tweeter Floorstanding Loudspeakers",
    "nameZh": "B&W 804 D4 鑽石高音落地式音箱",
    "priceHkd": 118000.0,
    "descriptionEn": "Floorstanding reference loudspeaker featuring Solid Body Tweeter-on-Top with Diamond dome, Continuum Cone FST midrange, and Aerofoil bass drivers.",
    "descriptionZh": "旗艦落地式音箱，配備獨立實體鑽石高音單元、Continuum 錐盆 FST 中音及 Aerofoil 翼形低音單元。",
    "acousticSignatureEn": "Crystal-clean diamond high-frequency purity, solid tight bass extension, pinpoint orchestral imaging.",
    "acousticSignatureZh": "鑽石高音極致純淨，低頻結實下潛深，管弦樂團定位精確無瑕。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/bw-804-d4.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-kef-ls50-wireless-ii",
    "categoryId": "loudspeakers",
    "brand": "KEF",
    "model": "LS50 Wireless II",
    "nameEn": "KEF LS50 Wireless II Active All-in-One Stereo Loudspeakers",
    "nameZh": "KEF LS50 Wireless II 主動式無線數碼音箱",
    "priceHkd": 21800.0,
    "descriptionEn": "All-in-one active wireless loudspeaker system with 12th Gen Uni-Q driver array, Metamaterial Absorption Technology (MAT), and 760W total power.",
    "descriptionZh": "主動式無線音箱系統，採用第12代 Uni-Q 同軸單元、MAT 超材料吸音技術及 760W 總功放驅動。",
    "acousticSignatureEn": "Seamless Uni-Q point-source imaging, MAT absorbing clarity, tight bass impact, versatile streaming capability.",
    "acousticSignatureZh": "Uni-Q 同軸單元點聲源定位完美，MAT 技術吸音通透，低頻下潛彈跳，無線串流極致方便。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/kef-ls50-wireless-ii.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-harbeth-m302-xd",
    "categoryId": "loudspeakers",
    "brand": "Harbeth",
    "model": "Monitor 30.2 XD",
    "nameEn": "Harbeth Monitor 30.2 XD Standmount Loudspeakers",
    "nameZh": "Harbeth Monitor 30.2 XD 書架式監聽音箱",
    "priceHkd": 46800.0,
    "descriptionEn": "eXtended Definition British standmount monitor loudspeaker featuring RADIAL2 mid/bass technology and hand-crafted veneer.",
    "descriptionZh": "英國 eXtended Definition 書架監聽音箱，採用 RADIAL2 獨家中低音單元技術及精美手工木皮。",
    "acousticSignatureEn": "Enchanting vocal naturalness, organic BBC monitor timbre, rich wooden cabinet resonance, non-fatiguing presentation.",
    "acousticSignatureZh": "人聲迷人自然，具備經典 BBC 監聽音色，木箱共鳴質感溫暖，長時間聆聽毫無疲勞感。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/harbeth-m302-xd.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-genelec-8341a",
    "categoryId": "loudspeakers",
    "brand": "Genelec",
    "model": "8341A SAM",
    "nameEn": "Genelec 8341A SAM Coaxial Active Studio Monitor (The Ones)",
    "nameZh": "Genelec 8341A SAM 同軸主動式監聽喇叭",
    "priceHkd": 28500.0,
    "descriptionEn": "Point-source three-way coaxial active studio monitor with Smart Active Monitor (SAM) automated room calibration.",
    "descriptionZh": "三分頻同軸點聲源主動式監聽音箱，具備 SAM 智能自動房間聲學校正功能。",
    "acousticSignatureEn": "Uncompromising neutral accuracy, point-source phase alignment, pinpoint staging, and SAM room alignment.",
    "acousticSignatureZh": "極致中性準確，同軸點聲源相位一致，立體聲場極為精準，支援 SAM 房間校正。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/genelec-8341a.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-nordost-frey-2",
    "categoryId": "cables",
    "brand": "Nordost",
    "model": "Frey 2",
    "nameEn": "Nordost Frey 2 High-End Speaker Cables (2.5m Pair, Banana/Spade)",
    "nameZh": "Nordost Frey 2 發燒級喇叭線 (2.5米對裝)",
    "priceHkd": 26800.0,
    "descriptionEn": "Norse 2 series speaker cable featuring 22 x 22 AWG solid core silver-plated OFC conductors and Dual Mono-Filament technology.",
    "descriptionZh": "Norse 2 系列發燒喇叭線，採用 22 條 22 AWG 鍍銀無氧銅實心導線及專利雙微空間微單絲結構。",
    "acousticSignatureEn": "Lightning-fast transient speed, crystalline micro-detail, airy high-frequency extension, open dynamic range.",
    "acousticSignatureZh": "瞬態傳導速度極快，微細節如水晶般透明，高頻空氣感開揚，動態無壓縮。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/nordost-frey-2.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-audioquest-dragon-tail",
    "categoryId": "cables",
    "brand": "AudioQuest",
    "model": "Dragon Tail XLR",
    "nameEn": "AudioQuest Dragon XLR Balanced Interconnects (1.0m Pair)",
    "nameZh": "AudioQuest Dragon XLR 平衡訊號線 (1.0米對裝)",
    "priceHkd": 18500.0,
    "descriptionEn": "Flagship interconnect cable featuring Solid Perfect-Surface Silver (PSS) conductors and 72V Dielectric-Bias System (DBS).",
    "descriptionZh": "旗艦級平衡訊號線，採用實心 Perfect-Surface Silver (PSS) 純銀導體及 72V 介電偏壓系統 (DBS)。",
    "acousticSignatureEn": "Ultra-quiet noise floor, rich harmonic density, velvet smooth midrange, effortless low-frequency power.",
    "acousticSignatureZh": "底噪極其漆黑，諧波密度豐富，中頻如絲絨般柔順，低頻下潛深沉有力。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/audioquest-dragon-tail.jpg",
    "tags": [],
    "interfaces": [
      "XLR"
    ],
    "isTube": false
  },
  {
    "id": "prod-shunyata-venom-hc",
    "categoryId": "cables",
    "brand": "Shunyata Research",
    "model": "Venom HC",
    "nameEn": "Shunyata Research Venom HC High-Current Power Cable (1.75m)",
    "nameZh": "Shunyata Research Venom HC 大電流電源線 (1.75米)",
    "priceHkd": 4200.0,
    "descriptionEn": "High-current AC power cable designed specifically for high-power amplifiers and power conditioners featuring 10 AWG OFE conductors.",
    "descriptionZh": "專為大功率擴音機與電源處理器設計的大電流電源線，採用 10 AWG 無氧無電鍍超純銅導體。",
    "acousticSignatureEn": "Dramatic lowering of system noise floor, improved dynamic contrast, weightier bass slam and punch.",
    "acousticSignatureZh": "顯著降低系統底噪，提升動態對比度，低頻量感與衝擊力明顯增強。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/shunyata-venom-hc.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-inakustik-referenz-usb",
    "categoryId": "cables",
    "brand": "Inakustik",
    "model": "Referenz USB 2.0",
    "nameEn": "Inakustik Referenz High-Speed Audio USB Cable (1.5m)",
    "nameZh": "Inakustik Referenz 高速發燒級 USB 數據線 (1.5米)",
    "priceHkd": 2800.0,
    "descriptionEn": "High-speed USB 2.0 digital audio cable with quadruple shielding and silver-plated OFC conductors to eliminate digital jitter.",
    "descriptionZh": "德國製造高速 USB 2.0 數碼音訊線，具備四重高密度屏蔽及鍍銀 OFC 導線，徹底杜絕數據傳輸時基誤差。",
    "acousticSignatureEn": "Low-jitter USB digital signal transmission, elimination of high-frequency digital hash, clean soundstage width.",
    "acousticSignatureZh": "時基誤差極低，能有效消除高頻數位雜訊，音場寬廣清晰。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/inakustik-referenz-usb.jpg",
    "tags": [],
    "interfaces": [
      "USB"
    ],
    "isTube": false
  },
  {
    "id": "prod-audioquest-niagara-5000",
    "categoryId": "power-conditioning",
    "brand": "AudioQuest",
    "model": "Niagara 5000",
    "nameEn": "AudioQuest Niagara 5000 Low-Z Power Noise Dissipation System",
    "nameZh": "AudioQuest Niagara 5000 低阻抗電源濾波處理器",
    "priceHkd": 45000.0,
    "descriptionEn": "State-of-the-art power noise dissipation system featuring Transient Power Correction (90 amps peak) and Ultra-Linear Noise Dissipation.",
    "descriptionZh": "頂級電源雜訊消散系統，具備瞬態功率校正 (90安培峰值) 及超線性全頻率濾波技術。",
    "acousticSignatureEn": "Massive dynamic expansion, complete removal of AC line hash, ultra-transparent staging, dark background.",
    "acousticSignatureZh": "動態範圍顯著提升，完全掃除電網高頻雜訊，音場通透度極高，背景極致漆黑。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/audioquest-niagara-5000.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-isotek-v5-aquarius",
    "categoryId": "power-conditioning",
    "brand": "IsoTek",
    "model": "V5 Aquarius",
    "nameEn": "IsoTek V5 Aquarius High-End Mains Power Conditioner",
    "nameZh": "IsoTek V5 Aquarius 發燒級電源淨化器",
    "priceHkd": 23800.0,
    "descriptionEn": "Clean power system providing 6 independent outlets, KERP adaptive resistance, and 60dB RFI noise reduction.",
    "descriptionZh": "乾淨電源淨化系統，提供 6 組獨立隔離插座、KERP 自適應電阻網絡及 60dB 射頻雜訊衰減。",
    "acousticSignatureEn": "Pristine soundstage focus, improved vocal separation, clean extended treble without digital glare.",
    "acousticSignatureZh": "聲場定位精準，人聲分離度提高，高頻延伸乾淨流暢無雜質。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/isotek-v5-aquarius.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-psaudio-directstream-p12",
    "categoryId": "power-conditioning",
    "brand": "PS Audio",
    "model": "DirectStream P12",
    "nameEn": "PS Audio DirectStream Power Plant P12 AC Regenerator",
    "nameZh": "PS Audio DirectStream Power Plant P12 電源重組再生器",
    "priceHkd": 48000.0,
    "descriptionEn": "Pure sine-wave AC power regenerator producing 1250 VA continuous ultra-low impedance AC power from scratch.",
    "descriptionZh": "純正正弦波交流電源重組再生器，重新生成 1250 VA 連續超低阻抗純淨交流電。",
    "acousticSignatureEn": "Pure sine-wave AC regeneration, absolute noise isolation, tight authoritative low-end, stable staging.",
    "acousticSignatureZh": "純淨正弦波 AC 電源重組，完全隔絕電網干擾，低頻控制力強悍，音場極其穩定。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/psaudio-directstream-p12.jpg",
    "tags": [],
    "interfaces": [],
    "isTube": false
  },
  {
    "id": "prod-plixir-elite-bdc",
    "categoryId": "power-conditioning",
    "brand": "Plixir",
    "model": "Elite BDC",
    "nameEn": "Plixir Elite BDC Balanced DC Power Supply (12V 4A)",
    "nameZh": "Plixir Elite BDC 平衡式直流線性電源供應器",
    "priceHkd": 6800.0,
    "descriptionEn": "Dual-stage balanced toroidal DC linear power supply delivering noise-free DC power to digital transports and DACs.",
    "descriptionZh": "雙級平衡環形變壓器直流線性電源，為數位播放器與解碼器提供零雜訊直流電源。",
    "acousticSignatureEn": "Eliminates DC ripple noise, dramatically improves digital source micro-dynamics, warmer fluid mid-range.",
    "acousticSignatureZh": "完全消除直流漣波雜訊，顯著提升數位源頭之微動態表現，中頻更為溫暖順滑。",
    "imageUrl": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/plixir-elite-bdc.jpg",
    "tags": [],
    "interfaces": [
      "XLR"
    ],
    "isTube": false
  }
];
