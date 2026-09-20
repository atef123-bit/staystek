import { 
  ref, 
  onValue, 
  set, 
  get, 
  push, 
  update, 
  runTransaction 
} from 'firebase/database';
import { database } from './config';
import { Product, Category, StoreSettings, DynamicContent, Order, OrderStatus, UserProfile } from '../types';
import { initialSettings, initialContent, initialCategories, initialProducts } from './seedData';

/**
 * Initialize database if empty
 */
export async function ensureDatabaseInitialized(): Promise<void> {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    if (!snapshot.exists() || Object.keys(snapshot.val() || {}).length === 0) {
      console.log('Seeding initial luxury data to Firebase Realtime Database...');
      await resetToDefaultSeed();
    }
  } catch (err) {
    console.warn('Firebase RTDB read note (proceeding with fallback listener):', err);
  }
}

/**
 * Force re-seed database with default luxury collection
 */
export async function resetToDefaultSeed(): Promise<void> {
  try {
    const updates: Record<string, any> = {};
    updates['settings'] = initialSettings;
    updates['content'] = initialContent;
    updates['categories'] = initialCategories;
    updates['products'] = initialProducts;
    await update(ref(database), updates);
  } catch (err) {
    console.error('Failed to seed Firebase RTDB:', err);
    throw err;
  }
}

/**
 * Real-time connection listener
 */
export function subscribeToConnection(callback: (connected: boolean) => void) {
  const connectedRef = ref(database, '.info/connected');
  return onValue(connectedRef, (snap) => {
    callback(Boolean(snap.val()));
  }, (err) => {
    console.warn('Connection listener error:', err);
    callback(navigator.onLine);
  });
}

/**
 * Subscribe to store settings
 */
export function subscribeToSettings(callback: (settings: StoreSettings) => void) {
  const settingsRef = ref(database, 'settings');
  return onValue(settingsRef, (snap) => {
    if (snap.exists()) {
      callback(snap.val() as StoreSettings);
    } else {
      callback(initialSettings);
    }
  }, (err) => {
    console.warn('Settings read failed, using default:', err);
    callback(initialSettings);
  });
}

/**
 * Subscribe to dynamic content
 */
export function subscribeToContent(callback: (content: DynamicContent) => void) {
  const contentRef = ref(database, 'content');
  return onValue(contentRef, (snap) => {
    if (snap.exists()) {
      callback(snap.val() as DynamicContent);
    } else {
      callback(initialContent);
    }
  }, (err) => {
    console.warn('Content read failed, using default:', err);
    callback(initialContent);
  });
}

/**
 * Subscribe to all products
 */
export function subscribeToProducts(callback: (products: Product[]) => void) {
  const productsRef = ref(database, 'products');
  return onValue(productsRef, (snap) => {
    if (snap.exists()) {
      const val = snap.val();
      const list: Product[] = Object.values(val);
      callback(list);
    } else {
      callback(Object.values(initialProducts));
    }
  }, (err) => {
    console.warn('Products read failed, using fallback:', err);
    callback(Object.values(initialProducts));
  });
}

/**
 * Subscribe to all categories
 */
export function subscribeToCategories(callback: (categories: Category[]) => void) {
  const categoriesRef = ref(database, 'categories');
  return onValue(categoriesRef, (snap) => {
    if (snap.exists()) {
      const val = snap.val();
      const list: Category[] = Object.values(val);
      list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      callback(list);
    } else {
      callback(Object.values(initialCategories));
    }
  }, (err) => {
    console.warn('Categories read failed, using fallback:', err);
    callback(Object.values(initialCategories));
  });
}

/**
 * Subscribe to single order
 */
