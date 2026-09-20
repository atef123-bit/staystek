import React, { useState } from 'react';
import { X, Heart, Plus, Minus, Check, ArrowRight, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    closeQuickView, 
    settings, 
    addToCart, 
    toggleFavorite, 
    isFavorite,
    navigate 
  } = useStore();

  if (!quickViewProduct) return null;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(quickViewProduct.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(quickViewProduct.colors?.[0] || { name: 'Noir', hex: '#000000' });
  const [qty, setQty] = useState(1);

  const isFav = isFavorite(quickViewProduct.productId);
  const isOutOfStock = quickViewProduct.stock <= 0;

  const handleAddToCart = () => {
    const ok = addToCart(quickViewProduct, selectedSize, selectedColor, qty);
    if (ok) closeQuickView();
  };

  const handleBuyNow = () => {
    const ok = addToCart(quickViewProduct, selectedSize, selectedColor, qty);
    if (ok) {
      closeQuickView();
      navigate({ name: 'checkout' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={closeQuickView}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#101014] border border-white/10 shadow-2xl rounded-none overflow-hidden my-8 z-10">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-black/40 backdrop-blur rounded-full z-20 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Gallery Left */}
          <div className="bg-[#0b0b0d] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50 border border-white/5">
              <img 
                src={quickViewProduct.images?.[selectedImgIndex] || quickViewProduct.images?.[0]} 
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnails */}
            {quickViewProduct.images && quickViewProduct.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImgIndex(i)}
                    className={`w-14 aspect-[3/4] shrink-0 border overflow-hidden transition-all ${
                      selectedImgIndex === i ? 'border-white opacity-100' : 'border-white/10 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Right */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-[0.2em]">
                <span>{quickViewProduct.category}</span>
                <span className="font-mono">REF. {quickViewProduct.productId.toUpperCase()}</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl text-white tracking-wide leading-snug">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="text-xl font-medium text-white font-mono">
                  {settings.currencySymbol || '$'}{quickViewProduct.price.toLocaleString()}
                </span>
                {quickViewProduct.oldPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    {settings.currencySymbol || '$'}{quickViewProduct.oldPrice.toLocaleString()}
                  </span>
                )}
                {quickViewProduct.discount && (
                  <span className="text-[11px] px-2 py-0.5 bg-white text-black font-bold uppercase tracking-wider">
                    -{quickViewProduct.discount}%
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                {quickViewProduct.shortDescription || quickViewProduct.description}
              </p>

              {/* Color Selection */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="pt-2">
                  <span className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                    Color: <strong className="text-white">{selectedColor.name}</strong>
                  </span>
                  <div className="flex items-center gap-2.5">
                    {quickViewProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                          selectedColor.name === color.name ? 'border-white scale-110' : 'border-transparent hover:border-white/40'
                        }`}
                        title={color.name}
                      >
                        <span 
                          className="w-full h-full rounded-full border border-white/20"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="pt-2">
                  <span className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                    Select Size: <strong className="text-white">{selectedSize}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs uppercase font-medium border transition-all ${
                          selectedSize === size
                            ? 'bg-white text-black border-white'
                            : 'bg-black/40 text-zinc-300 border-white/15 hover:border-white/40'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400">
                  Quantity ({quickViewProduct.stock > 0 ? `${quickViewProduct.stock} Available` : 'Sold out'})
                </span>
                <div className="flex items-center border border-white/20 bg-black/40">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="px-3 text-xs text-white font-mono">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(quickViewProduct.stock, qty + 1))}
                    disabled={qty >= quickViewProduct.stock}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-2.5">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-zinc-200 disabled:opacity-30 transition-colors"
                >
                  {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                </button>
                
                <button
                  onClick={() => toggleFavorite(quickViewProduct.productId)}
                  className={`p-3.5 border transition-colors ${
                    isFav 
                      ? 'bg-rose-950/40 border-rose-700 text-rose-400' 
                      : 'border-white/20 text-zinc-300 hover:text-white hover:border-white'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart size={16} className={isFav ? 'fill-rose-400' : ''} />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-[#1c1c22] border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 transition-colors"
                >
                  Instant Checkout
                </button>
              )}

              <button
                onClick={() => {
                  closeQuickView();
                  navigate({ name: 'product', productId: quickViewProduct.productId });
                }}
                className="w-full text-center text-xs text-zinc-400 hover:text-white underline underline-offset-4 pt-1 transition-colors"
              >
                View Full Specifications & Story →
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
