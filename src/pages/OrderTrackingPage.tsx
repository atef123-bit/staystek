import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  ArrowRight, 
  Search,
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

interface OrderTrackingPageProps {
  orderId?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId: initialOrderId }) => {
  const { userOrders, navigate } = useStore();
  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      const found = userOrders.find((o) => o.orderId.toLowerCase() === initialOrderId.toLowerCase());
      setActiveOrder(found || null);
      setHasSearched(true);
    } else if (userOrders.length > 0) {
      setActiveOrder(userOrders[0]);
      setSearchId(userOrders[0].orderId);
      setHasSearched(true);
    }
  }, [initialOrderId, userOrders]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toLowerCase();
    const found = userOrders.find((o) => o.orderId.toLowerCase() === query);
    setActiveOrder(found || null);
    setHasSearched(true);
  };

  // Timeline Steps Definition
  const timelineStages: { key: OrderStatus; title: string; desc: string }[] = [
    { key: 'pending', title: 'Order Received', desc: 'Transaction authorized and archived in Florence registry' },
    { key: 'confirmed', title: 'Atelier Confirmed', desc: 'Stock allocated and inspected by master tailor' },
    { key: 'processing', title: 'Bespoke Packaging', desc: 'Encased in archival garment bag and signature hardcase' },
    { key: 'shipped', title: 'Dispatched via Courier', desc: 'Handed over to carbon-neutral international express carrier' },
    { key: 'delivered', title: 'Delivered', desc: 'Securely delivered to recipient with signature confirmation' }
  ];

  const getStageIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    const index = timelineStages.findIndex((s) => s.key === status);
    return index >= 0 ? index : 0;
  };

  const currentStageIdx = activeOrder ? getStageIndex(activeOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-10 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
          Global Logistics Dispatch
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-white">
          Real-Time Order Tracking
        </h1>
        <p className="text-xs text-zinc-400 mt-2">
          Monitor your shipment's journey from our Italian atelier to your residence.
        </p>

        {/* Tracking Search Input */}
        <form onSubmit={handleLookup} className="max-w-md mx-auto mt-6 flex gap-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order Reference (e.g. ORD-1729...)"
            className="flex-1 bg-[#0e0e11] border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Results View */}
      {activeOrder ? (
        <div className="space-y-8">
          
          {/* Order Snapshot Header */}
          <div className="bg-[#0e0e11] border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">
                VERIFIED ARCHIVE RECORD
              </span>
              <h2 className="font-mono text-base sm:text-lg text-white font-semibold">
                {activeOrder.orderId}
              </h2>
              <span className="text-xs text-zinc-400">
                Created: {new Date(activeOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">Status:</span>
              <span className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold border ${
                activeOrder.status === 'delivered' 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                  : activeOrder.status === 'cancelled'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-white text-black border-white'
              }`}>
                {activeOrder.status}
              </span>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="bg-[#0e0e11] border border-white/10 p-6 sm:p-10">
            <h3 className="font-editorial text-2xl text-white mb-8">
              Shipment Trajectory
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-white/10 ml-3">
              {timelineStages.map((stage, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div key={stage.key} className="relative group">
                    {/* Circle Node */}
                    <div className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCurrent 
                        ? 'bg-white border-white text-black ring-4 ring-white/20' 
                        : isPassed 
                        ? 'bg-[#1a1a20] border-white text-white' 
                        : 'bg-[#0e0e11] border-white/20 text-zinc-600'
                    }`}>
                      {isPassed ? <CheckCircle2 size={12} /> : <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`text-xs uppercase tracking-widest font-semibold ${
                          isPassed ? 'text-white' : 'text-zinc-500'
                        }`}>
                          {stage.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-white/10 text-white text-[9px] uppercase tracking-wider font-mono">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isPassed ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0e0e11] border border-white/10 p-6 space-y-3 text-xs">
              <h4 className="text-white font-medium uppercase tracking-wider mb-2">
                Destination Coordinates
              </h4>
              <p className="text-zinc-300">{activeOrder.shippingAddress?.fullName || activeOrder.customer?.fullName || 'Client'}</p>
              <p className="text-zinc-300">
                {activeOrder.shippingAddress?.street || activeOrder.address?.address || ''} {activeOrder.shippingAddress?.apartment || ''}
              </p>
              <p className="text-zinc-300">
                {activeOrder.shippingAddress?.city || activeOrder.address?.city || ''}, {activeOrder.shippingAddress?.postalCode || activeOrder.address?.postalCode || ''} • {activeOrder.shippingAddress?.country || activeOrder.address?.country || ''}
              </p>
              <p className="text-zinc-500 font-mono mt-2">
                {activeOrder.shippingAddress?.phone || activeOrder.customer?.phone || ''}
              </p>
            </div>

            <div className="bg-[#0e0e11] border border-white/10 p-6 space-y-3 text-xs">
              <h4 className="text-white font-medium uppercase tracking-wider mb-2">
                Order Content ({(activeOrder.products || activeOrder.items || []).length} Items)
              </h4>
              <div className="space-y-2">
                {(activeOrder.products || activeOrder.items || []).map((it, i) => (
                  <div key={i} className="flex justify-between items-center text-zinc-300">
                    <span className="truncate pr-2">{it.name} (x{it.quantity})</span>
                    <span className="font-mono text-white shrink-0">${(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between font-semibold text-white">
                <span>Total Settled</span>
                <span className="font-mono">${activeOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      ) : hasSearched ? (
        <div className="py-16 text-center border border-white/5 bg-[#0e0e11] p-8 max-w-md mx-auto">
          <AlertCircle size={30} className="text-zinc-500 mx-auto mb-3" />
          <h3 className="font-editorial text-xl text-white mb-1">No Matching Shipment Located</h3>
          <p className="text-xs text-zinc-400 mb-6">
            We could not locate an order with reference "{searchId}". Please verify the tracking reference provided in your order receipt.
          </p>
          <button
            onClick={() => navigate({ name: 'shop' })}
            className="px-6 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200"
          >
            Explore Atelier Catalog
          </button>
        </div>
      ) : null}
    </div>
  );
};
