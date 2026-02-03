import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ShoppingBag, Search, Music2, TrendingUp, 
  LayoutDashboard, Lock, Eye, EyeOff, X, 
  Upload, Plus, Music, DollarSign, Tag, 
  Image as ImageIcon, Play, Pause, SkipBack, SkipForward, 
  Volume2, Download, Trash2, ShieldCheck, 
  CreditCard, Loader2, ExternalLink, CheckCircle2, Home, FileAudio,
  AlertCircle, MessageSquareQuote, Send, Mail, Instagram, Twitter, Youtube, User, Info, Waves
} from 'lucide-react';
import AdminPortal from './components/AdminPortal';
import BeatCard from './components/BeatCard';
import CartModal from './components/CartModal';
import { Beat, CartItem } from './types';

// --- Constants ---
const SECRET_PASSWORD = 'BeatzbyMe';
const STRIPE_LINK = "https://buy.stripe.com/9B67sKbfkaWB3Sm4cSaIM00";
const CONTACT_EMAIL = "jmendezbeatz1@gmail.com";

// --- Sub-Components ---

const AboutSection = () => (
  <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="relative mb-16">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />
      <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-none mb-8">
        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">ARCHITECT.</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6 text-lg text-gray-400 leading-relaxed font-medium">
          <p>
            J Mendez is a multi-genre producer and sound designer dedicated to pushing the boundaries of modern sonics. With a signature style that blends gritty urban textures with polished cinematic atmospheres, he has become a go-to architect for artists looking to define their unique identity.
          </p>
          <p>
            Operating out of his private studio, Mendez focuses on "sonic storytelling"—ensuring every kick, snare, and synth lead serves a narrative purpose. His work spans across Dark Trap, Phonk, Melodic Drill, and Experimental R&B.
          </p>
          <div className="pt-8 flex flex-wrap gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <Waves className="text-purple-500" size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Industry Masters</span>
            </div>
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="text-pink-500" size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Verified Rights</span>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative aspect-[4/5] bg-zinc-900 rounded-[3.5rem] overflow-hidden border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" 
              alt="Studio Booth" 
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            />
            <div className="absolute bottom-10 left-10">
              <span className="text-4xl font-black italic tracking-tighter uppercase block">J MENDEZ</span>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-purple-400">Chief Engineer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  // Load beats from localStorage on mount to ensure persistence
  const [beats, setBeats] = useState<Beat[]>(() => {
    const saved = localStorage.getItem('jmendez_beats');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'marketplace' | 'about'>('marketplace');

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Offer Modal States
  const [offerBeat, setOfferBeat] = useState<Beat | null>(null);
  const [isOfferSent, setIsOfferSent] = useState(false);
  const [offerForm, setOfferForm] = useState({ amount: '', email: '', message: '' });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Sync beats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jmendez_beats', JSON.stringify(beats));
  }, [beats]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isPlaying, currentBeat]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthModalOpen(false);
      setIsAdminPortalOpen(true);
      setPassword('');
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const handleUpload = (newBeatData: Omit<Beat, 'id' | 'producer'>) => {
    const newBeat: Beat = {
      ...newBeatData,
      id: Date.now().toString(),
      producer: 'Jmendez Beatz',
      isSold: false
    } as Beat;

    setBeats([newBeat, ...beats]);
  };

  const deleteBeat = (id: string) => {
    if (confirm("Permanently delete this beat?")) {
      setBeats(beats.filter(b => b.id !== id));
      if (currentBeat?.id === id) {
        setCurrentBeat(null);
        setIsPlaying(false);
      }
    }
  };

  const toggleSold = (id: string) => {
    setBeats(beats.map(b => b.id === id ? { ...b, isSold: !b.isSold } : b));
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsOfferSent(true);
      setOfferForm({ amount: '', email: '', message: '' });
    }, 2000);
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setPurchasedItems([...cart]);
    setCart([]);
    setIsCartOpen(false);
    setIsCheckoutSuccess(true);
    setIsProcessing(false);
  };

  const downloadFile = (url: string, filename: string) => {
    // If it's a dropbox link, open it in a new tab for download
    if (url.includes('dropbox.com')) {
      window.open(url.replace('raw=1', 'dl=1'), '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const marketplaceBeats = beats.filter(b => !b.isSold && b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-purple-500/50 flex flex-col pb-32">
      {isCheckoutSuccess ? (
        <div className="fixed inset-0 z-[100] bg-[#070707] flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-10 text-green-500 animate-[bounce_1.5s_infinite] shadow-[0_0_50px_rgba(34,197,94,0.3)] rounded-full"><CheckCircle2 size={100} /></div>
          <h1 className="text-7xl font-black mb-4 italic tracking-tighter uppercase leading-none">ORDER SECURED</h1>
          <p className="text-gray-400 mb-12 max-w-lg text-lg">Your files are unlocked. Download below.</p>
          <div className="w-full max-w-2xl glass rounded-[3rem] border border-white/10 divide-y divide-white/5 mb-10 overflow-hidden shadow-2xl">
            {purchasedItems.map((item, i) => (
              <div key={i} className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-colors group">
                <div className="text-left flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center"><FileAudio size={32} /></div>
                  <div><h4 className="font-black text-2xl italic tracking-tight uppercase">{item.title}</h4><p className="text-xs text-purple-400 font-black uppercase tracking-[0.3em]">{item.licenseType} Distribution</p></div>
                </div>
                <button onClick={() => downloadFile(item.downloadUrl || '', `${item.title}_Master.wav`)} className="px-10 py-5 bg-white text-black font-black uppercase text-sm rounded-[1.5rem] flex items-center gap-3 hover:scale-105 transition-all"><Download size={22} /> Download Master</button>
              </div>
            ))}
          </div>
          <button onClick={() => setIsCheckoutSuccess(false)} className="flex items-center gap-2 text-gray-500 hover:text-white font-black uppercase text-xs tracking-[0.4em] transition-all"><Home size={18} /> BACK TO STORE</button>
        </div>
      ) : (
        <>
          <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center"><Music2 size={24} /></div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">Jmendez Beatz</span>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Added Portal and Contact to top Nav */}
              <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-purple-500 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={16} /> Portal
                </button>
                <a 
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <Mail size={16} /> Contact
                </a>
              </div>

              <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 group transition-all">
                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#070707]">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </nav>

          <main className="pt-32 flex-1">
            {activeView === 'marketplace' ? (
              <div className="max-w-7xl mx-auto px-10">
                <div className="max-w-4xl mb-24 relative">
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-[0.9] italic uppercase">
                    Your Next Hit <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Starts Here.</span>
                  </h1>
                  <p className="text-gray-400 text-xs md:text-sm font-black uppercase tracking-[0.3em] max-w-2xl mb-12">
                    All beats are digital downloads, available instantly after purchase
                  </p>
                  <div className="flex flex-col md:flex-row items-center gap-6 max-w-4xl">
                    <div className="relative flex-1 group w-full">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500" size={24} />
                      <input type="text" placeholder="SEARCH CRATE..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-8 text-lg font-bold focus:ring-4 focus:ring-purple-600/10 outline-none transition-all tracking-tighter" />
                    </div>
                  </div>
                </div>

                {marketplaceBeats.length === 0 ? (
                  <div className="text-center py-40 border border-white/5 rounded-3xl bg-white/5">
                    <Music2 size={64} className="mx-auto mb-6 text-gray-600" />
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">Crate Empty</h3>
                    <p className="text-gray-500 mt-2">Upload your first hit in the Developer Portal.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 mb-40">
                    {marketplaceBeats.map(beat => (
                      <BeatCard 
                        key={beat.id} 
                        beat={beat} 
                        isPlaying={isPlaying && currentBeat?.id === beat.id} 
                        onPlay={(b) => { if(currentBeat?.id === b.id) setIsPlaying(!isPlaying); else { setCurrentBeat(b); setIsPlaying(true); } }} 
                        onAddToCart={(b, t) => { if(!b.isSold) { setCart([...cart, { beatId: b.id, title: b.title, price: t === 'Lease' ? b.priceLease : b.priceExclusive, licenseType: t, downloadUrl: b.audioUrl }]); setIsCartOpen(true); } }}
                        onMakeOffer={(b: Beat) => { if(!b.isSold) setOfferBeat(b); }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <AboutSection />
            )}
          </main>

          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-lg">
            <div className="glass rounded-[2.5rem] p-2 border border-white/10 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <button onClick={() => setActiveView('marketplace')} className={`flex flex-col items-center gap-1 flex-1 py-3 rounded-3xl transition-all ${activeView === 'marketplace' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                <Music size={22} className={activeView === 'marketplace' ? 'fill-current' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest">Market</span>
              </button>
              <button onClick={() => setActiveView('about')} className={`flex flex-col items-center gap-1 flex-1 py-3 rounded-3xl transition-all ${activeView === 'about' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                <Info size={22} className={activeView === 'about' ? 'fill-current' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest">About</span>
              </button>
              <button onClick={() => setIsAuthModalOpen(true)} className="flex flex-col items-center gap-1 flex-1 py-3 rounded-3xl text-gray-500 hover:text-purple-400 transition-all">
                <LayoutDashboard size={22} />
                <span className="text-[10px] font-black uppercase tracking-widest">Portal</span>
              </button>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex flex-col items-center gap-1 flex-1 py-3 rounded-3xl text-gray-500 hover:text-pink-400 transition-all">
                <Mail size={22} />
                <span className="text-[10px] font-black uppercase tracking-widest">Contact</span>
              </a>
            </div>
          </div>

          {currentBeat && (
            <div className="fixed bottom-28 left-0 right-0 z-50 px-6 pointer-events-none">
              <div className="max-w-4xl mx-auto glass rounded-[2rem] p-4 shadow-2xl border border-white/10 relative overflow-hidden pointer-events-auto">
                <audio ref={audioRef} src={currentBeat.audioUrl} onTimeUpdate={() => setProgress((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1) * 100)} onEnded={() => setIsPlaying(false)} />
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${progress}%` }} /></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 w-1/3">
                    <img src={currentBeat.coverArt} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    <div className="hidden sm:block truncate"><h4 className="font-black text-sm truncate uppercase italic leading-none">{currentBeat.title}</h4></div>
                  </div>
                  <div className="flex items-center gap-8">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                  </div>
                  <div className="w-1/3 flex justify-end gap-4 text-gray-500"><Lock size={20} /></div>
                </div>
              </div>
            </div>
          )}

          {isAuthModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
              <div className={`w-full max-w-md glass rounded-[3rem] p-12 border-t-2 border-purple-500/50 shadow-3xl ${authError ? 'animate-shake border-red-500' : ''}`}>
                <div className="text-center mb-10"><div className="w-20 h-20 bg-purple-600/10 text-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-inner"><Lock size={32} /></div><h2 className="text-3xl font-black uppercase italic tracking-tighter">DEVELOPER ACCESS</h2></div>
                <form onSubmit={handleAuth} className="space-y-6">
                  <input autoFocus type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-5 px-6 text-center text-xl tracking-[0.5em] focus:border-purple-500 outline-none transition-all placeholder:text-gray-800 font-black" />
                  <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg uppercase italic tracking-tighter hover:bg-purple-50 transition-all">Verify Identity</button>
                </form>
              </div>
            </div>
          )}

          {isAdminPortalOpen && (
            <AdminPortal isOpen={isAdminPortalOpen} onClose={() => setIsAdminPortalOpen(false)} onUpload={handleUpload} beats={beats} onDelete={deleteBeat} onToggleSold={toggleSold} />
          )}

          {isCartOpen && (
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(cart.filter(item => item.beatId !== id))} onCheckout={handleCheckout} />
          )}
        </>
      )}

      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.15s ease-in-out 0s 2; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
