
import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Music2, TrendingUp, Sparkles, LayoutDashboard, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import BeatCard from './components/BeatCard';
import AudioPlayer from './components/AudioPlayer';
import AiAssistant from './components/AiAssistant';
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
      producer: 'Jmendez Beatz'
    };
    setBeats([newBeat, ...beats]);
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

  const filteredBeats = beats.filter(beat => {
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
          {/* Navigation */}
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
                <a href="#" className="hover:text-white transition-colors">Contact</a>
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
                <button className="hidden sm:block px-6 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
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
                  <button className="px-8 py-4 bg-purple-600 rounded-2xl font-bold hover:bg-purple-500 transition-all flex items-center justify-center gap-2">
                    <Sparkles size={20} />
                    Try AI Search
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Beats Grid */}
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

          {/* Footer Access */}
          <footer className="px-6 py-12 border-t border-white/5 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
              <p className="text-sm">© 2025 Jmendez Beatz. All Rights Reserved.</p>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-[10px] uppercase tracking-[0.2em] font-black hover:text-purple-500 transition-colors"
              >
                Developer & Admin Access
              </button>
            </div>
          </footer>

          {/* Global Components */}
          <AiAssistant />
          
          {/* Admin Authentication Modal */}
          {isAuthModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsAuthModalOpen(false)} />
              <div className={`relative w-full max-w-md glass rounded-3xl p-8 border-t-2 border-purple-500/50 shadow-2xl transition-all duration-300 ${authError ? 'animate-[shake_0.4s_ease-in-out] border-red-500' : ''}`}>
                <div className="flex flex-col items-center text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${authError ? 'bg-red-500/10 text-red-500' : 'bg-purple-600/10 text-purple-500'}`}>
                    <Lock size={32} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-2 uppercase italic">Admin Access</h2>
                  <p className="text-gray-400 text-sm">Please enter the developer password to continue.</p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-6">
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      className={`w-full bg-white/5 border rounded-xl py-4 pl-4 pr-12 focus:outline-none transition-all ${authError ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {authError && (
                    <div className="flex items-center gap-2 text-red-500 text-xs font-bold justify-center uppercase tracking-widest animate-pulse">
                      <AlertCircle size={14} />
                      Access Denied
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-white text-black py-4 rounded-xl font-black text-lg uppercase italic tracking-tighter hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Authenticate
                  </button>
                </form>

                <button 
                  onClick={() => setIsAuthModalOpen(false)}
                  className="w-full text-center mt-6 text-xs text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <AdminPortal 
            isOpen={isAdminPortalOpen} 
            onClose={() => setIsAdminPortalOpen(false)} 
            onUpload={handleUploadBeat} 
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
