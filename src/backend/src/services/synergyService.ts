import { getProductById, localizeProduct, Product } from './catalogService';

export interface SynergyCheckRequest {
  product_ids?: string[];
  cart_items?: string[];
  lang?: string;
}

export interface SynergyCheckItem {
  type: 'impedance_matching' | 'gain_staging' | 'sensitivity_threshold' | 'interface_compatibility';
  status: 'OPTIMAL' | 'COMPATIBLE' | 'WARNING' | 'INCOMPATIBLE';
  title_en: string;
  title_zh: string;
  title?: string;
  description_en: string;
  description_zh: string;
  description?: string;
}

export interface SynergyCheckResult {
  is_compatible: boolean;
  synergy_score: number; // 0 - 100
  badge: string;
  badge_zh: string;
  summary_en: string;
  summary_zh: string;
  summary?: string;
  checks: SynergyCheckItem[];
  warnings: string[];
  recommendations: string[];
  analyzed_products: {
    product_id: string;
    name: string;
    category_id: string;
    brand: string;
  }[];
}

/**
 * Audio Component Synergy Engine evaluating:
 * 1. Tube Amp Gain Staging
 * 2. Output Impedance Ratios (Damping Factor / Impedance Matching)
 * 3. Headphone & Speaker Sensitivity Thresholds
 * 4. Signal Chain Interface Connections (XLR, RCA, I2S)
 */
