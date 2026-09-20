import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowRight, PackageOpen } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

interface SearchPageProps {
  initialQuery?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '' }) => {
  const { products, navigate, dataLoading } = useStore();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  // Clean and normalize query
  const normalizedQuery = searchTerm.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return products.filter((p) => {
      if (!p.isActive) return false;

      // Category filter within search
      if (activeCategoryFilter !== 'all') {
        const catSlug = p.categorySlug || p.category.toLowerCase().replace(/\s+/g, '-');
        if (catSlug !== activeCategoryFilter && p.category !== activeCategoryFilter) {
          return false;
        }
      }

      // 1. Search in Name
      const matchName = p.name.toLowerCase().includes(normalizedQuery);
      // 2. Search in Category
      const matchCat = p.category.toLowerCase().includes(normalizedQuery);
      // 3. Search in Tags
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(normalizedQuery)) || false;
      // 4. Search in Description
      const matchDesc = p.description.toLowerCase().includes(normalizedQuery) || 
                        (p.shortDescription?.toLowerCase().includes(normalizedQuery) || false);

      return matchName || matchCat || matchTags || matchDesc;
    });
  }, [products, normalizedQuery, activeCategoryFilter]);

  // Available categories in search results
  const resultCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.category.toLowerCase().includes(normalizedQuery) ||
        p.tags?.some((t) => t.toLowerCase().includes(normalizedQuery))
      ) {
        cats.add(p.category);
      }
    });
    return Array.from(cats);
  }, [products, normalizedQuery]);

  const handleClear = () => {
    setSearchTerm('');
    setActiveCategoryFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Bar Header */}
      <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono">
          Maison Search Archive
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-white font-normal">
          Search the Collection
        </h1>

        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4 text-zinc-400" />
          <input
            type="text"
            id="main-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by silhouette, cloth, jacket, leather, cashmere, boots..."
            className="w-full bg-[#121216] border border-white/15 pl-12 pr-12 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all shadow-xl"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400 pt-1">
          <span className="text-zinc-500">Suggested:</span>
          {['Cashmere', 'Calfskin', 'Blazer', 'Dress', 'Boots', 'Silver', 'Trousers'].map((kw) => (
            <button
              key={kw}
              onClick={() => setSearchTerm(kw)}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 rounded-full transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Results Status */}
      {dataLoading ? (
        <div className="py-20 text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-widest animate-pulse">
            Querying Firebase Realtime Catalog...
          </p>
        </div>
      ) : !normalizedQuery ? (
        <div className="py-20 text-center border border-white/5 bg-white/[0.01]">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Enter a keyword to explore the archive.
          </p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="py-20 text-center border border-white/5 bg-white/[0.01] max-w-xl mx-auto p-8">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mx-auto mb-4">
            <PackageOpen size={24} />
          </div>
          <h3 className="font-editorial text-2xl text-white mb-2">No Matching Creations</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            We could not find any garments or accessories matching "{searchTerm}". Please check for typographic variations or explore our full collection.
          </p>
          <button
            onClick={() => navigate({ name: 'shop' })}
            className="px-6 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200"
          >
            Explore Complete Catalog
          </button>
        </div>
      ) : (
        <div>
          {/* Filter Bar by Category */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 mb-8 gap-4">
            <div className="text-xs text-zinc-400">
              Found <strong className="text-white font-mono">{searchResults.length}</strong> creations matching "{searchTerm}"
            </div>

            {resultCategories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                    activeCategoryFilter === 'all' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({searchResults.length})
                </button>
                {resultCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategoryFilter(c)}
                    className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                      activeCategoryFilter === c ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {searchResults.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
