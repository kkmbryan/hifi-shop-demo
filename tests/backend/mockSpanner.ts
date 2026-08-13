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
    category_id: 'dacs',
    name_en: 'DACs (Digital-to-Analog Converters)',
    name_zh: '解碼器 (DACs)',
    slug: 'dacs',
    description_en: 'High performance digital-to-analog converters',
    description_zh: '高效能數碼至類比轉換解碼器',
    display_order: 1
  },
  {
    category_id: 'amplifiers',
    name_en: 'Amplifiers',
    name_zh: '擴音機 (Amplifiers)',
    slug: 'amplifiers',
    description_en: 'Power and Integrated Amplifiers',
    description_zh: '功放與合併式擴音機',
    display_order: 2
  },
  {
    category_id: 'head-fi',
    name_en: 'Headphones / Head-Fi',
    name_zh: '耳機 / 入耳式耳機 (Head-Fi)',
    slug: 'head-fi',
    description_en: 'High fidelity headphones',
    description_zh: '高保真耳機',
    display_order: 3
  },
  {
    category_id: 'head-fi-amp',
    name_en: 'Headphone Amplifiers',
    name_zh: '耳機擴音機',
    slug: 'head-fi-amp',
    description_en: 'Dedicated headphone amps',
    description_zh: '專用耳機擴音機',
    display_order: 4
  },
  {
    category_id: 'streamers',
    name_en: 'Network Streamers',
    name_zh: '網絡播放器 (Streamers)',
    slug: 'streamers',
    description_en: 'High-res audio streamers',
    description_zh: '高解析度網絡播放器',
    display_order: 5
  },
  {
    category_id: 'loudspeakers',
    name_en: 'Loudspeakers',
    name_zh: '音箱 / 喇叭 (Loudspeakers)',
    slug: 'loudspeakers',
    description_en: 'Stereo loudspeakers',
    description_zh: '立體聲喇叭',
    display_order: 6
  }
];

