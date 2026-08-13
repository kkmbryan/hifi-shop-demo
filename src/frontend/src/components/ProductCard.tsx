import React, { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check, Disc, Volume2, Zap, Wifi, CircleDot, Headphones, Cable, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}


const getCategoryIcon = (categoryId?: string) => {
  const cat = (categoryId || '').toLowerCase();
  if (cat.includes('dac')) return Disc;
  if (cat.includes('amp') || cat.includes('tube')) return Zap;
  if (cat.includes('stream')) return Wifi;
  if (cat.includes('turntable')) return CircleDot;
  if (cat.includes('head')) return Headphones;
  if (cat.includes('loudspeaker') || cat.includes('speaker')) return Volume2;
  if (cat.includes('cable')) return Cable;
  if (cat.includes('power')) return ShieldCheck;
  return Disc;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { locale, t } = useLocale();
  const { cart, addToCart, formatHkd } = useCart();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset image load/error state when product or image URL changes
  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [product.id, product.imageUrl]);

  const hasValidImageUrl = Boolean(product.imageUrl && product.imageUrl.trim().length > 0);
  const showFallback = !hasValidImageUrl || imgError;
  const CategoryIcon = getCategoryIcon(product.categoryId || product.category_id);

  const isInCart = cart.some((item) => item.product.id === product.id);

  const title = locale === 'zh-HK' ? product.nameZh : product.nameEn;
  const description = locale === 'zh-HK' ? product.descriptionZh : product.descriptionEn;
  const acousticSig = locale === 'zh-HK' ? product.acousticSignatureZh : product.acousticSignatureEn;

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg hover:border-amber-500/50 hover:shadow-amber-500/5 transition-all flex flex-col group">
      {/* Image Header Container with Robust Fallback Placeholder Handling */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden border-b border-slate-700/60 flex items-center justify-center">
        {!showFallback ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center text-slate-700">
                <CategoryIcon className="w-8 h-8 animate-spin text-slate-600" />
              </div>
            )}
            <img
              src={product.imageUrl}
              alt={title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div
            role="img"
            aria-label={`${product.brand} ${product.model} placeholder`}
            className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-500 select-none"
          >
            <div className="p-3 rounded-full bg-slate-900/80 border border-slate-800 text-amber-500/80 mb-2 shadow-inner">
              <CategoryIcon className="w-8 h-8 text-amber-500/80" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-500/80 tracking-wide">{product.brand}</span>
            <span className="text-xs text-slate-400 text-center font-sans mt-0.5 line-clamp-1 max-w-[90%]">{product.model}</span>
          </div>
        )}

        {/* Brand Badge Overlay */}
        <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-md border border-slate-700 text-xs font-bold text-amber-400">
          {product.brand}
        </div>

        {/* Price Tag Overlay (Strictly HKD $) */}
        <div className="absolute bottom-2 right-2 bg-amber-500/95 text-slate-950 px-3 py-1 rounded-md font-black text-sm shadow-md">
          {formatHkd(product.priceHkd)}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
            onClick={() => onSelectProduct?.(product)}
            className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Acoustic Sound Profile Badges */}
        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <Volume2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{t('acousticSignature')}</span>
          </div>
          <p className="text-xs text-slate-300 italic line-clamp-2 leading-tight">
            "{acousticSig}"
          </p>
        </div>

        {/* Hardware Tags & Interfaces */}
        <div className="flex flex-wrap gap-1.5">
          {product.interfaces.map((iface) => (
            <span
              key={iface}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 border border-slate-600"
            >
              {iface}
            </span>
          ))}
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => addToCart(product)}
          className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
            isInCart
              ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white border border-emerald-500/50'
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/10'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t('inCart')}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>{t('addToCart')} ({formatHkd(product.priceHkd)})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
