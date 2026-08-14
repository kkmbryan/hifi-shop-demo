export interface MockCategoryRow {
  category_id: string;
  name_en: string;
  name_zh: string;
  slug: string;
  description_en: string;
  description_zh: string;
  display_order: number;
}

export interface MockProductRow {
  product_id: string;
  category_id: string;
  category_name_en: string;
  category_name_zh: string;
  category_description_en?: string;
  category_description_zh?: string;
  brand: string;
  model: string;
  name_en: string;
  name_zh: string;
  price_hkd: number;
  description_en: string;
  description_zh: string;
  acoustic_signature_en: string;
  acoustic_signature_zh: string;
  image_url: string;
  is_active: boolean;
}

export interface MockSpecRow {
  product_id: string;
  spec_key: string;
  spec_value_en: string;
  spec_value_zh: string;
  is_filter_facet: boolean;
}

export const MOCK_DB_CATEGORIES: MockCategoryRow[] = [
  {
    "category_id": "dacs",
    "name_en": "DACs (Digital-to-Analog Converters)",
    "name_zh": "解碼器 (DACs)",
    "slug": "dacs",
    "description_en": "High-resolution Digital-to-Analog Converters converting PCM and DSD streams into pure analog sound.",
    "description_zh": "高解析度數碼至模擬解碼器，將 PCM 與 DSD 數位訊號完美轉換為純淨類比音訊。",
    "display_order": 1
  },
  {
    "category_id": "amplifiers",
    "name_en": "Amplifiers",
    "name_zh": "擴音機 (Amplifiers)",
    "slug": "amplifiers",
    "description_en": "Integrated, pre-amplifiers, power amplifiers, and vacuum tube amplifiers delivering pristine audio power.",
    "description_zh": "合併式、前級、後級及真空管擴音機，提供純正無瑕的音訊擴大驅動力。",
    "display_order": 2
  },
  {
    "category_id": "streamers",
    "name_en": "Network Streamers",
    "name_zh": "網絡播放器 (Streamers)",
    "slug": "streamers",
    "description_en": "High-fidelity digital transports and network music streamers with ultra-low jitter.",
    "description_zh": "高保真網絡音樂播放器與數位轉盤，具備極低時基誤差與高清串流能力。",
    "display_order": 3
  },
  {
    "category_id": "turntables",
    "name_en": "Turntables",
    "name_zh": "黑膠唱機 (Turntables)",
    "slug": "turntables",
    "description_en": "Precision analog vinyl disc record players, tonearms, and moving magnet/moving coil cartridges.",
    "description_zh": "精密類比黑膠唱片機、唱臂及動磁/動圈唱頭，還原最真實的黑膠韻味。",
    "display_order": 4
  },
  {
    "category_id": "head-fi",
    "name_en": "Headphones / Head-Fi",
    "name_zh": "耳機 / 入耳式耳機 (Head-Fi)",
    "slug": "head-fi",
    "description_en": "Flagship open-back dynamic, planar magnetic, electrostatic headphones, and custom IEMs.",
    "description_zh": "旗艦級開放式動圈、平板振膜、靜電耳機及專業入耳式監聽耳機。",
    "display_order": 5
  },
  {
    "category_id": "loudspeakers",
    "name_en": "Loudspeakers",
    "name_zh": "音箱 / 喇叭 (Loudspeakers)",
    "slug": "loudspeakers",
    "description_en": "High-end stereo floorstanding, bookshelf, and active studio monitor loudspeakers.",
    "description_zh": "高級立體聲落地式音箱、書架式喇叭及主動式專業監聽音箱。",
    "display_order": 6
  },
  {
    "category_id": "cables",
    "name_en": "Audio Cables",
    "name_zh": "線材 (Cables)",
    "slug": "cables",
    "description_en": "Audiophile-grade speaker cables, balanced XLR/RCA interconnects, USB data cables, and power cords.",
    "description_zh": "發燒級喇叭線、平衡 XLR/RCA 訊號線、高傳真 USB 數據線及大電流電源線。",
    "display_order": 7
  },
  {
    "category_id": "power-conditioning",
    "name_en": "Power Conditioning",
    "name_zh": "電源處理 (Power Conditioning)",
    "slug": "power-conditioning",
    "description_en": "Ultra-low noise AC power noise dissipation systems, power regenerators, and linear DC supplies.",
    "description_zh": "超低雜訊交流電源淨化器、正弦波電源重組再生器及平衡直流線性電源。",
    "display_order": 8
  }
];

