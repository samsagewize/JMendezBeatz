
import React, { useState, useRef } from 'react';
// Added Music2 to imports
import { X, Upload, Plus, Music, Music2, DollarSign, Tag, Activity, Image as ImageIcon, CheckCircle2, FileAudio, Trash2, ShieldCheck, ListMusic } from 'lucide-react';
import { Beat } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (beat: Omit<Beat, 'id' | 'producer'>) => void;
  beats: Beat[];
  onDelete: (id: string) => void;
  onToggleSold: (id: string) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose, onUpload, beats, onDelete, onToggleSold }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [formData, setFormData] = useState({
    title: '',
    bpm: 140,
    key: 'Cm',
    tags: '',
    priceLease: 24.99,
    priceExclusive: 249.99,
    description: ''
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !coverFile) {
      alert("Both an audio file and cover art are required for distribution.");
      return;
    }

    const audioUrl = URL.createObjectURL(audioFile);
    const coverArt = URL.createObjectURL(coverFile);

    onUpload({
      ...formData,
      audioUrl,
      coverArt,
      bpm: Number(formData.bpm),
      priceLease: Number(formData.priceLease),
      priceExclusive: Number(formData.priceExclusive),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== "")
    });

    setFormData({
      title: '',
      bpm: 140,
      key: 'Cm',
      tags: '',
      priceLease: 24.99,
      priceExclusive: 249.99,
      description: ''
    });
    setAudioFile(null);
    setCoverFile(null);
    setCoverPreview(null);
    setActiveTab('manage');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl glass rounded-[3rem] overflow-hidden shadow-2xl border border-purple-500/20 flex flex-col h-[90vh]">
        <div className="p-10 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <Upload className="text-purple-500" />
              Developer Portal
            </h2>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Marketplace Operations</p>
          </div>
          <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <Plus size={16} /> New Release
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'manage' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <ListMusic size={16} /> Manage Marketplace
            </button>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all text-gray-500 hover:text-white absolute top-6 right-6 md:static">
            <X size={32} />
          </button>
        </div>

        {activeTab === 'upload' ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-2">
                  <div className="w-4 h-px bg-purple-500" /> Sonic Identity
                </h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Beat Title</label>
                  <input 
                    required
                    type="text"
                    placeholder="E.G. MIDNIGHT DRIFT"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none transition-all uppercase font-black italic text-lg"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">BPM</label>
                    <input 
                      required
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none transition-all font-bold"
                      value={formData.bpm}
                      onChange={e => setFormData({...formData, bpm: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Key</label>
                    <input 
                      required
                      type="text"
                      placeholder="CM"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none transition-all font-bold uppercase"
                      value={formData.key}
                      onChange={e => setFormData({...formData, key: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tags (Comma Separated)</label>
                  <div className="relative">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input 
                      type="text"
                      placeholder="TRAP, DARK, MELODIC"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:border-purple-500 outline-none transition-all uppercase font-bold text-sm"
                      value={formData.tags}
                      onChange={e => setFormData({...formData, tags: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none transition-all resize-none text-sm font-medium"
                    placeholder="Brief context for the artist..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 flex items-center gap-2">
                  <div className="w-4 h-px bg-pink-500" /> Asset Distribution
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lease ($)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-xl outline-none focus:border-pink-500"
                      value={formData.priceLease}
                      onChange={e => setFormData({...formData, priceLease: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exclusive ($)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-xl outline-none focus:border-pink-500"
                      value={formData.priceExclusive}
                      onChange={e => setFormData({...formData, priceExclusive: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Audio File (WAV/MP3)</label>
                  <div className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center text-center gap-3 ${audioFile ? 'border-green-500 bg-green-500/5' : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'}`}>
                    <input required type="file" accept="audio/*" onChange={handleAudioChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${audioFile ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/10 text-gray-400'}`}>
                      {audioFile ? <CheckCircle2 size={32} /> : <FileAudio size={32} />}
                    </div>
                    <div className="space-y-1">
                      <span className="block font-black text-xs uppercase tracking-[0.2em]">{audioFile ? audioFile.name : 'Choose Master File'}</span>
                      <span className="block text-[10px] text-gray-600 font-bold uppercase">{audioFile ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB` : 'WAV, MP3, AIFF'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cover Art (Square JPG/PNG)</label>
                  <div className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center text-center gap-3 ${coverFile ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/50 hover:bg-white/5'}`}>
                    <input required type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {coverPreview ? (
                      <div className="relative">
                        <img src={coverPreview} className="w-20 h-20 rounded-2xl object-cover shadow-2xl border-2 border-blue-500" alt="Preview" />
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-black rounded-full p-1 border-4 border-[#0a0a0a]"><CheckCircle2 size={12} /></div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white/10 text-gray-400 flex items-center justify-center">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <span className="font-black text-xs uppercase tracking-[0.2em]">{coverFile ? coverFile.name : 'Upload Visual Art'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 py-8 rounded-[2rem] font-black text-3xl uppercase italic tracking-tighter flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-purple-900/50 group"
              >
                <Plus size={36} className="group-hover:rotate-180 transition-transform duration-700" />
                DEPLOY TO MARKETPLACE
              </button>
            </div>
          </form>
        ) : (
          <div className="flex-1 overflow-y-auto p-10 space-y-4 scrollbar-hide">
            {beats.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-40">
                <Music2 size={80} className="mb-6" />
                <h3 className="text-3xl font-black uppercase tracking-widest italic">Inventory Empty</h3>
              </div>
            ) : (
              beats.map(beat => (
                <div key={beat.id} className="glass border border-white/5 p-6 rounded-3xl flex items-center justify-between gap-6 group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <img src={beat.coverArt} className="w-20 h-20 rounded-2xl object-cover shadow-xl" alt={beat.title} />
                    <div className="min-w-0">
                      <h4 className="font-black italic uppercase text-xl truncate tracking-tight">{beat.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{beat.bpm} BPM</span>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{beat.key}</span>
                        {beat.isSold && (
                          <span className="bg-red-600/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-red-500/20">SOLD</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onToggleSold(beat.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                        beat.isSold 
                        ? 'bg-green-600/10 border-green-500/20 text-green-500' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                      }`}
                    >
                      {beat.isSold ? <CheckCircle2 size={14} /> : <DollarSign size={14} />}
                      {beat.isSold ? 'Restock' : 'Mark Sold'}
                    </button>
                    <button 
                      onClick={() => onDelete(beat.id)}
                      className="p-3 rounded-xl bg-red-600/10 border border-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
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

export default AdminPortal;