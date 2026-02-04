
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ShoppingBag, Search, Music2, LayoutDashboard, 
  X, Music, Waves, TrendingUp, Mail, Server, UploadCloud, Users, Filter, Globe,
  Lock, AlertCircle
} from 'lucide-react';
import AdminPortal from './components/AdminPortal';
import BeatCard from './components/BeatCard';
import CartModal from './components/CartModal';
import AudioPlayer from './components/AudioPlayer';
import CheckoutSuccess from './components/CheckoutSuccess';
import SubmissionPortal from './components/SubmissionPortal';
import { Beat, CartItem, SiteConfig } from './types';

const SECRET_PASSWORD = 'BeatzbyMe';
const LOCAL_STORAGE_KEY = 'jmendez_local_beats';
const COMMUNITY_STORAGE_KEY = 'jmendez_community_beats';

const App = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    producerName: "Jmendez Beatz",
    heroTitle: "World's Best Beats.",
    heroSubtitle: "High-end production architecture. Explore, listen, and license industry-ready tracks instantly.",
    accentColor: "#a855f7",
    contactEmail: "jmendezbeatz1@gmail.com"
  });

  const [globalBeats, setGlobalBeats] = useState<Beat[]>([]);
  
  // Load from LocalStorage on initial boot
  const [localBeats, setLocalBeats] = useState<Beat[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      // NOTE: Objects stored here that use blob: URLs will break on refresh. 
      // We warn the user in the UI to sync to AWS for true persistence.
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading local beats", e);
      return [];
    }
  });

  const [communityBeats, setCommunityBeats] = useState<Beat[]>(() => {
    try {
      const saved = localStorage.getItem(COMMUNITY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading community beats", e);
      return [];
    }
  });
  
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'curated' | 'community'>('all');

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localBeats));
  }, [localBeats]);

  useEffect(() => {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(communityBeats));
  }, [communityBeats]);

  const fetchGlobalData = async () => {
    const awsConfig = JSON.parse(localStorage.getItem('jmendez_aws_config') || '{}');
    const s3Url = awsConfig.bucket ? `https://${awsConfig.bucket}.s3.${awsConfig.region || 'us-east-1'}.amazonaws.com/` : null;

    try {
      const beatsUrl = s3Url ? `${s3Url}content/beats.json` : 'content/beats.json';
      const configUrl = s3Url ? `${s3Url}content/site_config.json` : 'content/site_config.json';

      const [beatsRes, configRes] = await Promise.all([
        fetch(beatsUrl).then(r => r.json()).catch(() => []),
        fetch(configUrl).then(r => r.json()).catch(() => siteConfig)
      ]);

      setGlobalBeats(beatsRes);
      if (configRes && configRes.producerName) setSiteConfig(configRes);
    } catch (e) {
      console.warn("Global data not found, showing local/fallback inventory.");
      setGlobalBeats([]);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const allBeats = [
    ...globalBeats,
    ...localBeats.filter(lb => !globalBeats.some(gb => gb.id === lb.id)),
    ...communityBeats.filter(cb => !globalBeats.some(gb => gb.id === cb.id))
  ];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthModalOpen(false);
      setIsAdminPortalOpen(true);
      setPassword('');
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const handleUpload = (newBeatData: Omit<Beat, 'id' | 'producer'> & { producer?: string }, isCommunity = false) => {
    const newBeat: Beat = {
      ...newBeatData,
      id: `${isCommunity ? 'comm' : 'local'}_${Date.now()}`,
      producer: isCommunity ? (newBeatData.producer || 'Guest Producer') : siteConfig.producerName,
      isSold: false,
      isCommunity: isCommunity
    } as Beat;
    
    if (isCommunity) {
      setCommunityBeats(prev => [newBeat, ...prev]);
    } else {
      setLocalBeats(prev => [newBeat, ...prev]);
    }
  };

  const deleteBeat = (id: string) => {
    setLocalBeats(prev => prev.filter(b => b.id !== id));
    setCommunityBeats(prev => prev.filter(b => b.id !== id));
    setGlobalBeats(prev => prev.filter(b => b.id !== id));
  };

  const toggleSold = (id: string) => {
    const update = (prev: Beat[]) => prev.map(b => b.id === id ? { ...b, isSold: !b.isSold } : b);
    setLocalBeats(update);
    setCommunityBeats(update);
    setGlobalBeats(update);
  };

  const onSyncSuccess = () => {
    setLocalBeats([]);
    setCommunityBeats([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(COMMUNITY_STORAGE_KEY);
    fetchGlobalData();
  };

  const filteredBeats = allBeats.filter(b => {
    const matchesSearch = (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'curated' && !b.isCommunity) ||
                       (activeTab === 'community' && b.isCommunity);
    return matchesSearch && matchesTab && !b.isSold;
  });

  const hasUnsyncedBeats = localBeats.length > 0 || communityBeats.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/50 flex flex-col font-['Inter']">
      {isCheckoutSuccess ? (
        <CheckoutSuccess items={purchasedItems} onBackToStore={() => { setIsCheckoutSuccess(false); setPurchasedItems([]); }} />
      ) : (
        <>
          <nav className="fixed top-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-3xl border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
                  <Music2 size={20} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                  {siteConfig.producerName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {hasUnsyncedBeats && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-[9px] font-black uppercase animate-pulse">
                  <AlertCircle size={12} /> Sync Required for Friends to See
                </div>
              )}
              <button onClick={() => setIsSubmissionOpen(true)} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <UploadCloud size={14} className="text-purple-400" /> Community Upload
              </button>
              <button onClick={() => setIsAuthModalOpen(true)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-zinc-500 hover:text-white">
                <LayoutDashboard size={20} />
              </button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-900/40 transition-all active:scale-95 group">
                <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-purple-600 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-purple-600 animate-pulse">{cart.length}</span>}
              </button>
            </div>
          </nav>

          <section className="pt-40 pb-20 px-4 sm:px-8 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-10">
                <Globe size={12} /> Live Marketplace
              </div>
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] italic uppercase">
                {siteConfig.heroTitle}
              </h1>
              <p className="text-zinc-400 max-w-2xl mx-auto mb-16 text-lg sm:text-xl font-medium leading-relaxed opacity-80">
                {siteConfig.heroSubtitle}
              </p>
              <div className="max-w-3xl mx-auto relative group">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search beats..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] py-8 pl-18 pr-8 text-xl font-bold focus:ring-4 focus:ring-purple-600/20 outline-none transition-all placeholder:text-zinc-600 shadow-2xl" 
                />
              </div>
            </div>
          </section>

          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 pb-48">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="flex items-center gap-4">
                <Waves className="text-purple-500 animate-pulse" size={32} />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Storefront</h2>
              </div>
              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                {['all', 'curated', 'community'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
              {filteredBeats.map(beat => (
                <div key={beat.id} className="relative">
                  {(beat.id.startsWith('local_') || beat.id.startsWith('comm_')) && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-amber-500 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-black shadow-lg">
                      STAGED (LOCAL ONLY)
                    </div>
                  )}
                  <BeatCard 
                    beat={beat} 
                    isPlaying={isPlaying && currentBeat?.id === beat.id} 
                    onPlay={(b) => { 
                      if(currentBeat?.id === b.id) setIsPlaying(!isPlaying); 
                      else { setCurrentBeat(b); setIsPlaying(true); } 
                    }} 
                    onAddToCart={(b, t) => { 
                      if(!b.isSold) { 
                        setCart([...cart, { 
                          beatId: b.id, 
                          title: b.title, 
                          price: t === 'Lease' ? b.priceLease : b.priceExclusive, 
                          licenseType: t 
                        }]); 
                        setIsCartOpen(true); 
                      } 
                    }}
                  />
                </div>
              ))}
            </div>
          </main>

          <footer className="bg-black/40 border-t border-white/5 py-20 px-4 sm:px-8 mt-auto text-center">
            <div className="max-w-7xl mx-auto">
               <h4 className="font-black uppercase italic tracking-tighter text-xl mb-2">{siteConfig.producerName}</h4>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">© 2025 Jmendez Productions</p>
            </div>
          </footer>

          <AudioPlayer 
            currentBeat={currentBeat} 
            isPlaying={isPlaying} 
            onTogglePlay={() => setIsPlaying(!isPlaying)} 
            onNext={() => {}} 
            onPrev={() => {}} 
          />

          {isAuthModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
              <div className={`w-full max-w-md glass rounded-[3rem] p-12 border border-white/10 ${authError ? 'animate-shake' : ''} shadow-2xl`}>
                <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Lock className="text-purple-500" size={32} />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-center mb-10">Creator Authentication</h2>
                <form onSubmit={handleAuth} className="space-y-6 text-center">
                  <input autoFocus type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-center text-2xl tracking-[0.5em] focus:border-purple-500 outline-none shadow-inner" />
                  <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase italic text-lg shadow-xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-95">Verify & Enter</button>
                  <button type="button" onClick={() => setIsAuthModalOpen(false)} className="w-full text-zinc-500 font-black uppercase text-[10px] tracking-widest pt-4 hover:text-white transition-colors">Return to Store</button>
                </form>
              </div>
            </div>
          )}

          {isAdminPortalOpen && (
            <AdminPortal 
              isOpen={isAdminPortalOpen} 
              onClose={() => setIsAdminPortalOpen(false)} 
              onUpload={handleUpload} 
              beats={allBeats} 
              onDelete={deleteBeat} 
              onToggleSold={toggleSold} 
              config={siteConfig}
              onConfigUpdate={setSiteConfig}
              onSyncSuccess={onSyncSuccess}
            />
          )}

          {isSubmissionOpen && (
            <SubmissionPortal 
              isOpen={isSubmissionOpen}
              onClose={() => setIsSubmissionOpen(false)}
              onUpload={(data) => handleUpload(data, true)}
            />
          )}

          <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(cart.filter(item => item.beatId !== id))} onCheckout={() => { setPurchasedItems([...cart]); setCart([]); setIsCartOpen(false); setIsCheckoutSuccess(true); }} />

          <style>{`
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            .animate-shake { animation: shake 0.1s ease-in-out 0s 2; }
            .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.05); }
          `}</style>
        </>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
