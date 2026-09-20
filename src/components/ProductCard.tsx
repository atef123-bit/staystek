import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    settings, 
    toggleFavorite, 
    isFavorite, 
    navigate, 
    openQuickView, 
    addToCart 
  } = useStore();

  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isFav = isFavorite(product.productId);
  const hasOldPrice = typeof product.oldPrice === 'number' && product.oldPrice > product.price;
  const hasDiscount = typeof product.discount === 'number' && product.discount > 0;
  const hasRating = typeof product.rating === 'number' && product.rating > 0;
  const isOutOfStock = product.stock <= 0;

  // Secondary image on hover if available
  const currentImg = isHovered && product.images?.length > 1 ? product.images[1] : (product.images?.[0] || '');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first size and first color
    const defaultSize = product.sizes?.[0] || 'Standard';
    const defaultColor = product.colors?.[0] || { name: 'Standard', hex: '#000000' };
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <div 
      id={`product-card-${product.productId}`}
      className="group flex flex-col relative transition-all duration-300 cursor-pointer"
      onClick={() => navigate({ name: 'product', productId: product.productId })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Luxury Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141417] border border-white/5 group-hover:border-white/20 transition-all duration-500">
        {currentImg ? (
          <img 
            src={currentImg}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs tracking-widest uppercase">
            Image Unavailable
          </div>
        )}

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges (Discount & Stock) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase shadow">
              -{product.discount}%
            </span>
          )}
          {product.newArrival && (
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-white border border-white/20 text-[9px] font-medium tracking-widest uppercase">
              New Season
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-rose-950/90 text-rose-200 border border-rose-800/40 text-[9px] font-semibold tracking-widest uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Top Right Actions (Wishlist) */}
        <button
          id={`fav-btn-${product.productId}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.productId);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFav 
              ? 'bg-white text-black' 
              : 'bg-black/50 text-white hover:bg-white hover:text-black border border-white/10'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={15} className={isFav ? 'fill-black' : ''} />
        </button>

        {/* Bottom Hover Action Bar */}
        <div className="absolute bottom-3 inset-x-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 py-2.5 bg-black/90 backdrop-blur-md hover:bg-black text-white text-[11px] uppercase tracking-widest font-medium border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye size={13} />
            <span>Quick View</span>
          </button>
          
          {!isOutOfStock && (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="p-2.5 bg-white text-black hover:bg-zinc-200 transition-colors"
              title="Add to Shopping Bag"
            >
              <ShoppingBag size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Product Details info below image */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
          <span className="uppercase tracking-[0.15em] truncate">
            {product.category}
          </span>
          {hasRating && (
            <div className="flex items-center gap-1 text-zinc-300 shrink-0 font-medium">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{product.rating?.toFixed(1)}</span>
              {typeof product.reviewsCount === 'number' && (
                <span className="text-zinc-400 text-[10px]">({product.reviewsCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm text-zinc-200 group-hover:text-white font-normal line-clamp-1 transition-colors">
          {product.name}
        </h3>

        {/* Price & Stock */}
        <div className="flex items-baseline justify-between mt-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-white tracking-wide">
              {settings.currencySymbol || '$'}{product.price.toLocaleString()}
            </span>
            {hasOldPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {settings.currencySymbol || '$'}{product.oldPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Low stock alert */}
          {!isOutOfStock && product.stock <= 5 && (
            <span className="text-[10px] text-amber-400/90 font-medium tracking-wider uppercase">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Color Swatch Dots if available */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.map((c, i) => (
              <span 
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-white/20"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
