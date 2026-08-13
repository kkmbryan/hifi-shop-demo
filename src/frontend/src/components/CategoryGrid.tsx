import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { CATEGORIES, Category } from '../data/products';
import { Disc, Zap, Wifi, CircleDot, Headphones, Volume2, Cable, ShieldCheck, Grid } from 'lucide-react';

interface CategoryGridProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Disc: <Disc className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Wifi: <Wifi className="w-6 h-6" />,
  CircleDot: <CircleDot className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Volume2: <Volume2 className="w-6 h-6" />,
  Cable: <Cable className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategoryId,
  onSelectCategory
}) => {
  const { locale, t } = useLocale();

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Grid className="w-5 h-5 text-amber-400" />
          <span>{locale === 'zh-HK' ? '發燒音響八大核心分類' : '8 Core Audiophile Categories'}</span>
        </h2>
        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
          >
            {t('allCategories')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map((cat: Category) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`p-3.5 rounded-xl border transition-all flex flex-col items-center text-center gap-2 group ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10 scale-105'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900/80 text-amber-400 group-hover:text-amber-300 group-hover:bg-slate-900'
                }`}
              >
                {iconMap[cat.icon] || <Disc className="w-6 h-6" />}
              </div>
              <span className="text-xs font-bold leading-tight">
                {locale === 'zh-HK' ? cat.nameZh : cat.nameEn}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
