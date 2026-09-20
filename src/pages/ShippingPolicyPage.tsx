import React from 'react';
import { Truck, ShieldCheck, Clock, Globe } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ShippingPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-white/10 pb-8">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
          LOGISTICS & TRANSIT STANDARDS
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-white">
          Insured Courier & Delivery Policy
        </h1>
        <p className="text-xs text-zinc-400 mt-2 font-mono">
          Last revised: January 2026 • Florence Atelier Dispatch
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            1. Complimentary Global Delivery
          </h2>
          <p>
            AMIS ATELIER provides complimentary carbon-neutral express courier delivery on all orders exceeding {settings.currencySymbol || '$'}{settings.freeShippingThreshold || 350}. Orders beneath this threshold incur a standardized dispatch fee of {settings.currencySymbol || '$'}{settings.standardShippingFee || 25}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            2. Transit Timelines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#0e0e11] border border-white/10">
              <h4 className="text-white font-medium uppercase tracking-wider text-xs mb-1">Domestic & European Union</h4>
              <p className="text-zinc-400 text-xs">2 to 4 business days via DHL Express with signature on delivery.</p>
            </div>
            <div className="p-4 bg-[#0e0e11] border border-white/10">
              <h4 className="text-white font-medium uppercase tracking-wider text-xs mb-1">North America & Global</h4>
              <p className="text-zinc-400 text-xs">3 to 5 business days with direct customs priority clearance.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            3. Signature Security & Inspection
          </h2>
          <p>
            Due to the archival value of our garments and leathergoods, all dispatches require a physical signature upon delivery. Couriers will not leave packages unattended. If you require specialized white-glove unboxing or weekend delivery, coordinate via our concierge.
          </p>
        </section>
      </div>
    </div>
  );
};
