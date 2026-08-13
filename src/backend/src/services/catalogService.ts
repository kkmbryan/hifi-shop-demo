import { executeSpannerSql } from '../config/spanner';

export interface Category {
  category_id: string;
  name_en: string;
  name_zh: string;
  name?: string;
  slug: string;
  description_en: string;
  description_zh: string;
  description?: string;
  display_order: number;
}

export interface ProductSpecification {
  product_id: string;
  spec_key: string;
  spec_value_en: string;
  spec_value_zh: string;
  spec_value?: string;
  is_filter_facet: boolean;
}

export interface Product {
  product_id: string;
  category_id: string;
  brand: string;
  model: string;
  name_en: string;
  name_zh: string;
  name?: string;
  price_hkd: number;
  description_en: string;
  description_zh: string;
  description?: string;
  acoustic_signature_en: string;
  acoustic_signature_zh: string;
  acoustic_signature?: string;
  image_url: string;
  is_active: boolean;
  specifications?: ProductSpecification[];
  rrf_score?: number;
  bm25_rank?: number;
  vector_rank?: number;
}

export interface ProductQueryOptions {
  category_id?: string;
  brand?: string | string[];
  min_price?: number;
  max_price?: number;
  output_ports?: string | string[];
  spec_key?: string;
  spec_value?: string;
  lang?: string;
  limit?: number;
  offset?: number;
}

