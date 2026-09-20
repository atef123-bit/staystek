import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  ArrowUpRight,
  Database,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, content, navigate, isOnline, setIsAdminModalOpen } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#08080a] border-t border-white/10 text-zinc-400 text-sm">
      {/* Editorial Value Pillars */}
      <div className="border-b border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-[0.2em] font-semibold mb-1">
                Global Express
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {content.footer.shippingText || "Carbon-neutral insured dispatch worldwide within 24 hours."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-[0.2em] font-semibold mb-1">
                Bespoke Returns
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {content.footer.returnsText || "Complimentary 30-day global returns with doorstep collection."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-[0.2em] font-semibold mb-1">
                Authenticity Sealed
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every piece carries an individual atelier serial seal verifying Italian craftsmanship.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-[0.2em] font-semibold mb-1">
                Private Concierge
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dedicated styling consultants available for private client appointments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <span className="font-editorial text-3xl tracking-[0.2em] text-white block">
              {settings.storeName || 'AMIS ATELIER'}
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {content.footer.description || "An independent luxury fashion house dedicated to architectural silhouettes, uncompromised craftsmanship, and enduring minimalism."}
            </p>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-300 font-semibold mb-3">
                Private Gazette & Releases
              </p>
              {subscribed ? (
                <div className="p-3 bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" />
                  <span>Your email has been added to our private salon directory.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input 
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter client email address"
                    className="w-full bg-black/50 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                  />
                  <button 
                    type="submit"
                    className="px-5 bg-white text-black text-xs uppercase font-semibold tracking-widest hover:bg-zinc-200 transition-colors shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-5">
              Collections
            </h5>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => navigate({ name: 'shop' })} className="hover:text-white transition-colors">
                  All Creations
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'category', categoryId: 'womenswear' })} className="hover:text-white transition-colors">
                  Womenswear
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'category', categoryId: 'menswear' })} className="hover:text-white transition-colors">
                  Menswear
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'category', categoryId: 'leather-goods' })} className="hover:text-white transition-colors">
                  Leather Goods
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'category', categoryId: 'footwear' })} className="hover:text-white transition-colors">
                  Footwear
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'category', categoryId: 'jewelry-timepieces' })} className="hover:text-white transition-colors">
                  Jewelry & Objects
                </button>
              </li>
            </ul>
          </div>

          {/* Client Relations */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-5">
              Client Care
            </h5>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => navigate({ name: 'tracking' })} className="hover:text-white transition-colors">
                  Track Delivery
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'orders' })} className="hover:text-white transition-colors">
                  Order Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'contact' })} className="hover:text-white transition-colors">
                  Private Concierge
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'faq' })} className="hover:text-white transition-colors">
                  Frequently Asked
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'shipping' })} className="hover:text-white transition-colors">
                  Shipping Terms
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'returns' })} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
            </ul>
          </div>

          {/* Maison & Legal */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-5">
              Maison
            </h5>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => navigate({ name: 'about' })} className="hover:text-white transition-colors">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'privacy' })} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'terms' })} className="hover:text-white transition-colors">
                  Terms of Sale
                </button>
              </li>
              <li className="pt-2">
                <button
                  id="admin-tools-footer-btn"
                  onClick={() => setIsAdminModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-white/10 px-3 py-1.5 rounded transition-all bg-white/5"
                >
                  <Database size={13} />
                  <span>Firebase RTDB Manager</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & contact */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © {new Date().getFullYear()} {settings.storeName || 'AMIS ATELIER'}. All rights reserved. Registered under Milan & New York Commerce.
          </div>
          <div className="flex items-center gap-6">
            <span>{settings.contactPhone}</span>
            <span>•</span>
            <span>{settings.contactEmail}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
