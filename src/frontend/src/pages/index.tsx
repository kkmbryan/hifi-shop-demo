import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { Header } from '../components/Header';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductCard } from '../components/ProductCard';
import { SynergyWarning } from '../components/SynergyWarning';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../context/CartContext';
import { Product, Category, adaptProduct, adaptCategory } from '../data/products';
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Search,
  X,
  ShoppingBag,
  ShieldCheck,
  Loader2,
  Zap
} from 'lucide-react';

export type SearchEngineMode = 'hybrid' | 'fts';

interface HomePageProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function HomePage({ initialProducts, categories }: HomePageProps) {
  const router = useRouter();
  const { locale, t } = useLocale();
  const { addToCart, formatHkd } = useCart();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchEngineMode>('hybrid');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxBudget, setMaxBudget] = useState<number>(120000);
  const [selectedInterface, setSelectedInterface] = useState<string | null>(null);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync initial and dynamic URL query params `q` and `mode` into state
  useEffect(() => {
    if (router.isReady) {
      if (typeof router.query.q === 'string') {
        if (router.query.q !== searchQuery) {
          setSearchQuery(router.query.q);
        }
      }
      if (
        typeof router.query.mode === 'string' &&
        (router.query.mode === 'hybrid' || router.query.mode === 'fts')
      ) {
        if (router.query.mode !== searchMode) {
          setSearchMode(router.query.mode as SearchEngineMode);
        }
      }
    }
  }, [router.isReady, router.query.q, router.query.mode]);

  // Handler for user search input changes, updating searchQuery state and URL query parameters
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (router.isReady) {
        const newQuery: Record<string, any> = { ...router.query };
        if (query.trim()) {
          newQuery.q = query;
        } else {
          delete newQuery.q;
        }
        if (searchMode) {
          newQuery.mode = searchMode;
        }
        router.replace(
          {
            pathname: router.pathname,
            query: newQuery,
          },
          undefined,
          { shallow: true }
        );
      }
    },
    [router, searchMode]
  );

  // Handler for switching search engine mode ('hybrid' vs 'fts')
  const handleModeChange = useCallback(
    (newMode: SearchEngineMode) => {
      setSearchMode(newMode);
      if (router.isReady) {
        const newQuery = {
          ...router.query,
          mode: newMode,
        };
        router.replace(
          {
            pathname: router.pathname,
            query: newQuery,
          },
          undefined,
          { shallow: true }
        );
      }
    },
    [router]
  );

  // Available interface filter options
  const INTERFACE_OPTIONS = ['I2S', 'XLR', 'RCA', 'USB', 'Vacuum Tube 膽機'];

  // Preset acoustic search queries
  const PRESET_QUERIES = [
    '溫暖人聲 解碼器 3萬以下',
    'ultra-low jitter transport',
    '300B 膽機 溫暖聲場',
    'R-2R 精密電阻解碼器',
    'I2S 網絡串流播放器'
  ];

  // Live fetch search handler querying Backend API /api/v1/search (Cloud Spanner BM25 + Vector KNN)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const controller = new AbortController();

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.BACKEND_API_URL ||
      (typeof window !== 'undefined' && window.location.port === '3000' ? 'http://localhost:8080' : '');

    const params = new URLSearchParams({
      q: trimmed,
      mode: searchMode,
      limit: '100',
      lang: locale || 'en-US',
      max_price: String(maxBudget)
    });
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }

    const searchUrl = `${apiBaseUrl}/api/v1/search?${params.toString()}`;

    fetch(searchUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Search request failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const rawProducts = data?.data?.products || data?.products || [];
        const adapted = rawProducts.map(adaptProduct);
        setSearchResults(adapted);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error calling Spanner search API:', err);
          setSearchResults([]);
        }
      })
      .finally(() => {
        setIsSearching(false);
      });

    return () => controller.abort();
  }, [searchQuery, searchMode, selectedCategory, maxBudget, locale]);

  // Dynamic Product Filtering (combining Backend Search Results & Multi-Faceted UI Filters)
  const filteredProducts = useMemo(() => {
    let list = searchQuery.trim() && searchResults !== null ? [...searchResults] : [...initialProducts];

    // 1. Category Filter
    if (selectedCategory) {
      list = list.filter((p) => p.categoryId === selectedCategory || p.category_id === selectedCategory);
    }

    // 2. Max Budget Filter (Strictly HKD $)
    list = list.filter((p) => p.priceHkd <= maxBudget);

    // 3. Interface / Spec Tag Filter
    if (selectedInterface) {
      if (selectedInterface === 'Vacuum Tube 膽機') {
        list = list.filter((p) => p.isTube || p.tags.some((t) => t.includes('Tube') || t.includes('膽機')));
      } else {
        list = list.filter((p) => p.interfaces.includes(selectedInterface) || p.tags.includes(selectedInterface));
      }
    }

    return list;
  }, [initialProducts, searchResults, searchQuery, selectedCategory, maxBudget, selectedInterface]);

  // Memoized category object lookup for selected category badge
  const selectedCategoryObj = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find((c) => c.id === selectedCategory || c.category_id === selectedCategory) || null;
  }, [categories, selectedCategory]);

  const resetFilters = useCallback(() => {
    handleSearchChange('');
    setSelectedCategory(null);
    setMaxBudget(120000);
    setSelectedInterface(null);
  }, [handleSearchChange]);

  return (
    <>
      <Head>
        <title>{t('siteTitle')}</title>
        <meta
          name="description"
          content="Premium Hi-Fi E-Commerce Platform inspired by Pro Audio featuring Cloud Spanner Hybrid Search in HKD currency."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        {/* Sticky Header with Search & Cart */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onOpenFilters={() => setShowMobileFilters(!showMobileFilters)}
        />

        {/* Main Hero & Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Hybrid Search Tech Banner */}
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0">
                {searchMode === 'hybrid' ? (
                  <Sparkles className="w-6 h-6 animate-pulse" />
                ) : (
                  <Search className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>
                      {searchMode === 'hybrid'
                        ? locale === 'zh-HK'
                          ? 'Google Cloud Spanner 雙引擎混合搜尋'
                          : 'Google Cloud Spanner Dual-Engine Hybrid Search'
                        : locale === 'zh-HK'
                          ? 'Google Cloud Spanner 3-Tier 加權全文搜尋'
                          : 'Google Cloud Spanner 3-Tier Weighted BM25 Search'}
                    </span>
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border bg-amber-500/10 text-amber-300 border-amber-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>
                      {searchMode === 'hybrid'
                        ? 'BM25 + 768d Vector KNN (Reciprocal Rank Fusion)'
                        : 'Cloud Spanner 3-Tier Weighted BM25 (No Vector Embeddings)'}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {searchMode === 'hybrid'
                    ? locale === 'zh-HK'
                      ? '支援硬體精確規格 (I2S, XLR, R-2R) 與發燒聲學感官詞彙 ("溫暖膽味", "廣闊音場", "高分析力") 語義檢索'
                      : 'Combines exact keyword SKU filtering with 768-dimensional dense vector embeddings for subjective acoustic profile search.'
                    : locale === 'zh-HK'
                      ? '基於 Spanner 原生 Tokenlist 分詞索引與 N-gram 加權計分 (TOKENIZE_FULLTEXT & TOKENIZE_NGRAMS)，快速精確比對品牌與型號'
                      : 'Strict BM25 lexical token matching across SKU brands, models, and specifications without vector embeddings.'}
                </p>
              </div>
            </div>

            {/* Segmented Mode Controls & Currency Badge */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              {/* Interactive Segmented Mode Toggle */}
              <div
                role="group"
                aria-label="Search Engine Mode"
                className="inline-flex p-1 rounded-xl bg-slate-950/80 border border-slate-700/80 shadow-inner"
              >
                <button
                  type="button"
                  onClick={() => handleModeChange('hybrid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    searchMode === 'hybrid'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  aria-pressed={searchMode === 'hybrid'}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{locale === 'zh-HK' ? '⚡ 雙引擎混合搜尋 (Hybrid RRF)' : '⚡ Hybrid RRF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('fts')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    searchMode === 'fts'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  aria-pressed={searchMode === 'fts'}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{locale === 'zh-HK' ? '🔍 純全文搜尋 (Pure FTS)' : '🔍 Pure FTS'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-amber-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict HKD Currency ($)</span>
              </div>
            </div>
          </div>

          {/* 8 Core Audio Category Selector */}
          <CategoryGrid
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Real-Time Component Synergy Banner */}
          <SynergyWarning />

          {/* Two-Column Layout: Sidebar Filters + Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside
              className={`md:block space-y-6 ${
                showMobileFilters ? 'block bg-slate-900 p-4 rounded-xl border border-slate-800' : 'hidden'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span>{locale === 'zh-HK' ? '發燒多維度篩選器' : 'Faceted Hardware Filters'}</span>
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('resetFilters')}</span>
                </button>
              </div>

              {/* Search Engine Mode Selector in Sidebar */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{locale === 'zh-HK' ? '搜尋引擎運算模式' : 'Search Engine Mode'}</span>
                  </label>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                    {searchMode.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleModeChange('hybrid')}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col gap-1 ${
                      searchMode === 'hybrid'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-100">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{locale === 'zh-HK' ? '雙引擎混合搜尋 (Hybrid RRF)' : 'Hybrid Search (RRF)'}</span>
                      </span>
                      {searchMode === 'hybrid' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal leading-tight">
                      {locale === 'zh-HK'
                        ? 'BM25 全文分詞 + 768 維向量語義 (KNN) 倒數排名融合'
                        : 'BM25 + 768d Vector Embeddings (RRF ranking)'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeChange('fts')}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col gap-1 ${
                      searchMode === 'fts'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-100">
                        <Search className="w-3.5 h-3.5 text-amber-400" />
                        <span>{locale === 'zh-HK' ? '純全文搜尋 (Pure FTS)' : 'Pure Full-Text (FTS)'}</span>
                      </span>
                      {searchMode === 'fts' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal leading-tight">
                      {locale === 'zh-HK'
                        ? 'Cloud Spanner 3-Tier 加權 BM25 (不調用向量模型)'
                        : 'Cloud Spanner 3-Tier Weighted BM25 (Lexical only)'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Budget Range Filter (HKD $) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-300">{t('filterByBudget')}</span>
                  <span className="text-amber-400 font-bold">{formatHkd(maxBudget)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="120000"
                  step="2000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>$2,000 HKD</span>
                  <span>$120,000 HKD</span>
                </div>
              </div>

              {/* Interface & Spec Tags */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  {t('filterByInterface')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {INTERFACE_OPTIONS.map((opt) => {
                    const isSelected = selectedInterface === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setSelectedInterface(isSelected ? null : opt)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sample Acoustic Queries Helper Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" />
                  <span>{locale === 'zh-HK' ? '經典發燒語義搜尋關鍵字' : 'Acoustic Vector Preset Queries'}</span>
                </span>
                <div className="space-y-1.5">
                  {PRESET_QUERIES.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSearchChange(preset)}
                      className="w-full text-left text-xs text-slate-400 hover:text-amber-300 truncate transition-colors block py-0.5"
                    >
                      • "{preset}"
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-medium text-slate-400">
                  {t('resultsCount', { count: filteredProducts.length })}
                </span>
                {selectedCategoryObj && (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                    {locale === 'zh-HK' ? selectedCategoryObj.nameZh : selectedCategoryObj.nameEn}
                  </span>
                )}
              </div>

              {isSearching ? (
                <div className="p-12 text-center bg-slate-900/50 rounded-xl border border-slate-800 space-y-3 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  <p className="text-slate-400 text-sm">
                    {searchMode === 'fts'
                      ? locale === 'zh-HK'
                        ? '正在查詢 Cloud Spanner 3-Tier 加權全文搜尋 (BM25)...'
                        : 'Querying Cloud Spanner 3-Tier Weighted Full-Text Search (BM25)...'
                      : locale === 'zh-HK'
                        ? '正在查詢 Cloud Spanner 雙引擎混合搜尋 (BM25 + 768d Vector KNN)...'
                        : 'Querying Cloud Spanner Hybrid Search (BM25 + 768d Vector KNN)...'}
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                  <Search className="w-10 h-10 text-slate-600 mx-auto stroke-1" />
                  <p className="text-slate-400 text-sm">{t('noProductsFound')}</p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 transition-colors"
                  >
                    {t('resetFilters')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((prod, index) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      priority={index < 6}
                      onSelectProduct={(p) => setSelectedProductModal(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Product Hardware Detail Modal */}
        {selectedProductModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedProductModal(null)}
                className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-48 h-48 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={selectedProductModal.imageUrl}
                    alt={selectedProductModal.nameEn}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 flex-1">
                  <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    {selectedProductModal.brand}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {locale === 'zh-HK' ? selectedProductModal.nameZh : selectedProductModal.nameEn}
                  </h3>
                  <p className="text-xl font-black text-amber-400">
                    {formatHkd(selectedProductModal.priceHkd)}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {locale === 'zh-HK' ? selectedProductModal.descriptionZh : selectedProductModal.descriptionEn}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Search className="w-4 h-4" />
                  <span>{t('acousticSignature')}</span>
                </h4>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{locale === 'zh-HK' ? selectedProductModal.acousticSignatureZh : selectedProductModal.acousticSignatureEn}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex flex-wrap gap-1.5">
                  {selectedProductModal.interfaces.map((i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {i}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedProductModal);
                    setSelectedProductModal(null);
                  }}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('addToCart')} ({formatHkd(selectedProductModal.priceHkd)})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';

  try {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${apiBaseUrl}/api/v1/categories`),
      fetch(`${apiBaseUrl}/api/v1/products?limit=100`)
    ]);

    let categories: Category[] = [];
    if (categoriesRes.ok) {
      const catData = await categoriesRes.json();
      const rawCategories = catData?.data?.categories || catData?.categories || [];
      categories = rawCategories.map(adaptCategory);
    }

    let initialProducts: Product[] = [];
    if (productsRes.ok) {
      const prodData = await productsRes.json();
      const rawProducts = prodData?.data?.products || prodData?.products || [];
      initialProducts = rawProducts.map(adaptProduct);
    }

    return {
      props: {
        initialProducts,
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching catalog in getServerSideProps:', error);
    return {
      props: {
        initialProducts: [],
        categories: [],
      },
    };
  }
};
