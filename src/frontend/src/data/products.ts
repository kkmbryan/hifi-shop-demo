// Hi-Fi Product Catalog Interfaces and Adapter Types

export interface ProductSpecification {
  product_id?: string;
  spec_key?: string;
  spec_value_en?: string;
  spec_value_zh?: string;
  spec_value?: string;
  is_filter_facet?: boolean;
}

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
  specifications?: ProductSpecification[];
  rrfScore?: number;
  bm25Rank?: number;
  vectorRank?: number;

  // Backend API snake_case compatibility fields
  product_id?: string;
  category_id?: string;
  name_en?: string;
  name_zh?: string;
  price_hkd?: number;
  description_en?: string;
  description_zh?: string;
  acoustic_signature_en?: string;
  acoustic_signature_zh?: string;
  image_url?: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameZh: string;
  slug: string;
  descriptionEn: string;
  descriptionZh: string;
  icon: string;

  // Backend API snake_case compatibility fields
  category_id?: string;
  name_en?: string;
  name_zh?: string;
  description_en?: string;
  description_zh?: string;
  display_order?: number;
}

// Localized Dictionary Strings for Authentic Hong Kong Audio Terminology
export const LOCALIZED_AUDIO_DICTIONARY_ZH: Record<string, string> = {
  dacs: '解碼器 (DACs)',
  amplifiers: '擴音機 (Amplifiers)',
  tubes: '膽機 (Vacuum Tube Amplifiers)',
  streamers: '網絡播放器 (Streamers)',
  turntables: '黑膠唱機 (Turntables)',
  headFi: '耳機 / 入耳式耳機 (Head-Fi)',
  loudspeakers: '音箱 / 喇叭 (Loudspeakers)',
  cables: '線材 (Cables)',
  powerConditioning: '電源處理 (Power Conditioning)'
};

export const LOCALIZED_AUDIO_DICTIONARY_EN: Record<string, string> = {
  dacs: 'DACs (Digital-to-Analog Converters)',
  amplifiers: 'Amplifiers',
  tubes: 'Vacuum Tube Amplifiers',
  streamers: 'Network Streamers',
  turntables: 'Turntables',
  headFi: 'Headphones / Head-Fi',
  loudspeakers: 'Loudspeakers',
  cables: 'Audio Cables',
  powerConditioning: 'Power Conditioning'
};

const DEFAULT_CATEGORY_ICONS: Record<string, string> = {
  dacs: 'Disc',
  amplifiers: 'Zap',
  streamers: 'Wifi',
  turntables: 'CircleDot',
  'head-fi': 'Headphones',
  loudspeakers: 'Volume2',
  cables: 'Cable',
  'power-conditioning': 'ShieldCheck',
};

/**
 * Adapt raw backend category payload into standard frontend Category object.
 */
export function adaptCategory(raw: any): Category {
  const id = raw.id || raw.category_id || '';
  return {
    id,
    nameEn: raw.nameEn || raw.name_en || raw.name || '',
    nameZh: raw.nameZh || raw.name_zh || raw.name || '',
    slug: raw.slug || id,
    descriptionEn: raw.descriptionEn || raw.description_en || raw.description || '',
    descriptionZh: raw.descriptionZh || raw.description_zh || raw.description || '',
    icon: raw.icon || DEFAULT_CATEGORY_ICONS[id] || 'Disc',
    category_id: id,
    name_en: raw.nameEn || raw.name_en || raw.name || '',
    name_zh: raw.nameZh || raw.name_zh || raw.name || '',
    description_en: raw.descriptionEn || raw.description_en || raw.description || '',
    description_zh: raw.descriptionZh || raw.description_zh || raw.description || '',
    display_order: raw.display_order,
  };
}

/**
 * Adapt raw backend product payload into standard frontend Product object.
 */
