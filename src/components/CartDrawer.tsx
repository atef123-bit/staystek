import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    settings,
    navigate
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 350;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e11] border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={18} className="text-white" />
              <h2 className="font-editorial text-2xl text-white tracking-wide">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close Bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#141418] px-6 py-3 border-b border-white/5">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider mb-1.5">
              <span className="text-zinc-400">
                {amountToFreeShipping === 0
                  ? 'Complimentary Express Delivery Unlocked'
                  : `Add ${settings.currencySymbol || '$'}${amountToFreeShipping.toLocaleString()} for Free Express Delivery`}
              </span>
              <span className="text-white font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-editorial text-2xl text-white mb-2">Your Bag is Empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Explore our newest architectural silhouettes and Italian leathergoods to begin.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate({ name: 'shop' });
                  }}
                  className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-white/5 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="w-20 aspect-[3/4] bg-zinc-900 overflow-hidden shrink-0 border border-white/10">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs text-white font-medium line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                        <span>Size: <strong className="text-zinc-300">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <span 
                            className="w-2 h-2 rounded-full border border-white/20 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="text-zinc-300">{item.selectedColor.name}</span>
                        </div>
                      </div>

                      <div className="text-xs text-white font-medium mt-1">
                        {settings.currencySymbol || '$'}{item.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-white/15 bg-black/40">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-xs text-white font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-xs text-zinc-300 font-medium">
                        Subtotal: <span className="text-white font-mono">{settings.currencySymbol || '$'}{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0a0a0c] space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="uppercase tracking-wider">Subtotal</span>
                <span className="text-sm text-white font-mono">
                  {settings.currencySymbol || '$'}{cartSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="uppercase tracking-wider">Shipping</span>
                <span className="text-xs text-zinc-300">
                  {amountToFreeShipping === 0 ? 'Complimentary' : 'Calculated at checkout'}
                </span>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-sm font-semibold text-white">
                <span className="uppercase tracking-widest font-editorial text-lg">Estimated Total</span>
                <span className="font-mono text-base">
                  {settings.currencySymbol || '$'}{cartSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="drawer-checkout-btn"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate({ name: 'checkout' });
                  }}
                  className="w-full py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  id="drawer-view-cart-btn"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate({ name: 'cart' });
                  }}
                  className="w-full py-2.5 border border-white/15 text-zinc-300 text-xs uppercase tracking-[0.15em] font-medium hover:text-white hover:border-white/40 transition-colors"
                >
                  View Complete Bag
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 pt-1">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Encrypted 256-bit checkout • Insured global delivery</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
