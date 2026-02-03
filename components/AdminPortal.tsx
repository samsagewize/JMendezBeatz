
import React, { useState, useRef } from 'react';
/* Added User to the list of imports from lucide-react */
import { X, Upload, Plus, Music, Music2, DollarSign, Tag, Activity, Image as ImageIcon, CheckCircle2, FileAudio, Trash2, ShieldCheck, ListMusic, Link as LinkIcon, AlertCircle, Globe, Code, Copy, User } from 'lucide-react';
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
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('link');
  const [showExport, setShowExport] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bpm: 140,
    key: 'Cm',
    tags: '',
    priceLease: 24.99,
    priceExclusive: 249.99,
    description: '',
    audioUrl: '',
    coverArt: ''
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const formatDropboxLink = (url: string) => {
    if (url.includes('dropbox.com')) {
      return url.replace('dl=0', 'raw=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }
    return url;
  };

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

  const exportForSource = () => {
    const json = JSON.stringify(beats, null, 2);
    navigator.clipboard.writeText(json);
    alert("Full Global Beat Inventory copied to clipboard! Paste this into the 'constants.ts' file in your source code to make these beats permanent for every visitor.");
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalAudioUrl = formData.audioUrl;
    let finalCoverArt = formData.coverArt;

    if (uploadMode === 'file') {
      if (!audioFile || !coverFile) {
        alert("Files are required for temporary local distribution.");
        return;
      }
      finalAudioUrl = URL.createObjectURL(audioFile);
      finalCoverArt = URL.createObjectURL(coverFile);
    } else {
      if (!finalAudioUrl || !finalCoverArt) {
        alert("Links for both audio and cover art are required for persistent storage.");
        return;
      }
      finalAudioUrl = formatDropboxLink(finalAudioUrl);
    }

    onUpload({
      ...formData,
      audioUrl: finalAudioUrl,
      coverArt: finalCoverArt,
      bpm: Number(formData.bpm),
      priceLease: Number(formData.priceLease),
      priceExclusive: Number(formData.priceExclusive),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ""),
      allowOffers: true
    });

    setFormData({
      title: '', bpm: 140, key: 'Cm', tags: '', priceLease: 24.99, priceExclusive: 249.99, description: '', audioUrl: '', coverArt: ''
    });
    setAudioFile(null); setCoverFile(null); setCoverPreview(null);
    setActiveTab('manage');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative w-full max-w-5xl glass rounded-[3rem] overflow-hidden shadow-2xl border border-purple-500/20 flex flex-col h-[90vh]">
        <div className="p-10 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <Upload className="text-purple-500" /> Developer Portal
            </h2>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Admin Management Dashboard</p>
          </div>
          <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('upload')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
              <Plus size={16} /> New Release
            </button>
            <button onClick={() => setActiveTab('manage')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'manage' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
              <ListMusic size={16} /> Inventory
            </button>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-gray-500 hover:text-white absolute top-6 right-6 md:static">
            <X size={32} />
          </button>
        </div>

        {activeTab === 'upload' ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
            <div className="bg-purple-600/10 border border-purple-500/20 p-6 rounded-3xl flex items-start gap-4">
              <AlertCircle className="text-purple-400 shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest text-purple-400 mb-1">DEPLOYMENT GUIDE</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">To make your beats **Global for everyone**, use Dropbox/Cloud links. Once you've added your beats here, switch to the 'Inventory' tab and use the 'Export for Deployment' button to generate the code snippet for the site engineer.</p>
              </div>
            </div>

            <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/5 w-fit">
              <button type="button" onClick={() => setUploadMode('link')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${uploadMode === 'link' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                <LinkIcon size={14} /> Persistent Link (Global)
              </button>
              <button type="button" onClick={() => setUploadMode('file')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${uploadMode === 'file' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                <Upload size={14} /> Local File Preview
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Beat Title</label>
                  <input required type="text" placeholder="E.G. MIDNIGHT DRIFT" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none uppercase font-black italic text-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">BPM</label>
                    <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-bold" value={formData.bpm} onChange={e => setFormData({...formData, bpm: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Key</label>
                    <input required type="text" placeholder="CM" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 uppercase font-bold" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
                  </div>
                </div>
                {uploadMode === 'link' ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Audio URL (Dropbox/Cloud)</label>
                      <input required type="url" placeholder="https://www.dropbox.com/s/..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none font-bold text-sm" value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Artwork URL</label>
                      <input required type="url" placeholder="https://images.unsplash.com/..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none font-bold text-sm" value={formData.coverArt} onChange={e => setFormData({...formData, coverArt: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center text-center gap-3 ${audioFile ? 'border-green-500 bg-green-500/5' : 'border-white/10 hover:border-purple-500/50'}`}>
                      <input type="file" accept="audio/*" onChange={handleAudioChange} className="absolute inset-0 opacity-0_cursor-pointer_z-10" />
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${audioFile ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-400'}`}><FileAudio size={24} /></div>
                      <span className="block font-black text-[10px] uppercase tracking-[0.2em]">{audioFile ? audioFile.name : 'Upload Preview WAV'}</span>
                    </div>
                    <div className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center text-center gap-3 ${coverFile ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/50'}`}>
                      <input type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      {coverPreview ? <img src={coverPreview} className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500" /> : <div className="w-12 h-12 rounded-2xl bg-white/10 text-gray-400 flex items-center justify-center"><ImageIcon size={24} /></div>}
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">{coverFile ? coverFile.name : 'Upload Artwork'}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lease ($)</label>
                    <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-xl outline-none" value={formData.priceLease} onChange={e => setFormData({...formData, priceLease: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exclusive ($)</label>
                    <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-xl outline-none" value={formData.priceExclusive} onChange={e => setFormData({...formData, priceExclusive: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tags (Comma Separated)</label>
                  <input type="text" placeholder="TRAP, DARK, MELODIC" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 uppercase font-bold text-sm" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                  <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none resize-none text-sm font-medium" placeholder="Project context..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 py-8 rounded-[2rem] font-black text-3xl uppercase italic tracking-tighter flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl group">
                <Plus size={36} className="group-hover:rotate-180 transition-transform duration-700" /> DEPLOY TO STOREFRONT
              </button>
            </div>
          </form>
        ) : (
          <div className="flex-1 overflow-y-auto p-10 flex flex-col scrollbar-hide">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black italic uppercase tracking-widest">Current Inventory ({beats.length})</h3>
              <button onClick={exportForSource} className="flex items-center gap-2 bg-white/10 hover:bg-white text-gray-400 hover:text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                <Code size={16} /> Export for Global Deployment
              </button>
            </div>
            <div className="space-y-4">
              {beats.map(beat => (
                <div key={beat.id} className="glass border border-white/5 p-6 rounded-3xl flex items-center justify-between gap-6 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <img src={beat.coverArt} className="w-20 h-20 rounded-2xl object-cover shadow-xl" alt={beat.title} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-black italic uppercase text-xl truncate tracking-tight">{beat.title}</h4>
                        {beat.id.startsWith('global_') ? (
                          <span className="flex items-center gap-1 text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20"><Globe size={10} /> Global Source</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"><User size={10} /> Local Draft</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{beat.bpm} BPM</span>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{beat.key}</span>
                        {beat.isSold && <span className="text-red-500 text-[10px] font-black uppercase">SOLD</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button disabled={beat.id.startsWith('global_')} onClick={() => onToggleSold(beat.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${beat.isSold ? 'bg-green-600/10 border-green-500/20 text-green-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 disabled:opacity-30'}`}>
                      {beat.isSold ? 'Restock' : 'Mark Sold'}
                    </button>
                    <button disabled={beat.id.startsWith('global_')} onClick={() => onDelete(beat.id)} className="p-3 rounded-xl bg-red-600/10 border border-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all disabled:opacity-30"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
