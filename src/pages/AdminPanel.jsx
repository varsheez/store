import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { LayoutDashboard, Bell, Link2, Code2, MessageSquare, LogOut, ChevronDown, Tag, ShoppingCart } from 'lucide-react';

export default function AdminPanel({ onNavigate }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [globalExec, setGlobalExec] = useState(0);
  const [scripts, setScripts] = useState([]);
  const [messages, setMessages] = useState([]);

  // State Promo Target Date & Running Timer
  const [targetPromoDate, setTargetPromoDate] = useState(null);
  const [promoTimer, setPromoTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Input Form Waktu Promo
  const [inputTimer, setInputTimer] = useState({ days: 33, hours: 12, minutes: 17, seconds: 10 });

  // Popup Settings State
  const [popup, setPopup] = useState({
    id: 1,
    is_active: true,
    title: '',
    content: ''
  });

  // Site Settings State
  const [settings, setSettings] = useState({
    id: 1,
    discord_show: true,
    discord_name: 'Discord',
    discord_link: '',
    devtool_show: true,
    devtool_name: '',
    devtool_link: '',
    donate_show: true,
    donate_name: '',
    donate_link: ''
  });

  // Script / Produk Form State (Diperbarui dengan Harga & Badge Custom)
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [developerName, setDeveloperName] = useState('');
  const [price, setPrice] = useState(0); // Custom Harga
  const [badgeText, setBadgeText] = useState('HOT'); // Custom Lencana
  const [isVerified, setIsVerified] = useState(true);
  const [status, setStatus] = useState('ACTIVE');
  const [executions, setExecutions] = useState(0);
  const [version, setVersion] = useState('v1.0.0');
  const [description, setDescription] = useState('');

  const ADMIN_PASS = '089527732022';

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  // Hook interval agar Timer Promo Berjalan Realtime setiap detik
  useEffect(() => {
    if (!targetPromoDate) return;

    const interval = setInterval(() => {
      const diff = new Date(targetPromoDate).getTime() - new Date().getTime();
      if (diff > 0) {
        setPromoTimer({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setPromoTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetPromoDate]);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
    } else {
      alert('Password salah!');
    }
  };

  const handleBackToSite = () => {
    if (onNavigate) onNavigate('landing');
    else navigate('/');
  };

  async function loadAdminData() {
    // 1. Load Promo Target Date
    const { data: promoData } = await supabase.from('promo_settings').select('*').eq('id', 1).maybeSingle();
    if (promoData && promoData.target_date) {
      setTargetPromoDate(promoData.target_date);
    }

    // 2. Stats
    const { data: stats } = await supabase.from('global_stats').select('total_executions').eq('id', 1).maybeSingle();
    if (stats) setGlobalExec(stats.total_executions);

    // 3. Popup Settings
    const { data: popupData } = await supabase.from('popup_settings').select('*').eq('id', 1).maybeSingle();
    if (popupData) setPopup(popupData);

    // 4. Site Settings
    const { data: sets } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (sets) setSettings(sets);

    // 5. Scripts / Products
    const { data: scriptList } = await supabase.from('scripts').select('*').order('created_at', { ascending: false });
    if (scriptList) setScripts(scriptList);

    // 6. Messages
    const { data: msgList } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (msgList) setMessages(msgList);
  }

  const savePromoTimer = async () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(inputTimer.days || 0));
    targetDate.setHours(targetDate.getHours() + parseInt(inputTimer.hours || 0));
    targetDate.setMinutes(targetDate.getMinutes() + parseInt(inputTimer.minutes || 0));
    targetDate.setSeconds(targetDate.getSeconds() + parseInt(inputTimer.seconds || 0));

    const { error } = await supabase.from('promo_settings').upsert({
      id: 1,
      target_date: targetDate.toISOString()
    });

    if (!error) {
      alert('Waktu Berakhir Promo berhasil diperbarui!');
      loadAdminData();
    } else {
      alert('Gagal menyimpan promo timer: ' + error.message);
    }
  };

  const saveGlobalExec = async () => {
    await supabase.from('global_stats').upsert({ id: 1, total_executions: parseInt(globalExec) });
    alert('Global Executions berhasil disimpan!');
  };

  const savePopupSettings = async () => {
    const { error } = await supabase.from('popup_settings').upsert({
      id: 1,
      is_active: popup.is_active,
      title: popup.title,
      content: popup.content,
      updated_at: new Date().toISOString()
    });

    if (!error) {
      alert('Pengaturan Popup Announcement berhasil disimpan!');
      loadAdminData();
    } else {
      alert('Gagal menyimpan popup: ' + error.message);
    }
  };

  const saveSiteSettings = async () => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      discord_show: settings.discord_show,
      discord_name: settings.discord_name,
      discord_link: settings.discord_link,
      devtool_show: settings.devtool_show,
      devtool_name: settings.devtool_name,
      devtool_link: settings.devtool_link,
      donate_show: settings.donate_show,
      donate_name: settings.donate_name,
      donate_link: settings.donate_link
    });

    if (!error) {
      alert('Pengaturan tombol & link berhasil disimpan!');
      loadAdminData();
    } else {
      alert('Gagal menyimpan: ' + error.message);
    }
  };

  const handleSubmitScript = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      place_id: placeId,
      developer_name: developerName,
      price: parseFloat(price),
      badge_text: badgeText,
      is_verified: isVerified,
      status,
      executions: parseInt(executions),
      version,
      description
    };

    if (editingId) {
      await supabase.from('scripts').update(payload).eq('id', editingId);
    } else {
      await supabase.from('scripts').insert([payload]);
    }

    resetForm();
    loadAdminData();
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setTitle(s.title || '');
    setPlaceId(s.place_id || '');
    setDeveloperName(s.developer_name || '');
    setPrice(s.price || 0);
    setBadgeText(s.badge_text || 'HOT');
    setIsVerified(s.is_verified !== false);
    setStatus(s.status || 'ACTIVE');
    setExecutions(s.executions || 0);
    setVersion(s.version || 'v1.0.0');
    setDescription(s.description || '');
  };

  const toggleArchive = async (s) => {
    const nextState = !s.is_archived;
    await supabase.from('scripts').update({ is_archived: nextState }).eq('id', s.id);
    loadAdminData();
  };

  const handleDeleteScript = async (id) => {
    if (confirm('Hapus produk / script ini secara permanen?')) {
      await supabase.from('scripts').delete().eq('id', id);
      loadAdminData();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPlaceId('');
    setDeveloperName('');
    setPrice(0);
    setBadgeText('HOT');
    setIsVerified(true);
    setStatus('ACTIVE');
    setExecutions(0);
    setVersion('v1.0.0');
    setDescription('');
  };

  const handleReply = async (id, replyText) => {
    await supabase.from('messages').update({ admin_reply: replyText }).eq('id', id);
    alert('Balasan tersimpan!');
    loadAdminData();
  };

  const handleDeleteMsg = async (id) => {
    if (confirm('Hapus pesan?')) {
      await supabase.from('messages').delete().eq('id', id);
      loadAdminData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans relative">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
          <h2 className="font-bold text-xl tracking-widest text-white mb-2">ADMIN PANEL LOGIN</h2>
          <p className="text-xs text-gray-400 mb-6">Masukkan kode akses unik untuk mengelola sistem</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password Admin"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-white/30"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-200 transition shadow-lg"
            >
              MASUK PANEL
            </button>
          </form>
          <button onClick={handleBackToSite} className="mt-6 text-xs font-mono text-gray-400 hover:text-white hover:underline block mx-auto">
            ← Kembali ke Website Utama
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Promo', icon: LayoutDashboard },
    { id: 'popup', label: 'Popup Notifikasi', icon: Bell },
    { id: 'links', label: 'Tombol & Link', icon: Link2 },
    { id: 'scripts', label: 'Katalog Produk & Script', icon: Code2 },
    { id: 'messages', label: 'Pesan Masuk', icon: MessageSquare },
  ];

  return (
    <div className="bg-black/90 text-gray-100 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Admin */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <div>
            <h1 className="font-extrabold text-xl text-white tracking-wider">ADMIN PANEL SYSTEM</h1>
            <p className="font-mono text-xs text-gray-400">Pengaturan Realtime & Database Cloud</p>
          </div>
          <button 
            onClick={handleBackToSite} 
            className="px-5 py-2 rounded-full border border-white/20 text-xs font-mono text-gray-300 hover:bg-white hover:text-black transition flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" /> KELUAR
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="hidden md:flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? 'bg-white text-black shadow-lg' 
                    : 'glass-card text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full glass-card rounded-xl p-3 flex justify-between items-center text-xs font-mono text-white"
          >
            <span className="flex items-center gap-2">
              {navItems.find(i => i.id === activeTab)?.label}
            </span>
            <ChevronDown className={`w-4 h-4 transition ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-30 shadow-2xl space-y-1 p-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
                      activeTab === item.id ? 'bg-white text-black font-bold' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* TAB 1: DASHBOARD STATS & PROMO TIMER */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Display Countdown Berjalan */}
            <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-white/10">
              <h3 className="text-xs font-mono text-gray-400 mb-2">STATUS TIMER PROMO AKTIF (REALTIME)</h3>
              <div className="grid grid-cols-4 gap-2 text-center max-w-sm">
                <div className="bg-black/50 p-2 rounded-xl"><span className="text-xl font-bold font-mono text-white">{promoTimer.days}</span><p className="text-[10px] text-gray-400">HARI</p></div>
                <div className="bg-black/50 p-2 rounded-xl"><span className="text-xl font-bold font-mono text-white">{promoTimer.hours}</span><p className="text-[10px] text-gray-400">JAM</p></div>
                <div className="bg-black/50 p-2 rounded-xl"><span className="text-xl font-bold font-mono text-white">{promoTimer.minutes}</span><p className="text-[10px] text-gray-400">MENIT</p></div>
                <div className="bg-black/50 p-2 rounded-xl"><span className="text-xl font-bold font-mono text-white">{promoTimer.seconds}</span><p className="text-[10px] text-gray-400">DETIK</p></div>
              </div>
            </div>

            {/* Form Setting Timer Promo Berakhir */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-sm text-white border-b border-white/10 pb-2">TURANKAN WAKTU PROMO BARU</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1">Tambah Hari</label>
                  <input type="number" value={inputTimer.days} onChange={(e) => setInputTimer({ ...inputTimer, days: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1">Tambah Jam</label>
                  <input type="number" value={inputTimer.hours} onChange={(e) => setInputTimer({ ...inputTimer, hours: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1">Tambah Menit</label>
                  <input type="number" value={inputTimer.minutes} onChange={(e) => setInputTimer({ ...inputTimer, minutes: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1">Tambah Detik</label>
                  <input type="number" value={inputTimer.seconds} onChange={(e) => setInputTimer({ ...inputTimer, seconds: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white font-mono focus:outline-none" />
                </div>
              </div>
              <button onClick={savePromoTimer} className="px-6 py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-200 transition">
                SETEL ULANG TIMER PROMO
              </button>
            </div>

            {/* Total Executions Global */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-sm text-white border-b border-white/10 pb-2">TOTAL EXECUTIONS GLOBAL</h2>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block font-mono text-xs text-gray-400 mb-1">Hitungan Manual Execution Counter</label>
                  <input type="number" value={globalExec} onChange={(e) => setGlobalExec(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white font-mono focus:outline-none" />
                </div>
                <button onClick={saveGlobalExec} className="w-full sm:w-auto px-6 py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-200 transition">
                  SIMPAN EXECUTION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POPUP NOTIFIKASI */}
        {activeTab === 'popup' && (
          <div className="glass-card rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h2 className="font-bold text-sm text-white">POPUP ANNOUNCEMENT NOTIFICATION</h2>
              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={popup.is_active} 
                  onChange={(e) => setPopup({ ...popup, is_active: e.target.checked })} 
                  className="w-4 h-4 accent-white" 
                />
                Aktifkan Popup
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1">Judul Popup Announcement</label>
                <input 
                  type="text" 
                  value={popup.title} 
                  onChange={(e) => setPopup({ ...popup, title: e.target.value })} 
                  placeholder="misal: Promo Spesial & Updates!" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1">
                  Isi Pesan / Konten (Bisa spasi/enter & URL Link)
                </label>
                <textarea 
                  rows="6" 
                  value={popup.content} 
                  onChange={(e) => setPopup({ ...popup, content: e.target.value })} 
                  placeholder="Isikan pengumuman lengkap..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none font-sans leading-relaxed resize-none" 
                />
              </div>

              <button onClick={savePopupSettings} className="px-6 py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-200 transition">
                SIMPAN POPUP ANNOUNCEMENT
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TOMBOL & LINK */}
        {activeTab === 'links' && (
          <div className="glass-card rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h2 className="font-bold text-sm text-white border-b border-white/10 pb-2">PENGATURAN TOMBOL & REDIRECT LINK</h2>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-white">Tombol Discord Navbar</span>
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input type="checkbox" checked={settings.discord_show} onChange={(e) => setSettings({ ...settings, discord_show: e.target.checked })} className="w-4 h-4 accent-white" />
                  Tampilkan
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" value={settings.discord_name} onChange={(e) => setSettings({ ...settings, discord_name: e.target.value })} placeholder="Nama Tombol" className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white" />
                <input type="text" value={settings.discord_link} onChange={(e) => setSettings({ ...settings, discord_link: e.target.value })} placeholder="Link Invite Discord" className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white font-mono" />
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-white">Tombol Developer Tools</span>
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input type="checkbox" checked={settings.devtool_show} onChange={(e) => setSettings({ ...settings, devtool_show: e.target.checked })} className="w-4 h-4 accent-white" />
                  Tampilkan
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" value={settings.devtool_name} onChange={(e) => setSettings({ ...settings, devtool_name: e.target.value })} placeholder="Nama Tombol" className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white" />
                <input type="text" value={settings.devtool_link} onChange={(e) => setSettings({ ...settings, devtool_link: e.target.value })} placeholder="Link Redirect" className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white font-mono" />
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-white">Tombol Support / Donasi</span>
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input type="checkbox" checked={settings.donate_show} onChange={(e) => setSettings({ ...settings, donate_show: e.target.checked })} className="w-4 h-4 accent-white" />
                  Tampilkan
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" value={settings.donate_name} onChange={(e) => setSettings({ ...settings, donate_name: e.target.value })} placeholder="Nama Tombol" className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white" />
                <input type="text" value={settings.donate_link} onChange={(e) => setSettings({ ...settings, donate_link: e.target.value })} placeholder="Link Redirect" className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white font-mono" />
              </div>
            </div>

            <button onClick={saveSiteSettings} className="px-6 py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-200 transition">
              SIMPAN PENGATURAN LINK
            </button>
          </div>
        )}

        {/* TAB 4: KATALOG PRODUK & SCRIPT CUSTOM */}
        {activeTab === 'scripts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Form Input Produk & Script */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold text-sm text-white mb-4 border-b border-white/10 pb-2">
                {editingId ? 'EDIT INFORMASI PRODUK' : 'TAMBAH PRODUK / SCRIPT BARU'}
              </h2>
              <form onSubmit={handleSubmitScript} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Nama Produk / Game</label>
                    <input type="text" placeholder="misal: Blox Fruits Hub" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Harga (IDR / Robux)</label>
                    <input type="number" placeholder="misal: 15000" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Lencana / Badge Custom</label>
                    <input type="text" placeholder="misal: HOT, BEST, PROMO, FREE" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Place ID (misal: 9872472334)" value={placeId} onChange={(e) => setPlaceId(e.target.value)} required className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                  <input type="text" placeholder="Developer / Author Name" value={developerName} onChange={(e) => setDeveloperName(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none">
                    <option value="ACTIVE font-bold text-green-400">ACTIVE</option>
                    <option value="DISABLED">DISABLED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <label className="text-xs text-gray-300 font-mono flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} className="w-4 h-4 accent-white" />
                      Verified Badge (Centang)
                    </label>
                  </div>
                  <input type="number" placeholder="Executions Count" value={executions} onChange={(e) => setExecutions(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                  <input type="text" placeholder="Versi (misal: v2.1.0)" value={version} onChange={(e) => setVersion(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                </div>

                <div>
                  <textarea rows="3" placeholder="Deskripsi Ringkas Produk / Script..." value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none resize-none" />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-200 transition">
                    SIMPAN PRODUK
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="px-6 py-3 bg-white/10 text-white font-extrabold text-xs rounded-xl hover:bg-white/20 transition">
                      BATAL
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Tabel Katalog */}
            <div className="glass-card rounded-2xl p-6 overflow-x-auto">
              <h2 className="font-bold text-sm text-white mb-4 border-b border-white/10 pb-2">DAFTAR KATALOG PRODUK</h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 font-mono text-xs text-gray-400">
                    <th className="py-2">Produk</th>
                    <th className="py-2">Harga</th>
                    <th className="py-2">Badge</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {scripts.map((s) => (
                    <tr key={s.id} className="border-b border-white/5">
                      <td className="py-3 font-bold">{s.title}</td>
                      <td className="py-3 font-mono text-xs text-emerald-400">
                        {s.price > 0 ? `Rp ${s.price.toLocaleString('id-ID')}` : 'Gratis'}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                          {s.badge_text || 'HOT'}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-xs">
                        <span className={`px-2 py-0.5 rounded border ${s.status === 'ACTIVE' ? 'border-emerald-500/30 text-emerald-400' : 'border-gray-700 text-gray-500'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button onClick={() => toggleArchive(s)} className="px-3 py-1 font-bold text-xs rounded bg-white/10 text-gray-300 hover:bg-white/20">
                          {s.is_archived ? 'Unarchive' : 'Archive'}
                        </button>
                        <button onClick={() => handleEdit(s)} className="px-3 py-1 bg-white text-black font-bold text-xs rounded hover:bg-gray-200">Edit</button>
                        <button onClick={() => handleDeleteScript(s.id)} className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded hover:bg-red-700">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PESAN MASUK */}
        {activeTab === 'messages' && (
          <div className="glass-card rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h2 className="font-bold text-sm text-white border-b border-white/10 pb-2">PESAN MASUK (PUBLIC THREADS)</h2>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8 font-mono text-xs">Belum ada pesan masuk dari pengunjung.</div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span className="text-white font-bold">👤 {m.sender_name}</span>
                    <button onClick={() => handleDeleteMsg(m.id)} className="text-red-400 hover:underline">Hapus</button>
                  </div>
                  <p className="text-sm text-gray-200">{m.content}</p>
                  <div className="flex gap-2 pt-2">
                    <input type="text" defaultValue={m.admin_reply} id={`reply-input-${m.id}`} placeholder="Tulis balasan admin..." className="flex-1 bg-white/5 border border-white/10 rounded p-2 text-xs text-white focus:outline-none" />
                    <button onClick={() => handleReply(m.id, document.getElementById(`reply-input-${m.id}`).value)} className="px-4 py-2 bg-white text-black font-bold text-xs rounded hover:bg-gray-200 transition">
                      Balas
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
