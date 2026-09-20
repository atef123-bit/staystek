import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    settings,
    navigate
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const freeShippingThreshold = settings.freeShippingThreshold || 350;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : (settings.standardShippingFee || 25);
  const finalTotal = Math.max(0, cartSubtotal - promoDiscount + (cart.length > 0 ? shippingFee : 0));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ATELIER10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      alert('Invalid promotional invitation code.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
            Shopping Bag
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-white">
            Your Order Selection ({cartCount})
          </h1>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs uppercase tracking-wider text-zinc-400 hover:text-rose-400 transition-colors self-start sm:self-auto"
          >
            Clear Entire Bag
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center border border-white/5 bg-white/[0.01] max-w-md mx-auto p-8">
          <h3 className="font-editorial text-2xl text-white mb-2">Your Shopping Bag is Empty</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            There are currently no garments or accessories selected. Explore our runway tailoring and Italian leathergoods to build your wardrobe.
          </p>
          <button
            onClick={() => navigate({ name: 'shop' })}
            className="px-8 py-3.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors"
          >
            Discover Creations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Cart Items (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 p-6 bg-[#0e0e11] border border-white/10 relative transition-all"
              >
                {/* Thumbnail */}
                <div 
                  className="w-full sm:w-28 aspect-[3/4] bg-black overflow-hidden shrink-0 cursor-pointer border border-white/5"
                  onClick={() => navigate({ name: 'product', productId: item.productId })}
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 
                        onClick={() => navigate({ name: 'product', productId: item.productId })}
                        className="text-sm sm:text-base text-white font-medium hover:underline cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove piece"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-2">
                      <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="text-white">{item.selectedColor.name}</span>
                      </div>
                      <span>•</span>
                      <span className="text-zinc-500 font-mono">Max Stock: {item.maxStock}</span>
                    </div>

                    <div className="text-sm font-medium text-white font-mono mt-3">
                      {settings.currencySymbol || '$'}{item.price.toLocaleString()} each
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center border border-white/20 bg-black/40">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-4 text-xs text-white font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button
                        disabled={item.quantity >= item.maxStock}
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block">Total</span>
                      <span className="font-mono text-base font-semibold text-white">
                        {settings.currencySymbol || '$'}{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* Value Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2.5 p-3 bg-white/5 border border-white/5">
                <Truck size={16} className="text-white shrink-0" />
                <span>Express courier tracking</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-white/5 border border-white/5">
                <RotateCcw size={16} className="text-white shrink-0" />
                <span>30-day doorstep returns</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-white/5 border border-white/5">
                <ShieldCheck size={16} className="text-white shrink-0" />
                <span>Atelier certificate included</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary (4 Columns) */}
          <div className="lg:col-span-4">
            <div className="p-6 bg-[#0e0e11] border border-white/10 sticky top-28 space-y-6">
              <h2 className="font-editorial text-2xl text-white">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Bag Subtotal</span>
                  <span className="font-mono text-white">
                    {settings.currencySymbol || '$'}{cartSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Carbon-Neutral Shipping</span>
                  <span className="font-mono text-white">
                    {isFreeShipping ? 'Complimentary' : `${settings.currencySymbol || '$'}${shippingFee}`}
                  </span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Code (10% Off)</span>
                    <span className="font-mono">-{settings.currencySymbol || '$'}{promoDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex justify-between text-base font-semibold text-white">
                  <span className="font-editorial text-lg">Total Due</span>
                  <span className="font-mono text-xl">
                    {settings.currencySymbol || '$'}{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo code field */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="VIP invitation code"
                  className="flex-1 bg-black/60 border border-white/15 px-3 py-2 text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-white/20 text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => navigate({ name: 'checkout' })}
                className="w-full py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3 shadow-xl"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight size={15} />
              </button>

              <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                Taxes and import duties are calculated transparently during the delivery review step.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
