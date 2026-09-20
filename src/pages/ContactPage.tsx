import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Private Appointment',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast('Your inquiry has been relayed to our head concierge in Florence.', 'success');
      setFormData({ name: '', email: '', topic: 'Private Appointment', message: '' });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3 border-b border-white/10 pb-8 mb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono">
          CLIENT LIAISON & APPOINTMENTS
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-white">
          Private Concierge
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
          Whether inquiring regarding bespoke garments, size consultations, or private salon showings in Florence or Manhattan, our team remains at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Contact Information & Showrooms (5 Columns) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#0e0e11] border border-white/10 p-6 sm:p-8 space-y-6">
            <h3 className="font-editorial text-2xl text-white">
              Atelier Locations
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <MapPin size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Headquarters & Archive</div>
                  <p className="text-zinc-400">Via de' Tornabuoni, 24, 50123 Firenze FI, Italy</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Manhattan Private Salon</div>
                  <p className="text-zinc-400">740 Park Avenue, Penthouse B, New York, NY 10021</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Electronic Dispatch</div>
                  <p className="text-zinc-400 font-mono">concierge@amis-atelier.com</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Direct Telephone Line</div>
                  <p className="text-zinc-400 font-mono">+1 (800) 294-8192</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Hours of Availability</div>
                  <p className="text-zinc-400">Monday – Saturday: 09:00 – 19:00 CET</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Contact Form (7 Columns) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-[#0e0e11] border border-white/10 p-6 sm:p-8 space-y-5">
            <h3 className="font-editorial text-2xl text-white pb-2 border-b border-white/10">
              Transmit An Inquiry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Eleanor Vance"
                  className="w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@domain.com"
                  className="w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                Inquiry Nature
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full bg-black border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="Private Appointment">Private Appointment / Showroom Booking</option>
                <option value="Sizing & Measurements">Bespoke Sizing & Garment Proportion Query</option>
                <option value="Order & Logistics">Order Tracking & White Glove Delivery</option>
                <option value="Press & Editorial">Press, Editorial & Media Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                Message Content *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Detail your request or desired garment reference..."
                className="w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xl"
            >
              <Send size={13} />
              <span>{submitting ? 'Transmitting...' : 'Transmit Inquiry'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
