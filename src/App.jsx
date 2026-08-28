import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import PaymentPendingPage from './pages/PaymentPendingPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'payment', 'success', 'admin'
  const [activeOrder, setActiveOrder] = useState(null);

  const navigateTo = (page, orderData = null) => {
    if (orderData) setActiveOrder(orderData);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'payment' && <PaymentPendingPage orderData={activeOrder} onNavigate={navigateTo} />}
      {currentPage === 'success' && <OrderSuccessPage orderData={activeOrder} onNavigate={navigateTo} />}
      {currentPage === 'admin' && <AdminPanel onNavigate={navigateTo} />}

      {/* Floating Admin Button Switcher */}
      <div className="fixed top-2 right-2 z-50">
        <button
          onClick={() => navigateTo(currentPage === 'admin' ? 'landing' : 'admin')}
          className="text-[10px] bg-black/80 text-white px-3 py-1.5 rounded-full backdrop-blur-md hover:bg-black"
        >
          {currentPage === 'admin' ? '← Mode User' : '⚙ Admin Panel'}
        </button>
      </div>
    </div>
  );
}
