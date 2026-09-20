import React from 'react';
import { Check, ArrowRight, Package, Truck, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OrderSuccessPageProps {
  orderId: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId }) => {
  const { navigate, userOrders } = useStore();

  const currentOrder = userOrders.find((o) => o.orderId === orderId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-950/40 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto mb-6">
        <Check size={36} />
      </div>

      <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
        DISPATCH AUTHORIZED
      </span>

      <h1 className="font-editorial text-4xl sm:text-5xl text-white mb-3">
        Thank You For Your Acquisition
      </h1>

      <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed mb-8">
        Your order has been recorded in the AMIS atelier archives. Our artisans in Florence and Biella have commenced piece inspection and preparation.
      </p>

      {/* Order Info Card */}
      <div className="p-6 bg-[#0e0e11] border border-white/15 text-left max-w-md mx-auto mb-8 space-y-4">
        <div className="flex justify-between items-center text-xs pb-3 border-b border-white/10">
          <span className="text-zinc-400 uppercase tracking-wider">Order Reference</span>
          <span className="font-mono text-white font-semibold">{orderId}</span>
        </div>

        {currentOrder && (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Total Billed</span>
              <span className="font-mono text-white">${currentOrder.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Delivery Recipient</span>
              <span className="text-white">{currentOrder.shippingAddress?.fullName || currentOrder.customer?.fullName || 'Distinguished Client'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Current Status</span>
              <span className="px-2 py-0.5 bg-white text-black font-semibold text-[10px] uppercase tracking-wider">
                {currentOrder.status}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => navigate({ name: 'order-tracking', orderId })}
          className="w-full sm:w-auto px-8 py-3.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
        >
          <Truck size={14} />
          <span>Track Order Timeline</span>
        </button>

        <button
          onClick={() => navigate({ name: 'shop' })}
          className="w-full sm:w-auto px-8 py-3.5 border border-white/20 text-white text-xs uppercase tracking-widest font-medium hover:bg-white/5 transition-colors"
        >
          Return to Collection
        </button>
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>A formal confirmation dispatch has been transmitted to your email.</span>
      </div>
    </div>
  );
};