export const MOCK_DB_PRODUCTS: MockProductRow[] = [
  {
    "product_id": "prod-chord-hugo-tt2",
    "category_id": "dacs",
    "category_name_en": "DACs (Digital-to-Analog Converters)",
    "category_name_zh": "解碼器 (DACs)",
    "category_description_en": "High-resolution Digital-to-Analog Converters converting PCM and DSD streams into pure analog sound.",
    "category_description_zh": "高解析度數碼至模擬解碼器，將 PCM 與 DSD 數位訊號完美轉換為純淨類比音訊。",
    "brand": "Chord Electronics",
    "model": "Hugo TT 2",
    "name_en": "Chord Hugo TT 2 Desktop DAC / Headphone Amplifier",
    "name_zh": "Chord Hugo TT 2 桌面級解碼器 / 耳機擴音機",
    "price_hkd": 39800,
    "description_en": "The Hugo TT 2 is a ground-breaking desktop DAC and headphone amplifier equipped with custom FPGA filtering and 98,304-tap WTA filter algorithm delivering unmatched acoustic depth.",
    "description_zh": "Hugo TT 2 是一款突破性的桌面級解碼耳擴一體機，配備客製化 FPGA 濾波器及 98,304 Tap WTA 演算法，提供無可比擬的聲學深度與動態展現。",
    "acoustic_signature_en": "Crystal-clear soundstage, ultra-fast transient response, articulate micro-detail rendering, and explosive dynamic headroom.",
    "acoustic_signature_zh": "音場極度廣闊清晰，瞬態響應速度極快，微細節豐富，動態起伏澎湃有力。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/chord-hugo-tt2.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-denafrips-venus-ii",
    "category_id": "dacs",
    "category_name_en": "DACs (Digital-to-Analog Converters)",
    "category_name_zh": "解碼器 (DACs)",
    "category_description_en": "High-resolution Digital-to-Analog Converters converting PCM and DSD streams into pure analog sound.",
    "category_description_zh": "高解析度數碼至模擬解碼器，將 PCM 與 DSD 數位訊號完美轉換為純淨類比音訊。",
    "brand": "Denafrips",
    "model": "Venus II 12th",
    "name_en": "Denafrips Venus II 12th Anniversary R-2R Ladder DAC",
    "name_zh": "Denafrips Venus II 12週年紀念版 R-2R 電阻陣列解碼器",
    "price_hkd": 24800,
    "description_en": "True balanced discrete R-2R architecture featuring high-precision resistor networks and TCXO ultra-low phase noise clocks.",
    "description_zh": "採用真平衡分立式 R-2R 架構，配備高精度金屬膜電阻網絡與 TCXO 超低相位雜訊晶振。",
    "acoustic_signature_en": "Warm analog-like musicality, lush natural vocals, rich body, smooth liquid treble without digital glare.",
    "acoustic_signature_zh": "具備濃郁黑膠般溫暖人聲，聲音厚實自然，高頻順滑流暢，完全沒有數位味。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/denafrips-venus-ii.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-topping-d90-iii",
    "category_id": "dacs",
    "category_name_en": "DACs (Digital-to-Analog Converters)",
    "category_name_zh": "解碼器 (DACs)",
    "category_description_en": "High-resolution Digital-to-Analog Converters converting PCM and DSD streams into pure analog sound.",
    "category_description_zh": "高解析度數碼至模擬解碼器，將 PCM 與 DSD 數位訊號完美轉換為純淨類比音訊。",
    "brand": "Topping",
    "model": "D90 III SABRE",
    "name_en": "Topping D90 III SABRE Fully Balanced Flagship DAC",
    "name_zh": "Topping D90 III SABRE 旗艦全平衡解碼器",
    "price_hkd": 7980,
    "description_en": "Flagship dual ESS ES9039SPRO DAC implementation with ultra-low jitter CPLD clock processing and Bluetooth 5.1 LDAC support.",
    "description_zh": "搭載雙 ESS ES9039SPRO 旗艦晶片，配合 CPLD 超低時基誤差時鐘處理及藍芽 5.1 LDAC 無損傳輸。",
    "acoustic_signature_en": "Extremely analytical, ultra-low background noise floor, precise instrument separation, and neutral uncolored presentation.",
    "acoustic_signature_zh": "極具分析力，底噪極低，樂器定位精確，聲音中性無渲染。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/topping-d90-iii.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-ifi-neo-idosd-2",
    "category_id": "dacs",
    "category_name_en": "DACs (Digital-to-Analog Converters)",
    "category_name_zh": "解碼器 (DACs)",
    "category_description_en": "High-resolution Digital-to-Analog Converters converting PCM and DSD streams into pure analog sound.",
    "category_description_zh": "高解析度數碼至模擬解碼器，將 PCM 與 DSD 數位訊號完美轉換為純淨類比音訊。",
    "brand": "iFi Audio",
    "model": "NEO iDSD 2",
    "name_en": "iFi Audio NEO iDSD 2 Lossless Bluetooth & Headphone DAC/Amp",
    "name_zh": "iFi Audio NEO iDSD 2 無損藍芽解碼耳擴一體機",
    "price_hkd": 6480,
    "description_en": "Versatile desktop DAC and headphone amplifier featuring aptX Lossless Bluetooth, ultra-low jitter GMT clock, and 5,551mW drive power.",
    "description_zh": "全能型桌面解碼耳擴一體機，支援 aptX Lossless 無損藍芽，配備 GMT 超低時基誤差時鐘及 5,551mW 強勁輸出。",
    "acoustic_signature_en": "Energetic sound profile, warm-tilted mid-bass response, engaging vocals, and versatile headphone drive power.",
    "acoustic_signature_zh": "聲音充滿活力，中低頻包圍感強，人聲感染力高，耳機推力強勁。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/ifi-neo-idsd-2.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-mcintosh-ma8950",
    "category_id": "amplifiers",
    "category_name_en": "Amplifiers",
    "category_name_zh": "擴音機 (Amplifiers)",
    "category_description_en": "Integrated, pre-amplifiers, power amplifiers, and vacuum tube amplifiers delivering pristine audio power.",
    "category_description_zh": "合併式、前級、後級及真空管擴音機，提供純正無瑕的音訊擴大驅動力。",
    "brand": "Mcintosh",
    "model": "MA8950",
    "name_en": "McIntosh MA8950 Integrated Amplifier (200W/Ch)",
    "name_zh": "McIntosh MA8950 合併式擴音機 (每聲道200瓦)",
    "price_hkd": 78000,
    "description_en": "200 Watts per channel high-end stereo integrated amplifier featuring McIntosh Autoformer technology, DA2 digital audio module, and iconic blue meters.",
    "description_zh": "每聲道 200 瓦高級立體聲合併式擴音機，配備麥景圖專利 Autoformer 輸出變壓器、DA2 數碼模組及經典藍眼睛錶板。",
    "acoustic_signature_en": "Authoritative dynamic impact, warm velvet midrange, expansive bass control, and legendary McIntosh musical presence.",
    "acoustic_signature_zh": "音色雄渾大氣，中頻如絲絨般溫暖，低頻控制力極佳，展現麥景圖經典音樂味。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/mcintosh-ma8950.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-accuphase-e380",
    "category_id": "amplifiers",
    "category_name_en": "Amplifiers",
    "category_name_zh": "擴音機 (Amplifiers)",
    "category_description_en": "Integrated, pre-amplifiers, power amplifiers, and vacuum tube amplifiers delivering pristine audio power.",
    "category_description_zh": "合併式、前級、後級及真空管擴音機，提供純正無瑕的音訊擴大驅動力。",
    "brand": "Accuphase",
    "model": "E-380",
    "name_en": "Accuphase E-380 Stereo Integrated Amplifier",
    "name_zh": "Accuphase E-380 立體聲合併式擴音機",
    "price_hkd": 42000,
    "description_en": "Japanese high-end integrated amplifier with AAVA volume control, Instrumentation Amplifier configuration, and MOS-FET switches.",
    "description_zh": "日本頂級合併式擴音機，配備 AAVA 革命性音量控制系統、儀錶級放大電路及 MOS-FET 靜音開關。",
    "acoustic_signature_en": "Delicate, silky high frequencies, refined acoustic texturing, highly stable damping, and sweet articulate vocals.",
    "acoustic_signature_zh": "高頻細緻如絲，樂器質感極佳，阻尼係數高且控制力好，人聲甜美耐聽。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/accuphase-e380.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-feliks-envy",
    "category_id": "amplifiers",
    "category_name_en": "Amplifiers",
    "category_name_zh": "擴音機 (Amplifiers)",
    "category_description_en": "Integrated, pre-amplifiers, power amplifiers, and vacuum tube amplifiers delivering pristine audio power.",
    "category_description_zh": "合併式、前級、後級及真空管擴音機，提供純正無瑕的音訊擴大驅動力。",
    "brand": "Feliks Audio",
    "model": "Envy",
    "name_en": "Feliks Audio Envy Flagship 300B Vacuum Tube Headphone Amp",
    "name_zh": "Feliks Audio Envy 旗艦 300B 真空管耳機擴音機",
    "price_hkd": 58000,
    "description_en": "Flagship Single-Ended Class-A transformer-coupled headphone amplifier driven by iconic 300B vacuum tubes and solid oak chassis.",
    "description_zh": "旗艦級 Class-A 單端變壓器耦合耳機擴音機，採用傳奇 300B 真空管驅動，配以橡木機身。",
    "acoustic_signature_en": "Sublime 300B tube warmth, holographic 3D soundstage depth, intoxicating vocal emotion, and liquid texture.",
    "acoustic_signature_zh": "300B膽味極致溫暖，3D立體聲場深邃，人聲情感豐富，音色流暢連貫。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/feliks-envy.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-rega-elex-mk4",
    "category_id": "amplifiers",
    "category_name_en": "Amplifiers",
    "category_name_zh": "擴音機 (Amplifiers)",
    "category_description_en": "Integrated, pre-amplifiers, power amplifiers, and vacuum tube amplifiers delivering pristine audio power.",
    "category_description_zh": "合併式、前級、後級及真空管擴音機，提供純正無瑕的音訊擴大驅動力。",
    "brand": "Rega",
    "model": "Elex MK4",
    "name_en": "Rega Elex MK4 Integrated Stereo Amplifier with DAC",
    "name_zh": "Rega Elex MK4 整合式立體聲擴音機 (附設解碼)",
    "price_hkd": 11800,
    "description_en": "Award-winning British stereo amplifier with integrated DAC, built-in MM phono stage, and dedicated headphone output.",
    "description_zh": "屢獲殊榮的英國立體聲擴音機，內置 DAC 解碼、高品質 MM 黑膠唱頭放大器及耳機輸出。",
    "acoustic_signature_en": "Rhythmic drive, snappy timing, natural acoustic tone, and engaging punchy bass performance.",
    "acoustic_signature_zh": "節奏感強勁，瞬態時間準確，樂器音色自然，低頻彈跳力十足。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/rega-elex-mk4.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-aurender-n200",
    "category_id": "streamers",
    "category_name_en": "Network Streamers",
    "category_name_zh": "網絡播放器 (Streamers)",
    "category_description_en": "High-fidelity digital transports and network music streamers with ultra-low jitter.",
    "category_description_zh": "高保真網絡音樂播放器與數位轉盤，具備極低時基誤差與高清串流能力。",
    "brand": "Aurender",
    "model": "N200",
    "name_en": "Aurender N200 High-Performance Caching Music Server & Transport",
    "name_zh": "Aurender N200 高效能緩存音樂伺服器與轉盤",
    "price_hkd": 49800,
    "description_en": "High-performance digital audio streamer featuring NVMe SSD caching system, isolated USB Audio Class 2.0 output, and supercapacitor UPS.",
    "description_zh": "高效能數位音訊串流播放器，採用 NVMe SSD 緩存系統、獨立隔離 USB Audio 2.0 輸出及超大電容 UPS 保護。",
    "acoustic_signature_en": "Ultra-low jitter, pitch-black silence background, deep low-level retrieval, and pure uncompressed digital clarity.",
    "acoustic_signature_zh": "極低時基誤差，背景漆黑一片，微細細節還原度極高，數位訊號純淨無瑕。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/aurender-n200.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-lumin-t3",
    "category_id": "streamers",
    "category_name_en": "Network Streamers",
    "category_name_zh": "網絡播放器 (Streamers)",
    "category_description_en": "High-fidelity digital transports and network music streamers with ultra-low jitter.",
    "category_description_zh": "高保真網絡音樂播放器與數位轉盤，具備極低時基誤差與高清串流能力。",
    "brand": "Lumin",
    "model": "T3",
    "name_en": "Lumin T3 Digital Music Player with Internal Dual SABRE DAC",
    "name_zh": "Lumin T3 網絡串流播放器 (內置雙SABRE解碼)",
    "price_hkd": 38500,
    "description_en": "All-new processing system combining dual ESS SABRE ES9028PRO DACs, Leedh Processing lossless volume control, and CNC aluminum chassis.",
    "description_zh": "全新晶片處理系統，結合雙 ESS SABRE ES9028PRO 解碼、Leedh Processing 無損數碼音量控制及 CNC 鋁合金機身。",
    "acoustic_signature_en": "Smooth analog fluidity, expansive high-res imaging, articulate bass definition, and effortless streaming dynamics.",
    "acoustic_signature_zh": "具備類比音效順滑度，高解析度聲像遼闊，低頻線條清晰，串流動態輕鬆自然。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/lumin-t3.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-eversolo-dmp-a8",
    "category_id": "streamers",
    "category_name_en": "Network Streamers",
    "category_name_zh": "網絡播放器 (Streamers)",
    "category_description_en": "High-fidelity digital transports and network music streamers with ultra-low jitter.",
    "category_description_zh": "高保真網絡音樂播放器與數位轉盤，具備極低時基誤差與高清串流能力。",
    "brand": "Eversolo",
    "model": "DMP-A8",
    "name_en": "Eversolo DMP-A8 Network Streamer, DAC & Preamp",
    "name_zh": "Eversolo DMP-A8 網絡數播解碼前級一體機",
    "price_hkd": 15800,
    "description_en": "Flagship streamer with AK4191EQ + AK4499EX DAC separation, I2S HDMI output, R-2R analog volume control, and 6-inch touch screen.",
    "description_zh": "旗艦級數播，採用 AK4191EQ + AK4499EX 數位模擬分離解碼、I2S HDMI 輸出、R-2R 類比音量控制及 6吋觸摸屏。",
    "acoustic_signature_en": "Transparent dynamic presentation, crisp clarity, versatile sound tuning options, and robust bass presence.",
    "acoustic_signature_zh": "通透動態，細節高分辨，音色可調性高，低頻紮實有量感。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/eversolo-dmp-a8.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-wiim-pro-plus",
    "category_id": "streamers",
    "category_name_en": "Network Streamers",
    "category_name_zh": "網絡播放器 (Streamers)",
    "category_description_en": "High-fidelity digital transports and network music streamers with ultra-low jitter.",
    "category_description_zh": "高保真網絡音樂播放器與數位轉盤，具備極低時基誤差與高清串流能力。",
    "brand": "WiiM",
    "model": "Pro Plus",
    "name_en": "WiiM Pro Plus High-Res Audio Streamer with Premium AKM DAC",
    "name_zh": "WiiM Pro Plus 高解析度網絡音訊串流播放器",
    "price_hkd": 1880,
    "description_en": "Affordable high-res streamer featuring AKM AK4493SEQ DAC, AirPlay 2, Chromecast, and Roon Ready certification.",
    "description_zh": "超值高清串流播放器，內置 AKM AK4493SEQ DAC，支援 AirPlay 2、Chromecast 及 Roon Ready 認證。",
    "acoustic_signature_en": "Surprisingly clean and articulate sound, smooth neutral balance, excellent cost-performance entry transport.",
    "acoustic_signature_zh": "聲音出奇乾淨清晰，中性平衡，性價比極高的串流入門選擇。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/wiim-pro-plus.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-linn-sondek-lp12",
    "category_id": "turntables",
    "category_name_en": "Turntables",
    "category_name_zh": "黑膠唱機 (Turntables)",
    "category_description_en": "Precision analog vinyl disc record players, tonearms, and moving magnet/moving coil cartridges.",
    "category_description_zh": "精密類比黑膠唱片機、唱臂及動磁/動圈唱頭，還原最真實的黑膠韻味。",
    "brand": "Linn",
    "model": "Sondek LP12 Majik",
    "name_en": "Linn Sondek LP12 Majik Precision Turntable Package",
    "name_zh": "Linn Sondek LP12 Majik 精密黑膠唱機套裝",
    "price_hkd": 36800,
    "description_en": "The definitive benchmark turntable featuring Karousel single-point bearing, Krane tonearm, and Majik MM cartridge.",
    "description_zh": "黑膠唱機標桿產品，配備 Karousel 單點軸承、Krane 精密唱臂及 Majik MM 唱頭。",
    "acoustic_signature_en": "Legendary musical pace, rhythm and timing (PRaT), organic warmth, emotional vocal focus, and natural instrument resonance.",
    "acoustic_signature_zh": "傳奇般的音樂節奏與旋律感 (PRaT)，人聲溫暖貼耳，樂器共鳴極具生命力。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/linn-sondek-lp12.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-technics-sl1200g",
    "category_id": "turntables",
    "category_name_en": "Turntables",
    "category_name_zh": "黑膠唱機 (Turntables)",
    "category_description_en": "Precision analog vinyl disc record players, tonearms, and moving magnet/moving coil cartridges.",
    "category_description_zh": "精密類比黑膠唱片機、唱臂及動磁/動圈唱頭，還原最真實的黑膠韻味。",
    "brand": "Technics",
    "model": "SL-1200G",
    "name_en": "Technics SL-1200G Grand Class Direct Drive Turntable",
    "name_zh": "Technics SL-1200G 旗艦直驅黑膠唱盤",
    "price_hkd": 32000,
    "description_en": "Grand Class coreless direct-drive turntable featuring 3-layer brass and aluminium platter, lightweight magnesium tonearm.",
    "description_zh": "Grand Class 無鐵芯直接驅動唱盤，採用三層黃銅鋁合金黃金轉盤及輕量化鎂合金唱臂。",
    "acoustic_signature_en": "Rock-solid speed stability, explosive bass speed, pitch perfection, precise micro-dynamics, and dead-silent background.",
    "acoustic_signature_zh": "轉速絕對穩定，低頻反應迅捷紮實，音高精確，微動態豐富，背景寧靜。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/technics-sl1200g.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-rega-planar-6",
    "category_id": "turntables",
    "category_name_en": "Turntables",
    "category_name_zh": "黑膠唱機 (Turntables)",
    "category_description_en": "Precision analog vinyl disc record players, tonearms, and moving magnet/moving coil cartridges.",
    "category_description_zh": "精密類比黑膠唱片機、唱臂及動磁/動圈唱頭，還原最真實的黑膠韻味。",
    "brand": "Rega",
    "model": "Planar 6",
    "name_en": "Rega Planar 6 Turntable with Neo PSU & Ania MC Cartridge",
    "name_zh": "Rega Planar 6 黑膠唱機 (配備 Neo 電源與 Ania MC 唱頭)",
    "price_hkd": 14500,
    "description_en": "Lightweight Tancast 8 aerospace foam core turntable equipped with RB330 tonearm, Neo MK2 PSU, and factory-fitted Ania MC cartridge.",
    "description_zh": "採用 Tancast 8 航天泡綿夾層超輕機身，配備 RB330 精密唱臂、Neo MK2 電源及原廠 Ania MC 唱頭。",
    "acoustic_signature_en": "Energetic timing, lively soundstage, agile bass response, and detailed stringed instrument clarity.",
    "acoustic_signature_zh": "節奏明快活力充沛，聲場開揚，低頻迅捷，弦樂細節清晰。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/rega-planar-6.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-project-debut-pro",
    "category_id": "turntables",
    "category_name_en": "Turntables",
    "category_name_zh": "黑膠唱機 (Turntables)",
    "category_description_en": "Precision analog vinyl disc record players, tonearms, and moving magnet/moving coil cartridges.",
    "category_description_zh": "精密類比黑膠唱片機、唱臂及動磁/動圈唱頭，還原最真實的黑膠韻味。",
    "brand": "Pro-Ject",
    "model": "Debut PRO",
    "name_en": "Pro-Ject Debut PRO Audiophile Manual Turntable",
    "name_zh": "Pro-Ject Debut PRO 發燒級手動黑膠唱盤",
    "price_hkd": 7800,
    "description_en": "30th Anniversary turntable with 8.6-inch carbon-aluminium one-piece tonearm, nickel-plated aluminum components, and Pick it PRO cartridge.",
    "description_zh": "30 週年紀念版唱盤，配備 8.6 吋碳纖維鋁合金一體式唱臂、鍍鎳鋁金屬部件及 Pick it PRO 唱頭。",
    "acoustic_signature_en": "Well-balanced analogue tonality, tight acoustic focus, warm midrange, and clean stereo separation.",
    "acoustic_signature_zh": "類比音色平衡自然，樂器定位清晰，中頻溫和，聲道分離度高。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/project-debut-pro.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-sennheiser-hd800s",
    "category_id": "head-fi",
    "category_name_en": "Headphones / Head-Fi",
    "category_name_zh": "耳機 / 入耳式耳機 (Head-Fi)",
    "category_description_en": "Flagship open-back dynamic, planar magnetic, electrostatic headphones, and custom IEMs.",
    "category_description_zh": "旗艦級開放式動圈、平板振膜、靜電耳機及專業入耳式監聽耳機。",
    "brand": "Sennheiser",
    "model": "HD 800 S",
    "name_en": "Sennheiser HD 800 S Open-Back Dynamic Flagship Headphones",
    "name_zh": "Sennheiser HD 800 S 開放式動圈旗艦耳機",
    "price_hkd": 14200,
    "description_en": "The iconic benchmark open-back reference headphones featuring 56mm Ring Radiator transducers and Absorber Technology.",
    "description_zh": "業界開放式參考級耳機標桿，採用 56mm 環形振膜單元及專利吸收器技術。",
    "acoustic_signature_en": "Industry-benchmark 3D soundstage width, surgical instrument isolation, airy micro-detail, reference transparency.",
    "acoustic_signature_zh": "業界標桿級 3D 開揚音場，樂器分離度如外科手術般精確，高頻通透空氣感十足。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/sennheiser-hd800s.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-focal-utopia-2022",
    "category_id": "head-fi",
    "category_name_en": "Headphones / Head-Fi",
    "category_name_zh": "耳機 / 入耳式耳機 (Head-Fi)",
    "category_description_en": "Flagship open-back dynamic, planar magnetic, electrostatic headphones, and custom IEMs.",
    "category_description_zh": "旗艦級開放式動圈、平板振膜、靜電耳機及專業入耳式監聽耳機。",
    "brand": "Focal",
    "model": "Utopia (2022)",
    "name_en": "Focal Utopia (2022 Edition) Beryllium Open-Back Headphones",
    "name_zh": "Focal Utopia (2022新版) 純鈹振膜開放式耳機",
    "price_hkd": 39800,
    "description_en": "French luxury open-back flagship headphones equipped with 40mm Pure Beryllium \"M\"-shaped dome drivers and copper-aluminum voice coils.",
    "description_zh": "法國奢華開放式旗艦耳機，採用 40mm 純鈹 \"M\" 形穹頂單元與銅鋁合金音圈。",
    "acoustic_signature_en": "Unmatched dynamic speed, visceral physical impact, luxurious vocal detail, pinpoint spatial imaging.",
    "acoustic_signature_zh": "無可比擬的動態反應速度，衝擊力強，人聲細緻華麗，聲像定位極為精準。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/focal-utopia-2022.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-vision-ears-ext",
    "category_id": "head-fi",
    "category_name_en": "Headphones / Head-Fi",
    "category_name_zh": "耳機 / 入耳式耳機 (Head-Fi)",
    "category_description_en": "Flagship open-back dynamic, planar magnetic, electrostatic headphones, and custom IEMs.",
    "category_description_zh": "旗艦級開放式動圈、平板振膜、靜電耳機及專業入耳式監聽耳機。",
    "brand": "Vision Ears",
    "model": "EXT",
    "name_en": "Vision Ears EXT Universal Hybrid In-Ear Monitors",
    "name_zh": "Vision Ears EXT 圈鐵靜電混合入耳式耳機",
    "price_hkd": 22800,
    "description_en": "German hand-crafted hybrid IEMs combining 2 dynamic drivers and 4 electrostatic drivers for breathtaking vocal warmth and high extension.",
    "description_zh": "德國手工打造混合單元入耳式耳機，結合 2 動圈與 4 靜電單元，人聲溫暖潤澤且高頻延伸驚人。",
    "acoustic_signature_en": "Deep thunderous sub-bass impact, lush organic vocals, extended electrostatic shimmer without harshness.",
    "acoustic_signature_zh": "低頻下潛深遂有力，人聲溫暖潤澤，靜電高頻延伸極佳且毫無刺耳感。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/vision-ears-ext.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-campfire-andromeda-2020",
    "category_id": "head-fi",
    "category_name_en": "Headphones / Head-Fi",
    "category_name_zh": "耳機 / 入耳式耳機 (Head-Fi)",
    "category_description_en": "Flagship open-back dynamic, planar magnetic, electrostatic headphones, and custom IEMs.",
    "category_description_zh": "旗艦級開放式動圈、平板振膜、靜電耳機及專業入耳式監聽耳機。",
    "brand": "Campfire Audio",
    "model": "Andromeda 2020",
    "name_en": "Campfire Audio Andromeda 2020 5-BA In-Ear Monitors",
    "name_zh": "Campfire Audio Andromeda 2020 五動鐵入耳式耳機",
    "price_hkd": 8500,
    "description_en": "Iconic emerald green anodized aluminum IEM with 5 balanced armature drivers and Solid-Body acoustic chamber.",
    "description_zh": "經典翠綠陽極氧化鋁耳機，配備 5 動鐵單元及實心一體化聲學腔體。",
    "acoustic_signature_en": "Holographic spatial expansion, sparkling treble detail, sweet forward mid-range, iconically musical tuning.",
    "acoustic_signature_zh": "聲場空間感絕佳，高頻亮麗通透，中頻人聲甜美靠前，經典發燒調音。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/campfire-andromeda-2020.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-bw-804-d4",
    "category_id": "loudspeakers",
    "category_name_en": "Loudspeakers",
    "category_name_zh": "音箱 / 喇叭 (Loudspeakers)",
    "category_description_en": "High-end stereo floorstanding, bookshelf, and active studio monitor loudspeakers.",
    "category_description_zh": "高級立體聲落地式音箱、書架式喇叭及主動式專業監聽音箱。",
    "brand": "Bowers & Wilkins",
    "model": "804 D4",
    "name_en": "Bowers & Wilkins 804 D4 Diamond Tweeter Floorstanding Loudspeakers",
    "name_zh": "B&W 804 D4 鑽石高音落地式音箱",
    "price_hkd": 118000,
    "description_en": "Floorstanding reference loudspeaker featuring Solid Body Tweeter-on-Top with Diamond dome, Continuum Cone FST midrange, and Aerofoil bass drivers.",
    "description_zh": "旗艦落地式音箱，配備獨立實體鑽石高音單元、Continuum 錐盆 FST 中音及 Aerofoil 翼形低音單元。",
    "acoustic_signature_en": "Crystal-clean diamond high-frequency purity, solid tight bass extension, pinpoint orchestral imaging.",
    "acoustic_signature_zh": "鑽石高音極致純淨，低頻結實下潛深，管弦樂團定位精確無瑕。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/bw-804-d4.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-kef-ls50-wireless-ii",
    "category_id": "loudspeakers",
    "category_name_en": "Loudspeakers",
    "category_name_zh": "音箱 / 喇叭 (Loudspeakers)",
    "category_description_en": "High-end stereo floorstanding, bookshelf, and active studio monitor loudspeakers.",
    "category_description_zh": "高級立體聲落地式音箱、書架式喇叭及主動式專業監聽音箱。",
    "brand": "KEF",
    "model": "LS50 Wireless II",
    "name_en": "KEF LS50 Wireless II Active All-in-One Stereo Loudspeakers",
    "name_zh": "KEF LS50 Wireless II 主動式無線數碼音箱",
    "price_hkd": 21800,
    "description_en": "All-in-one active wireless loudspeaker system with 12th Gen Uni-Q driver array, Metamaterial Absorption Technology (MAT), and 760W total power.",
    "description_zh": "主動式無線音箱系統，採用第12代 Uni-Q 同軸單元、MAT 超材料吸音技術及 760W 總功放驅動。",
    "acoustic_signature_en": "Seamless Uni-Q point-source imaging, MAT absorbing clarity, tight bass impact, versatile streaming capability.",
    "acoustic_signature_zh": "Uni-Q 同軸單元點聲源定位完美，MAT 技術吸音通透，低頻下潛彈跳，無線串流極致方便。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/kef-ls50-wireless-ii.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-harbeth-m302-xd",
    "category_id": "loudspeakers",
    "category_name_en": "Loudspeakers",
    "category_name_zh": "音箱 / 喇叭 (Loudspeakers)",
    "category_description_en": "High-end stereo floorstanding, bookshelf, and active studio monitor loudspeakers.",
    "category_description_zh": "高級立體聲落地式音箱、書架式喇叭及主動式專業監聽音箱。",
    "brand": "Harbeth",
    "model": "Monitor 30.2 XD",
    "name_en": "Harbeth Monitor 30.2 XD Standmount Loudspeakers",
    "name_zh": "Harbeth Monitor 30.2 XD 書架式監聽音箱",
    "price_hkd": 46800,
    "description_en": "eXtended Definition British standmount monitor loudspeaker featuring RADIAL2 mid/bass technology and hand-crafted veneer.",
    "description_zh": "英國 eXtended Definition 書架監聽音箱，採用 RADIAL2 獨家中低音單元技術及精美手工木皮。",
    "acoustic_signature_en": "Enchanting vocal naturalness, organic BBC monitor timbre, rich wooden cabinet resonance, non-fatiguing presentation.",
    "acoustic_signature_zh": "人聲迷人自然，具備經典 BBC 監聽音色，木箱共鳴質感溫暖，長時間聆聽毫無疲勞感。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/harbeth-m302-xd.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-genelec-8341a",
    "category_id": "loudspeakers",
    "category_name_en": "Loudspeakers",
    "category_name_zh": "音箱 / 喇叭 (Loudspeakers)",
    "category_description_en": "High-end stereo floorstanding, bookshelf, and active studio monitor loudspeakers.",
    "category_description_zh": "高級立體聲落地式音箱、書架式喇叭及主動式專業監聽音箱。",
    "brand": "Genelec",
    "model": "8341A SAM",
    "name_en": "Genelec 8341A SAM Coaxial Active Studio Monitor (The Ones)",
    "name_zh": "Genelec 8341A SAM 同軸主動式監聽喇叭",
    "price_hkd": 28500,
    "description_en": "Point-source three-way coaxial active studio monitor with Smart Active Monitor (SAM) automated room calibration.",
    "description_zh": "三分頻同軸點聲源主動式監聽音箱，具備 SAM 智能自動房間聲學校正功能。",
    "acoustic_signature_en": "Uncompromising neutral accuracy, point-source phase alignment, pinpoint staging, and SAM room alignment.",
    "acoustic_signature_zh": "極致中性準確，同軸點聲源相位一致，立體聲場極為精準，支援 SAM 房間校正。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/genelec-8341a.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-nordost-frey-2",
    "category_id": "cables",
    "category_name_en": "Audio Cables",
    "category_name_zh": "線材 (Cables)",
    "category_description_en": "Audiophile-grade speaker cables, balanced XLR/RCA interconnects, USB data cables, and power cords.",
    "category_description_zh": "發燒級喇叭線、平衡 XLR/RCA 訊號線、高傳真 USB 數據線及大電流電源線。",
    "brand": "Nordost",
    "model": "Frey 2",
    "name_en": "Nordost Frey 2 High-End Speaker Cables (2.5m Pair, Banana/Spade)",
    "name_zh": "Nordost Frey 2 發燒級喇叭線 (2.5米對裝)",
    "price_hkd": 26800,
    "description_en": "Norse 2 series speaker cable featuring 22 x 22 AWG solid core silver-plated OFC conductors and Dual Mono-Filament technology.",
    "description_zh": "Norse 2 系列發燒喇叭線，採用 22 條 22 AWG 鍍銀無氧銅實心導線及專利雙微空間微單絲結構。",
    "acoustic_signature_en": "Lightning-fast transient speed, crystalline micro-detail, airy high-frequency extension, open dynamic range.",
    "acoustic_signature_zh": "瞬態傳導速度極快，微細節如水晶般透明，高頻空氣感開揚，動態無壓縮。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/nordost-frey-2.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-audioquest-dragon-tail",
    "category_id": "cables",
    "category_name_en": "Audio Cables",
    "category_name_zh": "線材 (Cables)",
    "category_description_en": "Audiophile-grade speaker cables, balanced XLR/RCA interconnects, USB data cables, and power cords.",
    "category_description_zh": "發燒級喇叭線、平衡 XLR/RCA 訊號線、高傳真 USB 數據線及大電流電源線。",
    "brand": "AudioQuest",
    "model": "Dragon Tail XLR",
    "name_en": "AudioQuest Dragon XLR Balanced Interconnects (1.0m Pair)",
    "name_zh": "AudioQuest Dragon XLR 平衡訊號線 (1.0米對裝)",
    "price_hkd": 18500,
    "description_en": "Flagship interconnect cable featuring Solid Perfect-Surface Silver (PSS) conductors and 72V Dielectric-Bias System (DBS).",
    "description_zh": "旗艦級平衡訊號線，採用實心 Perfect-Surface Silver (PSS) 純銀導體及 72V 介電偏壓系統 (DBS)。",
    "acoustic_signature_en": "Ultra-quiet noise floor, rich harmonic density, velvet smooth midrange, effortless low-frequency power.",
    "acoustic_signature_zh": "底噪極其漆黑，諧波密度豐富，中頻如絲絨般柔順，低頻下潛深沉有力。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/audioquest-dragon-tail.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-shunyata-venom-hc",
    "category_id": "cables",
    "category_name_en": "Audio Cables",
    "category_name_zh": "線材 (Cables)",
    "category_description_en": "Audiophile-grade speaker cables, balanced XLR/RCA interconnects, USB data cables, and power cords.",
    "category_description_zh": "發燒級喇叭線、平衡 XLR/RCA 訊號線、高傳真 USB 數據線及大電流電源線。",
    "brand": "Shunyata Research",
    "model": "Venom HC",
    "name_en": "Shunyata Research Venom HC High-Current Power Cable (1.75m)",
    "name_zh": "Shunyata Research Venom HC 大電流電源線 (1.75米)",
    "price_hkd": 4200,
    "description_en": "High-current AC power cable designed specifically for high-power amplifiers and power conditioners featuring 10 AWG OFE conductors.",
    "description_zh": "專為大功率擴音機與電源處理器設計的大電流電源線，採用 10 AWG 無氧無電鍍超純銅導體。",
    "acoustic_signature_en": "Dramatic lowering of system noise floor, improved dynamic contrast, weightier bass slam and punch.",
    "acoustic_signature_zh": "顯著降低系統底噪，提升動態對比度，低頻量感與衝擊力明顯增強。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/shunyata-venom-hc.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-inakustik-referenz-usb",
    "category_id": "cables",
    "category_name_en": "Audio Cables",
    "category_name_zh": "線材 (Cables)",
    "category_description_en": "Audiophile-grade speaker cables, balanced XLR/RCA interconnects, USB data cables, and power cords.",
    "category_description_zh": "發燒級喇叭線、平衡 XLR/RCA 訊號線、高傳真 USB 數據線及大電流電源線。",
    "brand": "Inakustik",
    "model": "Referenz USB 2.0",
    "name_en": "Inakustik Referenz High-Speed Audio USB Cable (1.5m)",
    "name_zh": "Inakustik Referenz 高速發燒級 USB 數據線 (1.5米)",
    "price_hkd": 2800,
    "description_en": "High-speed USB 2.0 digital audio cable with quadruple shielding and silver-plated OFC conductors to eliminate digital jitter.",
    "description_zh": "德國製造高速 USB 2.0 數碼音訊線，具備四重高密度屏蔽及鍍銀 OFC 導線，徹底杜絕數據傳輸時基誤差。",
    "acoustic_signature_en": "Low-jitter USB digital signal transmission, elimination of high-frequency digital hash, clean soundstage width.",
    "acoustic_signature_zh": "時基誤差極低，能有效消除高頻數位雜訊，音場寬廣清晰。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/inakustik-referenz-usb.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-audioquest-niagara-5000",
    "category_id": "power-conditioning",
    "category_name_en": "Power Conditioning",
    "category_name_zh": "電源處理 (Power Conditioning)",
    "category_description_en": "Ultra-low noise AC power noise dissipation systems, power regenerators, and linear DC supplies.",
    "category_description_zh": "超低雜訊交流電源淨化器、正弦波電源重組再生器及平衡直流線性電源。",
    "brand": "AudioQuest",
    "model": "Niagara 5000",
    "name_en": "AudioQuest Niagara 5000 Low-Z Power Noise Dissipation System",
    "name_zh": "AudioQuest Niagara 5000 低阻抗電源濾波處理器",
    "price_hkd": 45000,
    "description_en": "State-of-the-art power noise dissipation system featuring Transient Power Correction (90 amps peak) and Ultra-Linear Noise Dissipation.",
    "description_zh": "頂級電源雜訊消散系統，具備瞬態功率校正 (90安培峰值) 及超線性全頻率濾波技術。",
    "acoustic_signature_en": "Massive dynamic expansion, complete removal of AC line hash, ultra-transparent staging, dark background.",
    "acoustic_signature_zh": "動態範圍顯著提升，完全掃除電網高頻雜訊，音場通透度極高，背景極致漆黑。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/audioquest-niagara-5000.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-isotek-v5-aquarius",
    "category_id": "power-conditioning",
    "category_name_en": "Power Conditioning",
    "category_name_zh": "電源處理 (Power Conditioning)",
    "category_description_en": "Ultra-low noise AC power noise dissipation systems, power regenerators, and linear DC supplies.",
    "category_description_zh": "超低雜訊交流電源淨化器、正弦波電源重組再生器及平衡直流線性電源。",
    "brand": "IsoTek",
    "model": "V5 Aquarius",
    "name_en": "IsoTek V5 Aquarius High-End Mains Power Conditioner",
    "name_zh": "IsoTek V5 Aquarius 發燒級電源淨化器",
    "price_hkd": 23800,
    "description_en": "Clean power system providing 6 independent outlets, KERP adaptive resistance, and 60dB RFI noise reduction.",
    "description_zh": "乾淨電源淨化系統，提供 6 組獨立隔離插座、KERP 自適應電阻網絡及 60dB 射頻雜訊衰減。",
    "acoustic_signature_en": "Pristine soundstage focus, improved vocal separation, clean extended treble without digital glare.",
    "acoustic_signature_zh": "聲場定位精準，人聲分離度提高，高頻延伸乾淨流暢無雜質。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/isotek-v5-aquarius.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-psaudio-directstream-p12",
    "category_id": "power-conditioning",
    "category_name_en": "Power Conditioning",
    "category_name_zh": "電源處理 (Power Conditioning)",
    "category_description_en": "Ultra-low noise AC power noise dissipation systems, power regenerators, and linear DC supplies.",
    "category_description_zh": "超低雜訊交流電源淨化器、正弦波電源重組再生器及平衡直流線性電源。",
    "brand": "PS Audio",
    "model": "DirectStream P12",
    "name_en": "PS Audio DirectStream Power Plant P12 AC Regenerator",
    "name_zh": "PS Audio DirectStream Power Plant P12 電源重組再生器",
    "price_hkd": 48000,
    "description_en": "Pure sine-wave AC power regenerator producing 1250 VA continuous ultra-low impedance AC power from scratch.",
    "description_zh": "純正正弦波交流電源重組再生器，重新生成 1250 VA 連續超低阻抗純淨交流電。",
    "acoustic_signature_en": "Pure sine-wave AC regeneration, absolute noise isolation, tight authoritative low-end, stable staging.",
    "acoustic_signature_zh": "純淨正弦波 AC 電源重組，完全隔絕電網干擾，低頻控制力強悍，音場極其穩定。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/psaudio-directstream-p12.jpg",
    "is_active": true
  },
  {
    "product_id": "prod-plixir-elite-bdc",
    "category_id": "power-conditioning",
    "category_name_en": "Power Conditioning",
    "category_name_zh": "電源處理 (Power Conditioning)",
    "category_description_en": "Ultra-low noise AC power noise dissipation systems, power regenerators, and linear DC supplies.",
    "category_description_zh": "超低雜訊交流電源淨化器、正弦波電源重組再生器及平衡直流線性電源。",
    "brand": "Plixir",
    "model": "Elite BDC",
    "name_en": "Plixir Elite BDC Balanced DC Power Supply (12V 4A)",
    "name_zh": "Plixir Elite BDC 平衡式直流線性電源供應器",
    "price_hkd": 6800,
    "description_en": "Dual-stage balanced toroidal DC linear power supply delivering noise-free DC power to digital transports and DACs.",
    "description_zh": "雙級平衡環形變壓器直流線性電源，為數位播放器與解碼器提供零雜訊直流電源。",
    "acoustic_signature_en": "Eliminates DC ripple noise, dramatically improves digital source micro-dynamics, warmer fluid mid-range.",
    "acoustic_signature_zh": "完全消除直流漣波雜訊，顯著提升數位源頭之微動態表現，中頻更為溫暖順滑。",
    "image_url": "https://storage.googleapis.com/bryanko-hifi-shop-demo-assets/products/plixir-elite-bdc.jpg",
    "is_active": true
  }
];

