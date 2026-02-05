
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';
import { Beat } from '../types';

interface AudioPlayerProps {
  currentBeat: Beat | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentBeat, isPlaying, onTogglePlay, onNext, onPrev }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback error", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentBeat]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  if (!currentBeat) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-6xl mx-auto glass rounded-3xl p-4 shadow-2xl border border-white/10 relative overflow-hidden">
        <audio 
          ref={audioRef} 
          src={currentBeat.audioUrl} 
          onTimeUpdate={handleTimeUpdate} 
          onEnded={onNext}
        />
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mt-1">
          {/* Beat Info */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            <div className="relative group">
              <img 
                src={currentBeat.coverArt} 
                alt={currentBeat.title} 
                className="w-12 h-12 rounded-xl object-cover shadow-lg border border-white/10 group-hover:scale-105 transition-transform" 
              />
              <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-sm truncate uppercase italic tracking-tighter">{currentBeat.title}</h4>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest truncate">{currentBeat.producer}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button onClick={onPrev} className="text-zinc-500 hover:text-white transition-all active:scale-90">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              onClick={onTogglePlay}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={onNext} className="text-zinc-500 hover:text-white transition-all active:scale-90">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>

          {/* Tools - Replaced Download with Volume/Tools only */}
          <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
            <div className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors">
              <Volume2 size={18} />
              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
                <div className="h-full w-3/4 bg-white/40 group-hover:bg-purple-500 transition-all" />
              </div>
            </div>
            <button className="text-zinc-500 hover:text-white transition-all">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