// In-Memory Seed Fallback Data (Matching sql/03_seed_data.sql)
export const FALLBACK_CATEGORIES: Category[] = [
  {
    category_id: 'dacs',
    name_en: 'DACs (Digital-to-Analog Converters)',
    name_zh: '解碼器 (DACs)',
    slug: 'dacs',
    description_en: 'High-resolution Digital-to-Analog Converters converting PCM and DSD streams into pure analog sound.',
    description_zh: '高解析度數碼至模擬解碼器，將 PCM 與 DSD 數位訊號完美轉換為純淨類比音訊。',
    display_order: 1
  },
  {
    category_id: 'amplifiers',
    name_en: 'Amplifiers',
    name_zh: '擴音機 (Amplifiers)',
    slug: 'amplifiers',
    description_en: 'Integrated, pre-amplifiers, power amplifiers, and vacuum tube amplifiers delivering pristine audio power.',
    description_zh: '合併式、前級、後級及真空管擴音機，提供純正無瑕的音訊擴大驅動力。',
    display_order: 2
  },
  {
    category_id: 'streamers',
    name_en: 'Network Streamers',
    name_zh: '網絡播放器 (Streamers)',
    slug: 'streamers',
    description_en: 'High-fidelity digital transports and network music streamers with ultra-low jitter.',
    description_zh: '高保真網絡音樂播放器與數位轉盤，具備極低時基誤差與高清串流能力。',
    display_order: 3
  },
  {
    category_id: 'turntables',
    name_en: 'Turntables',
    name_zh: '黑膠唱機 (Turntables)',
    slug: 'turntables',
    description_en: 'Precision analog vinyl disc record players, tonearms, and moving magnet/moving coil cartridges.',
    description_zh: '精密類比黑膠唱片機、唱臂及動磁/動圈唱頭，還原最真實的黑膠韻味。',
    display_order: 4
  },
  {
    category_id: 'head-fi',
    name_en: 'Headphones / Head-Fi',
    name_zh: '耳機 / 入耳式耳機 (Head-Fi)',
    slug: 'head-fi',
    description_en: 'Flagship open-back dynamic, planar magnetic, electrostatic headphones, and custom IEMs.',
    description_zh: '旗艦級開放式動圈、平板振膜、靜電耳機及專業入耳式監聽耳機。',
    display_order: 5
  },
  {
    category_id: 'loudspeakers',
    name_en: 'Loudspeakers',
    name_zh: '音箱 / 喇叭 (Loudspeakers)',
    slug: 'loudspeakers',
    description_en: 'High-end stereo floorstanding, bookshelf, and active studio monitor loudspeakers.',
    description_zh: '高級立體聲落地式音箱、書架式喇叭及主動式專業監聽音箱。',
    display_order: 6
  },
  {
    category_id: 'cables',
    name_en: 'Audio Cables',
    name_zh: '線材 (Cables)',
    slug: 'cables',
    description_en: 'Audiophile-grade speaker cables, balanced XLR/RCA interconnects, USB data cables, and power cords.',
    description_zh: '發燒級喇叭線、平衡 XLR/RCA 訊號線、高傳真 USB 數據線及大電流電源線。',
    display_order: 7
  },
  {
    category_id: 'power-conditioning',
    name_en: 'Power Conditioning',
    name_zh: '電源處理 (Power Conditioning)',
    slug: 'power-conditioning',
    description_en: 'Ultra-low noise AC power noise dissipation systems, power regenerators, and linear DC supplies.',
    description_zh: '超低雜訊交流電源淨化器、正弦波電源重組再生器及平衡直流線性電源。',
    display_order: 8
  }
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    product_id: 'prod-chord-hugo-tt2',
    category_id: 'dacs',
    brand: 'Chord Electronics',
    model: 'Hugo TT 2',
    name_en: 'Chord Hugo TT 2 Desktop DAC / Headphone Amplifier',
    name_zh: 'Chord Hugo TT 2 桌面級解碼器 / 耳機擴音機',
    price_hkd: 39800.00,
    description_en: 'The Hugo TT 2 is a ground-breaking desktop DAC and headphone amplifier equipped with custom FPGA filtering and 98,304-tap WTA filter algorithm delivering unmatched acoustic depth.',
    description_zh: 'Hugo TT 2 是一款突破性的桌面級解碼耳擴一體機，配備客製化 FPGA 濾波器及 98,304 Tap WTA 演算法，提供無可比擬的聲學深度與動態展現。',
    acoustic_signature_en: 'Crystal-clear soundstage, ultra-fast transient response, articulate micro-detail rendering, and explosive dynamic headroom.',
    acoustic_signature_zh: '音場極度廣闊清晰，瞬態響應速度極快，微細節豐富，動態起伏澎湃有力。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/chord-hugo-tt2.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-chord-hugo-tt2', spec_key: 'dac_chip', spec_value_en: 'Custom Xilinx Artix-7 FPGA (98,304 Taps)', spec_value_zh: '客製化 Xilinx Artix-7 FPGA (98,304 Taps)', is_filter_facet: true },
      { product_id: 'prod-chord-hugo-tt2', spec_key: 'input_interface', spec_value_en: 'Dual BNC, Optical x2, USB Type-B', spec_value_zh: '雙 BNC, 光纖 x2, USB Type-B', is_filter_facet: true },
      { product_id: 'prod-chord-hugo-tt2', spec_key: 'output_interface', spec_value_en: 'XLR Balanced, RCA, 6.35mm x2, 3.5mm x2', spec_value_zh: 'XLR 平衡, RCA, 6.35mm x2, 3.5mm x2', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-denafrips-venus-ii',
    category_id: 'dacs',
    brand: 'Denafrips',
    model: 'Venus II 12th',
    name_en: 'Denafrips Venus II 12th Anniversary R-2R Ladder DAC',
    name_zh: 'Denafrips Venus II 12週年紀念版 R-2R 電阻陣列解碼器',
    price_hkd: 24800.00,
    description_en: 'True balanced discrete R-2R architecture featuring high-precision resistor networks and TCXO ultra-low phase noise clocks.',
    description_zh: '採用真平衡分立式 R-2R 架構，配備高精度金屬膜電阻網絡與 TCXO 超低相位雜訊晶振。',
    acoustic_signature_en: 'Warm analog-like musicality, lush natural vocals, rich body, smooth liquid treble without digital glare.',
    acoustic_signature_zh: '具備濃郁黑膠般溫暖人聲，聲音厚實自然，高頻順滑流暢，完全沒有數位味。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/denafrips-venus-ii.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-denafrips-venus-ii', spec_key: 'dac_chip', spec_value_en: 'True 24-Bit R-2R + 6-Bit DSD Architecture', spec_value_zh: '真 24-Bit R-2R + 6-Bit DSD 架構', is_filter_facet: true },
      { product_id: 'prod-denafrips-venus-ii', spec_key: 'input_interface', spec_value_en: 'I2S HDMI, AES/EBU, Coaxial, Optical, USB', spec_value_zh: 'I2S HDMI, AES/EBU, 同軸, 光纖, USB', is_filter_facet: true },
      { product_id: 'prod-denafrips-venus-ii', spec_key: 'output_interface', spec_value_en: 'XLR Balanced, RCA Single-Ended', spec_value_zh: 'XLR 平衡, RCA 單端', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-topping-d90-iii',
    category_id: 'dacs',
    brand: 'Topping',
    model: 'D90 III SABRE',
    name_en: 'Topping D90 III SABRE Fully Balanced Flagship DAC',
    name_zh: 'Topping D90 III SABRE 旗艦全平衡解碼器',
    price_hkd: 7980.00,
    description_en: 'Flagship dual ESS ES9039SPRO DAC implementation with ultra-low jitter CPLD clock processing and Bluetooth 5.1 LDAC support.',
    description_zh: '搭載雙 ESS ES9039SPRO 旗艦晶片，配合 CPLD 超低時基誤差時鐘處理及藍芽 5.1 LDAC 無損傳輸。',
    acoustic_signature_en: 'Extremely analytical, ultra-low background noise floor, precise instrument separation, and neutral uncolored presentation.',
    acoustic_signature_zh: '極具分析力，底噪極低，樂器定位精確，聲音中性無渲染。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/topping-d90-iii.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-topping-d90-iii', spec_key: 'input_interface', spec_value_en: 'IIS, AES, Coaxial, Optical, USB, Bluetooth', spec_value_zh: 'IIS, AES, 同軸, 光纖, USB, 藍芽', is_filter_facet: true },
      { product_id: 'prod-topping-d90-iii', spec_key: 'output_interface', spec_value_en: 'XLR Balanced, RCA Single-Ended', spec_value_zh: 'XLR 平衡, RCA 單端', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-ifi-neo-idosd-2',
    category_id: 'dacs',
    brand: 'iFi Audio',
    model: 'NEO iDSD 2',
    name_en: 'iFi Audio NEO iDSD 2 Lossless Bluetooth & Headphone DAC/Amp',
    name_zh: 'iFi Audio NEO iDSD 2 無損藍芽解碼耳擴一體機',
    price_hkd: 6480.00,
    description_en: 'Versatile desktop DAC and headphone amplifier featuring aptX Lossless Bluetooth, ultra-low jitter GMT clock, and 5,551mW drive power.',
    description_zh: '全能型桌面解碼耳擴一體機，支援 aptX Lossless 無損藍芽，配備 GMT 超低時基誤差時鐘及 5,551mW 強勁輸出。',
    acoustic_signature_en: 'Energetic sound profile, warm-tilted mid-bass response, engaging vocals, and versatile headphone drive power.',
    acoustic_signature_zh: '聲音充滿活力，中低頻包圍感強，人聲感染力高，耳機推力強勁。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/ifi-neo-idsd-2.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-ifi-neo-idosd-2', spec_key: 'output_power_mw', spec_value_en: '5551mW @ 32 ohms', spec_value_zh: '5551毫瓦 @ 32 歐姆', is_filter_facet: true },
      { product_id: 'prod-ifi-neo-idosd-2', spec_key: 'output_interface', spec_value_en: '4.4mm Balanced, 6.35mm, XLR, RCA', spec_value_zh: '4.4mm 平衡, 6.35mm, XLR, RCA', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-mcintosh-ma8950',
    category_id: 'amplifiers',
    brand: 'McIntosh',
    model: 'MA8950',
    name_en: 'McIntosh MA8950 Integrated Amplifier (200W/Ch)',
    name_zh: 'McIntosh MA8950 合併式擴音機 (每聲道200瓦)',
    price_hkd: 78000.00,
    description_en: '200 Watts per channel high-end stereo integrated amplifier featuring McIntosh Autoformer technology, DA2 digital audio module, and iconic blue meters.',
    description_zh: '每聲道 200 瓦高級立體聲合併式擴音機，配備麥景圖專利 Autoformer 輸出變壓器、DA2 數碼模組及經典藍眼睛錶板。',
    acoustic_signature_en: 'Authoritative dynamic impact, warm velvet midrange, expansive bass control, and legendary McIntosh musical presence.',
    acoustic_signature_zh: '音色雄渾大氣，中頻如絲絨般溫暖，低頻控制力極佳，展現麥景圖經典音樂味。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/mcintosh-ma8950.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-mcintosh-ma8950', spec_key: 'output_power_w', spec_value_en: '200 Watts/Ch into 2/4/8 ohms', spec_value_zh: '每聲道 200 瓦 (2/4/8 歐姆)', is_filter_facet: true },
      { product_id: 'prod-mcintosh-ma8950', spec_key: 'amp_class', spec_value_en: 'Class AB Solid State with Autoformer', spec_value_zh: 'Class AB 晶體管配 Autoformer 變壓器', is_filter_facet: true },
      { product_id: 'prod-mcintosh-ma8950', spec_key: 'input_interface', spec_value_en: 'XLR Balanced x1, RCA x6, MM/MC Phono', spec_value_zh: 'XLR 平衡 x1, RCA x6, MM/MC 黑膠唱頭', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-accuphase-e380',
    category_id: 'amplifiers',
    brand: 'Accuphase',
    model: 'E-380',
    name_en: 'Accuphase E-380 Stereo Integrated Amplifier',
    name_zh: 'Accuphase E-380 立體聲合併式擴音機',
    price_hkd: 42000.00,
    description_en: 'Japanese high-end integrated amplifier with AAVA volume control, Instrumentation Amplifier configuration, and MOS-FET switches.',
    description_zh: '日本頂級合併式擴音機，配備 AAVA 革命性音量控制系統、儀錶級放大電路及 MOS-FET 靜音開關。',
    acoustic_signature_en: 'Delicate, silky high frequencies, refined acoustic texturing, highly stable damping, and sweet articulate vocals.',
    acoustic_signature_zh: '高頻細緻如絲，樂器質感極佳，阻尼係數高且控制力好，人聲甜美耐聽。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/accuphase-e380.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-accuphase-e380', spec_key: 'output_power_w', spec_value_en: '120W into 8 ohms, 180W into 4 ohms', spec_value_zh: '每聲道 120瓦 (8歐姆) / 180瓦 (4歐姆)', is_filter_facet: true },
      { product_id: 'prod-accuphase-e380', spec_key: 'amp_class', spec_value_en: 'Class AB with AAVA Volume Control', spec_value_zh: 'Class AB 配合 AAVA 音量控制', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-feliks-envy',
    category_id: 'amplifiers',
    brand: 'Feliks Audio',
    model: 'Envy',
    name_en: 'Feliks Audio Envy Flagship 300B Tube Headphone Amplifier',
    name_zh: 'Feliks Audio Envy 旗艦 300B 真空管耳機擴音機',
    price_hkd: 58000.00,
    description_en: 'Class A Single-Ended Triode (SET) flagship headphone amplifier driven by legendary 300B tubes delivering organic analog warmth.',
    description_zh: 'Class A 單端三極管 (SET) 旗艦耳機擴音機，由傳奇 300B 真空管驅動，呈現無比有機的類比溫暖感。',
    acoustic_signature_en: 'Lush 300B tube midrange warmth, wide holographic 3D soundstage, sweet natural harmonics, and liquid musical flow.',
    acoustic_signature_zh: '濃郁 300B 真空管中頻溫暖感，廣闊立體 3D 音場，諧音甜美自然，音樂感極致順滑。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/feliks-envy.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-feliks-envy', spec_key: 'tube_complement', spec_value_en: '300B Power Tubes x2, CV181 (6SN7) Driver Tubes x2', spec_value_zh: '300B 功率管 x2, CV181 (6SN7) 驅動管 x2', is_filter_facet: true },
      { product_id: 'prod-feliks-envy', spec_key: 'amp_class', spec_value_en: 'Class A Single-Ended Triode (SET)', spec_value_zh: 'Class A 單端三極管 (SET)', is_filter_facet: true },
      { product_id: 'prod-feliks-envy', spec_key: 'output_power_w', spec_value_en: '8 Watts per channel', spec_value_zh: '每聲道 8 瓦', is_filter_facet: true },
      { product_id: 'prod-feliks-envy', spec_key: 'impedance_range_ohms', spec_value_en: '16 to 600 ohms', spec_value_zh: '16 至 600 歐姆', is_filter_facet: true },
      { product_id: 'prod-feliks-envy', spec_key: 'output_interface', spec_value_en: '4.4mm Balanced, 4-pin XLR, 6.35mm', spec_value_zh: '4.4mm 平衡, 4-pin XLR, 6.35mm', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-rega-elex-mk4',
    category_id: 'amplifiers',
    brand: 'Rega',
    model: 'Elex MK4',
    name_en: 'Rega Elex MK4 Integrated Stereo Amplifier',
    name_zh: 'Rega Elex MK4 立體聲合併式擴音機',
    price_hkd: 12800.00,
    description_en: 'High-performance integrated amplifier featuring Rega high-spec DAC circuit, MM phono stage, and Class A driver stage.',
    description_zh: '高性能合併式擴音機，配備 Rega 高規格解碼電路、MM 黑膠唱頭放大器及 Class A 驅動級。',
    acoustic_signature_en: 'Rhythmic pace, energetic musical timing, clean dynamic attack, and warm natural vocal presentation.',
    acoustic_signature_zh: '節奏感強烈，音樂時序動態極佳，衝擊力強，人聲表現溫暖自然。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/rega-elex-mk4.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-rega-elex-mk4', spec_key: 'output_power_w', spec_value_en: '72W/Ch into 8 ohms, 90W/Ch into 6 ohms', spec_value_zh: '每聲道 72瓦 (8歐姆) / 90瓦 (6歐姆)', is_filter_facet: true },
      { product_id: 'prod-rega-elex-mk4', spec_key: 'input_interface', spec_value_en: 'MM Phono, RCA Line x4, Optical, Coaxial', spec_value_zh: 'MM 黑膠唱頭, RCA Line x4, 光纖, 同軸', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-aurender-n200',
    category_id: 'streamers',
    brand: 'Aurender',
    model: 'N200',
    name_en: 'Aurender N200 High-Resolution Network Streamer',
    name_zh: 'Aurender N200 高解析度網絡數位播放器',
    price_hkd: 46800.00,
    description_en: 'Reference digital transport music server featuring dual NVMe SSD caching, supercapacitor-based UPS, and dedicated Audio Class 2.0 USB output.',
    description_zh: '參考級數碼轉盤音樂伺服器，配備雙 NVMe SSD 快取、超級電容 UPS 及獨立 Audio Class 2.0 USB 輸出。',
    acoustic_signature_en: 'Ultra-low digital jitter, pitch-black background, liquid micro-details, absolute spatial stability.',
    acoustic_signature_zh: '數位時基誤差極低，背景深邃漆黑，微細節豐富順滑，聲場定位極其穩定。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/aurender-n200.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-aurender-n200', spec_key: 'output_interface', spec_value_en: 'Audio Class 2.0 USB, Ultra-Low Jitter Coaxial BNC', spec_value_zh: '獨立 Audio Class 2.0 USB, 超低時基誤差 BNC 同軸', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-lumin-t3',
    category_id: 'streamers',
    brand: 'Lumin',
    model: 'T3',
    name_en: 'Lumin T3 Digital Music Streamer / DAC',
    name_zh: 'Lumin T3 網絡數碼播放器 / 解碼器',
    price_hkd: 38800.00,
    description_en: 'All-new processing chassis featuring dual ESS SABRE ES9028PRO DACs, Leedh Processing lossless digital volume control, and native DSD512.',
    description_zh: '全新升級運算底盤，採用雙 ESS SABRE ES9028PRO 解碼晶片、Leedh Processing 無損數碼音量控制及原創 DSD512 支援。',
    acoustic_signature_en: 'Smooth analog warmth, pristine digital clarity, effortlessly dynamic, natural vocal timbre.',
    acoustic_signature_zh: '具備順滑的類比溫暖感，數碼清晰度極高，動態自然順暢，人聲音色自然。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/lumin-t3.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-lumin-t3', spec_key: 'output_interface', spec_value_en: 'XLR Balanced, RCA, BNC SPDIF, USB', spec_value_zh: 'XLR 平衡, RCA, BNC SPDIF, USB', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-eversolo-dmp-a8',
    category_id: 'streamers',
    brand: 'Eversolo',
    model: 'DMP-A8',
    name_en: 'Eversolo DMP-A8 Flagship Streamer / Preamp / DAC',
    name_zh: 'Eversolo DMP-A8 旗艦串流播放前級解碼一體機',
    price_hkd: 15800.00,
    description_en: 'Flagship streamer preamp featuring AK4499EX + AK4191EQ DAC combination, R2R analog volume control, and dual FEMTO clocks.',
    description_zh: '旗艦串流前級解碼器，採用 AK4499EX + AK4191EQ 旗艦解碼組合、R2R 類比音量控制及雙 FEMTO 時鐘。',
    acoustic_signature_en: 'Rich natural texture, spacious 3D imaging, detailed extension, and transparent preamp volume control.',
    acoustic_signature_zh: '質感豐富自然，3D 聲像空間感強，高頻延伸細緻，前級音量控制透明度高。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/eversolo-dmp-a8.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-eversolo-dmp-a8', spec_key: 'input_interface', spec_value_en: 'I2S HDMI, IIS, Coaxial, Optical, USB', spec_value_zh: 'I2S HDMI, IIS, 同軸, 光纖, USB', is_filter_facet: true },
      { product_id: 'prod-eversolo-dmp-a8', spec_key: 'output_interface', spec_value_en: 'XLR Balanced, RCA, IIS, Coaxial', spec_value_zh: 'XLR 平衡, RCA, IIS, 同軸', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-wiim-pro-plus',
    category_id: 'streamers',
    brand: 'WiiM',
    model: 'Pro Plus',
    name_en: 'WiiM Pro Plus High-Res Audio Streamer',
    name_zh: 'WiiM Pro Plus 高解析度數碼音訊串流器',
    price_hkd: 1880.00,
    description_en: 'Compact high-resolution streamer equipped with AKM AK4493SEQ DAC chip, AirPlay 2, Spotify Connect, TIDAL Connect, and Roon Ready.',
    description_zh: '輕巧高解析度串流播放器，搭載 AKM AK4493SEQ 解碼晶片，支援 AirPlay 2、Spotify Connect、TIDAL Connect 及 Roon Ready。',
    acoustic_signature_en: 'Clean, transparent, musical, neutral balance, unbeatable price-to-performance ratio.',
    acoustic_signature_zh: '聲音乾淨透明，具備音樂感，平衡中性，性價比極高。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/wiim-pro-plus.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-wiim-pro-plus', spec_key: 'output_interface', spec_value_en: 'RCA, Optical, Coaxial', spec_value_zh: 'RCA, 光纖, 同軸', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-linn-sondek-lp12',
    category_id: 'turntables',
    brand: 'Linn',
    model: 'Sondek LP12',
    name_en: 'Linn Sondek LP12 Modular Reference Turntable',
    name_zh: 'Linn Sondek LP12 模組化參考級黑膠唱盤',
    price_hkd: 68000.00,
    description_en: 'Iconic precision modular turntable engineered for lifetime upgradeability with Karousel precision bearing and Radikal power supply.',
    description_zh: '經典精密模組化黑膠唱盤，採用 Karousel 精密軸承與 Radikal 電源，支援終身模組化升級。',
    acoustic_signature_en: 'Unmatched musical rhythm and timing, emotional vocal depth, organic analog realism.',
    acoustic_signature_zh: '音樂節奏與時序掌控無與倫比，人聲情感深刻，極致有機類比真實感。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/linn-sondek-lp12.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-linn-sondek-lp12', spec_key: 'drive_method', spec_value_en: 'Precision Belt Drive', spec_value_zh: '精密皮帶驅動', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-sennheiser-hd800s',
    category_id: 'head-fi',
    brand: 'Sennheiser',
    model: 'HD 800 S',
    name_en: 'Sennheiser HD 800 S Reference Open-Back Headphones',
    name_zh: 'Sennheiser HD 800 S 參考級開放式頭戴耳機',
    price_hkd: 13999.00,
    description_en: 'Reference open-back dynamic headphones handcrafted in Germany with 56mm Ring Radiator transducer and patented absorber technology.',
    description_zh: '德國手工打造參考級開放式動圈耳機，採用 56mm 環形振膜單元與專利吸收器技術。',
    acoustic_signature_en: 'Unrivaled concert-hall soundstage width, pinpoint orchestral instrument positioning, pristine micro-detail rendering, transparent neutral treble.',
    acoustic_signature_zh: '音樂廳級別廣闊音場，管弦樂器定位精確無瑕，微細節豐富，高頻清澈通透。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/sennheiser-hd800s.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-sennheiser-hd800s', spec_key: 'impedance_ohms', spec_value_en: '300 ohms', spec_value_zh: '300 歐姆', is_filter_facet: true },
      { product_id: 'prod-sennheiser-hd800s', spec_key: 'headphone_impedance_ohms', spec_value_en: '300 ohms', spec_value_zh: '300 歐姆', is_filter_facet: true },
      { product_id: 'prod-sennheiser-hd800s', spec_key: 'sensitivity_db', spec_value_en: '102 dB/mW', spec_value_zh: '102 dB/mW', is_filter_facet: true },
      { product_id: 'prod-sennheiser-hd800s', spec_key: 'connector', spec_value_en: '4.4mm Pentaconn, 6.35mm Stereo Plug', spec_value_zh: '4.4mm 平衡, 6.35mm 單端插頭', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-focal-utopia-2022',
    category_id: 'head-fi',
    brand: 'Focal',
    model: 'Utopia (2022)',
    name_en: 'Focal Utopia (2022 Edition) Flagship Beryllium Headphones',
    name_zh: 'Focal Utopia (2022版) 旗艦純鈹單元頭戴耳機',
    price_hkd: 39800.00,
    description_en: 'French luxury open-back flagship headphones equipped with 40mm Pure Beryllium M-shaped dome drivers and copper-aluminum voice coils.',
    description_zh: '法國奢華開放式旗艦耳機，採用 40mm 純鈹 M 形穹頂單元與銅鋁合金音圈。',
    acoustic_signature_en: 'Unmatched dynamic speed, visceral physical impact, luxurious vocal detail, pinpoint spatial imaging.',
    acoustic_signature_zh: '無可比擬的動態反應速度，衝擊力強，人聲細緻華麗，聲像定位極為精準。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/focal-utopia-2022.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-focal-utopia-2022', spec_key: 'impedance_ohms', spec_value_en: '80 ohms', spec_value_zh: '80 歐姆', is_filter_facet: true },
      { product_id: 'prod-focal-utopia-2022', spec_key: 'sensitivity_db', spec_value_en: '104 dB/mW', spec_value_zh: '104 dB/mW', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-vision-ears-ext',
    category_id: 'head-fi',
    brand: 'Vision Ears',
    model: 'EXT',
    name_en: 'Vision Ears EXT Universal Hybrid In-Ear Monitors',
    name_zh: 'Vision Ears EXT 圈鐵靜電混合入耳式耳機',
    price_hkd: 22800.00,
    description_en: 'German hand-crafted hybrid IEMs combining 2 dynamic drivers and 4 electrostatic drivers for breathtaking vocal warmth and high extension.',
    description_zh: '德國手工打造混合單元入耳式耳機，結合 2 動圈與 4 靜電單元，人聲溫暖潤澤且高頻延伸驚人。',
    acoustic_signature_en: 'Deep thunderous sub-bass impact, lush organic vocals, extended electrostatic shimmer without harshness.',
    acoustic_signature_zh: '低頻下潛深遂有力，人聲溫暖潤澤，靜電高頻延伸極佳且毫無刺耳感。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/vision-ears-ext.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-vision-ears-ext', spec_key: 'impedance_ohms', spec_value_en: '10 ohms', spec_value_zh: '10 歐姆', is_filter_facet: true },
      { product_id: 'prod-vision-ears-ext', spec_key: 'sensitivity_db', spec_value_en: '108.5 dB/mW', spec_value_zh: '108.5 dB/mW', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-campfire-andromeda-2020',
    category_id: 'head-fi',
    brand: 'Campfire Audio',
    model: 'Andromeda 2020',
    name_en: 'Campfire Audio Andromeda 2020 5-BA In-Ear Monitors',
    name_zh: 'Campfire Audio Andromeda 2020 五動鐵入耳式耳機',
    price_hkd: 8500.00,
    description_en: 'Iconic emerald green anodized aluminum IEM with 5 balanced armature drivers and Solid-Body acoustic chamber.',
    description_zh: '經典翠綠陽極氧化鋁耳機，配備 5 動鐵單元及實心一體化聲學腔體。',
    acoustic_signature_en: 'Holographic spatial expansion, sparkling treble detail, sweet forward mid-range, iconically musical tuning.',
    acoustic_signature_zh: '聲場空間感絕佳，高頻亮麗通透，中頻人聲甜美靠前，經典發燒調音。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/campfire-andromeda-2020.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-campfire-andromeda-2020', spec_key: 'impedance_ohms', spec_value_en: '12.8 ohms', spec_value_zh: '12.8 歐姆', is_filter_facet: true },
      { product_id: 'prod-campfire-andromeda-2020', spec_key: 'sensitivity_db', spec_value_en: '115 dB/mW', spec_value_zh: '115 dB/mW', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-bw-804-d4',
    category_id: 'loudspeakers',
    brand: 'Bowers & Wilkins',
    model: '804 D4',
    name_en: 'Bowers & Wilkins 804 D4 Diamond Tweeter Floorstanding Loudspeakers',
    name_zh: 'B&W 804 D4 鑽石高音落地式音箱',
    price_hkd: 118000.00,
    description_en: 'Floorstanding reference loudspeaker featuring Solid Body Tweeter-on-Top with Diamond dome, Continuum Cone FST midrange, and Aerofoil bass drivers.',
    description_zh: '旗艦落地式音箱，配備獨立實體鑽石高音單元、Continuum 錐盆 FST 中音及 Aerofoil 翼形低音單元。',
    acoustic_signature_en: 'Crystal-clean diamond high-frequency purity, solid tight bass extension, pinpoint orchestral imaging.',
    acoustic_signature_zh: '鑽石高音極致純淨，低頻結實下潛深，管弦樂團定位精確無瑕。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/bw-804-d4.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-bw-804-d4', spec_key: 'nominal_impedance_ohms', spec_value_en: '8 ohms', spec_value_zh: '8 歐姆', is_filter_facet: true },
      { product_id: 'prod-bw-804-d4', spec_key: 'sensitivity_db', spec_value_en: '89 dB', spec_value_zh: '89 dB', is_filter_facet: true }
    ]
  },
  {
    product_id: 'prod-kef-ls50-wireless-ii',
    category_id: 'loudspeakers',
    brand: 'KEF',
    model: 'LS50 Wireless II',
    name_en: 'KEF LS50 Wireless II Active All-in-One Stereo Loudspeakers',
    name_zh: 'KEF LS50 Wireless II 主動式無線數碼音箱',
    price_hkd: 21800.00,
    description_en: 'All-in-one active wireless loudspeaker system with 12th Gen Uni-Q driver array, Metamaterial Absorption Technology (MAT), and 760W total power.',
    description_zh: '主動式無線音箱系統，採用第12代 Uni-Q 同軸單元、MAT 超材料吸音技術及 760W 總功放驅動。',
    acoustic_signature_en: 'Seamless Uni-Q point-source imaging, MAT absorbing clarity, tight bass impact, versatile streaming capability.',
    acoustic_signature_zh: 'Uni-Q 同軸單元點聲源定位完美，MAT 技術吸音通透，低頻下潛彈跳，無線串流極致方便。',
    image_url: 'https://storage.googleapis.com/hifi-shop-demo-assets/products/kef-ls50-wireless-ii.jpg',
    is_active: true,
    specifications: [
      { product_id: 'prod-kef-ls50-wireless-ii', spec_key: 'output_power_w', spec_value_en: '760W Total System Power', spec_value_zh: '760W 系統總功率', is_filter_facet: true }
    ]
  }
];

