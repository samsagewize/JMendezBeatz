import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Music2, TrendingUp, LayoutDashboard, Lock, Eye, EyeOff, AlertCircle, Mail, Instagram, Twitter, Youtube } from 'lucide-react';
import BeatCard from './components/BeatCard';
import AudioPlayer from './components/AudioPlayer';
import CartModal from './components/CartModal';
import CheckoutSuccess from './components/CheckoutSuccess';
import AdminPortal from './components/AdminPortal';
import { BEATS as INITIAL_BEATS } from './constants';
import { Beat, CartItem } from './types';

const App: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>(INITIAL_BEATS);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Auth & Admin States
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  const SECRET_PASSWORD = 'BeatzbyMe';
  const CONTACT_EMAIL = 'jmendezbeatz1@gmail.com';

  const handlePlay = (beat: Beat) => {
    if (currentBeat?.id === beat.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentBeat(beat);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    const currentIndex = beats.findIndex(b => b.id === currentBeat?.id);
    const nextBeat = beats[(currentIndex + 1) % beats.length];
    setCurrentBeat(nextBeat);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = beats.findIndex(b => b.id === currentBeat?.id);
    const prevBeat = beats[(currentIndex - 1 + beats.length) % beats.length];
    setCurrentBeat(prevBeat);
    setIsPlaying(true);
  };

  const addToCart = (beat: Beat, type: 'Lease' | 'Exclusive') => {
    const item: CartItem = {
      beatId: beat.id,
      title: beat.title,
      price: type === 'Lease' ? beat.priceLease : beat.priceExclusive,
      licenseType: type
    };
    setCart([...cart, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (beatId: string) => {
    setCart(cart.filter(item => item.beatId !== beatId));
  };

  const handleCheckout = () => {
    setPurchasedItems([...cart]);
    setCart([]);
    setIsCartOpen(false);
    setIsCheckoutSuccess(true);
  };

  const handleUploadBeat = (newBeatData: Omit<Beat, 'id' | 'producer'>) => {
    const newBeat: Beat = {
      ...newBeatData,
      id: Date.now().toString(),
      producer: 'Jmendez Beatz',
      isSold: false
    };
    setBeats([newBeat, ...beats]);
  };

  // Added logic to handle beat deletion from state
  const handleDeleteBeat = (id: string) => {
    setBeats(prev => prev.filter(b => b.id !== id));
    if (currentBeat?.id === id) {
      setCurrentBeat(null);
      setIsPlaying(false);
    }
  };

  // Added logic to toggle sold status of a beat
  const handleToggleSold = (id: string) => {
    setBeats(prev => prev.map(b => b.id === id ? { ...b, isSold: !b.isSold } : b));
  };

  const resetStore = () => {
    setIsCheckoutSuccess(false);
    setPurchasedItems([]);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setAuthError(false);
      setIsAuthModalOpen(false);
      setIsAdminPortalOpen(true);
      setPassword('');
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  // Logic to filter marketplace view: Only show beats that are NOT sold
  const filteredBeats = beats.filter(beat => {
    if (beat.isSold) return false;
    const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         beat.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'All' || beat.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Trap', 'Lo-fi', 'Drill', 'Pop', 'Synthwave'];

  return (
    <div className="min-h-screen pb-32">
      {isCheckoutSuccess ? (
        <CheckoutSuccess items={purchasedItems} onBackToStore={resetStore} />
      ) : (
        <>
          <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/40">
                  <Music2 className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">Jmendez Beatz</span>
              </div>

              <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
                <a href="#" className="text-white">Beats</a>
                <a href="#" className="hover:text-white transition-colors">Licensing</a>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 hover:text-purple-400 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                  <LayoutDashboard size={14} />
                  Developer Portal
                </button>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors flex items-center gap-2">
                  <Mail size={14} />
                  Contact
                </a>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
                >
                  <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                      {cart.length}
                    </span>
                  )}
                </button>
                <a 
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hidden sm:block px-6 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors"
                >
                  Inquiries
                </a>
              </div>
            </div>
          </nav>

          <section className="pt-40 pb-20 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
              <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 -z-10 w-[300px] h-[300px] bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <TrendingUp size={14} />
                  New Beats Dropped Weekly
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
                  FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">SONIC IDENTITY.</span>
                </h1>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                  High-end production from Jmendez Beatz. Explore our curated collection of industry-ready beats.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search by mood, tag, or title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all"
                    />
                  </div>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                    <Mail size={20} />
                    Contact Jmendez
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap border transition-all ${
                        activeFilter === cat 
                          ? 'bg-white text-black border-white' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold">
                  <Filter size={18} />
                  Advanced Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredBeats.map(beat => (
                  <BeatCard 
                    key={beat.id} 
                    beat={beat} 
                    isPlaying={isPlaying && currentBeat?.id === beat.id}
                    onPlay={handlePlay}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>

              {filteredBeats.length === 0 && (
                <div className="text-center py-40 glass rounded-3xl border border-white/5">
                  <Music2 size={64} className="mx-auto mb-6 text-gray-700" />
                  <h3 className="text-2xl font-bold mb-2">No beats found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </section>

          <footer className="px-6 pt-24 pb-12 border-t border-white/5 bg-black/20">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <Music2 size={20} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">Jmendez Beatz</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    Premium audio assets for artists, content creators, and agencies. Industry-standard sonics delivered instantly.
                  </p>
                  <div className="flex items-center gap-4">
                    <a href="#" className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all"><Instagram size={18} /></a>
                    <a href="#" className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all"><Twitter size={18} /></a>
                    <a href="#" className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all"><Youtube size={18} /></a>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-purple-400">Quick Links</h4>
                  <div className="flex flex-col gap-3 text-sm text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">Licensing Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Custom Production</a>
                    <a href="#" className="hover:text-white transition-colors">Beat Mixing</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-pink-500">Direct Contact</h4>
                  <p className="text-sm text-gray-400">Available for custom sound design and exclusive collaboration inquiries.</p>
                  <a 
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all group"
                  >
                    <Mail size={20} className="text-gray-400 group-hover:text-white" />
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 opacity-40">
                <p className="text-xs font-medium uppercase tracking-[0.1em]">© 2025 Jmendez Beatz. Mastered in Studio.</p>
              </div>
            </div>
          </footer>
          
          <AdminPortal 
            isOpen={isAdminPortalOpen} 
            onClose={() => setIsAdminPortalOpen(false)} 
            onUpload={handleUploadBeat} 
            // Correctly passed required props to AdminPortal
            beats={beats}
            onDelete={handleDeleteBeat}
            onToggleSold={handleToggleSold}
          />

          <CartModal 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
          />

          <AudioPlayer 
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
          />

          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20%, 60% { transform: translateX(-10px); }
              40%, 80% { transform: translateX(10px); }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default App;