import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Sizing & Proportions',
    question: 'How do AMIS garments fit across architectural proportions?',
    answer: 'Our silhouettes are designed with intentional architectural drape. Outerwear and blazers feature structured shoulders with generous body lines for ease of movement. Trousers sit cleanly on the natural waist with a straight, continuous crease. We recommend selecting your standard size for the intended editorial drape, or sizing down for a closer, conventional fit.'
  },
  {
    category: 'Sizing & Proportions',
    question: 'Can I request bespoke sleeve or hem adjustments prior to shipping?',
    answer: 'Yes. For our structured tailoring and double-faced coats, we offer complimentary unfinished trouser hems or pre-tailored bespoke inseam adjustments. Please contact our concierge immediately after placing your order reference.'
  },
  {
    category: 'Materials & Authenticity',
    question: 'Where are AMIS materials sourced and woven?',
    answer: 'We work exclusively with certified heritage mills. Our wool and cashmere are woven in Biella, Italy. Silk linings are loomed in Como. Raw and washed denim is woven on vintage shuttle looms in Kojima, Okayama. Every garment includes an individualized certificate of provenance and serialized archival tag.'
  },
  {
    category: 'Logistics & Dispatch',
    question: 'How are garments packaged during transit?',
    answer: 'Every piece is enclosed within a breathable archival cotton garment bag, folded on custom wooden contour hangers, and placed in our matte signature hardcase box to arrive pristine and ready to wear without transit creasing.'
  },
  {
    category: 'Logistics & Dispatch',
    question: 'How does carbon-neutral courier delivery work?',
    answer: 'We partner with DHL Express GoGreen Plus, utilizing sustainable aviation fuel (SAF) and local electric courier fleets to offset 100% of transport emissions on every single parcel.'
  },
  {
    category: 'Care & Permanence',
    question: 'How should untreated wool and cashmere garments be preserved?',
    answer: 'Natural wool fibers possess self-cleaning lanolin properties. After wearing, air garments overnight on our broad contour hangers. Brush gently with a natural horsehair garment brush. For cleaning, utilize only specialized eco-friendly ecological dry cleaners with gentle hydrocarbon solvent baths.'
  }
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(filterQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-white/10 pb-8 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
          CLIENT KNOWLEDGE ARCHIVE
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-white">
          Frequently Inquired Inquiries
        </h1>
        <p className="text-xs text-zinc-400 mt-2">
          Everything you need to know regarding atelier tailoring, shipping, and fabric provenance.
        </p>

        {/* Search inside FAQ */}
        <div className="max-w-md mx-auto mt-6 relative">
          <Search size={16} className="absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search questions (e.g., sizing, wool, returns)..."
            className="w-full bg-[#0e0e11] border border-white/15 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="bg-[#0e0e11] border border-white/10 transition-all overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-normal text-white">
                    {item.question}
                  </h3>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-zinc-400 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light border-t border-white/5">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