function isChinese(lang?: string): boolean {
  if (!lang) return false;
  const l = lang.toLowerCase();
  return l.includes('zh') || l.includes('hk') || l.includes('cn');
}

export function localizeCategory(category: Category, lang?: string): Category {
  const zh = isChinese(lang);
  return {
    ...category,
    name: zh ? category.name_zh : category.name_en,
    description: zh ? category.description_zh : category.description_en,
  };
}

export function localizeProduct(product: Product, lang?: string): Product {
  const zh = isChinese(lang);
  return {
    ...product,
    name: zh ? product.name_zh : product.name_en,
    description: zh ? product.description_zh : product.description_en,
    acoustic_signature: zh ? product.acoustic_signature_zh : product.acoustic_signature_en,
    specifications: product.specifications?.map(s => ({
      ...s,
      spec_value: zh ? s.spec_value_zh : s.spec_value_en,
    }))
  };
}

/**
 * Retrieve category taxonomy.
 */
export async function getCategories(lang?: string): Promise<Category[]> {
  const sql = `SELECT category_id, name_en, name_zh, slug, description_en, description_zh, display_order FROM Categories ORDER BY display_order ASC`;
  const dbRows = await executeSpannerSql<Category>(sql);

  const rawCategories = dbRows && dbRows.length > 0 ? dbRows : FALLBACK_CATEGORIES;
  return rawCategories.map(cat => localizeCategory(cat, lang));
}

