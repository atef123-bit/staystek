import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star,
  ChevronDown,
  Sparkles,
  Share2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsPageProps {
  productId: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId }) => {
  const { 
    products, 
    settings, 
    addToCart, 
    toggleFavorite, 
    isFavorite, 
    navigate,
    showToast 
  } = useStore();

  const product = products.find((p) => p.productId === productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);

  // Initialize selected size and color when product changes
  useEffect(() => {
    if (product) {
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-editorial text-3xl text-white mb-3">Creations Archive Unavailable</h2>
        <p className="text-xs text-zinc-400 mb-6">
          The requested atelier product reference could not be located in our records.
        </p>
        <button
          onClick={() => navigate({ name: 'shop' })}
          className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isFav = isFavorite(product.productId);
  const isOutOfStock = product.stock <= 0;
  const hasOldPrice = typeof product.oldPrice === 'number' && product.oldPrice > product.price;

  const handleAddToCart = () => {
    if (!selectedColor) return;
    addToCart(product, selectedSize || 'Standard', selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedColor) return;
    const ok = addToCart(product, selectedSize || 'Standard', selectedColor, quantity);
    if (ok) {
      navigate({ name: 'checkout' });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Atelier link copied to clipboard.', 'info');
    }
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.productId !== product.productId && (p.category === product.category || p.categorySlug === product.categorySlug))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-widest mb-8">
        <button
          onClick={() => navigate({ name: 'shop' })}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Collection</span>
        </button>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-zinc-500">REF {product.productId.toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Product Image Gallery (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Stage */}
          <div className="relative aspect-[3/4] w-full bg-[#141418] border border-white/10 overflow-hidden">
            <img
              src={product.images?.[activeImageIndex] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />

            {product.discount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-xs font-bold tracking-widest uppercase shadow-xl">
                -{product.discount}% OFF
              </span>
            )}

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 hover:bg-white hover:text-black transition-all"
              title="Share Creation"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[3/4] overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-white opacity-100 ring-1 ring-white'
                      : 'border-white/10 opacity-40 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Buy Box & Editorial Details (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Title & Rating */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="uppercase tracking-[0.25em] font-semibold text-zinc-400">
                  {product.category}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 text-zinc-300 font-medium">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-zinc-500 text-[11px]">({product.reviewsCount || 0} reviews)</span>
                  </div>
                )}
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl text-white tracking-wide leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Stock Display */}
            <div className="flex items-baseline gap-4 py-2 border-y border-white/10">
              <span className="font-mono text-2xl sm:text-3xl text-white font-medium">
                {settings.currencySymbol || '$'}{product.price.toLocaleString()}
              </span>
              {hasOldPrice && (
                <span className="font-mono text-base text-zinc-400 line-through">
                  {settings.currencySymbol || '$'}{product.oldPrice?.toLocaleString()}
                </span>
              )}
              <div className="ml-auto">
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-rose-950/80 text-rose-300 border border-rose-800/50 text-xs uppercase tracking-wider font-semibold">
                    Sold Out
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">
                    Low Stock: {product.stock} units remaining
                  </span>
                ) : (
                  <span className="text-xs text-emerald-400 uppercase tracking-wider font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    In Stock • Ready to Ship
                  </span>
                )}
              </div>
            </div>

            {/* Editorial Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && selectedColor && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-zinc-400">
                    Atelier Shade: <strong className="text-white">{selectedColor.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                        selectedColor.name === c.name ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/40'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-full h-full rounded-full border border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-zinc-400">
                    Proportional Size: <strong className="text-white">{selectedSize}</strong>
                  </span>
                  <button 
                    onClick={() => navigate({ name: 'faq' })}
                    className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 text-[11px]"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-3 text-xs uppercase font-medium border text-center transition-all ${
                        selectedSize === s
                          ? 'bg-white text-black border-white shadow'
                          : 'bg-black/40 text-zinc-300 border-white/15 hover:border-white/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controller */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs uppercase tracking-wider text-zinc-400">
                Quantity
              </span>
              <div className="flex items-center border border-white/20 bg-black/40">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="px-4 text-xs text-white font-mono">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3.5 py-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add To Bag, Buy Now, Favorite */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-200 disabled:opacity-30 transition-colors flex items-center justify-center gap-2 shadow-2xl"
                >
                  <ShoppingBag size={15} />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}</span>
                </button>

                <button
                  onClick={() => toggleFavorite(product.productId)}
                  className={`p-4 border transition-colors ${
                    isFav
                      ? 'bg-rose-950/40 border-rose-700 text-rose-400'
                      : 'border-white/20 text-zinc-300 hover:text-white hover:border-white'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart size={18} className={isFav ? 'fill-rose-400' : ''} />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  id="buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-white/5 border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white/15 transition-colors"
                >
                  Proceed to Direct Checkout
                </button>
              )}
            </div>

            {/* Accordion: Specifications & Craftsmanship */}
            <div className="border-t border-white/10 pt-4 space-y-4 text-xs">
              <div className="border-b border-white/10 pb-3">
                <button
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full flex items-center justify-between text-white font-medium uppercase tracking-wider text-xs"
                >
                  <span>Atelier Specifications</span>
                  <ChevronDown size={15} className={`transition-transform duration-200 ${specsOpen ? 'rotate-180' : ''}`} />
                </button>

                {specsOpen && product.specifications && (
                  <dl className="mt-3 space-y-2 text-zinc-400 font-light">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-white/5">
                        <dt className="text-zinc-500 uppercase tracking-wider text-[11px]">{key}</dt>
                        <dd className="text-zinc-200 font-normal">{val}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              {/* Delivery & Returns Accordion */}
              <div className="border-b border-white/10 pb-3">
                <button
                  onClick={() => setShippingOpen(!shippingOpen)}
                  className="w-full flex items-center justify-between text-white font-medium uppercase tracking-wider text-xs"
                >
                  <span>Insured Shipping & Doorstep Returns</span>
                  <ChevronDown size={15} className={`transition-transform duration-200 ${shippingOpen ? 'rotate-180' : ''}`} />
                </button>

                {shippingOpen && (
                  <div className="mt-3 space-y-2 text-zinc-400 text-xs leading-relaxed">
                    <p>• Complimentary carbon-neutral express courier worldwide on orders over ${settings.freeShippingThreshold || 350}.</p>
                    <p>• Dispatched in signature AMIS bespoke matte packaging with certificate of authenticity.</p>
                    <p>• 30-day global return policy with complimentary doorstep courier collection.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Creations Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-editorial text-2xl sm:text-3xl text-white">
              Complementary Silhouette Ensemble
            </h2>
            <button
              onClick={() => navigate({ name: 'shop' })}
              className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white"
            >
              Browse All →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
