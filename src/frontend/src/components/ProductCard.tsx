import React, { useState } from 'react';
import { Product } from '../data/products';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check, Disc, Volume2, Cpu, ShieldAlert } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { locale, t } = useLocale();
  const { cart, addToCart, formatHkd } = useCart();
  const [imgError, setImgError] = useState(false);

  const isInCart = cart.some((item) => item.product.id === product.id);

  const title = locale === 'zh-HK' ? product.nameZh : product.nameEn;
  const description = locale === 'zh-HK' ? product.descriptionZh : product.descriptionEn;
  const acousticSig = locale === 'zh-HK' ? product.acousticSignatureZh : product.acousticSignatureEn;

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg hover:border-amber-500/50 hover:shadow-amber-500/5 transition-all flex flex-col group">
      {/* Image Header Container */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden border-b border-slate-700/60 flex items-center justify-center">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-500">
            <Disc className="w-12 h-12 text-slate-700 mb-2 animate-spin-slow" />
            <span className="text-xs font-mono font-bold text-amber-500/80">{product.brand}</span>
            <span className="text-xs text-slate-400 text-center font-sans mt-1">{product.model}</span>
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