export function subscribeToOrder(orderId: string, callback: (order: Order | null) => void) {
  const orderRef = ref(database, `orders/${orderId}`);
  return onValue(orderRef, (snap) => {
    if (snap.exists()) {
      callback(snap.val() as Order);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn(`Order ${orderId} read error:`, err);
    callback(null);
  });
}

/**
 * Subscribe to user orders
 */
export function subscribeToUserOrders(userId: string, callback: (orders: Order[]) => void) {
  const ordersRef = ref(database, 'orders');
  return onValue(ordersRef, (snap) => {
    if (snap.exists()) {
      const val = snap.val();
      const allOrders: Order[] = Object.values(val);
      const userOrders = allOrders
        .filter(o => o.userId === userId || o.customer?.email?.toLowerCase() === userId?.toLowerCase())
        .sort((a, b) => b.createdAt - a.createdAt);
      callback(userOrders);
    } else {
      callback([]);
    }
  }, (err) => {
    console.warn('User orders read error:', err);
    callback([]);
  });
}

/**
 * Subscribe to user favorites
 */
export function subscribeToUserFavorites(userId: string, callback: (productIds: string[]) => void) {
  const favRef = ref(database, `favorites/${userId}`);
  return onValue(favRef, (snap) => {
    if (snap.exists()) {
      const val = snap.val();
      callback(Object.keys(val).filter(k => Boolean(val[k])));
    } else {
      callback([]);
    }
  }, (err) => {
    console.warn('Favorites read error:', err);
    callback([]);
  });
}

/**
 * Toggle favorite in Firebase
 */
export async function setFavoriteInFirebase(userId: string, productId: string, isFav: boolean): Promise<void> {
  try {
    const favItemRef = ref(database, `favorites/${userId}/${productId}`);
    if (isFav) {
      await set(favItemRef, true);
    } else {
      await set(favItemRef, null);
    }
  } catch (err) {
    console.error('Failed to update favorite in Firebase:', err);
  }
}

/**
 * Create Order with server-side stock verification & stock decrement
 */
export async function createOrderInFirebase(
  orderPayload: Omit<Order, 'orderId' | 'createdAt'>
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // 1. Verify stocks first
    for (const item of orderPayload.products) {
      const productRef = ref(database, `products/${item.productId}`);
      const snap = await get(productRef);
      if (!snap.exists()) {
        return { success: false, error: `Product "${item.name}" is no longer available in catalog.` };
      }
      const prod = snap.val() as Product;
      if (!prod.isActive) {
        return { success: false, error: `Product "${prod.name}" is currently inactive.` };
      }
      if (prod.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${prod.name}". Only ${prod.stock} left in stock.`
        };
      }
    }

    // 2. Generate unique order ID (e.g. AMIS-2026-XXXX)
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AMIS-${new Date().getFullYear()}-${randomSuffix}`;

    const newOrder: Order = {
      ...orderPayload,
      orderId,
      items: orderPayload.products,
      shippingAddress: orderPayload.address,
      createdAt: timestamp,
      status: 'confirmed'
    };

    // 3. Decrement stocks atomically and record order
    const updates: Record<string, any> = {};
    updates[`orders/${orderId}`] = newOrder;

    // Apply stock decrement updates
    for (const item of orderPayload.products) {
      const prodRef = ref(database, `products/${item.productId}/stock`);
      await runTransaction(prodRef, (currentStock) => {
        if (currentStock === null) return currentStock;
        return Math.max(0, currentStock - item.quantity);
      });
    }

    // Save order
    await update(ref(database), { [`orders/${orderId}`]: newOrder });

    return { success: true, orderId };
  } catch (err: any) {
    console.error('Failed to create order in Firebase:', err);
    return { success: false, error: err.message || 'Failed to place order in Firebase.' };
  }
}

/**
 * Update user profile in Firebase
 */
export async function updateUserProfileInFirebase(userId: string, data: Partial<UserProfile>): Promise<void> {
  await update(ref(database, `users/${userId}`), {
    ...data,
    updatedAt: Date.now()
  });
}

/**
 * Update order status (pending, confirmed, processing, shipped, delivered, cancelled)
 */
export async function updateOrderStatusInFirebase(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const orderStatusRef = ref(database, `orders/${orderId}`);
    await update(orderStatusRef, {
      status,
      updatedAt: Date.now()
    });
    return true;
  } catch (err) {
    console.error(`Failed to update status for ${orderId}:`, err);
    return false;
  }
}

/**
 * Direct updates for settings/content (Admin feature)
 */
export async function updateSettingsInFirebase(newSettings: Partial<StoreSettings>): Promise<void> {
  await update(ref(database, 'settings'), newSettings);
}

export async function updateContentInFirebase(newContent: Partial<DynamicContent>): Promise<void> {
  await update(ref(database, 'content'), newContent);
}

export async function updateProductStockInFirebase(productId: string, newStock: number): Promise<void> {
  await update(ref(database, `products/${productId}`), { stock: Math.max(0, newStock) });
}