/**
 * Query products with multi-faceted hardware filters (Price HKD, Brand, Category, Output Ports).
 */
export async function getProducts(options: ProductQueryOptions = {}): Promise<{
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}> {
  const limit = options.limit || 20;
  const offset = options.offset || 0;

  // Try Cloud Spanner execution if connected
  const spannerResult = await querySpannerProducts(options);
  if (spannerResult) {
    const localized = spannerResult.products.map(p => localizeProduct(p, options.lang));
    return {
      products: localized,
      total: spannerResult.total,
      limit,
      offset
    };
  }

  // Fallback memory querying logic
  let filtered = [...FALLBACK_PRODUCTS].filter(p => p.is_active);

  if (options.category_id) {
    filtered = filtered.filter(p => p.category_id.toLowerCase() === options.category_id?.toLowerCase());
  }

  if (options.brand) {
    const brands = Array.isArray(options.brand) ? options.brand : [options.brand];
    filtered = filtered.filter(p => brands.some(b => p.brand.toLowerCase().includes(b.toLowerCase())));
  }

  if (options.min_price !== undefined) {
    filtered = filtered.filter(p => p.price_hkd >= options.min_price!);
  }

  if (options.max_price !== undefined) {
    filtered = filtered.filter(p => p.price_hkd <= options.max_price!);
  }

  if (options.output_ports) {
    const ports = Array.isArray(options.output_ports) ? options.output_ports : [options.output_ports];
    filtered = filtered.filter(p => {
      if (!p.specifications) return false;
      return p.specifications.some(spec => {
        if (spec.spec_key === 'output_interface' || spec.spec_key === 'input_interface' || spec.spec_key === 'connector') {
          return ports.some(port => 
            spec.spec_value_en.toLowerCase().includes(port.toLowerCase()) || 
            spec.spec_value_zh.toLowerCase().includes(port.toLowerCase())
          );
        }
        return false;
      });
    });
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit).map(p => localizeProduct(p, options.lang));

  return {
    products: paginated,
    total,
    limit,
    offset
  };
}

