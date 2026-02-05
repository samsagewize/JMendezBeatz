
import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface BeatstarsStoreProps {
  url: string;
}

const BeatstarsStore: React.FC<BeatstarsStoreProps> = ({ url }) => {
  // Ensure the URL is optimized for embedding if it's a standard link
  const embedUrl = url.includes('player') ? url : url; 

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-700">
      <div className="relative w-full aspect-[9/16] md:aspect-[16/10] lg:aspect-[21/9] min-h-[700px] glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        <iframe
          src={embedUrl}
          className="w-full h-full border-none"
          title="Beatstars Store"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
        
        {/* Verification Footer */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
          <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <ShieldCheck size={14} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verified Secure Checkout</span>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="pointer-events-auto bg-white text-black px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
          >
            Open in Beatstars <ExternalLink size={12} />
          </a>
        </div>
      </div>
      
      <div className="mt-8 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Powered by Beatstars Global Distribution</p>
      </div>
    </div>
  );
};

export default BeatstarsStore;
