
import React, { useState, useEffect } from 'react';
import { 
  X, Upload, Plus, ListMusic, Link as LinkIcon, 
  Globe, Code, Zap, Trash2, Database, 
  Download, Terminal, RefreshCcw, Check, AlertTriangle, FileJson, Copy
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'sync'>('upload');
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  
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

  const formatDropboxLink = (url: string) => {
    if (!url) return '';
    if (url.includes('dropbox.com')) {
      // Convert standard share link to raw direct link for both images and audio
      return url
        .replace('dl=0', 'raw=1')
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }
    return url;
  };

  const getDeploymentJson = () => {
    const cleanBeats = beats.map(b => ({
      ...b,
      id: b.id.startsWith('global_') ? b.id : `global_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    }));
    return JSON.stringify(cleanBeats, null, 2);
  };

  const copyToClipboard = () => {
    const code = `Update content/beats.json with this data:\n\n${getDeploymentJson()}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleManualImport = () => {
    try {
      const data = JSON.parse(importJson);
      const beatList = Array.isArray(data) ? data : (data.beats || []);
      // We assume user wants to replace or add these to local state for preview
      beatList.forEach((b: any) => onUpload(b));
      setImportJson('');
      setActiveTab('manage');
      alert("Local state synchronized with provided JSON!");
    } catch (e) {
      alert("Invalid JSON data format.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process the URLs immediately
    const processedBeat = {
      ...formData,
      audioUrl: formatDropboxLink(formData.audioUrl),
      coverArt: formatDropboxLink(formData.coverArt),
      bpm: Number(formData.bpm),
      priceLease: Number(formData.priceLease),
      priceExclusive: Number(formData.priceExclusive),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ""),
      allowOffers: true
    };

    onUpload(processedBeat);
    
    // Clear form
    setFormData({ title: '', bpm: 140, key: 'Cm', tags: '', priceLease: 24.99, priceExclusive: 249.99, description: '', audioUrl: '', coverArt: '' });
    
    // Switch to Sync tab so user can copy JSON for AI deployment
    setActiveTab('sync');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative w-full max-w-6xl glass rounded-[3rem] overflow-hidden shadow-2xl border border-purple-500/20 flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <Terminal className="text-purple-500" /> ARCHITECT HUB
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">Staging & Sync Environment</p>
          </div>
          
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('upload')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'upload' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Add New</button>
            <button onClick={() => setActiveTab('manage')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Inventory</button>
            <button onClick={() => setActiveTab('sync')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sync' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Global Sync</button>
          </div>
          
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-gray-500 hover:text-white">
            <X size={32} />
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide bg-[#0c0c0c]/50">
          
          {activeTab === 'upload' && (
            <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Title</label>
                    <input required type="text" placeholder="E.G. CHROME HEARTS" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none uppercase font-black italic text-xl focus:border-purple-500 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">BPM</label>
                      <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-bold" value={formData.bpm} onChange={e => setFormData({...formData, bpm: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Musical Key</label>
                      <input required type="text" placeholder="C# MIN" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 uppercase font-bold" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Audio Source (Dropbox URL)</label>
                      <input required type="url" placeholder="https://www.dropbox.com/s/..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none font-bold text-sm" value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Artwork Source (Dropbox URL)</label>
                      <input required type="url" placeholder="https://www.dropbox.com/s/..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-pink-500 outline-none font-bold text-sm" value={formData.coverArt} onChange={e => setFormData({...formData, coverArt: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lease ($)</label>
                      <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-2xl outline-none focus:border-white/20" value={formData.priceLease} onChange={e => setFormData({...formData, priceLease: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exclusive ($)</label>
                      <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-2xl outline-none focus:border-white/20" value={formData.priceExclusive} onChange={e => setFormData({...formData, priceExclusive: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Metatags (Separated by commas)</label>
                    <input type="text" placeholder="TRAP, HARD, MELODIC" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 uppercase font-bold text-sm" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none resize-none text-sm font-medium" placeholder="Describe the vibe..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-white text-black py-8 rounded-[2rem] font-black text-3xl uppercase italic tracking-tighter flex items-center justify-center gap-4 hover:bg-purple-50 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl group">
                <Plus size={36} className="group-hover:rotate-180 transition-transform duration-700" /> STAGE BEAT FOR SYNC
              </button>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-black italic uppercase tracking-widest">Production Inventory ({beats.length})</h3>
              <div className="grid grid-cols-1 gap-4">
                {beats.map(beat => (
                  <div key={beat.id} className="glass border border-white/5 p-6 rounded-3xl flex items-center justify-between gap-6 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="relative">
                        <img src={beat.coverArt} className="w-20 h-20 rounded-2xl object-cover shadow-xl grayscale group-hover:grayscale-0 transition-all duration-500" alt={beat.title} />
                        {beat.id.startsWith('global_') && <Globe className="absolute -top-2 -left-2 text-blue-400 bg-black rounded-full p-1" size={24} />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black italic uppercase text-xl truncate tracking-tight">{beat.title}</h4>
                        <div className="flex items-center gap-4 mt-1 opacity-60 text-[10px] font-black uppercase tracking-widest">
                          <span>{beat.bpm} BPM</span>
                          <span>{beat.key}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => onToggleSold(beat.id)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${beat.isSold ? 'bg-green-600/10 border-green-500/20 text-green-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                        {beat.isSold ? 'Restock' : 'Mark Sold'}
                      </button>
                      <button onClick={() => onDelete(beat.id)} className="p-4 rounded-xl bg-red-600/10 border border-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="max-w-4xl mx-auto space-y-12 py-12 animate-in zoom-in-95 duration-500">
              <div className="text-center space-y-4">
                <Globe size={48} className="mx-auto text-indigo-500 animate-pulse" />
                <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">GLOBAL SYNC ENGINE</h3>
                <p className="text-gray-400 font-medium max-w-xl mx-auto">Deploy your current staging inventory to the live production database. Use the code below for AI deployment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2"><Zap size={20} /> AI DEPLOYMENT</h4>
                  </div>
                  <div className="relative group">
                    <pre className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-4 text-[9px] font-mono overflow-auto scrollbar-hide text-indigo-300 opacity-60 group-hover:opacity-100 transition-opacity">
                      {`Update content/beats.json:\n\n${getDeploymentJson()}`}
                    </pre>
                    <button 
                      onClick={copyToClipboard}
                      className={`absolute top-4 right-4 p-2 rounded-lg backdrop-blur-xl border transition-all ${copied ? 'bg-green-500 border-green-400' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <button onClick={copyToClipboard} className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:scale-[1.02]'}`}>
                    {copied ? 'DEPLOYMENT READY' : 'COPY DEPLOYMENT CODE'}
                  </button>
                </div>

                <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
                  <h4 className="font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><FileJson size={20} /> PREVIEW SYNC</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Paste JSON here to force-update your local landing page state with existing data.</p>
                  <textarea 
                    value={importJson} 
                    onChange={e => setImportJson(e.target.value)} 
                    placeholder='[ { "title": "Example", ... } ]'
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-[10px] font-mono outline-none focus:border-blue-500 transition-all" 
                  />
                  <button onClick={handleManualImport} className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <RefreshCcw size={20} /> SYNC LOCAL STATE
                  </button>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2rem] flex items-start gap-6">
                <AlertTriangle className="text-amber-500 shrink-0" size={32} />
                <div className="space-y-1">
                  <h5 className="font-black text-amber-500 uppercase tracking-widest text-sm">IMPORTANT</h5>
                  <p className="text-xs text-amber-500/80 font-bold uppercase tracking-wider leading-relaxed">
                    "Sync Local State" only updates your current session. To make beats live for everyone, you MUST copy the AI Deployment code and send it to the AI Engineer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
