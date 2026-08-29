import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PaymentPendingPage from './pages/PaymentPendingPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [activeOrder, setActiveOrder] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (page, orderData = null) => {
    if (orderData) setActiveOrder(orderData);
    if (page === 'landing') navigate('/');
    else if (page === 'payment') navigate('/payment');
    else if (page === 'success') navigate('/success');
    else if (page === 'admin') navigate('/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
      <Route path="/payment" element={<PaymentPendingPage orderData={activeOrder} onNavigate={handleNavigate} />} />
      <Route path="/success" element={<OrderSuccessPage orderData={activeOrder} onNavigate={handleNavigate} />} />
      <Route path="/admin" element={<AdminPanel onNavigate={handleNavigate} />} />
    </Routes>
  );
}
