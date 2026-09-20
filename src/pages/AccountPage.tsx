import React, { useState, useEffect } from 'react';
import { User, Package, Heart, LogOut, Save, ShieldCheck, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { logoutUser } from '../firebase/auth';
import { updateUserProfileInFirebase } from '../firebase/database';

export const AccountPage: React.FC = () => {
  const { user, userOrders, favorites, products, navigate, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate({ name: 'login' });
    } else {
      setDisplayName(user.displayName || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfileInFirebase(user.uid, {
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim()
      });
      showToast('Client profile updated in Firebase.', 'success');
    } catch (err: any) {
      showToast('Failed to update profile: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Successfully signed out of atelier session.', 'info');
      navigate({ name: 'home' });
    } catch (err: any) {
      showToast('Sign out error: ' + err.message, 'error');
    }
  };

  const favoriteProducts = products.filter(p => favorites.includes(p.productId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
            Private Client Portal
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-white">
            {user.displayName || 'Distinguished Client'}
          </h1>
          <p className="text-xs text-zinc-400 mt-2 font-mono">
            {user.email} • ID: {user.uid.slice(0, 8)}...
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:border-rose-500 hover:text-rose-400 transition-colors self-start sm:self-auto"
        >
          <LogOut size={14} />
          <span>Terminate Session</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Column */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-medium flex items-center gap-3 transition-colors ${
              activeTab === 'profile' ? 'bg-white text-black font-semibold' : 'bg-[#0e0e11] text-zinc-300 hover:text-white border border-white/5'
            }`}
          >
            <User size={15} />
            <span>Profile Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-medium flex items-center justify-between transition-colors ${
              activeTab === 'orders' ? 'bg-white text-black font-semibold' : 'bg-[#0e0e11] text-zinc-300 hover:text-white border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={15} />
              <span>Purchase History</span>
            </div>
            <span className="font-mono text-xs">{userOrders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-medium flex items-center justify-between transition-colors ${
              activeTab === 'wishlist' ? 'bg-white text-black font-semibold' : 'bg-[#0e0e11] text-zinc-300 hover:text-white border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart size={15} />
              <span>Saved Wishlist</span>
            </div>
            <span className="font-mono text-xs">{favoriteProducts.length}</span>
          </button>
        </div>

        {/* Details Column */}
        <div className="md:col-span-3">
          
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="bg-[#0e0e11] border border-white/10 p-6 sm:p-8 space-y-6">
              <h3 className="font-editorial text-2xl text-white">
                Personal Credentials
              </h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                    Email Address (Immutable)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ''}
                    className="w-full bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-zinc-500 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <Save size={14} />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="p-12 text-center bg-[#0e0e11] border border-white/10">
                  <Package size={30} className="text-zinc-600 mx-auto mb-3" />
                  <h4 className="font-editorial text-xl text-white mb-1">No Orders Recorded</h4>
                  <p className="text-xs text-zinc-400 mb-6">
                    You have not yet completed any orders with our atelier.
                  </p>
                  <button
                    onClick={() => navigate({ name: 'shop' })}
                    className="px-6 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200"
                  >
                    Explore Atelier Catalog
                  </button>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div key={order.orderId} className="bg-[#0e0e11] border border-white/10 p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">
                          ORDER REFERENCE
                        </span>
                        <span className="font-mono text-white text-sm font-semibold">
                          {order.orderId}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider bg-white/10 text-white">
                          Status: {order.status}
                        </span>
                        <button
                          onClick={() => navigate({ name: 'order-tracking', orderId: order.orderId })}
                          className="px-3 py-1 bg-white text-black text-[11px] uppercase tracking-wider font-semibold hover:bg-zinc-200"
                        >
                          Track Order
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(order.products || order.items || []).map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-zinc-300">
                          <div className="flex items-center gap-3">
                            <img src={it.image} alt="" className="w-10 aspect-[3/4] object-cover" />
                            <div>
                              <div className="text-white font-medium">{it.name}</div>
                              <div className="text-zinc-500 text-[11px]">Size: {it.selectedSize} • Qty: {it.quantity}</div>
                            </div>
                          </div>
                          <span className="font-mono text-white">${(it.price * it.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between text-xs">
                      <span className="text-zinc-400">Total Billed ({order.paymentMethod})</span>
                      <span className="font-mono text-sm font-semibold text-white">${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              {favoriteProducts.length === 0 ? (
                <div className="p-12 text-center bg-[#0e0e11] border border-white/10">
                  <p className="text-xs text-zinc-400 mb-4">No saved pieces in your wishlist.</p>
                  <button
                    onClick={() => navigate({ name: 'shop' })}
                    className="px-6 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200"
                  >
                    View Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProducts.map((p) => (
                    <div 
                      key={p.productId}
                      onClick={() => navigate({ name: 'product', productId: p.productId })}
                      className="bg-[#0e0e11] border border-white/10 p-4 cursor-pointer hover:border-white/30 transition-all"
                    >
                      <img src={p.images[0]} alt="" className="aspect-[3/4] object-cover w-full mb-3" />
                      <div className="text-xs text-zinc-400 uppercase tracking-wider">{p.category}</div>
                      <div className="text-sm text-white font-medium truncate">{p.name}</div>
                      <div className="font-mono text-xs text-white mt-1">${p.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