export const MOCK_DB_SPECS: MockSpecRow[] = [
  {
    "product_id": "prod-chord-hugo-tt2",
    "spec_key": "dac_chip",
    "spec_value_en": "Custom Xilinx Artix-7 FPGA (98,304 Taps)",
    "spec_value_zh": "客製化 Xilinx Artix-7 FPGA (98,304 Taps)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-chord-hugo-tt2",
    "spec_key": "input_interface",
    "spec_value_en": "Dual BNC, Optical x2, USB Type-B",
    "spec_value_zh": "雙 BNC, 光纖 x2, USB Type-B",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-chord-hugo-tt2",
    "spec_key": "output_interface",
    "spec_value_en": "XLR Balanced, RCA, 6.35mm x2, 3.5mm x2",
    "spec_value_zh": "XLR 平衡, RCA, 6.35mm x2, 3.5mm x2",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-chord-hugo-tt2",
    "spec_key": "dynamic_range_db",
    "spec_value_en": "127.0 dB",
    "spec_value_zh": "127.0 dB",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-chord-hugo-tt2",
    "spec_key": "total_harmonic_distortion",
    "spec_value_en": "0.00008%",
    "spec_value_zh": "0.00008%",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-chord-hugo-tt2",
    "spec_key": "max_resolution",
    "spec_value_en": "PCM 768kHz / DSD512",
    "spec_value_zh": "PCM 768kHz / DSD512",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-denafrips-venus-ii",
    "spec_key": "dac_chip",
    "spec_value_en": "True 24-Bit R-2R + 6-Bit DSD Architecture",
    "spec_value_zh": "真 24-Bit R-2R + 6-Bit DSD 架構",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-denafrips-venus-ii",
    "spec_key": "input_interface",
    "spec_value_en": "I2S HDMI, AES/EBU, Coaxial, Optical, USB",
    "spec_value_zh": "I2S HDMI, AES/EBU, 同軸, 光纖, USB",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-denafrips-venus-ii",
    "spec_key": "output_interface",
    "spec_value_en": "XLR Balanced, RCA Single-Ended",
    "spec_value_zh": "XLR 平衡, RCA 單端",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-denafrips-venus-ii",
    "spec_key": "output_impedance_ohms",
    "spec_value_en": "1250 (XLR), 625 (RCA)",
    "spec_value_zh": "1250 歐姆 (XLR), 625 歐姆 (RCA)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-denafrips-venus-ii",
    "spec_key": "dynamic_range_db",
    "spec_value_en": "120.0 dB",
    "spec_value_zh": "120.0 dB",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-denafrips-venus-ii",
    "spec_key": "total_harmonic_distortion",
    "spec_value_en": "0.002%",
    "spec_value_zh": "0.002%",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-topping-d90-iii",
    "spec_key": "dac_chip",
    "spec_value_en": "Dual ESS ES9039SPRO",
    "spec_value_zh": "雙 ESS ES9039SPRO",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-topping-d90-iii",
    "spec_key": "input_interface",
    "spec_value_en": "USB, AES/EBU, Coaxial, Optical, Bluetooth 5.1",
    "spec_value_zh": "USB, AES/EBU, 同軸, 光纖, 藍芽 5.1",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-topping-d90-iii",
    "spec_key": "output_interface",
    "spec_value_en": "XLR Balanced, RCA Single-Ended",
    "spec_value_zh": "XLR 平衡, RCA 單端",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-topping-d90-iii",
    "spec_key": "dynamic_range_db",
    "spec_value_en": "135.0 dB",
    "spec_value_zh": "135.0 dB",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-topping-d90-iii",
    "spec_key": "total_harmonic_distortion",
    "spec_value_en": "0.000045%",
    "spec_value_zh": "0.000045%",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-topping-d90-iii",
    "spec_key": "max_resolution",
    "spec_value_en": "PCM 768kHz / DSD512",
    "spec_value_zh": "PCM 768kHz / DSD512",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-ifi-neo-idosd-2",
    "spec_key": "dac_chip",
    "spec_value_en": "Burr-Brown Multi-Bit Native DAC",
    "spec_value_zh": "Burr-Brown 多位元原生解碼晶片",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-ifi-neo-idosd-2",
    "spec_key": "input_interface",
    "spec_value_en": "USB3.0, Optical, Coaxial, Bluetooth 5.4",
    "spec_value_zh": "USB3.0, 光纖, 同軸, 藍芽 5.4",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-ifi-neo-idosd-2",
    "spec_key": "output_interface",
    "spec_value_en": "4.4mm Balanced, 6.35mm, XLR, RCA",
    "spec_value_zh": "4.4mm 平衡, 6.35mm, XLR, RCA",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-ifi-neo-idosd-2",
    "spec_key": "output_power_mw",
    "spec_value_en": "5551mW @ 32 ohms",
    "spec_value_zh": "5551毫瓦 @ 32 歐姆",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-ifi-neo-idosd-2",
    "spec_key": "dynamic_range_db",
    "spec_value_en": "120.0 dB",
    "spec_value_zh": "120.0 dB",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-mcintosh-ma8950",
    "spec_key": "output_power_w",
    "spec_value_en": "200 Watts/Ch into 2/4/8 ohms",
    "spec_value_zh": "每聲道 200 瓦 (2/4/8 歐姆)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-mcintosh-ma8950",
    "spec_key": "amp_class",
    "spec_value_en": "Class AB Solid State with Autoformer",
    "spec_value_zh": "Class AB 晶體管配 Autoformer 變壓器",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-mcintosh-ma8950",
    "spec_key": "input_interface",
    "spec_value_en": "XLR Balanced x1, RCA x6, MM/MC Phono, DA2 HDMI/USB",
    "spec_value_zh": "XLR 平衡 x1, RCA x6, MM/MC 黑膠唱頭, DA2 HDMI/USB",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-mcintosh-ma8950",
    "spec_key": "output_interface",
    "spec_value_en": "Solid Cinch Speaker Terminals, Preamp Out",
    "spec_value_zh": "Solid Cinch 喇叭接線柱, 前級輸出",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-mcintosh-ma8950",
    "spec_key": "total_harmonic_distortion",
    "spec_value_en": "0.005%",
    "spec_value_zh": "0.005%",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-mcintosh-ma8950",
    "spec_key": "snr_db",
    "spec_value_en": "113.0 dB",
    "spec_value_zh": "113.0 dB",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-accuphase-e380",
    "spec_key": "output_power_w",
    "spec_value_en": "120W into 8 ohms, 180W into 4 ohms",
    "spec_value_zh": "每聲道 120瓦 (8歐姆) / 180瓦 (4歐姆)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-accuphase-e380",
    "spec_key": "amp_class",
    "spec_value_en": "Class AB with AAVA Volume Control",
    "spec_value_zh": "Class AB 配合 AAVA 音量控制",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-accuphase-e380",
    "spec_key": "damping_factor",
    "spec_value_en": "500",
    "spec_value_zh": "500",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-accuphase-e380",
    "spec_key": "input_interface",
    "spec_value_en": "XLR Balanced x2, RCA x5",
    "spec_value_zh": "XLR 平衡 x2, RCA x5",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-accuphase-e380",
    "spec_key": "output_interface",
    "spec_value_en": "Dual Speaker A/B Terminals",
    "spec_value_zh": "雙組喇叭 A/B 接線端子",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-accuphase-e380",
    "spec_key": "total_harmonic_distortion",
    "spec_value_en": "0.05%",
    "spec_value_zh": "0.05%",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-feliks-envy",
    "spec_key": "tube_complement",
    "spec_value_en": "300B Power Tubes x2, CV181 (6SN7) Driver Tubes x2",
    "spec_value_zh": "300B 功率管 x2, CV181 (6SN7) 驅動管 x2",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-feliks-envy",
    "spec_key": "amp_class",
    "spec_value_en": "Class A Single-Ended Triode (SET)",
    "spec_value_zh": "Class A 單端三極管 (SET)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-feliks-envy",
    "spec_key": "output_power_w",
    "spec_value_en": "8 Watts per channel",
    "spec_value_zh": "每聲道 8 瓦",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-feliks-envy",
    "spec_key": "impedance_range_ohms",
    "spec_value_en": "16 to 600 ohms",
    "spec_value_zh": "16 至 600 歐姆",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-feliks-envy",
    "spec_key": "input_interface",
    "spec_value_en": "XLR Balanced x1, RCA x2",
    "spec_value_zh": "XLR 平衡 x1, RCA x2",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-feliks-envy",
    "spec_key": "output_interface",
    "spec_value_en": "4.4mm Balanced, 4-pin XLR, 6.35mm",
    "spec_value_zh": "4.4mm 平衡, 4-pin XLR, 6.35mm",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-rega-elex-mk4",
    "spec_key": "output_power_w",
    "spec_value_en": "72W/Ch into 8 ohms, 90W/Ch into 6 ohms",
    "spec_value_zh": "每聲道 72瓦 (8歐姆) / 90瓦 (6歐姆)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-rega-elex-mk4",
    "spec_key": "amp_class",
    "spec_value_en": "Class AB Class A Driver Stage",
    "spec_value_zh": "Class AB 配以 Class A 驅動級",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-rega-elex-mk4",
    "spec_key": "input_interface",
    "spec_value_en": "MM Phono, RCA Line x4, Optical, Coaxial",
    "spec_value_zh": "MM 黑膠唱頭, RCA Line x4, 光纖, 同軸",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-rega-elex-mk4",
    "spec_key": "output_interface",
    "spec_value_en": "Speaker Terminals, Pre-amp Out, 6.35mm Headphone Jack",
    "spec_value_zh": "喇叭接線柱, 前級輸出, 6.35mm 耳機孔",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-aurender-n200",
    "spec_key": "input_interface",
    "spec_value_en": "Gigabit Ethernet, Dual USB 3.0 Storage Ports",
    "spec_value_zh": "千兆乙太網絡, 雙 USB 3.0 儲存埠",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-aurender-n200",
    "spec_key": "output_interface",
    "spec_value_en": "Audio Class 2.0 USB, Ultra-Low Jitter Coaxial BNC",
    "spec_value_zh": "獨立 Audio Class 2.0 USB, 超低時基誤差 BNC 同軸",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-aurender-n200",
    "spec_key": "storage",
    "spec_value_en": "Dual 2.5\" SSD/HDD User Installable Slots",
    "spec_value_zh": "雙 2.5 吋 SSD/HDD 擴充槽",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-aurender-n200",
    "spec_key": "system_memory",
    "spec_value_en": "240GB NVMe SSD Cache",
    "spec_value_zh": "240GB NVMe SSD 快取緩存",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-lumin-t3",
    "spec_key": "dac_chip",
    "spec_value_en": "Dual ESS SABRE ES9028PRO",
    "spec_value_zh": "雙 ESS SABRE ES9028PRO",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-lumin-t3",
    "spec_key": "supported_codecs",
    "spec_value_en": "MQA, DSD512, PCM 384kHz, Roon Ready, Tidal/Spotify Connect",
    "spec_value_zh": "MQA, DSD512, PCM 384kHz, Roon Ready, Tidal/Spotify",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-lumin-t3",
    "spec_key": "input_interface",
    "spec_value_en": "RJ45 Gigabit Ethernet, USB Storage",
    "spec_value_zh": "RJ45 千兆網埠, USB 儲存裝置",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-lumin-t3",
    "spec_key": "output_interface",
    "spec_value_en": "XLR Balanced, RCA Single-Ended",
    "spec_value_zh": "XLR 平衡, RCA 單端",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-eversolo-dmp-a8",
    "spec_key": "dac_chip",
    "spec_value_en": "AKM AK4191EQ + AK4499EX Separated DAC System",
    "spec_value_zh": "AKM AK4191EQ + AK4499EX 數模分離系統",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-eversolo-dmp-a8",
    "spec_key": "input_interface",
    "spec_value_en": "I2S HDMI, Optical, Coaxial, USB-B, ARC, Bluetooth 5.0, RCA, XLR",
    "spec_value_zh": "I2S HDMI, 光纖, 同軸, USB-B, ARC, 藍芽, RCA, XLR",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-eversolo-dmp-a8",
    "spec_key": "output_interface",
    "spec_value_en": "XLR Balanced, RCA, Optical, Coaxial, IIS",
    "spec_value_zh": "XLR 平衡, RCA, 光纖, 同軸, IIS HDMI",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-eversolo-dmp-a8",
    "spec_key": "display",
    "spec_value_en": "6-inch HD Color Touchscreen",
    "spec_value_zh": "6 吋高解析度彩色觸控屏幕",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-wiim-pro-plus",
    "spec_key": "dac_chip",
    "spec_value_en": "AKM AK4493SEQ Premium DAC",
    "spec_value_zh": "AKM AK4493SEQ 優質解碼晶片",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-wiim-pro-plus",
    "spec_key": "supported_codecs",
    "spec_value_en": "AirPlay 2, Chromecast, DLNA, Roon Ready, Spotify/Tidal Connect",
    "spec_value_zh": "AirPlay 2, Chromecast, DLNA, Roon Ready, Spotify/Tidal",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-wiim-pro-plus",
    "spec_key": "input_interface",
    "spec_value_en": "WiFi 5, Ethernet, Optical In, RCA Line In",
    "spec_value_zh": "WiFi 5, 網線埠, 光纖輸入, RCA 輸入",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-wiim-pro-plus",
    "spec_key": "output_interface",
    "spec_value_en": "Optical Out, Coaxial Out, RCA Line Out",
    "spec_value_zh": "光纖輸出, 同軸輸出, RCA 輸出",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-linn-sondek-lp12",
    "spec_key": "drive_type",
    "spec_value_en": "Belt Drive with Sub-Chassis Suspension",
    "spec_value_zh": "皮帶驅動配合副底盤懸掛系統",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-linn-sondek-lp12",
    "spec_key": "tonearm",
    "spec_value_en": "Linn Krane Precision Tonearm",
    "spec_value_zh": "Linn Krane 精密唱臂",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-linn-sondek-lp12",
    "spec_key": "cartridge",
    "spec_value_en": "Karousel Bearing + Majik MM Cartridge",
    "spec_value_zh": "Karousel 軸承 + Majik MM 唱頭",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-linn-sondek-lp12",
    "spec_key": "speed_rpm",
    "spec_value_en": "33.3 / 45 RPM",
    "spec_value_zh": "33.3 / 45 轉",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-technics-sl1200g",
    "spec_key": "drive_type",
    "spec_value_en": "Coreless Direct Drive Motor",
    "spec_value_zh": "無鐵芯直接驅動馬達",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-technics-sl1200g",
    "spec_key": "platter",
    "spec_value_en": "Heavy Brass & Die-Cast Aluminium 3-Layer",
    "spec_value_zh": "重型黃銅壓鑄鋁三層轉盤",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-technics-sl1200g",
    "spec_key": "tonearm",
    "spec_value_en": "High-Damping Lightweight Magnesium Tonearm",
    "spec_value_zh": "高阻尼輕量化鎂合金唱臂",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-technics-sl1200g",
    "spec_key": "speed_rpm",
    "spec_value_en": "33.3 / 45 / 78 RPM",
    "spec_value_zh": "33.3 / 45 / 78 轉",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-technics-sl1200g",
    "spec_key": "wow_and_flutter",
    "spec_value_en": "0.025% W.R.M.S.",
    "spec_value_zh": "0.025% W.R.M.S.",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-rega-planar-6",
    "spec_key": "drive_type",
    "spec_value_en": "Ultra-Low Friction Belt Drive",
    "spec_value_zh": "超低摩擦皮帶驅動",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-rega-planar-6",
    "spec_key": "plinth",
    "spec_value_en": "Tancast 8 Aerospace Foam Core Substructure",
    "spec_value_zh": "Tancast 8 航天級泡綿核心底盤",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-rega-planar-6",
    "spec_key": "tonearm",
    "spec_value_en": "RB330 Precision Hand-Assembled Tonearm",
    "spec_value_zh": "RB330 手工精密唱臂",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-rega-planar-6",
    "spec_key": "cartridge",
    "spec_value_en": "Rega Ania Moving Coil (MC)",
    "spec_value_zh": "Rega Ania 動圈 (MC) 唱頭",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-project-debut-pro",
    "spec_key": "drive_type",
    "spec_value_en": "Precision Belt Drive with Electronic Speed Control",
    "spec_value_zh": "精密皮帶驅動配電子轉速控制",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-project-debut-pro",
    "spec_key": "tonearm",
    "spec_value_en": "8.6\" Carbon-Aluminium One-Piece Tonearm",
    "spec_value_zh": "8.6 吋碳纖維-鋁合金一體成型唱臂",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-project-debut-pro",
    "spec_key": "cartridge",
    "spec_value_en": "Pick it PRO MM Cartridge",
    "spec_value_zh": "Pick it PRO 動磁 (MM) 唱頭",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-project-debut-pro",
    "spec_key": "speed_rpm",
    "spec_value_en": "33.3 / 45 / 78 RPM",
    "spec_value_zh": "33.3 / 45 / 78 轉",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-sennheiser-hd800s",
    "spec_key": "driver_type",
    "spec_value_en": "56mm Ring Radiator Transducer",
    "spec_value_zh": "56mm 環形振膜單元",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-sennheiser-hd800s",
    "spec_key": "impedance_ohms",
    "spec_value_en": "300 ohms",
    "spec_value_zh": "300 歐姆",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-sennheiser-hd800s",
    "spec_key": "sensitivity_db",
    "spec_value_en": "102 dB/mW",
    "spec_value_zh": "102 dB/mW",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-sennheiser-hd800s",
    "spec_key": "frequency_response",
    "spec_value_en": "4 Hz - 51,000 Hz",
    "spec_value_zh": "4 Hz - 51,000 Hz",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-sennheiser-hd800s",
    "spec_key": "connector",
    "spec_value_en": "4.4mm Pentaconn, 6.35mm Stereo Plug",
    "spec_value_zh": "4.4mm 平衡, 6.35mm 單端插頭",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-focal-utopia-2022",
    "spec_key": "driver_type",
    "spec_value_en": "40mm Pure Beryllium \"M\"-Shaped Dome",
    "spec_value_zh": "40mm 純鈹 \"M\" 形穹頂單元",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-focal-utopia-2022",
    "spec_key": "impedance_ohms",
    "spec_value_en": "80 ohms",
    "spec_value_zh": "80 歐姆",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-focal-utopia-2022",
    "spec_key": "sensitivity_db",
    "spec_value_en": "104 dB/mW",
    "spec_value_zh": "104 dB/mW",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-focal-utopia-2022",
    "spec_key": "frequency_response",
    "spec_value_en": "5 Hz - 50,000 Hz",
    "spec_value_zh": "5 Hz - 50,000 Hz",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-focal-utopia-2022",
    "spec_key": "connector",
    "spec_value_en": "Dual Lemo to 4.4mm / XLR / 3.5mm",
    "spec_value_zh": "雙 Lemo 轉 4.4mm / XLR / 3.5mm",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-vision-ears-ext",
    "spec_key": "driver_type",
    "spec_value_en": "1 Dynamic (Bass), 1 Dynamic (Mids), 4 Electrostatic (Highs)",
    "spec_value_zh": "1 動圈(低音), 1 動圈(中音), 4 靜電(高音)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-vision-ears-ext",
    "spec_key": "impedance_ohms",
    "spec_value_en": "10 ohms",
    "spec_value_zh": "10 歐姆",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-vision-ears-ext",
    "spec_key": "sensitivity_db",
    "spec_value_en": "108.5 dB/mW",
    "spec_value_zh": "108.5 dB/mW",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-vision-ears-ext",
    "spec_key": "connector",
    "spec_value_en": "2-Pin 0.78mm Premium 4.4mm Cable",
    "spec_value_zh": "2-Pin 0.78mm 轉 4.4mm 發燒線材",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-campfire-andromeda-2020",
    "spec_key": "driver_type",
    "spec_value_en": "5 Balanced Armatures (2 High + 1 Mid + 2 Low)",
    "spec_value_zh": "5 動鐵單元 (2高音 + 1中音 + 2低音)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-campfire-andromeda-2020",
    "spec_key": "impedance_ohms",
    "spec_value_en": "12.8 ohms",
    "spec_value_zh": "12.8 歐姆",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-campfire-andromeda-2020",
    "spec_key": "sensitivity_db",
    "spec_value_en": "115 dB/mW",
    "spec_value_zh": "115 dB/mW",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-campfire-andromeda-2020",
    "spec_key": "connector",
    "spec_value_en": "Beryllium Copper MMCX to 3.5mm / 4.4mm",
    "spec_value_zh": "鈹銅 MMCX 轉 3.5mm / 4.4mm",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-bw-804-d4",
    "spec_key": "driver_type",
    "spec_value_en": "1x 25mm Diamond Tweeter, 1x 130mm Continuum Mid, 2x 165mm Aerofoil Bass",
    "spec_value_zh": "1x 25mm 鑽石高音, 1x 130mm Continuum中音, 2x 165mm 低音",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-bw-804-d4",
    "spec_key": "sensitivity_db",
    "spec_value_en": "89 dB",
    "spec_value_zh": "89 dB",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-bw-804-d4",
    "spec_key": "nominal_impedance_ohms",
    "spec_value_en": "8 ohms (minimum 3.0 ohms)",
    "spec_value_zh": "8 歐姆 (最低 3.0 歐姆)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-bw-804-d4",
    "spec_key": "frequency_response",
    "spec_value_en": "24 Hz - 28,000 Hz",
    "spec_value_zh": "24 Hz - 28,000 Hz",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-bw-804-d4",
    "spec_key": "recommended_amp_power_w",
    "spec_value_en": "50W - 200W into 8 ohms",
    "spec_value_zh": "50瓦 - 200瓦 (8歐姆)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-kef-ls50-wireless-ii",
    "spec_key": "driver_type",
    "spec_value_en": "Uni-Q Driver Array (12th Gen with MAT Technology)",
    "spec_value_zh": "Uni-Q 同軸單元 (第12代配備 MAT 技術)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-kef-ls50-wireless-ii",
    "spec_key": "total_system_power_w",
    "spec_value_en": "760W Total (380W per channel Class D/AB)",
    "spec_value_zh": "總功率 760瓦 (每聲道 380瓦 Class D/AB)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-kef-ls50-wireless-ii",
    "spec_key": "input_interface",
    "spec_value_en": "HDMI eARC, TOSLINK Optical, Coaxial, 3.5mm, Ethernet, WiFi",
    "spec_value_zh": "HDMI eARC, 光纖, 同軸, 3.5mm, 網線, WiFi",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-kef-ls50-wireless-ii",
    "spec_key": "max_resolution",
    "spec_value_en": "PCM 384kHz / DSD256",
    "spec_value_zh": "PCM 384kHz / DSD256",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-harbeth-m302-xd",
    "spec_key": "driver_type",
    "spec_value_en": "200mm RADIAL2 Bass/Mid, 25mm Soft Dome Tweeter",
    "spec_value_zh": "200mm RADIAL2 中低音, 25mm 軟球頂高音",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-harbeth-m302-xd",
    "spec_key": "sensitivity_db",
    "spec_value_en": "85 dB",
    "spec_value_zh": "85 dB",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-harbeth-m302-xd",
    "spec_key": "nominal_impedance_ohms",
    "spec_value_en": "6 ohms",
    "spec_value_zh": "6 歐姆",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-harbeth-m302-xd",
    "spec_key": "frequency_response",
    "spec_value_en": "50 Hz - 20,000 Hz",
    "spec_value_zh": "50 Hz - 20,000 Hz",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-harbeth-m302-xd",
    "spec_key": "recommended_amp_power_w",
    "spec_value_en": "25W+",
    "spec_value_zh": "25瓦以上",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-genelec-8341a",
    "spec_key": "driver_type",
    "spec_value_en": "Dual 6.6x3.5\" Woofers, 3.5\" Coaxial Mid + 3/4\" Dome Tweeter",
    "spec_value_zh": "雙 6.6x3.5\" 低音, 3.5\" 同軸中音 + 3/4\" 金屬高音",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-genelec-8341a",
    "spec_key": "total_system_power_w",
    "spec_value_en": "550W Tri-Amplified Class D",
    "spec_value_zh": "550瓦 三路三功放 Class D",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-genelec-8341a",
    "spec_key": "input_interface",
    "spec_value_en": "XLR Analog, XLR AES/EBU Digital, RJ45 GLM Network",
    "spec_value_zh": "XLR 類比, XLR AES/EBU 數位, RJ45 GLM 網埠",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-genelec-8341a",
    "spec_key": "max_spl_db",
    "spec_value_en": "118 dB SPL",
    "spec_value_zh": "118 dB SPL",
    "is_filter_facet": false
  },
  {
    "product_id": "prod-nordost-frey-2",
    "spec_key": "cable_type",
    "spec_value_en": "Speaker Cable (Pair)",
    "spec_value_zh": "喇叭線 (對裝)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-nordost-frey-2",
    "spec_key": "conductor_material",
    "spec_value_en": "22 x 22 AWG Solid Core 99.99999% OFC with Silver Plating",
    "spec_value_zh": "22條 22 AWG 實心 99.99999% 鍍銀無氧銅",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-nordost-frey-2",
    "spec_key": "insulation",
    "spec_value_en": "High Grade Fluorinated Ethylene Propylene (FEP)",
    "spec_value_zh": "高級 FEP 鐵氟龍絕緣",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-nordost-frey-2",
    "spec_key": "velocity_propagation",
    "spec_value_en": "96% Speed of Light",
    "spec_value_zh": "96% 光速傳播速度",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-audioquest-dragon-tail",
    "spec_key": "cable_type",
    "spec_value_en": "Balanced XLR Interconnect (Pair)",
    "spec_value_zh": "平衡 XLR 訊號線 (對裝)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-audioquest-dragon-tail",
    "spec_key": "conductor_material",
    "spec_value_en": "Solid Perfect-Surface Silver (PSS)",
    "spec_value_zh": "實心 PSS 純銀導體",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-audioquest-dragon-tail",
    "spec_key": "dissipation_system",
    "spec_value_en": "Carbon-Based 72V Dielectric-Bias System (DBS)",
    "spec_value_zh": "碳基 72V 介電偏壓系統 (DBS)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-audioquest-dragon-tail",
    "spec_key": "noise_dissipation",
    "spec_value_en": "Level 6 Zero-Tech Noise Dissipation",
    "spec_value_zh": "Level 6 Zero-Tech 雜訊消散技術",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-shunyata-venom-hc",
    "spec_key": "cable_type",
    "spec_value_en": "High-Current AC Power Cable",
    "spec_value_zh": "大電流交流電源線",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-shunyata-venom-hc",
    "spec_key": "conductor_material",
    "spec_value_en": "10 AWG Oxygen-Free Electrolytic (OFE) Copper",
    "spec_value_zh": "10 AWG OFE 無氧無電鍍高純銅",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-shunyata-venom-hc",
    "spec_key": "connectors",
    "spec_value_en": "CopperCONN Pure Copper Terminals",
    "spec_value_zh": "CopperCONN 純銅鍍金接頭",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-shunyata-venom-hc",
    "spec_key": "current_capacity",
    "spec_value_en": "20 Amps Continuous",
    "spec_value_zh": "20 安培連續電流承載能力",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-inakustik-referenz-usb",
    "spec_key": "cable_type",
    "spec_value_en": "USB 2.0 Digital Audio Cable",
    "spec_value_zh": "USB 2.0 數碼音訊線",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-inakustik-referenz-usb",
    "spec_key": "conductor_material",
    "spec_value_en": "Silver-Plated High-Purity OFC Conductor",
    "spec_value_zh": "鍍銀高純度 OFC 導線",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-inakustik-referenz-usb",
    "spec_key": "shielding",
    "spec_value_en": "Quadruple High-Density Shielding (4x)",
    "spec_value_zh": "四重高密度金屬屏蔽 (4x)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-inakustik-referenz-usb",
    "spec_key": "connectors",
    "spec_value_en": "24k Gold-Plated Precision Metal Plugs",
    "spec_value_zh": "24k 鍍金精密金屬接頭",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-audioquest-niagara-5000",
    "spec_key": "outlets",
    "spec_value_en": "12 AC Outlets (4 High-Current, 8 Ultra-Linear Filtered)",
    "spec_value_zh": "12 組 AC 插座 (4組大電流, 8組超線性濾波)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-audioquest-niagara-5000",
    "spec_key": "peak_current_reservoir",
    "spec_value_en": "90 Amps Transient Peak Power Correction",
    "spec_value_zh": "90 安培瞬態峰值電流校正蓄能",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-audioquest-niagara-5000",
    "spec_key": "surge_protection",
    "spec_value_en": "Non-Sacrificial Surge Protection up to 6000V/3000A",
    "spec_value_zh": "非犧牲型突波浪湧保護 (高達 6000V/3000A)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-isotek-v5-aquarius",
    "spec_key": "outlets",
    "spec_value_en": "6 Independent Outlets (2 High-Current, 4 Medium-Current)",
    "spec_value_zh": "6 組獨立插座 (2組大電流, 4組中電流)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-isotek-v5-aquarius",
    "spec_key": "noise_reduction",
    "spec_value_en": "60dB RFI Noise Reduction",
    "spec_value_zh": "60dB 射頻雜訊降噪衰減",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-isotek-v5-aquarius",
    "spec_key": "total_power_w",
    "spec_value_en": "3680W High-Current Total Power Handling",
    "spec_value_zh": "3680瓦 大電流總承載功率",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-psaudio-directstream-p12",
    "spec_key": "continuous_output_power_va",
    "spec_value_en": "1250 VA Continuous Power",
    "spec_value_zh": "1250 VA 連續輸出功率",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-psaudio-directstream-p12",
    "spec_key": "output_impedance_ohms",
    "spec_value_en": "< 0.008 ohms Output Impedance",
    "spec_value_zh": "< 0.008 歐姆超低輸出阻抗",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-psaudio-directstream-p12",
    "spec_key": "outlets",
    "spec_value_en": "8 Outlets across 4 Isolated Regenerated Zones",
    "spec_value_zh": "8 組插座分佈於 4 個獨立再生分區",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-psaudio-directstream-p12",
    "spec_key": "display",
    "spec_value_en": "Color Touchscreen with Real-Time THD Monitoring",
    "spec_value_zh": "彩色觸控屏即時顯示波形與 THD 失真度",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-plixir-elite-bdc",
    "spec_key": "output_voltage",
    "spec_value_en": "12V DC (4.0 Amps continuous)",
    "spec_value_zh": "12V 直流 (4.0 安培連續電流)",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-plixir-elite-bdc",
    "spec_key": "transformer_type",
    "spec_value_en": "Dual-Stage Balanced Toroidal Transformer",
    "spec_value_zh": "雙級平衡環形降壓變壓器",
    "is_filter_facet": true
  },
  {
    "product_id": "prod-plixir-elite-bdc",
    "spec_key": "casing",
    "spec_value_en": "Heavy-Duty CNC Aluminum Shielded Chassis",
    "spec_value_zh": "重型 CNC 鋁合金抗干擾外殼",
    "is_filter_facet": true
  }
];