export function adaptProduct(raw: any): Product {
  const id = raw.id || raw.product_id || '';
  const specs: ProductSpecification[] = raw.specifications || [];

  let interfaces: string[] = Array.isArray(raw.interfaces) ? [...raw.interfaces] : [];
  let tags: string[] = Array.isArray(raw.tags) ? [...raw.tags] : [];
  let isTube = raw.isTube;
  let impedance = raw.impedance;
  let sensitivity = raw.sensitivity;
  let powerOutput = raw.powerOutput;

  // Extract interfaces from backend specs if not explicitly present
  if (interfaces.length === 0 && specs.length > 0) {
    const knownInterfaces = ['I2S', 'XLR', 'RCA', 'USB', 'BNC', 'Optical', 'Coaxial', 'AES/EBU', '4.4mm', '6.35mm', '3.5mm'];
    specs.forEach((s) => {
      const val = `${s.spec_value_en || ''} ${s.spec_value_zh || ''} ${s.spec_value || ''}`;
      knownInterfaces.forEach((iface) => {
        if (val.toLowerCase().includes(iface.toLowerCase()) && !interfaces.includes(iface)) {
          interfaces.push(iface);
        }
      });
    });
  }

  // Detect vacuum tube (膽機) configuration
  if (isTube === undefined) {
    const nameStr = `${raw.name_en || raw.nameEn || ''} ${raw.name_zh || raw.nameZh || ''} ${raw.description_en || raw.descriptionEn || ''}`;
    const hasTubeSpec = specs.some(
      (s) => s.spec_key === 'tube_complement' || s.spec_value_en?.toLowerCase().includes('tube')
    );
    isTube = hasTubeSpec || nameStr.toLowerCase().includes('tube') || nameStr.includes('膽');
  }

  // Extract tags from backend specs if not explicitly present
  if (tags.length === 0) {
    if (isTube) tags.push('Vacuum Tube 膽機');
    specs.forEach((s) => {
      const val = `${s.spec_value_en || ''} ${s.spec_value_zh || ''}`;
      if (val.includes('R-2R')) tags.push('R-2R Ladder');
      if (val.includes('FPGA')) tags.push('FPGA Filter');
      if (val.includes('TCXO')) tags.push('TCXO Clock');
      if (val.includes('ESS') || val.includes('SABRE')) tags.push('ESS Sabre');
      if (val.includes('300B')) tags.push('300B Tube');
    });
    tags = Array.from(new Set(tags));
  }

  // Extract electrical specifications (impedance, sensitivity, power output)
  if (impedance === undefined) {
    const impSpec = specs.find(
      (s) => s.spec_key === 'impedance_ohms' || s.spec_key === 'headphone_impedance_ohms'
    );
    if (impSpec) {
      const num = parseInt(impSpec.spec_value_en || impSpec.spec_value_zh || '', 10);
      if (!isNaN(num)) impedance = num;
    }
  }

  if (sensitivity === undefined) {
    const sensSpec = specs.find((s) => s.spec_key === 'sensitivity_db');
    if (sensSpec) {
      const num = parseFloat(sensSpec.spec_value_en || sensSpec.spec_value_zh || '');
      if (!isNaN(num)) sensitivity = num;
    }
  }

  if (powerOutput === undefined) {
    const pwrSpec = specs.find((s) => s.spec_key === 'output_power_w' || s.spec_key === 'output_power_mw');
    if (pwrSpec) {
      powerOutput = pwrSpec.spec_value_en || pwrSpec.spec_value_zh;
    }
  }

  return {
    id,
    product_id: id,
    categoryId: raw.categoryId || raw.category_id || '',
    category_id: raw.categoryId || raw.category_id || '',
    brand: raw.brand || '',
    model: raw.model || '',
    nameEn: raw.nameEn || raw.name_en || raw.name || '',
    nameZh: raw.nameZh || raw.name_zh || raw.name || '',
    name_en: raw.nameEn || raw.name_en || raw.name || '',
    name_zh: raw.nameZh || raw.name_zh || raw.name || '',
    priceHkd: typeof raw.priceHkd === 'number' ? raw.priceHkd : Number(raw.price_hkd || 0),
    price_hkd: typeof raw.priceHkd === 'number' ? raw.priceHkd : Number(raw.price_hkd || 0),
    descriptionEn: raw.descriptionEn || raw.description_en || raw.description || '',
    descriptionZh: raw.descriptionZh || raw.description_zh || raw.description || '',
    description_en: raw.descriptionEn || raw.description_en || raw.description || '',
    description_zh: raw.descriptionZh || raw.description_zh || raw.description || '',
    acousticSignatureEn: raw.acousticSignatureEn || raw.acoustic_signature_en || raw.acoustic_signature || '',
    acousticSignatureZh: raw.acousticSignatureZh || raw.acoustic_signature_zh || raw.acoustic_signature || '',
    acoustic_signature_en: raw.acousticSignatureEn || raw.acoustic_signature_en || raw.acoustic_signature || '',
    acoustic_signature_zh: raw.acousticSignatureZh || raw.acoustic_signature_zh || raw.acoustic_signature || '',
    imageUrl: raw.imageUrl || raw.image_url || '',
    image_url: raw.imageUrl || raw.image_url || '',
    tags,
    interfaces,
    isTube: Boolean(isTube),
    impedance,
    sensitivity,
    powerOutput,
    specifications: specs,
    rrfScore: raw.rrfScore || raw.rrf_score,
    bm25Rank: raw.bm25Rank || raw.bm25_rank,
    vectorRank: raw.vectorRank || raw.vector_rank,
  };
}
