import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products, navigate } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-8 mb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
          Directory & Disciplines
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl text-white">
          Sartorial Categories
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-xl leading-relaxed">
          Each discipline is defined by specific artisan techniques, heritage mills, and architectural proportions.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="py-20 text-center border border-white/5">
          <p className="text-zinc-500 text-xs tracking-wider uppercase">
            No categories currently active in Firebase Realtime Database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const count = products.filter(
              p => p.category === category.categoryId || p.categorySlug === category.slug
            ).length;

            return (
              <div
                key={category.categoryId}
                id={`category-card-${category.categoryId}`}
                onClick={() => navigate({ name: 'category', categoryId: category.categoryId })}
                className="group relative overflow-hidden bg-zinc-900 border border-white/10 cursor-pointer aspect-[4/5] flex flex-col justify-end p-8 transition-all"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-75 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 tracking-widest uppercase">
                    <span>{count} CREATIONS</span>
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">EXPLORE →</span>
                  </div>

                  <h3 className="font-editorial text-3xl text-white">
                    {category.name}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed font-light line-clamp-2">
                    {category.description}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white border-b border-white pb-0.5 group-hover:border-zinc-400 transition-colors">
                      Browse Category
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
