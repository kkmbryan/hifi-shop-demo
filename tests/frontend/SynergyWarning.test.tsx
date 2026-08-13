import React from 'react';
import { render, screen } from '@testing-library/react';
import { SynergyWarning } from '../../src/frontend/src/components/SynergyWarning';
import { CartProvider, useCart } from '../../src/frontend/src/context/CartContext';
import { LocaleProvider, useLocale } from '../../src/frontend/src/context/LocaleContext';
import { Product } from '../../src/frontend/src/data/products';
import { MOCK_PRODUCTS } from './mockProducts';

const CartPopulator: React.FC<{ initialProducts: Product[]; targetLocale: 'zh-HK' | 'en-US' }> = ({ initialProducts, targetLocale }) => {
  const { addToCart } = useCart();
  const { setLocale } = useLocale();

  React.useEffect(() => {
    setLocale(targetLocale);
    initialProducts.forEach(p => addToCart(p));
  }, [initialProducts, targetLocale]);

  return null;
};

const TestHarness: React.FC<{ initialProducts?: Product[]; locale?: 'zh-HK' | 'en-US' }> = ({ initialProducts = [], locale = 'zh-HK' }) => {
  return (
    <LocaleProvider>
      <CartProvider>
        <CartPopulator initialProducts={initialProducts} targetLocale={locale} />
        <SynergyWarning />
      </CartProvider>
    </LocaleProvider>
  );
};

describe('SynergyWarning Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render null when cart is empty', () => {
    const { container } = render(<TestHarness initialProducts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display electrical impedance & tube amp warning when Feliks Audio Envy tube amp + Sennheiser HD 800 S are in cart', async () => {
    const tubeAmp = MOCK_PRODUCTS.find(p => p.id === 'prod-feliks-envy')!;
    const highImpedanceHp = MOCK_PRODUCTS.find(p => p.id === 'prod-sennheiser-hd800s')!;

    render(<TestHarness initialProducts={[tubeAmp, highImpedanceHp]} locale="zh-HK" />);

    const warningTitle = await screen.findByText(/真空管擴音機 \(膽機\) 與高阻抗\/純鈹耳機電氣阻抗匹配提醒/i);
    expect(warningTitle).toBeInTheDocument();
    expect(screen.getByText(/建議調整膽機變壓器輸出檔位至 High-Z/i)).toBeInTheDocument();
  });

  it('should display tube amp warning in English when locale is en-US', async () => {
    const tubeAmp = MOCK_PRODUCTS.find(p => p.id === 'prod-feliks-envy')!;
    const highImpedanceHp = MOCK_PRODUCTS.find(p => p.id === 'prod-sennheiser-hd800s')!;

    render(<TestHarness initialProducts={[tubeAmp, highImpedanceHp]} locale="en-US" />);

    const warningTitle = await screen.findByText(/Tube Amp & High-Impedance Electrical Synergy Notice/i);
    expect(warningTitle).toBeInTheDocument();
    expect(screen.getByText(/Ensure impedance output selector is set to High-Z/i)).toBeInTheDocument();
  });

  it('should display I2S digital interface synergy banner when streamer with I2S and R-2R DAC are in cart', async () => {
    const i2sStreamer = MOCK_PRODUCTS.find(p => p.id === 'prod-eversolo-dmp-a8')!;
    const r2rDac = MOCK_PRODUCTS.find(p => p.id === 'prod-denafrips-venus-ii')!;

    render(<TestHarness initialProducts={[i2sStreamer, r2rDac]} locale="zh-HK" />);

    const synergyTitle = await screen.findByText(/I2S 數碼介面最佳化傳輸搭配/i);
    expect(synergyTitle).toBeInTheDocument();
    expect(screen.getByText(/推薦使用發燒級 I2S HDMI 訊號線直接連線/i)).toBeInTheDocument();
  });

  it('should display McIntosh amp + B&W speakers impedance matching tip banner', async () => {
    const mcIntoshAmp = MOCK_PRODUCTS.find(p => p.id === 'prod-mcintosh-ma8950')!;
    const bwSpeakers = MOCK_PRODUCTS.find(p => p.id === 'prod-bw-804-d4')!;

    render(<TestHarness initialProducts={[mcIntoshAmp, bwSpeakers]} locale="zh-HK" />);

    const tipTitle = await screen.findByText(/麥景圖 200W Autoformer 與 B&W 鑽石高音阻抗匹配建議/i);
    expect(tipTitle).toBeInTheDocument();
    expect(screen.getByText(/建議將 B&W 804 D4 接駁至 4-Ohm 喇叭輸出端子/i)).toBeInTheDocument();
  });

  it('should display default system synergy verification when 2 general compatible products are added', async () => {
    const dac = MOCK_PRODUCTS.find(p => p.id === 'prod-topping-d90-iii')!;
    const streamer = MOCK_PRODUCTS.find(p => p.id === 'prod-wiim-pro-plus')!;

    render(<TestHarness initialProducts={[dac, streamer]} locale="zh-HK" />);

    const verifiedTitle = await screen.findByText(/系統組件相容性檢測良好/i);
    expect(verifiedTitle).toBeInTheDocument();
    expect(screen.getByText(/當前購物車內之器材介面與功率規格具備極佳的發燒音響搭配相容性/i)).toBeInTheDocument();
  });
});
