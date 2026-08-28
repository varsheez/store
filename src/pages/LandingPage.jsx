import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, ShieldCheck, Zap, Clock, User, AlertCircle, CheckCircle2, QrCode, MessageSquare, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ROBUX_PACKAGES = [
  { id: 1, robux: '1.800', price: 35000, rawRobux: 1800, badge: null },
  { id: 2, robux: '2.200', price: 45000, rawRobux: 2200, badge: 'PROMO', isPromo: true },
  { id: 3, robux: '2.700', price: 50000, rawRobux: 2700, badge: null },
  { id: 4, robux: '3.200', price: 60000, rawRobux: 3200, badge: null },
  { id: 5, robux: '10.500', price: 200000, rawRobux: 10500, badge: 'SULTAN', fullWidth: true },
];

export default function LandingPage({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [selectedItem, setSelectedItem] = useState(ROBUX_PACKAGES[1]); // Default 2.200 Robux
  const [cartCount, setCartCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('website'); // 'website' atau 'whatsapp'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 33, hours: 12, minutes: 17, seconds: 10 });

  useEffect(() => {
    fetchPromoTimer();
  }, []);

  const fetchPromoTimer = async () => {
    const { data } = await supabase.from('promo_settings').select('*').eq('id', 1).single();
    if (data && data.target_date) {
      calculateTimeLeft(data.target_date);
    }
  };

  const calculateTimeLeft = (targetDateStr) => {
    const interval = setInterval(() => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleSelectItem = (pkg) => {
    setSelectedItem(pkg);
    setCartCount((prev) => prev + 1);
  };

  const handleProcessPayment = () => {
    const orderCode = '#BLX' + Math.floor(10000000 + Math.random() * 90000000);
    const orderData = {
      orderCode,
      username: username || 'Roblox',
      itemName: `${selectedItem.robux} Robux`,
      price: selectedItem.price,
      paymentMethod: paymentMethod === 'website' ? 'Via QRIS Website' : 'Via Chat WhatsApp',
    };

    if (paymentMethod === 'whatsapp') {
      const waText = encodeURIComponent(
        `Halo Admin!\n\nSaya ingin melakukan Top Up Robux:\n\n*Kode Order:* ${orderCode}\n*Username Roblox:* ${orderData.username}\n*Pesanan:*\n- ${selectedItem.robux} Robux (Rp  ${selectedItem.price.toLocaleString('id-ID')})\n*Total Harga:* Rp  ${selectedItem.price.toLocaleString('id-ID')}\n*Metode Pembayaran:* WhatsApp Direct / Chat Admin\n\nMohon segera diproses ya min, terima kasih!`
      );
      window.open(`https://api.whatsapp.com/send/?phone=6282343927560&text=${waText}&type=phone_number&app_absent=0`, '_blank');
      onNavigate('success', { ...orderData, statusBukti: 'Via Chat WhatsApp' });
    } else {
      onNavigate('payment', orderData);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-32 bg-[#fff5f8] text-gray-800 font-sans shadow-xl relative border-x border-pink-100">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            BL
          </div>
          <span className="font-extrabold text-xl tracking-tight text-pink-600">Bloxy<span className="text-gray-800">Lucy</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center relative border border-pink-100"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center border border-pink-100"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* DROPDOWN MENU NAVBAR */}
      {isMenuOpen && (
        <div className="bg-white border-b border-pink-100 px-6 py-4 space-y-3 shadow-md animate-in slide-in-from-top duration-200">
          <a href="#pricelist" className="block text-sm font-semibold text-gray-700 hover:text-pink-600">Pricelist Robux</a>
          <a href="#cara-order" className="block text-sm font-semibold text-gray-700 hover:text-pink-600">Cara Order</a>
          <a href="#testimoni" className="block text-sm font-semibold text-gray-700 hover:text-pink-600">Testimoni Member</a>
          <button 
            onClick={() => window.open('https://wa.me/6282343927560', '_blank')}
            className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Chat WhatsApp Admin
          </button>
        </div>
      )}

      {/* CART MODAL POPUP */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative border border-pink-100 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-gray-800">Keranjang Belanja BloxyLucy</h3>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
              <span>Daftar Paket ({cartCount} item):</span>
              <button onClick={() => setCartCount(0)} className="text-pink-600 font-bold hover:underline">Kosongkan Semua</button>
            </div>

            <div className="bg-pink-50/60 p-3 rounded-2xl border border-pink-100 flex justify-between items-center mb-4">
              <div>
                <div className="font-extrabold text-sm text-gray-900">{selectedItem.robux} Robux</div>
                <div className="text-xs font-bold text-pink-600">Rp {selectedItem.price.toLocaleString('id-ID')}</div>
              </div>
              <button onClick={() => setSelectedItem(ROBUX_PACKAGES[0])} className="text-xs text-pink-600 font-bold">Hapus</button>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100 mb-4">
              <span className="text-xs text-gray-600">Total Pembayaran:</span>
              <span className="text-lg font-black text-pink-600">Rp {selectedItem.price.toLocaleString('id-ID')}</span>
            </div>

            <button 
              onClick={() => { setIsCartOpen(false); }}
              className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold text-sm hover:bg-pink-600 shadow-md transition"
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}

      <main className="px-4 pt-4 space-y-6">

        {/* HERO BANNER SECTION */}
        <section className="bg-white/80 rounded-3xl p-5 text-center relative border border-pink-100 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-[10px] font-extrabold mb-3">
            <span>PROMO SPESIAL BULAN INI</span>
            <span className="bg-pink-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">LIMITED</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-1">
            ROBUX BULAN <span class="text-pink-600">INI</span>
          </h1>
          <p className="text-[11px] text-gray-500 mb-4">
            Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!
          </p>

          <div className="mb-5 bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
            <div className="flex items-baseline justify-center gap-1.5 mb-0.5">
              <span className="text-3xl font-black text-pink-600">2.200</span>
              <span className="text-xs font-bold text-gray-500">ROBUX</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs line-through text-gray-400">2.000 Robux</span>
              <span className="text-xl font-black text-gray-900">Rp 45.000</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-white p-2 rounded-xl text-center border border-pink-100 shadow-2xs">
              <div className="text-lg font-black text-pink-600">{timeLeft.days}</div>
              <div className="text-[9px] text-gray-400 font-bold">HARI</div>
            </div>
            <div className="bg-white p-2 rounded-xl text-center border border-pink-100 shadow-2xs">
              <div className="text-lg font-black text-pink-600">{timeLeft.hours}</div>
              <div className="text-[9px] text-gray-400 font-bold">JAM</div>
            </div>
            <div className="bg-white p-2 rounded-xl text-center border border-pink-100 shadow-2xs">
              <div className="text-lg font-black text-pink-600">{timeLeft.minutes}</div>
              <div className="text-[9px] text-gray-400 font-bold">MENIT</div>
            </div>
            <div className="bg-white p-2 rounded-xl text-center border border-pink-100 shadow-2xs">
              <div className="text-lg font-black text-pink-600">{timeLeft.seconds}</div>
              <div className="text-[9px] text-gray-400 font-bold">DETIK</div>
            </div>
          </div>
        </section>

        {/* STEP 1: DATA AKUN */}
        <section className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-black text-xs flex items-center justify-center">1</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">Masukkan Data Akun</h2>
              <p className="text-[10px] text-gray-400">Isi username Roblox kamu untuk pengiriman otomatis</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-pink-500" /> Username Roblox
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: BloxyGamer123" 
              className="w-full bg-pink-50/40 border border-pink-200 px-3.5 py-2.5 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
            <p className="text-[10px] text-gray-400 flex items-start gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-pink-500 shrink-0" /> Akun 100% aman tanpa memerlukan password.
            </p>
          </div>
        </section>

        {/* STEP 2: PILIH ROBUX */}
        <section id="pricelist" className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-black text-xs flex items-center justify-center">2</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">Pilih Robux</h2>
              <p className="text-[10px] text-gray-400">Klik icon (+) untuk memasukkan ke keranjang</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {ROBUX_PACKAGES.map((pkg) => {
              const isSelected = selectedItem.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedItem(pkg)}
                  className={`p-3 rounded-2xl relative border cursor-pointer transition ${
                    pkg.fullWidth ? 'col-span-2' : ''
                  } ${
                    isSelected 
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md' 
                      : 'bg-white border-pink-100 hover:border-pink-300 text-gray-800'
                  }`}
                >
                  {pkg.badge && (
                    <span className={`absolute -top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-pink-600' : 'bg-pink-600 text-white'
                    }`}>
                      {pkg.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-600'
                    }`}>R$</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSelectItem(pkg); }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-white text-pink-600' : 'bg-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white'
                      }`}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-xs font-black">{pkg.robux} <span className="text-[9px] font-normal opacity-80">Robux</span></div>
                  <div className="text-xs font-extrabold mt-0.5">Rp {pkg.price.toLocaleString('id-ID')}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 3: PILIH PEMBAYARAN */}
        <section className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-black text-xs flex items-center justify-center">3</span>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">Pilih Pembayaran</h2>
              <p className="text-[10px] text-gray-400">Pilih metode pembayaran yang kamu sukai</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* WEBSITE QRIS */}
            <div 
              onClick={() => setPaymentMethod('website')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-2 ${
                paymentMethod === 'website' 
                  ? 'bg-pink-50/60 border-pink-500 ring-2 ring-pink-500/20' 
                  : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Pembayaran via Website</div>
                    <div className="text-[9px] font-semibold text-pink-600 flex items-center gap-1">
                      <QrCode className="w-3 h-3" /> Scan QRIS & Upload Bukti
                    </div>
                  </div>
                </div>
                {paymentMethod === 'website' && (
                  <div className="w-4 h-4 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                )}
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Scan barcode QRIS (BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay) lalu upload bukti transfer di website.
              </p>
              <div className="flex items-center justify-between pt-1.5 border-t border-pink-100 text-[10px]">
                <span className="font-bold text-pink-600 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-pink-600" /> Verifikasi Otomatis
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${paymentMethod === 'website' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {paymentMethod === 'website' ? 'Dipilih' : 'Pilih'}
                </span>
              </div>
            </div>

            {/* WHATSAPP DIRECT */}
            <div 
              onClick={() => setPaymentMethod('whatsapp')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-2 ${
                paymentMethod === 'whatsapp' 
                  ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20' 
                  : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Pembayaran via WhatsApp</div>
                    <div className="text-[9px] font-semibold text-emerald-600 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Chat Langsung dengan Admin
                    </div>
                  </div>
                </div>
                {paymentMethod === 'whatsapp' && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                )}
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Pesan langsung via WhatsApp resmi BloxyLucy dengan format otomatis, dibantu admin sampai selesai.
              </p>
              <div className="flex items-center justify-between pt-1.5 border-t border-emerald-100 text-[10px]">
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Fast Respon 24 Jam
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${paymentMethod === 'whatsapp' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {paymentMethod === 'whatsapp' ? 'Dipilih' : 'Pilih'}
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* BOTTOM STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-pink-100 p-3 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[9px] text-gray-400 font-bold">Total Pesanan</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-gray-800">{selectedItem.robux} Robux</span>
              <span className="text-base font-black text-pink-600">Rp {selectedItem.price.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <button 
            onClick={handleProcessPayment}
            className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition ${
              paymentMethod === 'whatsapp' 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {paymentMethod === 'whatsapp' ? (
              <>
                <MessageSquare className="w-4 h-4 fill-white" />
                Beli via WhatsApp
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                Bayar Sekarang
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
