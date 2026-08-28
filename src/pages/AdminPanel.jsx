import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Clock, Save, ArrowLeft } from 'lucide-react';

export default function AdminPanel({ onNavigate }) {
  const [days, setDays] = useState(33);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(17);
  const [seconds, setSeconds] = useState(10);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSaveTimer = async () => {
    // Hitung waktu masa depan berdasarkan input
    const newTarget = new Date();
    newTarget.setDate(newTarget.getDate() + parseInt(days));
    newTarget.setHours(newTarget.getHours() + parseInt(hours));
    newTarget.setMinutes(newTarget.getMinutes() + parseInt(minutes));
    newTarget.setSeconds(newTarget.getSeconds() + parseInt(seconds));

    const { error } = await supabase
      .from('promo_settings')
      .upsert({ id: 1, target_date: newTarget.toISOString() });

    if (!error) {
      setStatusMsg('Timer Promo Berhasil Diperbarui!');
      setTimeout(() => setStatusMsg(''), 3000);
    } else {
      setStatusMsg('Gagal menyimpan timer promo.');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white p-6 text-gray-800 font-sans shadow-xl border-x border-pink-100">
      <button 
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-pink-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Web Utama
      </button>

      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-pink-600" />
        <h1 className="text-xl font-extrabold">Admin Panel - Set Promo Timer</h1>
      </div>

      {statusMsg && (
        <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl text-xs font-bold mb-4">
          {statusMsg}
        </div>
      )}

      <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-600">Jumlah Hari</label>
            <input 
              type="number" 
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full bg-white border border-pink-200 p-2 rounded-xl text-sm font-bold text-gray-800 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600">Jumlah Jam</label>
            <input 
              type="number" 
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full bg-white border border-pink-200 p-2 rounded-xl text-sm font-bold text-gray-800 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600">Jumlah Menit</label>
            <input 
              type="number" 
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full bg-white border border-pink-200 p-2 rounded-xl text-sm font-bold text-gray-800 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600">Jumlah Detik</label>
            <input 
              type="number" 
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              className="w-full bg-white border border-pink-200 p-2 rounded-xl text-sm font-bold text-gray-800 mt-1"
            />
          </div>
        </div>

        <button 
          onClick={handleSaveTimer}
          className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md"
        >
          <Save className="w-4 h-4" /> Simpan Perubahan Timer
        </button>
      </div>
    </div>
  );
}
