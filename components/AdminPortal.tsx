
import React, { useState } from 'react';
import { 
  X, Upload, Plus, ListMusic, Link as LinkIcon, 
  Globe, Code, Zap, Trash2, Database, 
  Download, Terminal, RefreshCcw, Check, AlertTriangle, FileJson
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
  const [uploadMode, setUploadMode] = useState<'link' | 'file'>('link');
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

  const generateAIDeployment = () => {
    const cleanBeats = beats.map(b => ({
      ...b,
      id: b.id.startsWith('global_') ? b.id : `global_${Date.now()}`
    }));
    const code = `Update content/beats.json with this data:\n\n${JSON.stringify(cleanBeats, null, 2)}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleManualImport = () => {
    try {
      const data = JSON.parse(importJson);
      const beatList = Array.isArray(data) ? data : (data.beats || []);
      beatList.forEach((b: any) => onUpload(b));
      setImportJson('');
      setActiveTab('manage');
      alert("Inventory loaded successfully!");
    } catch (e) {
      alert("Invalid JSON data.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      ...formData,
      bpm: Number(formData.bpm),
      priceLease: Number(formData.priceLease),
      priceExclusive: Number(formData.priceExclusive),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ""),
      allowOffers: true
    });
    setFormData({ title: '', bpm: 140, key: 'Cm', tags: '', priceLease: 24.99, priceExclusive: 249.99, description: '', audioUrl: '', coverArt: '' });
    setActiveTab('manage');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative w-full max-w-6xl glass rounded-[3rem] overflow-hidden shadow-2xl border border-purple-500/20 flex flex-col h-[90vh]">
        <div className="p-8 md:p-10 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <Terminal className="text-purple-500" /> ARCHITECT HUB
            </h2>
          </div>
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('upload')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'upload' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Add New</button>
            <button onClick={() => setActiveTab('manage')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Inventory</button>
            <button onClick={() => setActiveTab('sync')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sync' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Global Sync</button>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-gray-500 hover:text-white"><X size={32} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide bg-[#0c0c0c]/50">
          {activeTab === 'upload' && (
            <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Title</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none uppercase font-black italic text-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-bold" value={formData.bpm} onChange={e => setFormData({...formData, bpm: parseInt(e.target.value)})} />
                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 uppercase font-bold" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
                  </div>
                  <input required type="url" placeholder="Audio Cloud URL" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none font-bold text-sm" value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} />
                  <input required type="url" placeholder="Cover Art URL" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-pink-500 outline-none font-bold text-sm" value={formData.coverArt} onChange={e => setFormData({...formData, coverArt: e.target.value})} />
                </div>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-2xl outline-none" value={formData.priceLease} onChange={e => setFormData({...formData, priceLease: parseFloat(e.target.value)})} />
                    <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-2xl outline-none" value={formData.priceExclusive} onChange={e => setFormData({...formData, priceExclusive: parseFloat(e.target.value)})} />
                  </div>
                  <input type="text" placeholder="TAGS (Separated by commas)" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 uppercase font-bold text-sm" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none resize-none text-sm font-medium" placeholder="Sonic Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-white text-black py-8 rounded-[2rem] font-black text-3xl uppercase italic tracking-tighter flex items-center justify-center gap-4 hover:bg-purple-50 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl group">
                <Plus size={36} className="group-hover:rotate-180 transition-transform duration-700" /> STAGE BEAT FOR SYNC
              </button>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-black italic uppercase tracking-widest">Active Crate ({beats.length})</h3>
              <div className="grid grid-cols-1 gap-4">
                {beats.map(beat => (
                  <div key={beat.id} className="glass border border-white/5 p-6 rounded-3xl flex items-center justify-between gap-6 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <img src={beat.coverArt} className="w-20 h-20 rounded-2xl object-cover" />
                      <div className="min-w-0">
                        <h4 className="font-black italic uppercase text-xl truncate tracking-tight">{beat.title}</h4>
                        <div className="flex items-center gap-4 mt-1 opacity-60 text-[10px] font-black uppercase">
                          <span>{beat.bpm} BPM</span> <span>{beat.key}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => onToggleSold(beat.id)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${beat.isSold ? 'bg-green-600/10 border-green-500/20 text-green-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                        {beat.isSold ? 'Restock' : 'Mark Sold'}
                      </button>
                      <button onClick={() => onDelete(beat.id)} className="p-4 rounded-xl bg-red-600/10 border border-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
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
                <h3 className="text-5xl font-black italic uppercase tracking-tighter">GLOBAL SYNC ENGINE</h3>
                <p className="text-gray-400 font-medium max-w-xl mx-auto">Update your production catalog globally. Use the CMS automated tool or the manual JSON sync below.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
                  <h4 className="font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2"><Zap size={20} /> AI DEPLOYMENT</h4>
                  <button onClick={generateAIDeployment} className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:scale-[1.02]'}`}>
                    {copied ? <Check size={20} /> : <Code size={20} />}
                    {copied ? 'CODE COPIED' : 'PREPARE DEPLOYMENT'}
                  </button>
                </div>

                <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
                  <h4 className="font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><FileJson size={20} /> MANUAL IMPORT</h4>
                  <textarea value={importJson} onChange={e => setImportJson(e.target.value)} placeholder="Paste JSON here..." className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-mono outline-none focus:border-blue-500" />
                  <button onClick={handleManualImport} className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <Download size={20} /> SYNC LOCAL STATE
                  </button>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2rem] flex items-start gap-6">
                <AlertTriangle className="text-amber-500 shrink-0" size={32} />
                <p className="text-xs text-amber-500/80 font-bold uppercase tracking-wider leading-relaxed">
                  NOTE: Permanent updates require the AI Engineer to apply the "Deployment Code" to content/beats.json. Decap CMS manages this automatically once you link it to a Git provider.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