function calculateMatchScore(p: MockProductRow, queryText: string): number {
  if (!queryText) return 0;
  const q = queryText.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);

  let score = 0;
  for (const term of terms) {
    let termMatched = false;
    // Model match (highest weight)
    if (p.model.toLowerCase().includes(term)) {
      score += 15;
      termMatched = true;
    }
    // Brand match
    if (p.brand.toLowerCase().includes(term)) {
      score += 10;
      termMatched = true;
    }
    // Title / Name match
    if (p.name_en.toLowerCase().includes(term) || p.name_zh.toLowerCase().includes(term)) {
      score += 12;
      termMatched = true;
    }
    // Category match
    if (
      p.category_name_en.toLowerCase().includes(term) ||
      p.category_name_zh.toLowerCase().includes(term) ||
      p.category_id.toLowerCase().includes(term) ||
      (p.category_description_en && p.category_description_en.toLowerCase().includes(term)) ||
      (p.category_description_zh && p.category_description_zh.toLowerCase().includes(term))
    ) {
      score += 8;
      termMatched = true;
    }
    // Acoustic signature match
    if (
      p.acoustic_signature_en.toLowerCase().includes(term) ||
      p.acoustic_signature_zh.toLowerCase().includes(term)
    ) {
      score += 7;
      termMatched = true;
    }
    // Description match
    if (
      p.description_en.toLowerCase().includes(term) ||
      p.description_zh.toLowerCase().includes(term)
    ) {
      score += 5;
      termMatched = true;
    }

    // Direct product_id match
    if (p.product_id.toLowerCase().includes(term)) {
      score += 6;
      termMatched = true;
    }
  }

  return score;
}

