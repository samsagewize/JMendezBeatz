
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
  const STRIPE_LINK = "https://buy.stripe.com/test_00w9AU1px7y87pC1msgMw01";

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.price, 0);

  const handleCheckoutClick = () => {
    setIsProcessing(true);
    
    // 1. Open Stripe in a new tab for the test payment
    window.open(STRIPE_LINK, '_blank');

    // 2. Simulate the return/success flow in the main window
    setTimeout(() => {
      onCheckout();
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg glass rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {isProcessing && (
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold mb-2">Redirecting to Stripe...</h3>
            <p className="text-gray-400 text-sm">Opening secure payment page in a new window. After checkout, return here to download your beats.</p>
          </div>
        )}

        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 text-gray-500">
                <CreditCard size={32} />
              </div>
              <p className="text-gray-400">Your cart is empty.</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.beatId}-${idx}`} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-xs text-purple-400 font-medium uppercase tracking-widest">{item.licenseType}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => onRemove(item.beatId)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-black/40 border-t border-white/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 font-medium">Total</span>
              <span className="text-3xl font-bold tracking-tight">${total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              disabled={isProcessing}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
            >
              <CreditCard size={20} />
              Pay via Stripe
              <ExternalLink size={16} className="ml-1 opacity-50" />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <ShieldCheck size={14} />
              Secured & Encrypted Payments
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
