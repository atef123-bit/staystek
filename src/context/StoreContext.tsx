import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  Product, 
  Category, 
  StoreSettings, 
  DynamicContent, 
  CartItem, 
  Order, 
  UserProfile, 
  PageRoute 
} from '../types';
import { 
  subscribeToProducts, 
  subscribeToCategories, 
  subscribeToSettings, 
  subscribeToContent, 
  subscribeToConnection, 
  subscribeToUserOrders, 
  subscribeToUserFavorites, 
  setFavoriteInFirebase, 
  ensureDatabaseInitialized 
} from '../firebase/database';
import { subscribeToAuth, getUserProfile, logoutUser } from '../firebase/auth';
import { initialSettings, initialContent } from '../firebase/seedData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  user: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  logout: () => Promise<void>;
  
  // Dynamic data
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  content: DynamicContent;
  isOnline: boolean;
  dataLoading: boolean;
  
  // Navigation
  currentRoute: PageRoute;
  navigate: (route: PageRoute) => void;
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, selectedSize: string, selectedColor: { name: string; hex: string }, qty?: number) => boolean;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Orders
  userOrders: Order[];
  
  // UI & Feedback
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  
  // Active search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const CART_STORAGE_KEY = 'amis_luxury_cart';
const LOCAL_FAVS_KEY = 'amis_luxury_favorites';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Dynamic Firebase data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [content, setContent] = useState<DynamicContent>(initialContent);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  // User orders & favorites from Firebase
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_FAVS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Parse current route from window.location.hash
  const parseRouteFromHash = (): PageRoute => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash || hash === '' || hash === 'home') return { name: 'home' };
    
    const parts = hash.split('/');
    const path = parts[0];
    const param = parts[1];

    switch (path) {
      case 'shop':
        return { name: 'shop', filterCategory: param };
      case 'categories':
        return { name: 'categories' };
      case 'category':
        return { name: 'category', categoryId: param || 'womenswear' };
      case 'product':
        return { name: 'product', productId: param || '' };
      case 'search':
        return { name: 'search', initialQuery: param ? decodeURIComponent(param) : '' };
      case 'favorites':
        return { name: 'favorites' };
      case 'cart':
        return { name: 'cart' };
      case 'login':
        return { name: 'login' };
      case 'register':
        return { name: 'register' };
      case 'account':
        return { name: 'account' };
      case 'checkout':
        return { name: 'checkout' };
      case 'order-success':
        return { name: 'order-success', orderId: param || '' };
      case 'orders':
        return param ? { name: 'order-details', orderId: param } : { name: 'orders' };
      case 'tracking':
        return { name: 'tracking', orderId: param };
      case 'about':
        return { name: 'about' };
      case 'contact':
        return { name: 'contact' };
      case 'shipping':
        return { name: 'shipping' };
      case 'returns':
        return { name: 'returns' };
      case 'privacy':
        return { name: 'privacy' };
      case 'terms':
        return { name: 'terms' };
      case 'faq':
        return { name: 'faq' };
      default:
        return { name: 'home' };
    }
  };

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(parseRouteFromHash);

  // Sync route on hash change
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseRouteFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: PageRoute) => {
    let hash = '';
    switch (route.name) {
      case 'home':
        hash = '';
        break;
      case 'shop':
        hash = route.filterCategory ? `shop/${route.filterCategory}` : 'shop';
        break;
      case 'categories':
        hash = 'categories';
        break;
      case 'category':
        hash = `category/${route.categoryId}`;
        break;
      case 'product':
        hash = `product/${route.productId}`;
        break;
      case 'search':
        hash = route.initialQuery ? `search/${encodeURIComponent(route.initialQuery)}` : 'search';
        break;
      case 'favorites':
        hash = 'favorites';
        break;
      case 'cart':
        hash = 'cart';
        break;
      case 'login':
        hash = 'login';
        break;
      case 'register':
        hash = 'register';
        break;
      case 'account':
        hash = 'account';
        break;
      case 'checkout':
        hash = 'checkout';
        break;
      case 'order-success':
        hash = `order-success/${route.orderId}`;
        break;
      case 'orders':
        hash = 'orders';
        break;
      case 'order-details':
        hash = `orders/${route.orderId}`;
        break;
      case 'tracking':
        hash = route.orderId ? `tracking/${route.orderId}` : 'tracking';
        break;
      case 'about':
      case 'contact':
      case 'shipping':
      case 'returns':
      case 'privacy':
      case 'terms':
      case 'faq':
        hash = route.name;
        break;
    }
    window.location.hash = hash;
  };

  // Toast notifier
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // 1. Initialize Firebase and Listen to Connection & Dynamic Data
  useEffect(() => {
    ensureDatabaseInitialized();

    const unsubConnection = subscribeToConnection((connected) => {
      setIsOnline(connected);
    });

    const unsubSettings = subscribeToSettings((data) => {
      setSettings(data);
    });

    const unsubContent = subscribeToContent((data) => {
      setContent(data);
    });

    const unsubCategories = subscribeToCategories((cats) => {
      setCategories(cats);
    });

    const unsubProducts = subscribeToProducts((prods) => {
      setProducts(prods);
      setDataLoading(false);
    });

    return () => {
      unsubConnection();
      unsubSettings();
      unsubContent();
      unsubCategories();
      unsubProducts();
    };
  }, []);

  // 2. Listen to Firebase Auth
  useEffect(() => {
    const unsubAuth = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
        setUserOrders([]);
      }
    });

    return () => unsubAuth();
  }, []);

  // 3. Listen to User Orders & Favorites when user changes
  useEffect(() => {
    if (!user) return;

    const unsubOrders = subscribeToUserOrders(user.uid, (orders) => {
      setUserOrders(orders);
    });

    const unsubFavs = subscribeToUserFavorites(user.uid, (favIds) => {
      if (favIds.length > 0) {
        setFavorites(favIds);
        try {
          localStorage.setItem(LOCAL_FAVS_KEY, JSON.stringify(favIds));
        } catch {}
      }
    });

    return () => {
      unsubOrders();
      unsubFavs();
    };
  }, [user]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_FAVS_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Favorites toggle
  const toggleFavorite = (productId: string) => {
    const exists = favorites.includes(productId);
    const updated = exists
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(updated);

    if (user) {
      setFavoriteInFirebase(user.uid, productId, !exists);
    }

    showToast(
      exists ? 'Removed from saved wishlist.' : 'Added to your private wishlist.',
      'info'
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Cart operations with inventory validation
  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: { name: string; hex: string },
    quantity = 1
  ): boolean => {
    if (!product.isActive || product.stock <= 0) {
      showToast('This exclusive piece is currently out of stock.', 'error');
      return false;
    }

    const itemId = `${product.productId}-${selectedSize}-${selectedColor.name}`;
    const existingIndex = cart.findIndex((item) => item.id === itemId);

    if (existingIndex > -1) {
      const existing = cart[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        showToast(`Cannot add more than available stock (${product.stock} units).`, 'error');
        return false;
      }

      const updated = [...cart];
      updated[existingIndex] = { ...existing, quantity: newQty, maxStock: product.stock };
      setCart(updated);
    } else {
      if (quantity > product.stock) {
        showToast(`Stock limit exceeded. Only ${product.stock} available.`, 'error');
        return false;
      }

      const newItem: CartItem = {
        id: itemId,
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        selectedSize,
        selectedColor,
        quantity,
        maxStock: product.stock
      };

      setCart([...cart, newItem]);
    }

    showToast(`"${product.name}" added to shopping bag.`, 'success');
    setIsCartDrawerOpen(true);
    return true;
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const clampedQty = Math.min(quantity, item.maxStock);
          if (quantity > item.maxStock) {
            showToast(`Max available stock is ${item.maxStock}`, 'info');
          }
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from shopping bag.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const logout = async () => {
    await logoutUser();
    showToast('You have signed out of AMIS ATELIER.', 'info');
    navigate({ name: 'home' });
  };

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  return (
    <StoreContext.Provider
      value={{
        user,
        userProfile,
        authLoading,
        logout,
        products,
        categories,
        settings,
        content,
        isOnline,
        dataLoading,
        currentRoute,
        navigate,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        favorites,
        toggleFavorite,
        isFavorite,
        userOrders,
        toasts,
        showToast,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isAdminModalOpen,
        setIsAdminModalOpen,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
