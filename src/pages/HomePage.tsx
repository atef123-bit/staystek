import React from 'react';
import { ArrowRight, ArrowUpRight, Sparkles, Compass } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { content, categories, products, navigate } = useStore();

  const featuredProducts = products.filter(p => p.featured && p.isActive).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival && p.isActive).slice(0, 4);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION - 100% Dynamic from Firebase RTDB */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Editorial Images */}
        <div className="absolute inset-0 z-0">
          <img 
            src={content.homepage?.heroImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85'} 
            alt="Hero Campaign"
            className="w-full h-full object-cover object-center opacity-60 scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-black/40 to-black/60" />
        </div>

        {/* Hero Copy & CTA */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] text-zinc-300 uppercase mb-4 animate-fade-in">
            {content.homepage?.heroSubtitle || 'AUTUMN / WINTER 2026 COLLECTION'}
          </span>

          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal tracking-tight max-w-4xl leading-[1.05] mb-6">
            {content.homepage?.heroTitle || 'ARCHITECTURAL MINIMALISM'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl font-light leading-relaxed mb-10 tracking-wide">
            {content.homepage?.heroDescription || 'Rigorous sculptural tailoring, pure monolithic silhouettes, and untreated Italian cashmere engineered for modern elegance.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              id="hero-cta-btn"
              onClick={() => navigate({ name: 'shop' })}
              className="px-8 sm:px-10 py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-200 transition-all duration-300 flex items-center gap-3 shadow-2xl"
            >
              <span>{content.homepage?.heroButtonText || 'DISCOVER COLLECTION'}</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => navigate({ name: 'categories' })}
              className="px-8 py-4 border border-white/25 backdrop-blur-md text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              Explore Disciplines
            </button>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-6 inset-x-0 flex justify-between px-8 text-[10px] text-zinc-400 tracking-[0.25em] uppercase font-mono hidden md:flex">
          <span>AMIS ATELIER • DISPATCH NO. 024</span>
          <span>FLORENCE / TOKYO / NEW YORK</span>
        </div>
      </section>

      {/* 2. CATEGORIES PREVIEW BENTO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-semibold block mb-1">
              Architectural Categories
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white">
              Sartorial Disciplines
            </h2>
          </div>
          <button
            onClick={() => navigate({ name: 'categories' })}
            className="text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((category, idx) => (
            <div
              key={category.categoryId}
              onClick={() => navigate({ name: 'category', categoryId: category.categoryId })}
              className={`group relative overflow-hidden bg-zinc-900 border border-white/10 cursor-pointer aspect-[4/5] ${
                idx === 0 ? 'lg:aspect-auto lg:row-span-1' : ''
              }`}
            >
              <img 
                src={category.image} 
                alt={category.name}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end">
                <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-mono mb-1">
                  COLLECTION 0{idx + 1}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 mb-4 leading-relaxed font-light">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white font-medium group-hover:translate-x-1 transition-transform">
                  <span>Explore Catalog</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED / FEATURED SELECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-semibold block mb-1">
              Curated By Concierge
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white">
              {content.homepage?.featuredTitle || 'CURATED SELECTION'}
            </h2>
          </div>
          <button
            onClick={() => navigate({ name: 'shop' })}
            className="text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>View Full Atelier Archive</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL BRAND STATEMENT */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#09090b] border-y border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono">
            PHILOSOPHY & PURITY
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl text-white font-normal leading-tight">
            "Stripped of superfluous ornament, the true silhouette of luxury emerges in uncompromised geometry."
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
            Every garment begins with raw, unadulterated natural fibers woven on heritage shuttle looms across Biella and Okayama. Zero seasonal obsolescence.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate({ name: 'about' })}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white border-b border-white pb-1 hover:text-zinc-300 transition-colors"
            >
              <span>Read The Maison Monograph</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-semibold block mb-1">
              Fresh Acquisitions
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white">
              {content.homepage?.newArrivalsTitle || 'NEW ACQUISITIONS'}
            </h2>
          </div>
          <button
            onClick={() => navigate({ name: 'shop' })}
            className="text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.map(product => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
