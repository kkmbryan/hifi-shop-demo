import React from 'react';
import { useCart } from '../context/CartContext';
import { useLocale } from '../context/LocaleContext';
import { ShieldAlert, Zap, Cpu, CheckCircle2 } from 'lucide-react';

export const SynergyWarning: React.FC = () => {
  const { cart } = useCart();
  const { locale, t } = useLocale();

  if (cart.length === 0) return null;

  // Extract products from cart
  const products = cart.map((item) => item.product);

  const hasTubeAmp = products.some((p) => p.isTube || p.id === 'prod-feliks-envy');
  const hasHighImpedanceHeadphones = products.some(
    (p) => (p.impedance && p.impedance >= 300) || p.id === 'prod-sennheiser-hd800s'
  );
  const hasPlanarHeadphones = products.some((p) => p.id === 'prod-focal-utopia-2022');
  const hasI2SStreamer = products.some((p) => p.interfaces.includes('I2S'));
  const hasR2RDac = products.some((p) => p.tags.some((t) => t.includes('R-2R')));
  const hasMcIntoshAmp = products.some((p) => p.id === 'prod-mcintosh-ma8950');
  const hasBWLoudspeakers = products.some((p) => p.id === 'prod-bw-804-d4');

  const warnings: { title: string; desc: string; type: 'warning' | 'synergy' | 'tip' }[] = [];

  // Scenario 4 BRD: Tube Amp + High-Impedance Headphone Synergy
  if (hasTubeAmp && (hasHighImpedanceHeadphones || hasPlanarHeadphones)) {
    warnings.push({
      type: 'warning',
      title:
        locale === 'zh-HK'
          ? '⚡ 真空管擴音機 (膽機) 與高阻抗/純鈹耳機電氣阻抗匹配提醒'
          : '⚡ Tube Amp & High-Impedance Electrical Synergy Notice',
      desc:
        locale === 'zh-HK'
          ? '檢測到系統中包含 Feliks Audio Envy 300B 膽機與 Sennheiser HD 800 S / Focal Utopia 旗艦耳機。建議調整膽機變壓器輸出檔位至 High-Z (100–300Ω)，以確保適當的阻抗衰減與動態控制力，避免高頻頻響失真！'
          : 'Feliks Audio Envy 300B tube amp detected alongside flagship reference headphones (HD 800 S / Focal Utopia). Ensure impedance output selector is set to High-Z (100-300Ω) for optimal damping factor and spatial 3D imaging!'
    });
  }

  // Digital Transport I2S + R-2R Synergy
  if (hasI2SStreamer && hasR2RDac) {
    warnings.push({
      type: 'synergy',
      title:
        locale === 'zh-HK'
          ? '✨ I2S 數碼介面最佳化傳輸搭配 (I2S Digital Synergy)'
          : '✨ I2S Ultra-Low Jitter Interface Synergy',
      desc:
        locale === 'zh-HK'
          ? '系統中的網絡播放器與 Denafrips R-2R 解碼器皆支援 I2S 介面！推薦使用發燒級 I2S HDMI 訊號線直接連線，可繞過傳統 S/PDIF 鎖相環電路，極致降低時基誤差 (Jitter)。'
          : 'Both Network Streamer and R-2R DAC support I2S output! Connect via I2S HDMI cable to bypass S/PDIF PLL recocking, resulting in ultra-low jitter digital precision.'
    });
  }

  // High-Power Amp + Flagship Speaker Synergy
  if (hasMcIntoshAmp && hasBWLoudspeakers) {
    warnings.push({
      type: 'tip',
      title:
        locale === 'zh-HK'
          ? '🔊 麥景圖 200W Autoformer 與 B&W 鑽石高音阻抗匹配建議'
          : '🔊 McIntosh Autoformer & B&W Diamond Driver Impedance Tip',
      desc:
        locale === 'zh-HK'
          ? 'McIntosh MA8950 具備專利 Autoformer 變壓輸出，建議將 B&W 804 D4 接駁至 4-Ohm 喇叭輸出端子，以發揮最大大電流阻尼控制力與溫暖中頻！'
          : 'McIntosh MA8950 Autoformer delivers maximum current on the 4-Ohm tap for B&W 804 D4 floorstanding loudspeakers.'
    });
  }

  // Default general synergy guidance if 2 or more products are in cart
  if (products.length >= 2 && warnings.length === 0) {
    warnings.push({
      type: 'synergy',
      title:
        locale === 'zh-HK'
          ? '✨ 系統組件相容性檢測良好 (System Synergy Verification)'
          : '✨ System Synergy Verified Compatible',
      desc:
        locale === 'zh-HK'
          ? '當前購物車內之器材介面與功率規格具備極佳的發燒音響搭配相容性，可放心組合試聽。'
          : 'Current selected audio components have verified electrical and interface compatibility for high-fidelity playback.'
    });
  }

  if (warnings.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
      {warnings.map((w, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl border flex items-start gap-3 shadow-lg backdrop-blur ${
            w.type === 'warning'
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-amber-500/5'
              : w.type === 'synergy'
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-emerald-500/5'
              : 'bg-blue-950/40 border-blue-500/60 text-blue-200 shadow-blue-500/5'
          }`}
        >
          {w.type === 'warning' ? (
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
          ) : w.type === 'synergy' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-sm font-bold">{w.title}</h4>
            <p className="text-xs mt-1 leading-relaxed opacity-90">{w.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
