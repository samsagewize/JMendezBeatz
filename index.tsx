
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ShoppingBag, Search, Music2, TrendingUp, 
  LayoutDashboard, Lock, Eye, EyeOff, X, 
  Upload, Plus, Music, DollarSign, Tag, 
  Image as ImageIcon, Play, Pause, SkipBack, SkipForward, 
  Volume2, Download, Trash2, ShieldCheck, 
  CreditCard, Loader2, ExternalLink, CheckCircle2, Home, FileAudio,
  AlertCircle
} from 'lucide-react';

// --- Types ---
interface Beat {
  id: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  tags: string[];
  priceLease: number;
  priceExclusive: number;
  audioUrl: string; // Stores Blob URL for local session
  coverArt: string; // Stores Blob URL for local session
  description: string;
}

interface CartItem {
  beatId: string;
  title: string;
  price: number;
  licenseType: 'Lease' | 'Exclusive';
  downloadUrl?: string;
}

// --- Constants ---
const SECRET_PASSWORD = 'BeatzbyMe';
const STRIPE_LINK = "https://buy.stripe.com/test_00w9AU1px7y87pC1msgMw01";

const INITIAL_BEATS: Beat[] = [
  {
    id: '1',
    title: 'Midnight Phonk',
    producer: 'Jmendez Beatz',
    bpm: 140,
    key: 'Cm',
    tags: ['Phonk', 'Dark', 'Aggressive'],
    priceLease: 24.99,
    priceExclusive: 249.99,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverArt: 'https://picsum.photos/seed/phonk/400/400',
    description: 'A heavy distorted cowbell phonk beat perfect for drifting.'
  }
];

// --- Sub-Components ---

