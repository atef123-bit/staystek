import React from 'react';
import { ArrowRight, Compass, Scissors, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4 border-b border-white/10 pb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono">
          MAISON HERITAGE & MANIFESTO
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl text-white font-normal leading-tight">
          Purity of Line, Untreated Materiality.
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
          Founded in Florence, AMIS ATELIER was born from a singular architectural rejection of disposable fast-fashion and ephemeral trends. We treat clothing not as decoration, but as inhabited sculpture.
        </p>
      </div>

      {/* Large Visual Feature */}
      <div className="relative aspect-[16/9] w-full bg-zinc-900 border border-white/10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=85"
          alt="Atelier workshop"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 max-w-lg text-white">
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 block mb-1">
            FLORENCE WORKSHOP • 01
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-light">
            Biella Wool & Tuscan Tanning
          </h3>
        </div>
      </div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        <div className="p-8 bg-[#0e0e11] border border-white/10 space-y-3">
          <div className="p-3 bg-white/5 border border-white/10 w-fit text-white mb-2">
            <Compass size={20} />
          </div>
          <h3 className="font-editorial text-xl text-white">Architectural Proportions</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every shoulder slope, lapel notch, and trouser break is drafted mathematically on heritage wooden dress forms to drape cleanly in motion.
          </p>
        </div>

        <div className="p-8 bg-[#0e0e11] border border-white/10 space-y-3">
          <div className="p-3 bg-white/5 border border-white/10 w-fit text-white mb-2">
            <Scissors size={20} />
          </div>
          <h3 className="font-editorial text-xl text-white">Heritage Mills Only</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            We partner exclusively with century-old family mills in Northern Italy and selvedge specialists in Kojima, Japan.
          </p>
        </div>

        <div className="p-8 bg-[#0e0e11] border border-white/10 space-y-3">
          <div className="p-3 bg-white/5 border border-white/10 w-fit text-white mb-2">
            <Shield size={20} />
          </div>
          <h3 className="font-editorial text-xl text-white">Guaranteed Permanence</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Designed to age with graceful patina. We provide lifetime care guidance and complimentary button & stitch restoration.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 border-t border-white/10">
        <h2 className="font-editorial text-3xl text-white mb-4">
          Experience The Silhouette
        </h2>
        <button
          onClick={() => navigate({ name: 'shop' })}
          className="px-8 py-3.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
        >
          <span>Discover The Collection</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
