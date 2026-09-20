import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Search, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from '../components/ProductGrid';

interface ShopPageProps {
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory }) => {
  const { products, categories, settings, dataLoading } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.isActive) return false;

      // Category match
      if (selectedCategory !== 'all') {
        const catSlug = product.categorySlug || product.category.toLowerCase().replace(/\s+/g, '-');
        if (catSlug !== selectedCategory && product.category !== selectedCategory) {
          return false;
        }
      }

      // In stock match
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Max price match
      if (product.price > maxPrice) {
        return false;
      }

      // Text search match
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase().trim();
        const inName = product.name.toLowerCase().includes(query);
        const inDesc = product.description.toLowerCase().includes(query);
        const inTags = product.tags?.some(t => t.toLowerCase().includes(query)) || false;
        const inCat = product.category.toLowerCase().includes(query);
        if (!inName && !inDesc && !inTags && !inCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return 0;
    });
  }, [products, selectedCategory, inStockOnly, maxPrice, searchFilter, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSortBy('newest');
    setInStockOnly(false);
    setMaxPrice(3000);
    setSearchFilter('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-8">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
          Atelier Catalog
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-editorial text-4xl sm:text-5xl text-white">
              {selectedCategory === 'all' 
                ? 'Complete Collection' 
                : categories.find(c => c.categoryId === selectedCategory)?.name || 'Filtered Selection'}
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Showing {filteredProducts.length} precision crafted pieces
            </p>
          </div>

          {/* Quick Filter & Sort bar for desktop */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2.5 bg-white/5 border border-white/15 text-xs text-white uppercase tracking-wider flex items-center gap-2"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/15 px-3 py-2 text-xs text-zinc-300">
              <ArrowUpDown size={14} className="text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white text-xs uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-zinc-900 text-white">Newest Arrivals</option>
                <option value="price-asc" className="bg-zinc-900 text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-zinc-900 text-white">Price: High to Low</option>
                <option value="popular" className="bg-zinc-900 text-white">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-8 bg-[#0e0e11] lg:bg-transparent p-6 lg:p-0 border lg:border-0 border-white/10`}>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 lg:hidden">
            <h3 className="font-editorial text-xl text-white">Filters</h3>
            <button onClick={() => setMobileFilterOpen(false)} className="text-zinc-400">
              <X size={18} />
            </button>
          </div>

          {/* Filter Search */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
              Search Within Shop
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full bg-black/40 border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
              Disciplines
            </label>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between ${
                  selectedCategory === 'all' ? 'bg-white text-black font-semibold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>All Disciplines</span>
                <span className="font-mono text-[11px]">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.categoryId || p.categorySlug === cat.slug).length;
                return (
                  <button
                    key={cat.categoryId}
                    onClick={() => setSelectedCategory(cat.categoryId)}
                    className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between ${
                      selectedCategory === cat.categoryId ? 'bg-white text-black font-semibold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="font-mono text-[11px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
              <span>Price Ceiling</span>
              <span className="text-white font-mono">{settings.currencySymbol || '$'}{maxPrice}</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-white cursor-pointer bg-white/10"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
              <span>$200</span>
              <span>$3,000+</span>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
              Stock Availability
            </label>
            <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-black accent-white"
              />
              <span>In Stock Only (Ready for Dispatch)</span>
            </label>
          </div>

          {/* Reset button */}
          <button
            onClick={resetAllFilters}
            className="w-full py-2.5 border border-white/15 text-xs uppercase tracking-widest text-zinc-300 hover:text-white hover:border-white transition-colors"
          >
            Reset Filters
          </button>
        </aside>

        {/* Main Product Grid */}
        <main className="lg:col-span-3">
          <ProductGrid 
            products={filteredProducts} 
            loading={dataLoading}
            emptyMessage="No creations match your current filters. Adjust your price ceiling or category selection."
            onResetFilters={resetAllFilters}
          />
        </main>
      </div>
    </div>
  );
};
