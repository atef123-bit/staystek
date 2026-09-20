import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  SlidersHorizontal,
  Wifi,
  WifiOff,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const { 
    settings, 
    content, 
    categories, 
    cartCount, 
    favorites, 
    user, 
    navigate, 
    currentRoute,
    isOnline, 
    setIsCartDrawerOpen,
    setIsAdminModalOpen 
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerSearchInput, setHeaderSearchInput] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchInput.trim()) {
      navigate({ name: 'search', initialQuery: headerSearchInput.trim() });
      setSearchOpen(false);
      setHeaderSearchInput('');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (name: string) => currentRoute.name === name;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      {content?.homepage?.announcement && (
        <div className="bg-[#18181b] border-b border-white/5 py-1.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] font-medium text-zinc-300 uppercase">
            <span>{content.homepage.announcement}</span>
            <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-zinc-700 text-[10px] text-zinc-400">
              {isOnline ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  RTDB Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400">
                  <WifiOff size={10} />
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0c0c0e]/90 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl' 
            : 'bg-[#0c0c0e]/70 backdrop-blur-md border-b border-white/5 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden gap-3">
            <button 
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-300 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <button 
              id="mobile-search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-zinc-300 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={19} />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.15em] uppercase font-medium">
            <button 
              id="nav-home"
              onClick={() => navigate({ name: 'home' })}
              className={`transition-colors hover:text-white ${isActive('home') ? 'text-white border-b border-white pb-0.5' : 'text-zinc-400'}`}
            >
              Atelier
            </button>
            <button 
              id="nav-shop"
              onClick={() => navigate({ name: 'shop' })}
              className={`transition-colors hover:text-white ${isActive('shop') ? 'text-white border-b border-white pb-0.5' : 'text-zinc-400'}`}
            >
              Collection
            </button>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button 
                id="nav-categories"
                onClick={() => navigate({ name: 'categories' })}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors py-1"
              >
                <span>Categories</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="glass-dropdown rounded-lg p-2 shadow-2xl border border-white/10">
                    <button
                      onClick={() => {
                        navigate({ name: 'categories' });
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold tracking-wider text-white hover:bg-white/5 rounded transition-colors uppercase border-b border-white/5 mb-1"
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.categoryId}
                        onClick={() => {
                          navigate({ name: 'category', categoryId: cat.categoryId });
                          setCategoryDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 rounded transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              id="nav-about"
              onClick={() => navigate({ name: 'about' })}
              className={`transition-colors hover:text-white ${isActive('about') ? 'text-white border-b border-white pb-0.5' : 'text-zinc-400'}`}
            >
              Maison
            </button>
            <button 
              id="nav-contact"
              onClick={() => navigate({ name: 'contact' })}
              className={`transition-colors hover:text-white ${isActive('contact') ? 'text-white border-b border-white pb-0.5' : 'text-zinc-400'}`}
            >
              Concierge
            </button>
          </nav>

          {/* Logo / Brand Centered */}
          <div className="text-center cursor-pointer select-none" onClick={() => navigate({ name: 'home' })}>
            <span className="font-editorial text-2xl sm:text-3xl lg:text-4xl tracking-[0.25em] text-white font-normal hover:opacity-90 transition-opacity">
              {settings.logoText || settings.storeName || 'AMIS'}
            </span>
            <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-400 -mt-1 font-sans">
              ATELIER
            </p>
          </div>

          {/* Action Icons Right */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Desktop Toggle */}
            <button 
              id="desktop-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex items-center gap-2 text-xs tracking-wider text-zinc-400 hover:text-white transition-colors"
              aria-label="Search Collection"
            >
              <Search size={17} />
              <span className="uppercase text-[11px]">Search</span>
            </button>

            {/* Tracking Quick Access */}
            <button
              id="nav-tracking-btn"
              onClick={() => navigate({ name: 'tracking' })}
              className="hidden sm:flex text-zinc-400 hover:text-white transition-colors p-1"
              title="Track Your Order"
              aria-label="Track Order"
            >
              <PackageCheck size={18} />
            </button>

            {/* Favorites Icon */}
            <button
              id="header-fav-btn"
              onClick={() => navigate({ name: 'favorites' })}
              className="relative text-zinc-300 hover:text-white transition-colors p-1"
              aria-label="Saved Wishlist"
            >
              <Heart size={19} className={favorites.length > 0 ? 'text-rose-400 fill-rose-400/20' : ''} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              id="header-account-btn"
              onClick={() => navigate({ name: user ? 'account' : 'login' })}
              className="text-zinc-300 hover:text-white transition-colors p-1 flex items-center gap-1.5"
              aria-label="Account"
            >
              <User size={19} />
              {user && (
                <span className="hidden xl:inline-block text-[11px] uppercase tracking-wider text-zinc-300 truncate max-w-[80px]">
                  {user.displayName?.split(' ')[0] || 'Profile'}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative text-zinc-300 hover:text-white transition-colors p-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Expandable Search Overlay */}
        {searchOpen && (
          <div className="w-full border-t border-white/10 bg-[#09090b]/95 backdrop-blur-xl px-4 py-4 mt-2 transition-all">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-zinc-500" />
                <input 
                  type="text"
                  id="header-search-input"
                  value={headerSearchInput}
                  onChange={(e) => setHeaderSearchInput(e.target.value)}
                  placeholder="Search silhouettes, materials, jackets, leather goods, boots..."
                  className="w-full bg-black/60 border border-white/15 rounded-none pl-12 pr-28 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors tracking-wide"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2.5 px-4 py-1.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Search
                </button>
              </form>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-zinc-400">
                <span className="text-zinc-500">Popular:</span>
                <button type="button" onClick={() => { navigate({ name: 'search', initialQuery: 'Cashmere' }); setSearchOpen(false); }} className="hover:text-white underline underline-offset-2">Cashmere</button>
                <button type="button" onClick={() => { navigate({ name: 'search', initialQuery: 'Tuscan Calfskin' }); setSearchOpen(false); }} className="hover:text-white underline underline-offset-2">Tuscan Calfskin</button>
                <button type="button" onClick={() => { navigate({ name: 'search', initialQuery: 'Blazer' }); setSearchOpen(false); }} className="hover:text-white underline underline-offset-2">Blazer</button>
                <button type="button" onClick={() => { navigate({ name: 'search', initialQuery: 'Boots' }); setSearchOpen(false); }} className="hover:text-white underline underline-offset-2">Boots</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[90px] z-50 bg-[#0c0c0e]/98 backdrop-blur-2xl border-t border-white/10 overflow-y-auto px-6 py-8">
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search size={16} className="absolute left-3 text-zinc-400" />
                <input 
                  type="text"
                  value={headerSearchInput}
                  onChange={(e) => setHeaderSearchInput(e.target.value)}
                  placeholder="Search collection..."
                  className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                />
              </form>
            </div>

            <div className="space-y-4 text-sm font-medium tracking-[0.2em] uppercase">
              <div>
                <button 
                  onClick={() => { navigate({ name: 'home' }); setMobileMenuOpen(false); }}
                  className="block py-2 text-zinc-300 hover:text-white"
                >
                  Home
                </button>
              </div>
              <div>
                <button 
                  onClick={() => { navigate({ name: 'shop' }); setMobileMenuOpen(false); }}
                  className="block py-2 text-zinc-300 hover:text-white"
                >
                  Complete Shop
                </button>
              </div>
              <div>
                <button 
                  onClick={() => { navigate({ name: 'categories' }); setMobileMenuOpen(false); }}
                  className="block py-2 text-zinc-300 hover:text-white"
                >
                  All Categories
                </button>
                <div className="pl-4 mt-2 space-y-2 border-l border-white/10">
                  {categories.map((cat) => (
                    <button
                      key={cat.categoryId}
                      onClick={() => {
                        navigate({ name: 'category', categoryId: cat.categoryId });
                        setMobileMenuOpen(false);
                      }}
                      className="block py-1 text-xs text-zinc-400 hover:text-white"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <button 
                  onClick={() => { navigate({ name: 'favorites' }); setMobileMenuOpen(false); }}
                  className="flex items-center justify-between w-full py-2 text-zinc-300 hover:text-white"
                >
                  <span>Wishlist</span>
                  {favorites.length > 0 && <span className="text-xs bg-white text-black px-2 py-0.5 rounded-full">{favorites.length}</span>}
                </button>
              </div>
              <div>
                <button 
                  onClick={() => { navigate({ name: 'orders' }); setMobileMenuOpen(false); }}
                  className="block py-2 text-zinc-300 hover:text-white"
                >
                  My Orders
                </button>
              </div>
              <div>
                <button 
                  onClick={() => { navigate({ name: 'tracking' }); setMobileMenuOpen(false); }}
                  className="block py-2 text-zinc-300 hover:text-white"
                >
                  Track Order
                </button>
              </div>
              <div>
                <button 
                  onClick={() => { navigate({ name: 'about' }); setMobileMenuOpen(false); }}
                  className="block py-2 text-zinc-300 hover:text-white"
                >
                  About Maison
                </button>
              </div>
              <div>
                <button 
                  onClick={() => { navigate({ name: 'contact' }); setMobileMenuOpen(false); }}
                  className="block py-2 text-zinc-300 hover:text-white"
                >
                  Concierge & Contact
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              {user ? (
                <button
                  onClick={() => { navigate({ name: 'account' }); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold text-center"
                >
                  Account Profile
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { navigate({ name: 'login' }); setMobileMenuOpen(false); }}
                    className="py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate({ name: 'register' }); setMobileMenuOpen(false); }}
                    className="py-3 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold text-center"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
