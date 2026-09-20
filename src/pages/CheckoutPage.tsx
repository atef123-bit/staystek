import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  Lock, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { createOrderInFirebase } from '../firebase/database';
import { ShippingAddress, Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    settings, 
    user, 
    clearCart, 
    navigate, 
    showToast 
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Shipping Address State
  const [address, setAddress] = useState<ShippingAddress>({
    country: 'United States',
    city: '',
    address: '',
    street: '',
    apartment: '',
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    postalCode: ''
  });

  // Step 2: Delivery Option
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const freeThreshold = settings.freeShippingThreshold || 350;
  const isEligibleFreeShipping = cartSubtotal >= freeThreshold;
  const standardCost = isEligibleFreeShipping ? 0 : (settings.standardShippingFee || 25);
  const expressCost = 45;
  const shippingFee = deliveryMethod === 'standard' ? standardCost : expressCost;

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'cod' | 'apple_pay' | 'wire'>('credit_card');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  // Calculation
  const orderTotal = cartSubtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-editorial text-3xl text-white mb-2">Shopping Bag is Empty</h2>
        <p className="text-xs text-zinc-400 mb-6">
          You cannot initiate checkout without selecting garments or accessories.
        </p>
        <button
          onClick={() => navigate({ name: 'shop' })}
          className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200"
        >
          Explore Atelier Collection
        </button>
      </div>
    );
  }

  // Final Submission with real atomic Firebase stock validation
  const handleFinalOrderPlacement = async () => {
    setErrorMessage('');
    setSubmitting(true);

    try {
      // 1. Prepare Order Data
      const orderAddress: ShippingAddress = {
        country: address.country,
        city: address.city,
        address: `${address.street || ''} ${address.apartment || ''}`.trim(),
        street: address.street,
        apartment: address.apartment,
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        postalCode: address.postalCode
      };

      const orderPayload: Omit<Order, 'orderId' | 'createdAt'> = {
        userId: user ? user.uid : 'guest',
        products: cart,
        items: cart,
        subtotal: cartSubtotal,
        shipping: shippingFee,
        shippingFee: shippingFee,
        total: orderTotal,
        customer: {
          fullName: address.fullName || 'Guest Client',
          email: address.email || '',
          phone: address.phone || ''
        },
        address: orderAddress,
        shippingAddress: orderAddress,
        shippingMethod: deliveryMethod === 'standard' ? 'Standard Courier' : 'White Glove Express',
        paymentMethod: paymentMethod === 'credit_card' ? 'Credit Card (256-bit Encrypted)' : 
                       paymentMethod === 'apple_pay' ? 'Apple Pay' : 
                       paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Wire',
        status: 'confirmed',
        notes: `Delivery Method: ${deliveryMethod.toUpperCase()}`
      };

      // 2. Commit to Firebase with Server-Side Transaction Stock Decrement
      const res = await createOrderInFirebase(orderPayload);
      if (!res.success || !res.orderId) {
        throw new Error(res.error || 'Failed to process order.');
      }

      // 3. Clear Bag & Direct to Success Screen
      clearCart();
      showToast('Order confirmed and recorded in Firebase atelier archives.', 'success');
      navigate({ name: 'order-success', orderId: res.orderId });

    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing transaction. Please retry.');
      showToast(err.message || 'Transaction failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.street || !address.city || !address.postalCode) {
      setErrorMessage('Please complete all compulsory shipping fields.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Checkout Progress Stepper */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/10 -z-1" />
          
          {[
            { num: 1, label: 'Delivery' },
            { num: 2, label: 'Shipping' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Review' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center bg-[#0c0c0e] px-3 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                step === s.num 
                  ? 'bg-white text-black font-bold ring-4 ring-white/20' 
                  : step > s.num 
                  ? 'bg-zinc-800 text-white border border-white/20' 
                  : 'bg-zinc-900 text-zinc-500 border border-white/10'
              }`}>
                {step > s.num ? <Check size={14} /> : s.num}
              </div>
              <span className={`text-[10px] uppercase tracking-wider mt-2 ${
                step === s.num ? 'text-white font-semibold' : 'text-zinc-500'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="max-w-3xl mx-auto mb-8 p-4 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Step Content (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: Personal & Shipping Address */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="bg-[#0e0e11] border border-white/10 p-6 sm:p-8 space-y-5">
              <h2 className="font-editorial text-2xl text-white pb-2 border-b border-white/10">
                1. Delivery Coordinates
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Email for Dispatch Tracking *
                  </label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Country / Sovereign Territory
                  </label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Germany">Germany</option>
                    <option value="Switzerland">Switzerland</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="740 Park Avenue"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Suite / Apt
                  </label>
                  <input
                    type="text"
                    value={address.apartment}
                    onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                    placeholder="Floor 14"
                    className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="New York"
                    className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="10021"
                    className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                  <span>Continue to Shipping Method</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="bg-[#0e0e11] border border-white/10 p-6 sm:p-8 space-y-6">
              <h2 className="font-editorial text-2xl text-white pb-2 border-b border-white/10">
                2. Shipping & Handling
              </h2>

              <div className="space-y-4">
                <label 
                  onClick={() => setDeliveryMethod('standard')}
                  className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                    deliveryMethod === 'standard' ? 'border-white bg-white/5' : 'border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={deliveryMethod === 'standard'} 
                      onChange={() => setDeliveryMethod('standard')}
                      className="mt-1 accent-white"
                    />
                    <div>
                      <div className="text-white text-xs font-semibold uppercase tracking-wider">
                        Atelier Insured Standard Courier
                      </div>
                      <p className="text-zinc-400 text-xs mt-1">
                        Dispatched in custom protective AMIS boxes. Delivery in 3–5 business days.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-white font-semibold">
                    {standardCost === 0 ? 'Complimentary' : `$${standardCost}`}
                  </span>
                </label>

                <label 
                  onClick={() => setDeliveryMethod('express')}
                  className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                    deliveryMethod === 'express' ? 'border-white bg-white/5' : 'border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={deliveryMethod === 'express'} 
                      onChange={() => setDeliveryMethod('express')}
                      className="mt-1 accent-white"
                    />
                    <div>
                      <div className="text-white text-xs font-semibold uppercase tracking-wider">
                        White Glove Priority Air Express
                      </div>
                      <p className="text-zinc-400 text-xs mt-1">
                        Dedicated courier liaison. Next business day delivery with signature verification.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-white font-semibold">
                    ${expressCost}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-white/20 text-zinc-300 text-xs uppercase tracking-widest hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <div className="bg-[#0e0e11] border border-white/10 p-6 sm:p-8 space-y-6">
              <h2 className="font-editorial text-2xl text-white pb-2 border-b border-white/10">
                3. Payment Details
              </h2>

              <div className="space-y-3">
                {[
                  { id: 'credit_card', name: 'Credit or Debit Card', desc: 'Encrypted via 256-bit TLS connection' },
                  { id: 'apple_pay', name: 'Apple Pay / Digital Wallet', desc: 'Biometric authorization' },
                  { id: 'cod', name: 'Cash on Hand Delivery', desc: 'Inspect garments upon courier arrival' },
                  { id: 'wire', name: 'Direct Bank Wire (Atelier Invoice)', desc: 'For corporate and bespoke acquisitions' }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                      paymentMethod === pm.id ? 'border-white bg-white/5' : 'border-white/15 hover:border-white/30'
                    }`}
                  >
                    <div className="flex gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as any)}
                        className="mt-1 accent-white"
                      />
                      <div>
                        <div className="text-white text-xs font-semibold uppercase tracking-wider">{pm.name}</div>
                        <p className="text-zinc-400 text-xs mt-0.5">{pm.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Card input if credit card selected */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8921"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                        Expiration
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                        Security Code (CVC)
                      </label>
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-white/20 text-zinc-300 text-xs uppercase tracking-widest hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-8 py-3.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                  <span>Review Order</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Place Order */}
          {step === 4 && (
            <div className="bg-[#0e0e11] border border-white/10 p-6 sm:p-8 space-y-6">
              <h2 className="font-editorial text-2xl text-white pb-2 border-b border-white/10">
                4. Final Verification
              </h2>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-black/50 border border-white/10">
                  <div className="text-zinc-400 uppercase tracking-wider text-[11px] mb-1 font-semibold">
                    Delivery Address
                  </div>
                  <div className="text-white font-medium">{address.fullName}</div>
                  <div className="text-zinc-300">{address.street} {address.apartment}</div>
                  <div className="text-zinc-300">{address.city}, {address.postalCode} • {address.country}</div>
                  <div className="text-zinc-400 font-mono mt-1">{address.phone} • {address.email}</div>
                </div>

                <div className="p-4 bg-black/50 border border-white/10 flex justify-between items-center">
                  <div>
                    <div className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">Payment Option</div>
                    <div className="text-white mt-1 capitalize">{paymentMethod.replace('_', ' ')}</div>
                  </div>
                  <button onClick={() => setStep(3)} className="text-zinc-400 hover:text-white underline">
                    Edit
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={submitting}
                  className="px-6 py-3 border border-white/20 text-zinc-300 text-xs uppercase tracking-widest hover:text-white"
                >
                  Back
                </button>

                <button
                  type="button"
                  id="place-order-button"
                  onClick={handleFinalOrderPlacement}
                  disabled={submitting}
                  className="px-10 py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center gap-3 shadow-2xl"
                >
                  <Lock size={14} />
                  <span>{submitting ? 'Verifying Stock & Authorizing...' : 'Authorize & Place Order'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: Order Summary (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="bg-[#0e0e11] border border-white/10 p-6 space-y-6 sticky top-28">
            <h3 className="font-editorial text-xl text-white">
              Order Bag ({cart.length} Pieces)
            </h3>

            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto pr-1">
              {cart.map((it) => (
                <div key={it.id} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={it.image} alt="" className="w-10 aspect-[3/4] object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">{it.name}</div>
                      <div className="text-zinc-500 text-[11px]">Size: {it.selectedSize} • Qty: {it.quantity}</div>
                    </div>
                  </div>
                  <span className="font-mono text-white shrink-0">${(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">${cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Courier Transport</span>
                <span className="font-mono text-white">{shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between text-base font-semibold text-white">
                <span className="font-editorial text-lg">Total Due</span>
                <span className="font-mono text-xl">${orderTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-zinc-500 pt-2 border-t border-white/5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Direct verification with Firebase RTDB ensures guaranteed inventory reservation.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