export async function evaluateSynergy(request: SynergyCheckRequest): Promise<SynergyCheckResult> {
  const ids = Array.from(new Set([...(request.product_ids || []), ...(request.cart_items || [])]));
  const lang = request.lang || 'en-US';
  const isZh = lang.toLowerCase().includes('zh') || lang.toLowerCase().includes('hk');

  if (ids.length < 2) {
    return {
      is_compatible: true,
      synergy_score: 100,
      badge: 'Single Component Selected',
      badge_zh: '單一器材已選擇',
      summary_en: 'Add more audio components (e.g. DAC, Amp, Headphones) to perform a full system synergy check.',
      summary_zh: '請加入更多音響器材（例如解碼器、擴音機、耳機）以進行完整系統搭配檢查。',
      checks: [],
      warnings: [],
      recommendations: ['Select complementary components to evaluate impedance matching and gain staging.'],
      analyzed_products: []
    };
  }

  // Fetch product objects
  const products: Product[] = [];
  for (const id of ids) {
    const product = await getProductById(id, lang);
    if (product) {
      products.push(product);
    }
  }

  const analyzedProducts = products.map(p => ({
    product_id: p.product_id,
    name: p.name || p.name_en,
    category_id: p.category_id,
    brand: p.brand
  }));

  const checks: SynergyCheckItem[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let score = 90;

  // Categorize components
  const amps = products.filter(p => p.category_id === 'amplifiers' || p.category_id === 'head-fi-amp');
  const dacs = products.filter(p => p.category_id === 'dacs' || p.category_id === 'streamers');
  const headphones = products.filter(p => p.category_id === 'head-fi');
  const speakers = products.filter(p => p.category_id === 'loudspeakers');

  // Check 1: Tube Amp Gain Staging & Output Impedance Matching with Headphones
  for (const amp of amps) {
    const isTubeAmp = amp.name_en.toLowerCase().includes('tube') || 
                      amp.description_en.toLowerCase().includes('tube') ||
                      amp.specifications?.some(s => s.spec_key === 'tube_complement');

    for (const hp of headphones) {
      // Find headphone impedance spec
      const impSpec = hp.specifications?.find(s => 
        s.spec_key === 'impedance_ohms' || s.spec_key === 'headphone_impedance_ohms'
      );
      const sensSpec = hp.specifications?.find(s => 
        s.spec_key === 'sensitivity_db' || s.spec_key === 'sensitivity_db_mw'
      );

      let hpImpedance = 32;
      if (impSpec) {
        const valMatch = impSpec.spec_value_en.match(/(\d+(\.\d+)?)\s*ohm/i);
        if (valMatch) hpImpedance = parseFloat(valMatch[1]);
      } else if (hp.product_id.includes('hd800s')) {
        hpImpedance = 300;
      } else if (hp.product_id.includes('ext')) {
        hpImpedance = 10;
      } else if (hp.product_id.includes('andromeda')) {
        hpImpedance = 12.8;
      }

      let hpSensitivity = 100;
      if (sensSpec) {
        const sensMatch = sensSpec.spec_value_en.match(/(\d+(\.\d+)?)\s*dB/i);
        if (sensMatch) hpSensitivity = parseFloat(sensMatch[1]);
      }

      if (isTubeAmp) {
        if (hpImpedance >= 150) {
          // Optimal Tube Pairing!
          score = Math.min(100, score + 10);
          checks.push({
            type: 'impedance_matching',
            status: 'OPTIMAL',
            title_en: 'Optimal High-Impedance Tube Transformer Pairing',
            title_zh: '高阻抗真空管變壓器最佳匹配',
            description_en: `${hp.model || hp.name_en} (${hpImpedance}Ω) matches ${amp.model || amp.name_en} output transformer taps, providing lush midrange, maximum voltage headroom, and dead-silent background.`,
            description_zh: `${hp.model || hp.name_zh} (${hpImpedance}歐姆) 完美配合 ${amp.model || amp.name_zh} 輸出變壓器抽頭，提供濃郁中頻、最大電壓儲備及極致漆黑背景。`
          });
          recommendations.push(
            isZh ? `建議使用 ${amp.model} 之 300Ω 高阻抗耳機輸出端子以獲得最佳音場與線路阻尼。`
                 : `Select high-impedance (300Ω) output jack on ${amp.model} for optimal soundstage and circuit damping.`
          );
        } else if (hpImpedance < 20 && hpSensitivity > 105) {
          // Ultra sensitive IEM on Tube Amp -> Warning
          score -= 20;
          checks.push({
            type: 'gain_staging',
            status: 'WARNING',
            title_en: 'Potential Noise Floor & Gain Staging Mismatch',
            title_zh: '潛在底噪與增益級匹配警告',
            description_en: `High-sensitivity IEM (${hpImpedance}Ω, ${hpSensitivity}dB/mW) driven by high-voltage Class A tube amplifier may exhibit background noise hiss or frequency damping skewing.`,
            description_zh: `高靈敏度入耳式耳機 (${hpImpedance}歐姆, ${hpSensitivity}dB/mW) 由高電壓 Class A 膽機驅動可能出現微弱底噪或頻響阻尼偏差。`
          });
          warnings.push(
            isZh ? `警告：${hp.name_zh} 阻抗極低 (${hpImpedance}Ω)，配合膽機時建議選用低增益模式或加配阻抗適配器。`
                 : `Warning: ${hp.name_en} has low impedance (${hpImpedance}Ω). Use low-gain mode or an inline impedance adapter when driven by tube amplifier.`
          );
        } else {
          checks.push({
            type: 'impedance_matching',
            status: 'COMPATIBLE',
            title_en: 'Tube Amp Drive Compatibility',
            title_zh: '真空管擴音機驅動相容',
            description_en: `${hp.model} (${hpImpedance}Ω) is within ${amp.model} recommended impedance operating range.`,
            description_zh: `${hp.model} (${hpImpedance}歐姆) 處於 ${amp.model} 建議之工作阻抗範圍內。`
          });
        }
      } else {
        // Solid state amp
        checks.push({
          type: 'impedance_matching',
          status: 'COMPATIBLE',
          title_en: 'Solid-State Damping & Impedance Ratio',
          title_zh: '晶體管阻尼與阻抗比例',
          description_en: `${amp.model} solid-state output stage will deliver high damping factor control for ${hp.model} (${hpImpedance}Ω).`,
          description_zh: `${amp.model} 晶體管輸出級為 ${hp.model} (${hpImpedance}歐姆) 提供高阻尼係數與控制力。`
        });
      }

      // Sensitivity Check
      if (hpSensitivity < 96 && hpImpedance > 250) {
        checks.push({
          type: 'sensitivity_threshold',
          status: 'COMPATIBLE',
          title_en: 'High Voltage Swing Power Requirement Met',
          title_zh: '高電壓擺幅功率需求已滿足',
          description_en: `Demanding headphones (${hpSensitivity} dB/mW sensitivity) receive sufficient peak voltage drive from selected amplifier.`,
          description_zh: `高難度耳機 (${hpSensitivity} dB/mW 靈敏度) 已獲得所選擴音機充足之峰值電壓驅動。`
        });
      }
    }
  }

  // Check 2: Speaker Sensitivity & Amp Power
  for (const amp of amps) {
    for (const spk of speakers) {
      if (spk.product_id.includes('kef-ls50-wireless')) {
        // Active speakers don't need external power amp
        score -= 15;
        checks.push({
          type: 'gain_staging',
          status: 'WARNING',
          title_en: 'Active Loudspeaker Redundancy Warning',
          title_zh: '主動式音箱重疊配置警告',
          description_en: `${spk.name_en} contains internal 760W amplification. External power amplifier ${amp.name_en} is redundant.`,
          description_zh: `${spk.name_zh} 已內建 760W 主動式功放，額外連接外部擴音機 ${amp.name_zh} 屬於重疊配置。`
        });
        warnings.push(
          isZh ? `${spk.name_zh} 為主動式喇叭，無需外部擴音機。`
               : `${spk.name_en} is an active wireless speaker system and does not require an external amplifier.`
        );
      } else {
        checks.push({
          type: 'sensitivity_threshold',
          status: 'OPTIMAL',
          title_en: 'Amplifier Power & Speaker Efficiency Match',
          title_zh: '擴音機功率與喇叭靈敏度匹配',
          description_en: `${amp.name_en} power reserves comfortably drive ${spk.name_en} dynamic baseline.`,
          description_zh: `${amp.name_zh} 功率儲備能從容驅動 ${spk.name_zh} 之動態音場。`
        });
      }
    }
  }

  // Check 3: Interface Compatibility (XLR, RCA, I2S)
  if (dacs.length > 0 && amps.length > 0) {
    const dac = dacs[0];
    const amp = amps[0];

    const dacOutputs = dac.specifications?.filter(s => s.spec_key === 'output_interface')
      .map(s => s.spec_value_en.toLowerCase()).join(' ') || '';
    const ampInputs = amp.specifications?.filter(s => s.spec_key === 'input_interface')
      .map(s => s.spec_value_en.toLowerCase()).join(' ') || '';

    const supportsXLR = (dacOutputs.includes('xlr') || dac.name_en.includes('XLR') || dac.description_en.includes('balanced')) &&
                        (ampInputs.includes('xlr') || amp.name_en.includes('XLR') || amp.description_en.includes('balanced'));

    if (supportsXLR) {
      checks.push({
        type: 'interface_compatibility',
        status: 'OPTIMAL',
        title_en: 'Fully Balanced XLR Interconnect Supported',
        title_zh: '支援全平衡 XLR 訊號線連接',
        description_en: `Both ${dac.model || dac.name_en} and ${amp.model || amp.name_en} feature True Balanced XLR interfaces for 6dB higher signal headroom and noise rejection.`,
        description_zh: `${dac.model || dac.name_zh} 與 ${amp.model || amp.name_zh} 均配備真平衡 XLR 介面，提供高 6dB 訊號動態餘量與共模抗雜訊效能。`
      });
      recommendations.push(
        isZh ? `建議使用高純度平衡 XLR 訊號線（如 Nordost Frey 2 或 AudioQuest Dragon Tail）連結解碼器與擴音機。`
             : `Recommend using high-purity Balanced XLR interconnects (e.g. Nordost Frey 2 or AudioQuest Dragon Tail) between DAC and Amp.`
      );
    } else {
      checks.push({
        type: 'interface_compatibility',
        status: 'COMPATIBLE',
        title_en: 'Standard Analog RCA Interconnect',
        title_zh: '標準類比 RCA 訊號線連接',
        description_en: 'Components will connect via Single-Ended RCA analog interconnects.',
        description_zh: '器材將經由單端 RCA 類比訊號線進行連接。'
      });
    }
  }

  // Determine Overall Badge & Summary
  const isCompatible = warnings.length === 0 && score >= 70;
  let badge = 'Excellent Component Synergy';
  let badgeZh = '極佳器材搭配';

  if (checks.some(c => c.status === 'OPTIMAL' && c.type === 'impedance_matching')) {
    badge = 'Optimal High-Impedance Tube Match';
    badgeZh = '高阻抗真空管最佳搭配';
  } else if (warnings.length > 0) {
    badge = 'Synergy Check Warning';
    badgeZh = '搭配注意事項';
  }

  const summaryEn = isCompatible 
    ? `Selected components demonstrate strong electrical and acoustic synergy with a score of ${score}/100.`
    : `Synergy evaluation detected potential impedance or setup warnings. Score: ${score}/100.`;

  const summaryZh = isCompatible
    ? `所選音響器材在電學阻抗與聲学特性上展現極佳相容性，綜合評分為 ${score}/100。`
    : `搭配評估檢測到潛在之阻抗或器材配置注意事項。綜合評分：${score}/100。`;

  return {
    is_compatible: isCompatible,
    synergy_score: score,
    badge,
    badge_zh: badgeZh,
    summary_en: summaryEn,
    summary_zh: summaryZh,
    summary: isZh ? summaryZh : summaryEn,
    checks,
    warnings,
    recommendations,
    analyzed_products: analyzedProducts
  };
}
