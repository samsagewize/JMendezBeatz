
import React from 'react';
import { CheckCircle2, Download, Home, Music, FileJson } from 'lucide-react';
import { CartItem, Beat } from '../types';
import { BEATS } from '../constants';

interface CheckoutSuccessProps {
  items: CartItem[];
  onBackToStore: () => void;
}

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ items, onBackToStore }) => {
  const handleDownload = (beatTitle: string) => {
    // In a real app, this would be a signed URL to a WAV/Zip file
    alert(`Starting download for: ${beatTitle} (High Quality WAV + License PDF)`);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-pulse" />
      
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">PAYMENT SUCCESSFUL!</h1>
        <p className="text-gray-400 text-lg mb-12">Your files are ready. A copy of the license agreement and receipt has been sent to your email.</p>
        
        <div className="glass rounded-3xl border border-white/10 overflow-hidden mb-12">
          <div className="bg-white/5 p-4 border-b border-white/10 text-left px-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Purchased Items</h3>
          </div>
          <div className="divide-y divide-white/5">
            {items.map((item, idx) => {
              const beat = BEATS.find(b => b.id === item.beatId);
              return (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Music size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-xs text-purple-400 font-medium uppercase tracking-widest">{item.licenseType} License</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(item.title)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                  >
                    <Download size={18} />
                    Download HQ
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onBackToStore}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold"
          >
            <Home size={18} />
            Back to Store
          </button>
          <div className="w-1 h-1 bg-gray-700 rounded-full hidden sm:block" />
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold">
            <FileJson size={18} />
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
