import React from 'react';

export const TermsPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-white/10 pb-8">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
          LEGAL TERMS & ATELIER ACQUISITION GOVERNANCE
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-white">
          Terms & Conditions
        </h1>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            1. Scope of Contract
          </h2>
          <p>
            By acquiring pieces from AMIS ATELIER via this digital portal, you agree to these terms governing authenticity, ownership, order limits, and delivery protocol.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            2. Intellectual Property & Archival Designs
          </h2>
          <p>
            All architectural patterns, tailoring cuts, photography, logos, typography, and copywriting are the proprietary intellectual property of AMIS ATELIER. Unauthorized commercial replication or reproduction is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-white font-normal">
            3. Pricing & Currency
          </h2>
          <p>
            Prices are indicated in United States Dollars ($ USD) or the configured sovereign currency. All transactions undergo stock allocation checks at the time of authorization. In the rare event of inventory exhaustion prior to fulfillment, transactions are cancelled and reimbursed in full immediately.
          </p>
        </section>
      </div>
    </div>
  );
};
