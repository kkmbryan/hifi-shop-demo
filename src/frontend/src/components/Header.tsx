import React, { useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Globe, Trash2, X, SlidersHorizontal, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenFilters?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onOpenFilters }) => {
  const { locale, setLocale, t } = useLocale();
  const { cart, totalCount, totalPriceHkd, removeFromCart, updateQuantity, clearCart, formatHkd } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleLocale = () => {
    setLocale(locale === 'zh-HK' ? 'en-US' : 'zh-HK');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl">
        {/* Top Announcement Bar */}
        <div className="bg-amber-600/20 border-b border-amber-500/20 px-4 py-1 text-xs text-amber-300 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{t('guestNotice')}</span>
          <span className="opacity-40">|</span>
          <span className="text-slate-300">{locale === 'zh-HK' ? 'Cloud Spanner 雙引擎向量搜尋' : 'Cloud Spanner Dual-Engine Hybrid Search'}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Store Brand / Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSearchChange('')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
                詠
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                  <span>雅詠音響</span>
                  <span className="text-amber-500 text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    Aria Audio
                  </span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {t('tagline')}
                </p>
              </div>
            </div>

            {/* Hybrid Search Input Bar */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-400 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-10 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls: Filter Button, Language Switcher, Cart Badge */}
            <div className="flex items-center gap-3">
              {onOpenFilters && (
                <button
                  onClick={onOpenFilters}
                  className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                  aria-label="Toggle Filters"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              )}

              {/* Locale Switcher Button */}
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all hover:border-amber-500/50"
                title="Switch Language (en-US / zh-HK)"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{locale === 'zh-HK' ? '繁體中文 (zh-HK)' : 'English (en-US)'}</span>
              </button>

              {/* Guest Cart Badge Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-all flex items-center gap-2 group"
                aria-label="View Guest Cart"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                <span className="hidden sm:inline font-bold text-xs">
                  {formatHkd(totalPriceHkd)}
                </span>
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 animate-bounce">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Guest Cart Drawer Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-opacity">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-slate-900 text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold">{t('cart')}</h2>
                  <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10">
                    HKD $ Only
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center gap-3">
                    <ShoppingBag className="w-12 h-12 text-slate-600 stroke-1" />
                    <p className="text-sm">{t('emptyCart')}</p>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded bg-slate-950 flex-shrink-0 overflow-hidden relative border border-slate-700 flex items-center justify-center">
                        <img
                          src={product.imageUrl}
                          alt={locale === 'zh-HK' ? product.nameZh : product.nameEn}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs font-mono -z-10">
                          Hi-Fi
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {locale === 'zh-HK' ? product.nameZh : product.nameEn}
                        </h4>
                        <p className="text-xs text-amber-400 font-semibold mt-0.5">
                          {formatHkd(product.priceHkd)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-slate-700 rounded bg-slate-900">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="px-2 py-0.5 text-xs text-slate-300 hover:text-white"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="px-2 py-0.5 text-xs text-slate-300 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-red-400 hover:text-red-300 text-xs p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{t('total')}:</span>
                    <span className="text-lg font-bold text-amber-400">
                      {formatHkd(totalPriceHkd)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={clearCart}
                      className="w-full py-2 px-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
                    >
                      {t('removeFromCart')} {t('allCategories')}
                    </button>
                    <button
                      onClick={() => alert(`Demo checkout completed! Total: ${formatHkd(totalPriceHkd)}`)}
                      className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
                    >
                      {t('checkout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
