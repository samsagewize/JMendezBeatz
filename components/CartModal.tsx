import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, CreditCard, Loader2, ExternalLink } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (beatId: string) => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, items, onRemove, onCheckout }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  // Updated Stripe link to the one provided for leasing/buying
  const STRIPE_LINK = "https://buy.stripe.com/9B67sKbfkaWB3Sm4cSaIM00";

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.price, 0);

  const handleCheckoutClick = () => {
    setIsProcessing(true);
    
    // 1. Open Stripe in a new tab for the payment
    window.open(STRIPE_LINK, '_blank');

    // 2. Simulate the security verification / return flow. 
    // In a production app, this would be handled by a webhook listener or redirect back from Stripe.
    setTimeout(() => {
      onCheckout(); // This marks payment as secured and reveals downloads
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg glass rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
        {isProcessing && (
          <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-6" />
            <h3 className="text-2xl font-black italic uppercase mb-2">Securing Connection...</h3>
            <p className="text-gray-400 text-sm font-medium">Please complete checkout in the new tab. Your assets will unlock instantly upon successful payment verification.</p>
          </div>
        )}

        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Your Digital Crate</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-8 space-y-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="text-center py-12 opacity-20 font-black uppercase tracking-[0.4em]">
              Crate is Empty
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.beatId}-${idx}`} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl">
                <div>
                  <h4 className="font-black italic uppercase text-lg tracking-tight">{item.title}</h4>
                  <p className="text-[9px] text-purple-400 font-black uppercase tracking-[0.2em]">{item.licenseType}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-xl italic">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => onRemove(item.beatId)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-10 bg-black/60 border-t border-white/10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-gray-600 font-black uppercase tracking-[0.4em] text-xs">INVESTMENT</span>
              <span className="text-4xl font-black italic tracking-tighter">${total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              disabled={isProcessing}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xl italic hover:bg-purple-50 transition-all flex items-center justify-center gap-4 mb-6 shadow-2xl active:scale-95 disabled:opacity-50"
            >
              <CreditCard size={28} />
              Checkout with Stripe
              <ExternalLink size={18} className="opacity-30" />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black">
              <ShieldCheck size={14} className="text-zinc-500" />
              Secured Distribution Channel
            </div>
          </div>
        )}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CartModal;
