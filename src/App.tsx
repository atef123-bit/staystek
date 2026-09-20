import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/ToastContainer';
import { AdminModal } from './components/AdminModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryProductsPage } from './pages/CategoryProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { ReturnsPolicyPage } from './pages/ReturnsPolicyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPolicyPage } from './pages/TermsPolicyPage';
import { FAQPage } from './pages/FAQPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useStore();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  const renderRoute = () => {
    switch (currentRoute.name) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage initialCategory={currentRoute.filterCategory || currentRoute.category} />;
      case 'categories':
        return <CategoriesPage />;
      case 'category':
        return <CategoryProductsPage categoryId={currentRoute.categoryId} />;
      case 'product':
        return <ProductDetailsPage productId={currentRoute.productId} />;
      case 'search':
        return <SearchPage initialQuery={currentRoute.initialQuery || currentRoute.query} />;
      case 'favorites':
        return <FavoritesPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage orderId={currentRoute.orderId} />;
      case 'order-tracking':
      case 'tracking':
        return <OrderTrackingPage orderId={currentRoute.orderId} />;
      case 'orders':
        return <AccountPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'account':
        return <AccountPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'shipping':
        return <ShippingPolicyPage />;
      case 'returns':
        return <ReturnsPolicyPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPolicyPage />;
      case 'faq':
        return <FAQPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-[#ededed] selection:bg-white selection:text-black">
      {/* Top Persistent Header */}
      <Header />

      {/* Main Routed Page Content */}
      <main className="flex-1 w-full flex flex-col">
        {renderRoute()}
      </main>

      {/* Global Interactive Elements */}
      <CartDrawer />
      <QuickViewModal />
      <ToastContainer />
      <AdminModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
