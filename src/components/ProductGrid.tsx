import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  emptyMessage = "No pieces matching your criteria were found in our atelier archives.",
  onResetFilters
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col space-y-3">
            <div className="aspect-[3/4] bg-white/5 rounded-none" />
            <div className="h-3 bg-white/5 w-1/3" />
            <div className="h-4 bg-white/10 w-4/5" />
            <div className="h-3 bg-white/5 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[350px] w-full flex flex-col items-center justify-center text-center p-8 border border-white/5 bg-white/[0.02]">
        <div className="p-4 rounded-full bg-white/5 border border-white/10 text-zinc-500 mb-4">
          <PackageOpen size={32} />
        </div>
        <h3 className="font-editorial text-2xl text-white mb-2">No Creations Found</h3>
        <p className="text-xs text-zinc-400 max-w-md leading-relaxed mb-6">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};
