
import React, { useState } from 'react';
import { X, Upload, Plus, Music, DollarSign, Tag, Activity, Image as ImageIcon } from 'lucide-react';
import { Beat } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (beat: Omit<Beat, 'id' | 'producer'>) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    bpm: 140,
    key: 'Cm',
    tags: '',
    priceLease: 24.99,
    priceExclusive: 249.99,
    audioUrl: '',
    coverArt: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      ...formData,
      bpm: Number(formData.bpm),
      priceLease: Number(formData.priceLease),
      priceExclusive: Number(formData.priceExclusive),
      tags: formData.tags.split(',').map(t => t.trim())
    });
    setFormData({
      title: '',
      bpm: 140,
      key: 'Cm',
      tags: '',
      priceLease: 24.99,
      priceExclusive: 249.99,
      audioUrl: '',
      coverArt: '',
      description: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl glass rounded-[2rem] overflow-hidden shadow-2xl border border-purple-500/20 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-transparent">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <Upload className="text-purple-500" />
              Developer Upload
            </h2>
            <p className="text-gray-400 text-sm">Add new heat to the Jmendez Beatz catalog</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 border-b border-purple-500/20 pb-2">Beat Essentials</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Beat Title</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Midnight Fury"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">BPM</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
                    value={formData.bpm}
                    onChange={e => setFormData({...formData, bpm: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Key</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Am"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
                    value={formData.key}
                    onChange={e => setFormData({...formData, key: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Tags (comma separated)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="text"
                    placeholder="trap, dark, melodic"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:border-purple-500 outline-none transition-all"
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Links */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400 border-b border-pink-500/20 pb-2">Pricing & Media</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Lease Price ($)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                    value={formData.priceLease}
                    onChange={e => setFormData({...formData, priceLease: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Exclusive ($)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                    value={formData.priceExclusive}
                    onChange={e => setFormData({...formData, priceExclusive: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Audio Stream URL</label>
                <div className="relative">
                  <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    required
                    type="url"
                    placeholder="https://example.com/beat.mp3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:border-pink-500 outline-none transition-all"
                    value={formData.audioUrl}
                    onChange={e => setFormData({...formData, audioUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Cover Art URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    required
                    type="url"
                    placeholder="https://picsum.photos/400"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:border-pink-500 outline-none transition-all"
                    value={formData.coverArt}
                    onChange={e => setFormData({...formData, coverArt: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Short Description</label>
            <textarea 
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all resize-none"
              placeholder="Describe the vibe of the beat..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-5 rounded-2xl font-black text-xl uppercase italic tracking-tighter flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-900/40"
            >
              <Plus size={24} />
              Publish to Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPortal;
