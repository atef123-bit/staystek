import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const FavoritesPage: React.FC = () => {
  const { favorites, products, navigate, user } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.productId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
            Private Selection
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-white">
            Saved Wishlist ({favoriteProducts.length})
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            {user 
              ? 'Synchronized in real time with your private AMIS client profile in Firebase.' 
              : 'Items saved locally. Sign in to synchronize your wishlist across devices.'}
          </p>
        </div>

        {!user && (
          <button
            onClick={() => navigate({ name: 'login' })}
            className="px-4 py-2 border border-white/20 text-xs uppercase tracking-wider text-zinc-200 hover:text-white hover:border-white transition-colors self-start sm:self-auto"
          >
            Sign In to Sync
          </button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="py-24 text-center border border-white/5 bg-white/[0.01] max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mx-auto mb-4">
            <Heart size={26} />
          </div>
          <h3 className="font-editorial text-2xl text-white mb-2">Your Wishlist is Empty</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            Curate your personal collection of architectural tailoring and fine Italian leathergoods by selecting the heart icon on any piece.
          </p>
          <button
            onClick={() => navigate({ name: 'shop' })}
            className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors"
          >
            Discover Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
