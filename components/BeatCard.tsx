
import React from 'react';
import { Play, Pause, ShoppingCart, Info, Activity } from 'lucide-react';
import { Beat } from '../types';

interface BeatCardProps {
  beat: Beat;
  isPlaying: boolean;
  onPlay: (beat: Beat) => void;
  onAddToCart: (beat: Beat, type: 'Lease' | 'Exclusive') => void;
}

const BeatCard: React.FC<BeatCardProps> = ({ beat, isPlaying, onPlay, onAddToCart }) => {
  return (
    <div className="group relative glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={beat.coverArt} 
          alt={beat.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button 
            onClick={() => onPlay(beat)}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
        </div>
        
        {/* BPM and Key Overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border border-white/10">
            {beat.bpm} BPM
          </span>
          <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border border-white/10">
            {beat.key}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg leading-tight truncate w-full">{beat.title}</h3>
            <p className="text-gray-400 text-sm">{beat.producer}</p>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Info size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {beat.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
              #{tag}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => onAddToCart(beat, 'Lease')}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group/btn"
          >
            <div className="text-left">
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Lease</span>
              <span className="text-sm font-semibold">${beat.priceLease}</span>
            </div>
            <ShoppingCart size={18} className="text-gray-400 group-hover/btn:text-white transition-colors" />
          </button>

          <button 
            onClick={() => onAddToCart(beat, 'Exclusive')}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-900/20"
          >
            <div className="text-left">
              <span className="block text-[10px] text-purple-200 uppercase tracking-widest font-bold">Exclusive</span>
              <span className="text-sm font-semibold">${beat.priceExclusive}</span>
            </div>
            <Activity size={18} className="text-purple-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeatCard;
