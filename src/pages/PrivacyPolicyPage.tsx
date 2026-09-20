import React from 'react';
import { Lock, Eye, Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-white/10 pb-8">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
          CLIENT DATA PRIVACY & GDPR CONFORMANCE
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-white">
          Client Privacy Charter
        </h1>
        <p className="text-xs text-zinc-400 mt-2 font-mono">
          Last updated: 2026 • Encrypted Firebase RTDB Infrastructure
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            1. Zero Commercial Data Monetization
          </h2>
          <p>
            AMIS ATELIER operates under a strict principle of non-monetization of private client data. We never sell, lease, or distribute customer information to advertising brokers, tracking networks, or third-party marketing companies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            2. Collected Coordinates
          </h2>
          <p>
            We process exclusively the minimal essential information required for order fulfillment and personalized concierge service:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>Delivery address and contact coordinates for courier dispatch.</li>
            <li>Transaction reference tokens processed through bank-grade PCI-DSS compliance (we do not store raw card numbers).</li>
            <li>Saved sizing and wishlist preferences stored in private Firebase authenticated profiles.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            3. Right to Erasure
          </h2>
          <p>
            Clients possess full autonomy to request permanent removal of their profile and historical order records by contacting concierge@amis-atelier.com.
          </p>
        </section>
      </div>
    </div>
  );
};
