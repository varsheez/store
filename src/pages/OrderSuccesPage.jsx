import React from 'react';
import { ArrowLeft, CheckCircle2, MessageSquare } from 'lucide-react';

export default function OrderSuccessPage({ orderData, onNavigate }) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fff5f8] px-4 py-4 text-gray-800 font-sans shadow-xl border-x border-pink-100">
      
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
        
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto border-4 border-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-xl font-black text-gray-900">Pesanan Berhasil Dikirim!</h1>
          <span className="inline-block bg-pink-50 text-pink-600 border border-pink-100 px-3 py-1 rounded-full text-xs font-bold mt-1">
            Kode Pesanan: {orderData?.orderCode || '#BLX13056841'}
          </span>
        </div>

        {/* DETAIL TABLE */}
        <div className="bg-pink-50/40 rounded-2xl p-3.5 border border-pink-100 space-y-2 text-xs text-left">
          <div className="flex justify-between">
            <span className="text-gray-500">Akun Roblox:</span>
            <span className="font-extrabold text-gray-900">@{orderData?.username || 'Roblox'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Nominal Robux:</span>
            <span className="font-extrabold text-pink-600">{orderData?.itemName || '2.200 Robux'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Pembayaran:</span>
            <span className="font-extrabold text-gray-900">Rp {orderData?.price ? orderData.price.toLocaleString('id-ID') : '45.000'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status Bukti:</span>
            <span className="font-extrabold text-emerald-600">{orderData?.statusBukti || 'Via Chat WhatsApp'}</span>
          </div>
        </div>

        {/* ADMIN NOTICE */}
        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 text-left space-y-1">
          <div className="text-xs font-extrabold text-emerald-800">Pesanan Sedang Diproses Admin</div>
          <p className="text-[10px] text-emerald-700 leading-relaxed">
            Data pembayaran dan akun kamu sudah berhasil diterima. Admin BloxyLucy sedang memproses pengiriman Robux ke akun @{orderData?.username || 'Roblox'}.
          </p>
          <div className="text-[10px] font-bold text-emerald-600 pt-1">Estimasi waktu pengiriman: 5 - 10 menit.</div>
        </div>

        {/* BUTTON CHAT WA */}
        <button 
          onClick={() => window.open('https://wa.me/6282343927560', '_blank')}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          Buka Chat WhatsApp Admin
        </button>

        <button 
          onClick={() => onNavigate('landing')}
          className="w-full py-3 bg-pink-50 text-pink-600 rounded-xl font-extrabold text-xs hover:bg-pink-100 border border-pink-100 transition"
        >
          Kembali ke Beranda
        </button>

      </div>

    </div>
  );
}
