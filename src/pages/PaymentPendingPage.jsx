import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, UploadCloud, Lock, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function PaymentPendingPage({ orderData, onNavigate }) {
  const [waNumber, setWaNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleConfirm = async () => {
    if (!waNumber) {
      alert('Mohon masukkan nomor WhatsApp Anda!');
      return;
    }

    setIsUploading(true);
    await supabase.from('orders').insert([
      {
        order_code: orderData.orderCode,
        roblox_username: orderData.username,
        item_name: orderData.itemName,
        price: orderData.price,
        payment_method: 'QRIS Website',
        whatsapp_number: waNumber,
        notes: notes,
        status: 'Pending',
      }
    ]);

    setIsUploading(false);
    onNavigate('success', { ...orderData, waNumber, notes, statusBukti: 'Via Upload Web' });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fff5f8] px-4 py-4 text-gray-800 font-sans shadow-xl border-x border-pink-100">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-1 bg-white border border-pink-100 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
        </button>
        <span className="font-extrabold text-sm text-pink-600">Bloxy<span className="text-gray-800">Lucy</span></span>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm text-center space-y-4">
        
        {/* Check Icon */}
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto border-4 border-emerald-50">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-lg font-black text-gray-900">Menunggu Pembayaran</h1>
          <p className="text-xs font-bold text-pink-600">{orderData?.itemName} (@{orderData?.username})</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Kode Order: {orderData?.orderCode}</p>
        </div>

        <div>
          <span className="text-[10px] text-gray-400 font-bold block">Total Pembayaran:</span>
          <span className="text-xl font-black text-gray-900">Rp {orderData?.price.toLocaleString('id-ID')}</span>
        </div>

        {/* QRIS CARD IMAGE mockup */}
        <div className="border-2 border-dashed border-pink-200 p-3 rounded-2xl bg-pink-50/30">
          <img 
            src="https://via.placeholder.com/280x350/ff2a7a/ffffff?text=QRIS+BLOXYLUCY+OFFICIAL" 
            alt="QRIS Code"
            className="w-full max-w-[240px] mx-auto rounded-xl shadow-xs"
          />
          <p className="text-[10px] text-gray-500 mt-2 font-medium">
            Scan QRIS di atas via BCA, GoPay, OVO, DANA, ShopeePay, LinkAja, dll.
          </p>
        </div>

        {/* BUKTI UPLOAD AREA */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer">
          <UploadCloud className="w-6 h-6 text-pink-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-gray-800">Klik untuk upload bukti bayar</p>
          <p className="text-[9px] text-gray-400">Format JPG, PNG (Maksimal 5MB)</p>
          <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-500 mt-2">
            <Lock className="w-2.5 h-2.5 text-emerald-500" /> Dilindungi OCR Anti-Fraud
          </span>
        </div>

        {/* INPUT WHATSAPP */}
        <div className="text-left space-y-1 bg-pink-50/40 p-3 rounded-2xl border border-pink-100">
          <label className="text-xs font-bold text-gray-800">Nomor WhatsApp Anda *</label>
          <div className="flex gap-2">
            <span className="bg-white border border-pink-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 flex items-center">+62</span>
            <input 
              type="text" 
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="81234567890"
              className="flex-1 bg-white border border-pink-200 px-3 py-2 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-pink-500"
            />
          </div>
          <p className="text-[9px] text-gray-400">Nomor ini digunakan admin untuk konfirmasi pesanan.</p>
        </div>

        {/* OPTIONAL NOTES */}
        <div className="text-left space-y-1">
          <label className="text-xs font-bold text-gray-800 flex justify-between">
            <span>Catatan Pesanan</span>
            <span className="text-[9px] text-gray-400">Opsional</span>
          </label>
          <textarea 
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Tolong kirim ke Gamepass / catatan tambahan..."
            className="w-full bg-pink-50/30 border border-pink-200 p-2.5 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-pink-500"
          ></textarea>
        </div>

        {/* BUTTON CONFIRM */}
        <button 
          onClick={handleConfirm}
          disabled={isUploading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          {isUploading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
        </button>

        <button onClick={() => onNavigate('landing')} className="text-xs text-pink-600 font-bold hover:underline">
          Kembali ke Beranda
        </button>
      </div>

    </div>
  );
}