export const MOCK_DB_PRODUCTS: MockProductRow[] = [
  {
    product_id: 'prod-chord-hugo-tt2',
    category_id: 'dacs',
    brand: 'Chord Electronics',
    model: 'Hugo TT 2',
    name_en: 'Chord Hugo TT 2 DAC/Headphone Amp',
    name_zh: 'Chord Hugo TT 2 解碼/耳擴/前級',
    price_hkd: 39800,
    description_en: 'Reference table-top DAC featuring custom FPGA filter.',
    description_zh: '旗艦桌上型解碼器，配備自研 FPGA 濾波器。',
    acoustic_signature_en: 'Neutral, transparent with soundstage depth.',
    acoustic_signature_zh: '中性通透，超強微動態與音場深度。',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-sennheiser-hd800s',
    category_id: 'head-fi',
    brand: 'Sennheiser',
    model: 'HD 800 S',
    name_en: 'Sennheiser HD 800 S Reference Open-Back Headphones',
    name_zh: 'Sennheiser HD 800 S 參考級開放式頭戴耳機',
    price_hkd: 14200,
    description_en: 'Iconic open-back dynamic reference headphones with 56mm Ring Radiator transducer.',
    description_zh: '傳奇開放式動圈參考耳機，配備 56mm 環形振膜單元。',
    acoustic_signature_en: 'Vast holographic soundstage, precise imaging, extended treble.',
    acoustic_signature_zh: '開闊立體音場，精準聲場定位，高頻延伸極佳。',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-denafrips-venus-ii',
    category_id: 'dacs',
    brand: 'Denafrips',
    model: 'Venus II',
    name_en: 'Denafrips Venus II R-2R DAC',
    name_zh: 'Denafrips Venus II R-2R 解碼器',
    price_hkd: 24800,
    description_en: 'Balanced R-2R ladder DAC with discrete resistor network.',
    description_zh: '平衡 R-2R 梯陣解碼器，配備分立電阻網絡。',
    acoustic_signature_en: 'Organic, natural analog warmth with expansive dynamics.',
    acoustic_signature_zh: '極致模擬味，自然溫暖，動態龐大。',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-topping-d90-iii',
    category_id: 'dacs',
    brand: 'Topping',
    model: 'D90 III',
    name_en: 'Topping D90 III Sabre DAC',
    name_zh: 'Topping D90 III 解碼器',
    price_hkd: 7980,
    description_en: 'Ultra-low distortion DAC featuring dual ES9039SPRO chips.',
    description_zh: '超低失真解碼器，採用雙 ES9039SPRO 晶片。',
    acoustic_signature_en: 'Ultra-clean background, analytical precision.',
    acoustic_signature_zh: '極度漆黑背景，解析力強勁。',
    image_url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-feliks-envy',
    category_id: 'head-fi-amp',
    brand: 'Feliks Audio',
    model: 'Envy',
    name_en: 'Feliks Audio Envy 300B Tube Amp',
    name_zh: 'Feliks Audio Envy 300B 旗艦膽機',
    price_hkd: 58000,
    description_en: 'Flagship Class-A single-ended 300B vacuum tube headphone amplifier.',
    description_zh: '旗艦 Class-A 單端 300B 真空管耳機擴音機 (膽機)。',
    acoustic_signature_en: 'Rich harmonic distortion, lush vocal texture, deep bass foundation.',
    acoustic_signature_zh: '豐富諧波人聲，潤澤中頻，深邃低頻下潛。',
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-campfire-andromeda-2020',
    category_id: 'head-fi',
    brand: 'Campfire Audio',
    model: 'Andromeda 2020',
    name_en: 'Campfire Audio Andromeda 2020 IEM',
    name_zh: 'Campfire Audio Andromeda 2020 入耳式耳機',
    price_hkd: 8980,
    description_en: '5 Balanced Armature drivers with Solid-Body acoustic chamber.',
    description_zh: '5 動鐵單元入耳式耳機，實心聲學腔體設計。',
    acoustic_signature_en: 'Sparkling highs, highly detailed and intimate vocals.',
    acoustic_signature_zh: '通透高頻，人聲貼耳細緻。',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-mcintosh-ma8950',
    category_id: 'amplifiers',
    brand: 'McIntosh',
    model: 'MA8950',
    name_en: 'McIntosh MA8950 Integrated Amp',
    name_zh: 'McIntosh MA8950 合併式擴音機',
    price_hkd: 78000,
    description_en: '200 Watts x 2 channel integrated amplifier with Autoformer technology.',
    description_zh: '200瓦 x 2 聲道合併式擴音機，配備 Autoformer 變壓輸出技術。',
    acoustic_signature_en: 'Warm, powerful dynamics, authoritative bass control.',
    acoustic_signature_zh: '溫暖強勁動態，權威級低頻控制力。',
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-kef-ls50-wireless-ii',
    category_id: 'loudspeakers',
    brand: 'KEF',
    model: 'LS50 Wireless II',
    name_en: 'KEF LS50 Wireless II Active Loudspeakers',
    name_zh: 'KEF LS50 Wireless II 主動式無線音箱',
    price_hkd: 22800,
    description_en: 'All-in-one active wireless loudspeaker system with 760W built-in amp.',
    description_zh: '全功能主動式無線喇叭系統，內置 760W 功放驅動。',
    acoustic_signature_en: 'Coherent point-source imaging with MAT absorption.',
    acoustic_signature_zh: '點聲源精準定位，MAT 迷宮吸音技術。',
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-bw-804-d4',
    category_id: 'loudspeakers',
    brand: 'Bowers & Wilkins',
    model: '804 D4',
    name_en: 'B&W 804 D4 Floorstanding Loudspeakers',
    name_zh: 'B&W 804 D4 鑽石高音落地喇叭',
    price_hkd: 108000,
    description_en: 'Diamond dome tweeter floorstanding loudspeaker.',
    description_zh: '鑽石高音單元落地式音箱。',
    acoustic_signature_en: 'Unrivaled clarity, realistic vocal rendering.',
    acoustic_signature_zh: '極致清晰度，逼真人聲重現。',
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    product_id: 'prod-wiim-pro-plus',
    category_id: 'streamers',
    brand: 'WiiM',
    model: 'Pro Plus',
    name_en: 'WiiM Pro Plus Streamer',
    name_zh: 'WiiM Pro Plus 串流播放器',
    price_hkd: 1880,
    description_en: 'Compact audio streamer.',
    description_zh: '小巧串流播放機。',
    acoustic_signature_en: 'Clean digital output.',
    acoustic_signature_zh: '乾淨數碼輸出。',
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    is_active: true
  }
];

