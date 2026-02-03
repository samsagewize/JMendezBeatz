
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Download } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto glass rounded-2xl p-4 shadow-2xl border border-white/10">
        <audio 
          ref={audioRef} 
          src={currentBeat.audioUrl} 
          onTimeUpdate={handleTimeUpdate} 
          onEnded={onNext}
        />
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden rounded-t-2xl">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mt-1">
          {/* Beat Info */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            <img 
              src={currentBeat.coverArt} 
              alt={currentBeat.title} 
              className="w-12 h-12 rounded-lg object-cover shadow-lg" 
            />
            <div className="min-w-0">
              <h4 className="font-bold text-sm truncate">{currentBeat.title}</h4>
              <p className="text-gray-400 text-xs truncate">{currentBeat.producer}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button onClick={onPrev} className="text-gray-400 hover:text-white transition-colors">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              onClick={onTogglePlay}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={onNext} className="text-gray-400 hover:text-white transition-colors">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>

          {/* Tools */}
          <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
            <div className="flex items-center gap-2 text-gray-400">
              <Volume2 size={18} />
              <div className="w-20 h-1 bg-white/10 rounded-full relative">
                <div className="absolute inset-y-0 left-0 w-3/4 bg-white/40 rounded-full" />
              </div>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Download size={18} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
