import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'zh-HK' | 'en-US';

export interface TermsMap {
  dacs: string;
  amplifiers: string;
  tubeAmps: string;
  streamers: string;
  turntables: string;
  headFi: string;
  loudspeakers: string;
  cables: string;
  powerConditioning: string;
}

export const HK_AUDIO_TERMS: Record<Locale, TermsMap> = {
  'zh-HK': {
    dacs: '解碼器',
    amplifiers: '擴音機',
    tubeAmps: '膽機',
    streamers: '網絡播放器',
    turntables: '黑膠唱機',
    headFi: '耳機 / 入耳式耳機',
    loudspeakers: '音箱 / 喇叭',
    cables: '線材',
    powerConditioning: '電源處理'
  },
  'en-US': {
    dacs: 'DACs',
    amplifiers: 'Amplifiers',
    tubeAmps: 'Vacuum Tube Amps',
    streamers: 'Network Streamers',
    turntables: 'Turntables',
    headFi: 'Headphones / IEMs',
    loudspeakers: 'Loudspeakers',
    cables: 'Audio Cables',
    powerConditioning: 'Power Conditioning'
  }
};

interface Translations {
  [key: string]: {
    'zh-HK': string;
    'en-US': string;
  };
}

export const TRANSLATIONS: Translations = {
  siteTitle: {
    'zh-HK': '雅詠音響 Pro Audio | 頂級發燒音響專門店',
    'en-US': 'Pro Audio | Flagship Audiophile Store'
  },
  tagline: {
    'zh-HK': ' Cloud Spanner 混合搜尋與發燒器材智能搭配示範平台',
    'en-US': 'Cloud Spanner Hybrid Search & Audiophile Synergy Platform'
  },
  searchPlaceholder: {
    'zh-HK': '搜尋聲學特性與規格 (例如: "溫暖人聲 解碼器 3萬以下", "膽機", "I2S")...',
    'en-US': 'Search acoustic profile & specs (e.g. "warm tube vocal DAC under 30k", "I2S")...'
  },
  allCategories: {
    'zh-HK': '全部分類',
    'en-US': 'All Categories'
  },
  cart: {
    'zh-HK': '購物車',
    'en-US': 'Cart'
  },
  guestNotice: {
    'zh-HK': '訪客模式中 (單一貨幣: 港幣 HKD $)',
    'en-US': 'Guest Mode (Single Currency: HKD $)'
  },
  addToCart: {
    'zh-HK': '加入系統配置',
    'en-US': 'Add to System'
  },
  inCart: {
    'zh-HK': '已加入購物車',
    'en-US': 'In Cart'
  },
  removeFromCart: {
    'zh-HK': '移除',
    'en-US': 'Remove'
  },
  total: {
    'zh-HK': '總金額',
    'en-US': 'Total Amount'
  },
  checkout: {
    'zh-HK': '結帳示範 (訪客)',
    'en-US': 'Demo Checkout (Guest)'
  },
  emptyCart: {
    'zh-HK': '購物車內暫無音響器材',
    'en-US': 'Your audio system configuration is empty'
  },
  filterByInterface: {
    'zh-HK': '硬體介面與架構',
    'en-US': 'Hardware Interfaces & Architecture'
  },
  filterByBudget: {
    'zh-HK': '預算上限 (HKD $)',
    'en-US': 'Max Budget (HKD $)'
  },
  resetFilters: {
    'zh-HK': '重置篩選器',
    'en-US': 'Reset Filters'
  },
  synergyWarningHeader: {
    'zh-HK': '⚡ 發燒器材搭配與阻抗電氣匹配提示 (Synergy Warning)',
    'en-US': '⚡ Component Synergy & Electrical Impedance Warning'
  },
  resultsCount: {
    'zh-HK': '共找到 {count} 款極品音響器材',
    'en-US': 'Found {count} flagship audio components'
  },
  acousticSignature: {
    'zh-HK': '聲學特性音色描繪',
    'en-US': 'Acoustic Sound Profile'
  },
  specs: {
    'zh-HK': '規格',
    'en-US': 'Specs'
  }
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  terms: TermsMap;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('zh-HK');

  useEffect(() => {
    const savedLocale = localStorage.getItem('hifi_locale') as Locale;
    if (savedLocale === 'zh-HK' || savedLocale === 'en-US') {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('hifi_locale', newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const entry = TRANSLATIONS[key];
    let text = entry ? entry[locale] : key;
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return text;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, terms: HK_AUDIO_TERMS[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
