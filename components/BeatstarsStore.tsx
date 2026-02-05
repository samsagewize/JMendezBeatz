
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
      <div className="relative w-full aspect-[9/16] md:aspect-[4/3] lg:aspect-video min-h-[1000px] glass rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        <iframe
          src={embedUrl}
          className="w-full h-full border-none"
          title="Beatstars Store"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
        
        {/* Verification Footer */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
          <div className="bg-black/90 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
            <ShieldCheck size={16} className="text-purple-400" />
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">Official Secure Marketplace</span>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="pointer-events-auto bg-white text-black px-6 py-3 rounded-full flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl active:scale-95"
          >
            Expand on Beatstars <ExternalLink size={14} />
          </a>
        </div>
      </div>
      
      <div className="mt-12 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">Encrypted Sonic Distribution via Beatstars API</p>
      </div>
    </div>
  );
};

export default BeatstarsStore;
