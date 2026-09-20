import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from '../components/ProductGrid';

interface CategoryProductsPageProps {
  categoryId: string;
}

export const CategoryProductsPage: React.FC<CategoryProductsPageProps> = ({ categoryId }) => {
  const { categories, products, navigate, dataLoading } = useStore();

  const category = categories.find(
    (c) => c.categoryId === categoryId || c.slug === categoryId
  );

  const categoryProducts = products.filter((p) => {
    if (!p.isActive) return false;
    const catSlug = p.categorySlug || p.category.toLowerCase().replace(/\s+/g, '-');
    return catSlug === categoryId || p.category === categoryId || p.category === category?.name;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate({ name: 'categories' })}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Return to All Categories</span>
      </button>

      {/* Category Hero / Banner */}
      <div className="relative overflow-hidden bg-black border border-white/10 p-8 sm:p-12 mb-12">
        {category?.image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover object-center opacity-30 blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 block mb-2">
            DISCIPLINE NO. {category?.sortOrder || 1}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-white mb-3">
            {category?.name || categoryId}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            {category?.description || 'Curated luxury designs conforming to rigorous atelier tailoring.'}
          </p>
          <div className="mt-4 text-[11px] font-mono text-zinc-400">
            {categoryProducts.length} CREATIONS IN DISCIPLINE
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid 
        products={categoryProducts} 
        loading={dataLoading}
        emptyMessage={`No creations found in the ${category?.name || categoryId} discipline at this moment.`}
        onResetFilters={() => navigate({ name: 'shop' })}
      />
    </div>
  );
};
