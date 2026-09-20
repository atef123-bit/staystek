import React, { useState } from 'react';
import { 
  X, 
  Database, 
  RefreshCw, 
  Check, 
  Sliders, 
  Package, 
  Sparkles, 
  ArrowRight,
  Wifi
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { 
  resetToDefaultSeed, 
  updateContentInFirebase, 
  updateSettingsInFirebase, 
  updateProductStockInFirebase,
  updateOrderStatusInFirebase 
} from '../firebase/database';
import { OrderStatus } from '../types';

export const AdminModal: React.FC = () => {
  const { 
    isAdminModalOpen, 
    setIsAdminModalOpen, 
    isOnline, 
    settings, 
    content, 
    products, 
    userOrders, 
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'content' | 'stocks' | 'orders' | 'database'>('content');
  const [heroTitle, setHeroTitle] = useState(content.homepage?.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(content.homepage?.heroSubtitle || '');
  const [announcement, setAnnouncement] = useState(content.homepage?.announcement || '');
  const [storeName, setStoreName] = useState(settings.storeName || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateContentInFirebase({
        homepage: {
          ...content.homepage,
          heroTitle,
          heroSubtitle,
          announcement
        }
      });
      await updateSettingsInFirebase({
        storeName
      });
      showToast('Firebase Realtime Database successfully updated live!', 'success');
    } catch (err: any) {
      showToast('Failed to save to Firebase: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset/Re-seed Firebase Realtime Database with default luxury collection?')) return;
    setIsSaving(true);
    try {
      await resetToDefaultSeed();
      showToast('Firebase RTDB successfully seeded with full luxury catalog!', 'success');
    } catch (err: any) {
      showToast('Seeding error: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await updateProductStockInFirebase(productId, newStock);
      showToast(`Stock updated in Firebase RTDB.`, 'success');
    } catch (err: any) {
      showToast('Stock update failed: ' + err.message, 'error');
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusInFirebase(orderId, status);
      showToast(`Order ${orderId} status set to ${status}. Timeline updated live!`, 'success');
    } catch (err: any) {
      showToast('Order status update failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsAdminModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0f0f13] border border-white/15 shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-black">
              <Database size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-xl text-white tracking-wide">
                  Firebase Realtime Database Manager
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${
                  isOnline ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300'
                }`}>
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                amis-d17f3-default-rtdb.asia-southeast1.firebasedatabase.app
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/20 text-xs uppercase tracking-widest font-semibold">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'content' ? 'border-white text-white bg-white/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Store & Content
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'stocks' ? 'border-white text-white bg-white/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-white text-white bg-white/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Order Simulator
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'database' ? 'border-white text-white bg-white/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Seed / Sync
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: Content Editor */}
          {activeTab === 'content' && (
            <form onSubmit={handleSaveContent} className="space-y-4 text-xs">
              <p className="text-zinc-400 text-xs leading-relaxed">
                Changes made here are committed directly to your Firebase Realtime Database node (<code className="text-white">/content</code> and <code className="text-white">/settings</code>) and synchronize across all clients in real time.
              </p>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Maison Store Name
                </label>
                <input 
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-white text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Hero Headline (Title)
                </label>
                <input 
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-white text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Hero Subtitle / Campaign
                </label>
                <input 
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-white text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                  Top Announcement Ticker
                </label>
                <input 
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-white text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-white text-black font-semibold uppercase tracking-widest text-xs hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Writing to Firebase...' : 'Save to Firebase RTDB'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Stocks & Products */}
          {activeTab === 'stocks' && (
            <div className="space-y-4">
              <p className="text-zinc-400 text-xs">
                Adjust stock levels in real time. Setting stock to 0 triggers "Sold Out" badges and prevents checkout.
              </p>
              <div className="divide-y divide-white/5 border border-white/10 bg-black/30">
                {products.map((p) => (
                  <div key={p.productId} className="p-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={p.images[0]} alt="" className="w-10 h-12 object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-white font-medium truncate">{p.name}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">${p.price} • {p.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-zinc-400">Stock:</span>
                      <input 
                        type="number" 
                        min="0"
                        defaultValue={p.stock}
                        onBlur={(e) => handleStockUpdate(p.productId, parseInt(e.target.value) || 0)}
                        className="w-16 bg-black border border-white/20 px-2 py-1 text-center text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Orders & Tracking Timeline Simulator */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <p className="text-zinc-400 text-xs">
                Test the dynamic Order Tracking timeline by updating an order's status in Firebase RTDB:
              </p>
              {userOrders.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs border border-white/10">
                  No orders found yet. Place a test order through the checkout flow to simulate status progression!
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((o) => (
                    <div key={o.orderId} className="p-4 bg-black/40 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-white font-semibold">{o.orderId}</span>
                        <span className="text-zinc-400 font-mono">${o.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">Current Status:</span>
                        <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] uppercase tracking-wider font-semibold">
                          {o.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleOrderStatusChange(o.orderId, st)}
                            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border transition-colors ${
                              o.status === st ? 'bg-white text-black border-white font-bold' : 'border-white/15 text-zinc-300 hover:border-white/40'
                            }`}
                          >
                            Set {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Database Re-seed */}
          {activeTab === 'database' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-white font-medium uppercase tracking-wider">
                  Full Catalog Synchronization
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Click below to synchronize and re-populate the entire AMIS luxury collection (5 categories, 8 high-end apparel & leather products, custom descriptions, and policies) directly into the connected Firebase Realtime Database.
                </p>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleResetDatabase}
                  className="mt-3 px-5 py-2.5 bg-white text-black font-semibold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw size={13} className={isSaving ? 'animate-spin' : ''} />
                  <span>Re-seed Firebase Realtime Database</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