const BeatCard = ({ beat, isPlaying, onPlay, onAddToCart }: { beat: Beat, isPlaying: boolean, onPlay: (b: Beat) => void, onAddToCart: (b: Beat, t: 'Lease' | 'Exclusive') => void }) => (
  <div className="group relative glass rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
    <div className="relative aspect-square overflow-hidden bg-zinc-900">
      <img src={beat.coverArt} alt={beat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button onClick={() => onPlay(beat)} className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-2xl">
          {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
        </button>
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black border border-white/10 uppercase tracking-widest">{beat.bpm} BPM</span>
        <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black border border-white/10 uppercase tracking-widest">{beat.key}</span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-black text-xl truncate mb-1 italic uppercase tracking-tighter">{beat.title}</h3>
      <p className="text-purple-400 text-xs font-bold mb-4 uppercase tracking-[0.2em]">{beat.producer}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {beat.tags.map(tag => <span key={tag} className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 font-bold uppercase">#{tag}</span>)}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onAddToCart(beat, 'Lease')} className="flex flex-col items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group/btn">
          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Lease</span>
          <span className="text-sm font-bold">${beat.priceLease}</span>
        </button>
        <button onClick={() => onAddToCart(beat, 'Exclusive')} className="flex flex-col items-center justify-center py-3 bg-purple-600 hover:bg-purple-500 rounded-2xl transition-all shadow-lg shadow-purple-900/40">
          <span className="text-[9px] text-purple-200 uppercase font-black tracking-widest mb-1">Exclusive</span>
          <span className="text-sm font-bold">${beat.priceExclusive}</span>
        </button>
      </div>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [beats, setBeats] = useState<Beat[]>(INITIAL_BEATS);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Admin Upload States
  const [adminForm, setAdminForm] = useState({
    title: '', bpm: 140, key: 'Cm', tags: '', priceLease: 24.99, priceExclusive: 249.99, description: ''
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

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

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !coverFile) {
      alert("Error: Both Audio and Cover files are mandatory for distribution.");
      return;
    }

    const audioUrl = URL.createObjectURL(audioFile);
    const coverArt = URL.createObjectURL(coverFile);

    const newBeat: Beat = {
      ...adminForm,
      id: Date.now().toString(),
      producer: 'Jmendez Beatz',
      tags: adminForm.tags.split(',').map(t => t.trim()).filter(t => t),
      audioUrl,
      coverArt
    };

    setBeats([newBeat, ...beats]);
    setIsAdminPortalOpen(false);
    // Reset form
    setAdminForm({ title: '', bpm: 140, key: 'Cm', tags: '', priceLease: 24.99, priceExclusive: 249.99, description: '' });
    setAudioFile(null);
    setCoverFile(null);
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    // Open the user's provided Stripe link
    window.open(STRIPE_LINK, '_blank');
    
    // Simulate successful redirect/return
    setTimeout(() => {
      setPurchasedItems([...cart]);
      setCart([]);
      setIsCartOpen(false);
      setIsCheckoutSuccess(true);
      setIsProcessing(false);
    }, 2800);
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBeats = beats.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-purple-500/50">
      {isCheckoutSuccess ? (
        <div className="fixed inset-0 z-[100] bg-[#070707] flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
          <div className="mb-10 text-green-500 animate-[bounce_1.5s_infinite] shadow-[0_0_50px_rgba(34,197,94,0.3)] rounded-full"><CheckCircle2 size={100} /></div>
          <h1 className="text-7xl font-black mb-4 italic tracking-tighter uppercase leading-none">ORDER SECURED</h1>
          <p className="text-gray-400 mb-12 max-w-lg text-lg font-medium">Payment confirmed. Your production assets are ready for download.</p>
          
          <div className="w-full max-w-2xl glass rounded-[3rem] border border-white/10 divide-y divide-white/5 mb-10 overflow-hidden shadow-2xl">
            {purchasedItems.map((item, i) => (
              <div key={i} className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-colors group">
                <div className="text-left flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"><FileAudio size={32} /></div>
                  <div>
                    <h4 className="font-black text-2xl italic tracking-tight uppercase">{item.title}</h4>
                    <p className="text-xs text-purple-400 font-black uppercase tracking-[0.3em]">{item.licenseType} Distribution Rights</p>
                  </div>
                </div>
                <button 
                  onClick={() => downloadFile(item.downloadUrl || '', `${item.title}_Master.wav`)} 
                  className="px-10 py-5 bg-white text-black font-black uppercase text-sm rounded-[1.5rem] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                  <Download size={22} /> Download WAV
                </button>
              </div>
            ))}
          </div>
          
          <button onClick={() => setIsCheckoutSuccess(false)} className="flex items-center gap-2 text-gray-500 hover:text-white font-black uppercase text-xs tracking-[0.4em] transition-all"><Home size={18} /> BACK TO STOREFRONT</button>
        </div>
      ) : (
        <>
          {/* Top Bar */}
          <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-900/40"><Music2 size={28} /></div>
              <span className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Jmendez Beatz</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
              <a href="#" className="text-white hover:text-purple-400 transition-colors">Marketplace</a>
              <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 hover:text-purple-400 transition-colors bg-white/5 px-6 py-3 rounded-full border border-white/5 shadow-inner hover:border-purple-500/30 transition-all"><LayoutDashboard size={14} /> Developer Portal</button>
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
              <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-7 h-7 bg-purple-600 text-[11px] font-black flex items-center justify-center rounded-full border-2 border-[#070707] shadow-lg animate-pulse">{cart.length}</span>}
            </button>
          </nav>

          {/* Hero & Market */}
          <main className="pt-56 pb-48 max-w-7xl mx-auto px-10">
            <div className="max-w-5xl mb-32 relative">
              <div className="absolute -top-32 -left-32 -z-10 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
              <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter mb-10 leading-[0.8] italic uppercase">ELEVATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">SOUND.</span></h1>
              <p className="text-3xl text-gray-500 mb-16 max-w-3xl font-medium leading-tight">Elite-tier production marketplace. Secure distribution rights and instant local fulfillment.</p>
              
              <div className="relative max-w-2xl group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={28} />
                <input 
                  type="text" 
                  placeholder="SEARCH VIBE, GENRE, OR BPM..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-7 pl-16 pr-8 text-xl font-bold focus:ring-8 focus:ring-purple-600/10 focus:border-purple-600/40 outline-none transition-all shadow-3xl placeholder:text-gray-800 tracking-tighter" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {filteredBeats.map(beat => (
                <BeatCard 
                  key={beat.id} 
                  beat={beat} 
                  isPlaying={isPlaying && currentBeat?.id === beat.id} 
                  onPlay={(b) => { 
                    if(currentBeat?.id === b.id) setIsPlaying(!isPlaying); 
                    else { setCurrentBeat(b); setIsPlaying(true); } 
                  }} 
                  onAddToCart={(b, t) => { 
                    setCart([...cart, { 
                      beatId: b.id, 
                      title: b.title, 
                      price: t === 'Lease' ? b.priceLease : b.priceExclusive, 
                      licenseType: t, 
                      downloadUrl: b.audioUrl 
                    }]); 
                    setIsCartOpen(true); 
                  }} 
                />
              ))}
              {filteredBeats.length === 0 && (
                <div className="col-span-full py-40 text-center opacity-30">
                  <Music size={100} className="mx-auto mb-6" />
                  <p className="text-3xl font-black italic uppercase tracking-widest">No Sonics Found</p>
                </div>
              )}
            </div>
          </main>

          {/* Player Footer */}
          {currentBeat && (
            <div className="fixed bottom-0 left-0 right-0 z-50 p-8">
              <div className="max-w-7xl mx-auto glass rounded-[2.5rem] p-6 shadow-2xl border border-white/10 relative overflow-hidden">
                <audio 
                  ref={audioRef} 
                  src={currentBeat.audioUrl} 
                  onTimeUpdate={() => setProgress((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1) * 100)} 
                  onEnded={() => setIsPlaying(false)} 
                />
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-6 w-1/3">
                    <img src={currentBeat.coverArt} className="w-16 h-16 rounded-[1.2rem] object-cover shadow-2xl border border-white/10" />
                    <div className="hidden md:block truncate">
                      <h4 className="font-black text-2xl truncate tracking-tight uppercase italic leading-none mb-1">{currentBeat.title}</h4>
                      <p className="text-purple-500 text-xs font-black uppercase tracking-[0.3em]">{currentBeat.producer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <button className="text-gray-600 hover:text-white transition-colors transform active:scale-90"><SkipBack size={28} fill="currentColor" /></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-2xl">
                      {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="text-gray-600 hover:text-white transition-colors transform active:scale-90"><SkipForward size={28} fill="currentColor" /></button>
                  </div>
                  <div className="w-1/3 flex justify-end gap-8 text-gray-500">
                    <Volume2 size={26} className="hidden sm:block hover:text-white transition-colors cursor-pointer" />
                    <button onClick={() => downloadFile(currentBeat.audioUrl, `${currentBeat.title}_Demo.wav`)} className="hover:text-white transition-colors transform hover:scale-110 active:scale-90"><Download size={26} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Developer Portal (Admin) */}
          {isAdminPortalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/98 backdrop-blur-[60px]">
              <div className="w-full max-w-5xl glass rounded-[4rem] border border-purple-500/20 max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-12 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/20 via-transparent to-transparent">
                  <div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter flex items-center gap-5"><Upload className="text-purple-500" /> MASTER UPLOAD</h2>
                    <p className="text-gray-500 text-sm font-black uppercase tracking-[0.4em] mt-2">Publishing Interface • Jmendez Protocol</p>
                  </div>
                  <button onClick={() => setIsAdminPortalOpen(false)} className="w-14 h-14 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"><X size={40} /></button>
                </div>
                
                <form onSubmit={handleUpload} className="p-12 overflow-y-auto space-y-12 scrollbar-hide">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-10">
                      <div>
                        <label className="text-[11px] font-black uppercase text-purple-500 tracking-[0.3em] mb-3 block">Production Title</label>
                        <input required placeholder="E.G. CHROME SOUL" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl focus:border-purple-500 outline-none uppercase font-black italic tracking-tight" value={adminForm.title} onChange={e => setAdminForm({...adminForm, title: e.target.value})} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <label className="text-[11px] font-black uppercase text-gray-500 tracking-[0.3em] mb-3 block">BPM</label>
                          <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl outline-none focus:border-white/30 font-bold" value={adminForm.bpm} onChange={e => setAdminForm({...adminForm, bpm: parseInt(e.target.value)})} />
                        </div>
                        <div>
                          <label className="text-[11px] font-black uppercase text-gray-500 tracking-[0.3em] mb-3 block">Scale Key</label>
                          <input required placeholder="AM" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl outline-none focus:border-white/30 font-bold uppercase" value={adminForm.key} onChange={e => setAdminForm({...adminForm, key: e.target.value})} />
                        </div>
                      </div>

                      <div className="space-y-5">
                        <label className="text-[11px] font-black uppercase text-pink-500 tracking-[0.3em] mb-3 block">Master Distribution File (WAV/MP3)</label>
                        <div className={`relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all flex flex-col items-center justify-center text-center gap-4 ${audioFile ? 'border-green-500 bg-green-500/5' : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'}`}>
                          <input required type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${audioFile ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/10 text-gray-400'}`}><Music size={32} /></div>
                          <span className="font-black text-sm uppercase tracking-[0.2em]">{audioFile ? audioFile.name : 'Select Master File'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <label className="text-[11px] font-black uppercase text-gray-500 tracking-[0.3em] mb-3 block">Lease Price ($)</label>
                          <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold outline-none" value={adminForm.priceLease} onChange={e => setAdminForm({...adminForm, priceLease: parseFloat(e.target.value)})} />
                        </div>
                        <div>
                          <label className="text-[11px] font-black uppercase text-gray-500 tracking-[0.3em] mb-3 block">Exclusive ($)</label>
                          <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold outline-none" value={adminForm.priceExclusive} onChange={e => setAdminForm({...adminForm, priceExclusive: parseFloat(e.target.value)})} />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-black uppercase text-gray-500 tracking-[0.3em] mb-3 block">Mood Tags (Comma separated)</label>
                        <input placeholder="Trap, Melodic, Dark" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-white/30 font-bold" value={adminForm.tags} onChange={e => setAdminForm({...adminForm, tags: e.target.value})} />
                      </div>

                      <div className="space-y-5">
                        <label className="text-[11px] font-black uppercase text-blue-500 tracking-[0.3em] mb-3 block">Visual Art (High Res Cover)</label>
                        <div className={`relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all flex flex-col items-center justify-center text-center gap-4 ${coverFile ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/50 hover:bg-white/5'}`}>
                          <input required type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                          {coverFile ? (
                            <div className="relative">
                              <img src={URL.createObjectURL(coverFile)} className="w-24 h-24 rounded-2xl object-cover shadow-2xl border border-blue-500/50" />
                              <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-black border-4 border-[#070707]"><CheckCircle2 size={16} /></div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-white/10 text-gray-400 flex items-center justify-center"><ImageIcon size={32} /></div>
                          )}
                          <span className="font-black text-sm uppercase tracking-[0.2em]">{coverFile ? coverFile.name : 'Select Cover Art'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 py-8 rounded-[2.5rem] font-black text-3xl uppercase italic shadow-3xl shadow-purple-900/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-5 group">
                    <Plus className="group-hover:rotate-180 transition-transform duration-700" size={36} /> DEPLOY TO MARKETPLACE
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Admin Authentication Modal */}
          {isAuthModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
              <div className={`w-full max-w-md glass rounded-[4rem] p-12 border-t-2 border-purple-500/50 shadow-3xl ${authError ? 'animate-shake border-red-500' : ''}`}>
                <div className="text-center mb-12">
                  <div className="w-24 h-24 bg-purple-600/10 text-purple-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-purple-500/20 shadow-inner"><Lock size={48} /></div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">DEVELOPER ACCESS</h2>
                  <p className="text-gray-500 text-sm mt-3 font-bold uppercase tracking-[0.2em]">Enter Jmendez Protocol Key</p>
                </div>
                <form onSubmit={handleAuth} className="space-y-8">
                  <div className="relative">
                    <input autoFocus type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-center text-2xl tracking-[0.5em] focus:border-purple-500 outline-none transition-all placeholder:text-gray-800 placeholder:tracking-normal font-black" />
                    {authError && <div className="absolute -bottom-10 left-0 right-0 text-center text-red-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"><AlertCircle size={14} /> Authentication Failure</div>}
                  </div>
                  <button type="submit" className="w-full bg-white text-black py-6 rounded-[1.5rem] font-black text-xl uppercase italic tracking-tighter hover:bg-purple-50 transition-all shadow-2xl active:scale-95">Verify Identity</button>
                  <button type="button" onClick={() => setIsAuthModalOpen(false)} className="w-full text-xs text-gray-700 uppercase tracking-[0.5em] font-black pt-4 hover:text-white transition-colors">Terminate Attempt</button>
                </form>
              </div>
            </div>
          )}

          {/* Cart View */}
          {isCartOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
              <div className="relative w-full max-w-2xl glass rounded-[4rem] overflow-hidden border border-white/10 shadow-3xl">
                {isProcessing && (
                  <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-12">
                    <Loader2 className="w-20 h-20 text-purple-500 animate-spin mb-8" />
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">SECURING PIPELINE...</h3>
                    <p className="text-gray-500 text-sm font-black uppercase tracking-[0.4em]">Stripe Checkout Interface Opening</p>
                  </div>
                )}
                
                <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">DIGITAL CRATE</h2>
                  <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"><X size={32} /></button>
                </div>
                
                <div className="max-h-[45vh] overflow-y-auto p-10 space-y-6 scrollbar-hide">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 opacity-20">
                      <ShoppingBag size={80} className="mx-auto mb-6" />
                      <p className="text-xl font-black uppercase tracking-[0.4em]">Crate Empty</p>
                    </div>
                  ) : cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-purple-600/20 text-purple-500 rounded-xl flex items-center justify-center font-black">{idx + 1}</div>
                        <div>
                          <h4 className="font-black italic uppercase text-2xl tracking-tight">{item.title}</h4>
                          <p className="text-[10px] text-purple-500 uppercase font-black tracking-[0.3em]">{item.licenseType} Rights</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="font-black text-2xl italic">${item.price}</span>
                        <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-gray-700 hover:text-red-500 transition-colors transform hover:scale-110"><Trash2 size={24} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length > 0 && (
                  <div className="p-12 bg-black/60 border-t border-white/10">
                    <div className="flex justify-between items-center mb-10">
                      <span className="text-gray-600 font-black uppercase tracking-[0.4em] text-sm">TOTAL INVESTMENT</span>
                      <span className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">${cart.reduce((s,i) => s + i.price, 0).toFixed(2)}</span>
                    </div>
                    <button onClick={handleCheckout} className="w-full bg-white text-black py-7 rounded-[2.5rem] font-black uppercase text-2xl italic flex items-center justify-center gap-4 hover:bg-purple-50 transition-all shadow-3xl active:scale-[0.98]"><CreditCard size={32} /> ACQUIRE ASSETS <ExternalLink size={20} /></button>
                    <div className="flex items-center justify-center gap-3 mt-8 text-[11px] font-black uppercase tracking-[0.5em] text-gray-700"><ShieldCheck size={16} /> JMZ ENCRYPTED ENDPOINT</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Styles */}
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.15s ease-in-out 0s 2; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