export async function mockExecuteSpannerSql(query: any): Promise<any[] | null> {
  const sqlString = typeof query === "string" ? query : query.sql;
  const params = typeof query === "object" && query.params ? query.params : {};

  if (sqlString.includes("FROM Categories")) {
    return MOCK_DB_CATEGORIES;
  }

  if (sqlString.includes("COUNT(*) AS count FROM Products")) {
    let list = MOCK_DB_PRODUCTS.filter(p => p.is_active);

    const q = (params.query_text || params.query || "").trim();
    if (q && sqlString.includes("SEARCH(search_tokens")) {
      list = list.filter(p => calculateMatchScore(p, q) > 0);
    }

    if (params.category_id || params.category) {
      const cat = (params.category_id || params.category).toLowerCase();
      list = list.filter(p => p.category_id.toLowerCase() === cat);
    }
    if (params.brand) {
      const bStr = params.brand.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.brand_pattern) {
      const bStr = params.brand_pattern.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.brands) {
      list = list.filter(p => params.brands.some((b: string) => p.brand.toLowerCase().includes(b.toLowerCase())));
    }
    if (params.min_price !== undefined) {
      list = list.filter(p => p.price_hkd >= params.min_price);
    }
    if (params.max_price !== undefined) {
      list = list.filter(p => p.price_hkd <= params.max_price);
    }
    return [{ count: list.length }];
  }

  // Pure FTS Search query (SELECT ... SCORE(...) AS score ... FROM Products@{FORCE_INDEX=idx_products_search} ...)
  if (
    sqlString.includes("SCORE(search_tokens") &&
    sqlString.includes("idx_products_search") &&
    !sqlString.includes("bm25_results") &&
    !sqlString.includes("SELECT product_id FROM Products")
  ) {
    const q = (params.query_text || params.query || "").trim();
    let list = MOCK_DB_PRODUCTS.filter(p => p.is_active);

    if (params.category_id || params.category) {
      const cat = (params.category_id || params.category).toLowerCase();
      list = list.filter(p => p.category_id.toLowerCase() === cat);
    }
    if (params.brand_pattern) {
      const bStr = params.brand_pattern.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.brand) {
      const bStr = params.brand.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.min_price !== undefined) {
      list = list.filter(p => p.price_hkd >= params.min_price);
    }
    if (params.max_price !== undefined) {
      list = list.filter(p => p.price_hkd <= params.max_price);
    }

    const scored = list
      .map(p => ({
        ...p,
        score: calculateMatchScore(p, q)
      }))
      .filter(item => item.score > 0);

    scored.sort((a, b) => b.score - a.score);

    // Check limit / offset
    const limitMatch = sqlString.match(/LIMIT\s+(\d+)/i);
    const offsetMatch = sqlString.match(/OFFSET\s+(\d+)/i);
    const limit = limitMatch ? parseInt(limitMatch[1], 10) : 50;
    const offset = offsetMatch ? parseInt(offsetMatch[1], 10) : 0;

    return scored.slice(offset, offset + limit);
  }

  // Hybrid Unified Query (WITH bm25_results AS ...)
  if (sqlString.includes("bm25_results") || sqlString.includes("candidate_ranks")) {
    const q = (params.query_text || params.query || "").trim();
    let baseList = MOCK_DB_PRODUCTS.filter(p => p.is_active);

    if (params.category_id || params.category) {
      const cat = (params.category_id || params.category).toLowerCase();
      baseList = baseList.filter(p => p.category_id.toLowerCase() === cat);
    }
    if (params.brand_pattern) {
      const bStr = params.brand_pattern.replace(/%/g, "").toLowerCase();
      baseList = baseList.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.brand) {
      const bStr = params.brand.replace(/%/g, "").toLowerCase();
      baseList = baseList.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.min_price !== undefined) {
      baseList = baseList.filter(p => p.price_hkd >= params.min_price);
    }
    if (params.max_price !== undefined) {
      baseList = baseList.filter(p => p.price_hkd <= params.max_price);
    }

    const bm25Matches = baseList
      .map(p => ({ p, score: calculateMatchScore(p, q) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const bm25Ranks = new Map<string, number>();
    bm25Matches.forEach((item, idx) => bm25Ranks.set(item.p.product_id, idx + 1));

    const vectorMatches = baseList;
    const vectorRanks = new Map<string, number>();
    vectorMatches.forEach((p, idx) => vectorRanks.set(p.product_id, idx + 1));

    const candidateIds = Array.from(new Set([...bm25Ranks.keys(), ...vectorRanks.keys()]));
    const results = [];
    for (const pid of candidateIds) {
      const p = MOCK_DB_PRODUCTS.find(item => item.product_id === pid);
      if (!p) continue;
      const bRank = bm25Ranks.get(pid) || null;
      const vRank = vectorRanks.get(pid) || null;
      const bTerm = bRank ? 0.4 / (60 + bRank) : 0;
      const vTerm = vRank ? 0.6 / (60 + vRank) : 0;
      const rrfScore = bTerm + vTerm;
      results.push({
        ...p,
        price_hkd: p.price_hkd,
        rrf_score: rrfScore,
        bm25_rank: bRank,
        vector_rank: vRank
      });
    }
    results.sort((a, b) => b.rrf_score - a.rrf_score);
    return results;
  }

  // BM25 Ranking query in Hybrid search (SELECT product_id FROM Products@{FORCE_INDEX=idx_products_search} ...)
  if (sqlString.includes("FORCE_INDEX=idx_products_search") && sqlString.includes("SELECT product_id FROM Products")) {
    const q = (params.query_text || params.query || "").trim();
    let list = MOCK_DB_PRODUCTS.filter(p => p.is_active);
    if (params.category_id || params.category) {
      const cat = (params.category_id || params.category).toLowerCase();
      list = list.filter(p => p.category_id.toLowerCase() === cat);
    }
    if (params.brand_pattern) {
      const bStr = params.brand_pattern.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.brand) {
      const bStr = params.brand.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.min_price !== undefined) {
      list = list.filter(p => p.price_hkd >= params.min_price);
    }
    if (params.max_price !== undefined) {
      list = list.filter(p => p.price_hkd <= params.max_price);
    }

    const matches = list
      .map(p => ({ p, score: calculateMatchScore(p, q) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return matches.slice(0, 50).map(item => ({ product_id: item.p.product_id }));
  }

  if (sqlString.includes("SEARCH(Products, @query)") || sqlString.includes("SEARCH(search_tokens")) {
    const q = (params.query_text || params.query || "").trim();
    const matches = MOCK_DB_PRODUCTS.filter(p => calculateMatchScore(p, q) > 0);
    return matches.map(p => ({ product_id: p.product_id }));
  }

  if (sqlString.includes("FROM ProductEmbeddings")) {
    let list = MOCK_DB_PRODUCTS.filter(p => p.is_active);
    if (params.category_id || params.category) {
      const cat = (params.category_id || params.category).toLowerCase();
      list = list.filter(p => p.category_id.toLowerCase() === cat);
    }
    if (params.brand_pattern) {
      const bStr = params.brand_pattern.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.brand) {
      const bStr = params.brand.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.min_price !== undefined) {
      list = list.filter(p => p.price_hkd >= params.min_price);
    }
    if (params.max_price !== undefined) {
      list = list.filter(p => p.price_hkd <= params.max_price);
    }
    return list.slice(0, 50).map((p, idx) => ({ product_id: p.product_id, distance: 0.1 * (idx + 1) }));
  }

  if (sqlString.includes("FROM ProductSpecifications")) {
    if (params.product_id) {
      return MOCK_DB_SPECS.filter(s => s.product_id === params.product_id);
    }
    if (params.product_ids) {
      return MOCK_DB_SPECS.filter(s => params.product_ids.includes(s.product_id));
    }
    return MOCK_DB_SPECS;
  }

  if (sqlString.includes("FROM Products")) {
    let list = MOCK_DB_PRODUCTS.filter(p => p.is_active);
    if (params.product_id) {
      list = list.filter(p => p.product_id === params.product_id);
    }
    if (params.product_ids) {
      list = list.filter(p => params.product_ids.includes(p.product_id));
    }
    if (params.category_id || params.category) {
      const cat = (params.category_id || params.category).toLowerCase();
      list = list.filter(p => p.category_id.toLowerCase() === cat);
    }
    if (params.brand) {
      const bStr = params.brand.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.brand_pattern) {
      const bStr = params.brand_pattern.replace(/%/g, "").toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bStr));
    }
    if (params.brands) {
      list = list.filter(p => params.brands.some((b: string) => p.brand.toLowerCase().includes(b.toLowerCase())));
    }
    if (params.min_price !== undefined) {
      list = list.filter(p => p.price_hkd >= params.min_price);
    }
    if (params.max_price !== undefined) {
      list = list.filter(p => p.price_hkd <= params.max_price);
    }
    return list;
  }

  return [];
}