export const MOCK_DB_SPECS: MockSpecRow[] = [
  {
    product_id: 'prod-chord-hugo-tt2',
    spec_key: 'output_interface',
    spec_value_en: 'XLR, RCA, BNC',
    spec_value_zh: 'XLR, RCA, BNC',
    is_filter_facet: true
  },
  {
    product_id: 'prod-sennheiser-hd800s',
    spec_key: 'impedance_ohms',
    spec_value_en: '300 ohm',
    spec_value_zh: '300 歐姆',
    is_filter_facet: true
  },
  {
    product_id: 'prod-sennheiser-hd800s',
    spec_key: 'sensitivity_db',
    spec_value_en: '102 dB',
    spec_value_zh: '102 dB',
    is_filter_facet: false
  },
  {
    product_id: 'prod-denafrips-venus-ii',
    spec_key: 'output_interface',
    spec_value_en: 'XLR, RCA, I2S',
    spec_value_zh: 'XLR, RCA, I2S',
    is_filter_facet: true
  },
  {
    product_id: 'prod-denafrips-venus-ii',
    spec_key: 'input_interface',
    spec_value_en: 'I2S, XLR, USB',
    spec_value_zh: 'I2S, XLR, USB',
    is_filter_facet: true
  },
  {
    product_id: 'prod-topping-d90-iii',
    spec_key: 'output_interface',
    spec_value_en: 'XLR, RCA',
    spec_value_zh: 'XLR, RCA',
    is_filter_facet: true
  },
  {
    product_id: 'prod-feliks-envy',
    spec_key: 'tube_complement',
    spec_value_en: '300B x 2, 6SN7 x 2',
    spec_value_zh: '300B x 2, 6SN7 x 2',
    is_filter_facet: true
  },
  {
    product_id: 'prod-feliks-envy',
    spec_key: 'input_interface',
    spec_value_en: 'XLR, RCA',
    spec_value_zh: 'XLR, RCA',
    is_filter_facet: true
  },
  {
    product_id: 'prod-campfire-andromeda-2020',
    spec_key: 'impedance_ohms',
    spec_value_en: '12.8 ohm',
    spec_value_zh: '12.8 歐姆',
    is_filter_facet: true
  },
  {
    product_id: 'prod-campfire-andromeda-2020',
    spec_key: 'sensitivity_db',
    spec_value_en: '115 dB',
    spec_value_zh: '115 dB',
    is_filter_facet: false
  },
  {
    product_id: 'prod-mcintosh-ma8950',
    spec_key: 'input_interface',
    spec_value_en: 'XLR, RCA',
    spec_value_zh: 'XLR, RCA',
    is_filter_facet: true
  },
  {
    product_id: 'prod-mcintosh-ma8950',
    spec_key: 'output_power_w',
    spec_value_en: '200W',
    spec_value_zh: '200瓦',
    is_filter_facet: true
  },
  {
    product_id: 'prod-bw-804-d4',
    spec_key: 'impedance_ohms',
    spec_value_en: '8 ohm',
    spec_value_zh: '8 歐姆',
    is_filter_facet: true
  }
];

export async function mockExecuteSpannerSql(query: any): Promise<any[] | null> {
  const sqlString = typeof query === 'string' ? query : query.sql;
  const params = typeof query === 'object' && query.params ? query.params : {};

  if (sqlString.includes('FROM Categories')) {
    return MOCK_DB_CATEGORIES;
  }

  if (sqlString.includes('COUNT(*) AS count FROM Products')) {
    let list = MOCK_DB_PRODUCTS.filter(p => p.is_active);
    if (params.category_id) {
      list = list.filter(p => p.category_id.toLowerCase() === params.category_id.toLowerCase());
    }
    if (params.brand) {
      const bStr = params.brand.replace(/%/g, '').toLowerCase();
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

  if (sqlString.includes('SEARCH(Products, @query)')) {
    const q = (params.query || '').toLowerCase();
    const matches = MOCK_DB_PRODUCTS.filter(p =>
      p.name_en.toLowerCase().includes(q) ||
      p.name_zh.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.description_en.toLowerCase().includes(q) ||
      p.description_zh.toLowerCase().includes(q)
    );
    return matches.map(p => ({ product_id: p.product_id }));
  }

  if (sqlString.includes('FROM ProductEmbeddings')) {
    const matches = MOCK_DB_PRODUCTS.filter(p => p.is_active);
    return matches.map((p, idx) => ({ product_id: p.product_id, distance: 0.1 * (idx + 1) }));
  }

  if (sqlString.includes('FROM ProductSpecifications')) {
    if (params.product_id) {
      return MOCK_DB_SPECS.filter(s => s.product_id === params.product_id);
    }
    if (params.product_ids) {
      return MOCK_DB_SPECS.filter(s => params.product_ids.includes(s.product_id));
    }
    return MOCK_DB_SPECS;
  }

  if (sqlString.includes('FROM Products')) {
    let list = MOCK_DB_PRODUCTS.filter(p => p.is_active);
    if (params.product_id) {
      list = list.filter(p => p.product_id === params.product_id);
    }
    if (params.product_ids) {
      list = list.filter(p => params.product_ids.includes(p.product_id));
    }
    if (params.category_id) {
      list = list.filter(p => p.category_id.toLowerCase() === params.category_id.toLowerCase());
    }
    if (params.brand) {
      const bStr = params.brand.replace(/%/g, '').toLowerCase();
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
