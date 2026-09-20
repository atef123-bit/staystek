import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReturnsPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-white/10 pb-8">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
          CLIENT SATISFACTION & ARCHIVAL INTEGRITY
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-white">
          Returns & Exchanges Protocol
        </h1>
        <p className="text-xs text-zinc-400 mt-2 font-mono">
          30-Day Doorstep Courier Collection Guarantee
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            1. 30-Day Window
          </h2>
          <p>
            We invite you to experience the fit and drape of your garment in the comfort of your home. If a piece does not satisfy your aesthetic expectations or sizing requirements, you may initiate a return or exchange within 30 days of confirmed courier delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            2. Return Conditions
          </h2>
          <p>
            To preserve the integrity of our pieces, items must be returned in their original condition:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>Unworn, unwashed, and completely unaltered.</li>
            <li>All atelier tags, garment ribbons, and authenticity seals remain intact.</li>
            <li>Packaged in the original AMIS archival gift box and dust bag.</li>
            <li>Footwear must be tried only on clean, carpeted surfaces to protect leather outsoles.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            3. Doorstep Courier Pickup
          </h2>
          <p>
            Returns are completely complimentary. Upon initiating a return through your account or concierge, we generate a pre-paid courier waybill and schedule a direct pickup at your residence.
          </p>
        </section>
      </div>
    </div>
  );
};