async function querySpannerProducts(options: ProductQueryOptions): Promise<{ products: Product[]; total: number } | null> {
  const conditions: string[] = ['is_active = true'];
  const params: Record<string, any> = {};

  if (options.category_id) {
    conditions.push('category_id = @category_id');
    params.category_id = options.category_id;
  }

  if (options.min_price !== undefined) {
    conditions.push('price_hkd >= @min_price');
    params.min_price = options.min_price;
  }

  if (options.max_price !== undefined) {
    conditions.push('price_hkd <= @max_price');
    params.max_price = options.max_price;
  }

  const whereClause = conditions.join(' AND ');
  const limit = options.limit || 20;
  const offset = options.offset || 0;

  const sql = `
    SELECT product_id, category_id, brand, model, name_en, name_zh, price_hkd,
           description_en, description_zh, acoustic_signature_en, acoustic_signature_zh,
           image_url, is_active
    FROM Products
    WHERE ${whereClause}
    ORDER BY price_hkd ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const rows = await executeSpannerSql<Product>({ sql, params });
  if (!rows) return null;

  // Query specs for each product
  const products: Product[] = [];
  for (const p of rows) {
    const specsSql = `SELECT product_id, spec_key, spec_value_en, spec_value_zh, is_filter_facet FROM ProductSpecifications WHERE product_id = @product_id`;
    const specs = await executeSpannerSql<ProductSpecification>({ sql: specsSql, params: { product_id: p.product_id } });
    products.push({
      ...p,
      price_hkd: Number(p.price_hkd),
      specifications: specs || []
    });
  }

  return {
    products,
    total: products.length
  };
}

/**
 * Get product by ID with full specs.
 */
export async function getProductById(productId: string, lang?: string): Promise<Product | null> {
  const sql = `SELECT * FROM Products WHERE product_id = @product_id AND is_active = true`;
  const rows = await executeSpannerSql<Product>({ sql, params: { product_id: productId } });

  if (rows && rows.length > 0) {
    const product = rows[0];
    const specsSql = `SELECT product_id, spec_key, spec_value_en, spec_value_zh, is_filter_facet FROM ProductSpecifications WHERE product_id = @product_id`;
    const specs = await executeSpannerSql<ProductSpecification>({ sql: specsSql, params: { product_id: productId } });
    product.specifications = specs || [];
    return localizeProduct(product, lang);
  }

  const found = FALLBACK_PRODUCTS.find(p => p.product_id.toLowerCase() === productId.toLowerCase());
  if (!found) return null;

  return localizeProduct(found, lang);
}

/**
 * Get faceted filter options for catalog UI.
 */
export async function getFacetedFilters(categoryId?: string): Promise<{
  brands: string[];
  output_ports: string[];
  price_range: { min: number; max: number };
}> {
  let products = FALLBACK_PRODUCTS;
  if (categoryId) {
    products = products.filter(p => p.category_id.toLowerCase() === categoryId.toLowerCase());
  }

  const brands = Array.from(new Set(products.map(p => p.brand))).sort();
  
  const portsSet = new Set<string>();
  const commonPorts = ['Balanced XLR', 'I2S', 'RCA', '4.4mm Balanced', '6.35mm', 'Optical', 'AES/EBU', 'USB'];
  
  products.forEach(p => {
    p.specifications?.forEach(spec => {
      commonPorts.forEach(port => {
        if (spec.spec_value_en.toLowerCase().includes(port.toLowerCase())) {
          portsSet.add(port);
        }
      });
    });
  });

  const prices = products.map(p => p.price_hkd);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 200000;

  return {
    brands,
    output_ports: Array.from(portsSet),
    price_range: {
      min: minPrice,
      max: maxPrice
    }
  };
}
