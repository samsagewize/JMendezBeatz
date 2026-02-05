
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Plus, Globe, Trash2, Terminal, Check, AlertTriangle, Copy, ArrowLeft, Settings, Layout,
  BarChart3, Headphones, DollarSign, Users, LayoutDashboard, PlusCircle, CheckCircle, Play, 
  Loader2, ExternalLink, Shield, FileAudio, ImageIcon, Cloud, Lock, Key, Server, Link as LinkIcon,
  Music
} from 'lucide-react';
import { Beat, SiteConfig } from '../types';

import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.565.0";

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (beat: Omit<Beat, 'id' | 'producer'>) => void;
  beats: Beat[];
  onDelete: (id: string) => void;
  onToggleSold: (id: string) => void;
  config: SiteConfig & { useExternalStore?: boolean, externalStoreUrl?: string };
  onConfigUpdate: (config: any) => void;
  onSyncSuccess?: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ 
  isOpen, onClose, onUpload, beats, onDelete, onToggleSold, config, onConfigUpdate, onSyncSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'upload' | 'manage' | 'storefront' | 'sync'>('insights');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncLog, setSyncLog] = useState<string[]>([]);
  
  const [awsConfig, setAwsConfig] = useState(() => {
    const saved = localStorage.getItem('jmendez_aws_config');
    return saved ? JSON.parse(saved) : {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
      bucket: ''
    };
  });

  const pendingFiles = useRef<Record<string, { audio?: File, image?: File }>>({});

  const [formData, setFormData] = useState({
    title: '', bpm: 140, key: 'Cm', tags: '', priceLease: 29.99, priceExclusive: 499.99
  });
  
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [brandingData, setBrandingData] = useState(config);

  useEffect(() => {
    localStorage.setItem('jmendez_aws_config', JSON.stringify(awsConfig));
  }, [awsConfig]);

  const addLog = (msg: string) => setSyncLog(prev => [...prev, msg]);

  const handleLocalPublish = (e: React.FormEvent) => {
    e.preventDefault();
    const tempId = `local_${Date.now()}`;
    
    pendingFiles.current[tempId] = {
      audio: selectedAudio || undefined,
      image: selectedImage || undefined
    };

    onUpload({
      title: formData.title,
      bpm: formData.bpm,
      key: formData.key,
      tags: formData.tags.split(',').map(t => t.trim()),
      priceLease: formData.priceLease,
      priceExclusive: formData.priceExclusive,
      audioUrl: selectedAudio ? URL.createObjectURL(selectedAudio) : '',
      coverArt: selectedImage ? URL.createObjectURL(selectedImage) : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop',
      description: '',
      allowOffers: true
    });

    setFormData({ title: '', bpm: 140, key: 'Cm', tags: '', priceLease: 29.99, priceExclusive: 499.99 });
    setSelectedAudio(null);
    setSelectedImage(null);
    setActiveTab('manage');
  };

  const handleAWSSync = async () => {
    if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey || !awsConfig.bucket) {
      alert("Please complete AWS Configuration.");
      return;
    }

    setSyncStatus('loading');
    setSyncLog(["Initializing AWS deployment..."]);
    
    const client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey
      }
    });

    try {
      const updatedBeats = JSON.parse(JSON.stringify(beats));

      for (let i = 0; i < updatedBeats.length; i++) {
        const beat = updatedBeats[i];
        const files = pendingFiles.current[beat.id];

        if (files) {
          if (files.audio) {
            const fileName = `beats/audio/${Date.now()}_${files.audio.name.replace(/\s+/g, '_')}`;
            addLog(`S3 Upload [Audio]: ${fileName}`);
            await client.send(new PutObjectCommand({
              Bucket: awsConfig.bucket,
              Key: fileName,
              Body: files.audio,
              ContentType: files.audio.type,
              ACL: 'public-read'
            }));
            updatedBeats[i].audioUrl = `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${fileName}`;
          }

          if (files.image) {
            const fileName = `beats/art/${Date.now()}_${files.image.name.replace(/\s+/g, '_')}`;
            addLog(`S3 Upload [Art]: ${fileName}`);
            await client.send(new PutObjectCommand({
              Bucket: awsConfig.bucket,
              Key: fileName,
              Body: files.image,
              ContentType: files.image.type,
              ACL: 'public-read'
            }));
            updatedBeats[i].coverArt = `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${fileName}`;
          }
          
          delete pendingFiles.current[beat.id];
        }
      }

      await client.send(new PutObjectCommand({
        Bucket: awsConfig.bucket,
        Key: 'content/beats.json',
        Body: JSON.stringify(updatedBeats, null, 2),
        ContentType: 'application/json',
        ACL: 'public-read'
      }));

      await client.send(new PutObjectCommand({
        Bucket: awsConfig.bucket,
        Key: 'content/site_config.json',
        Body: JSON.stringify(brandingData, null, 2),
        ContentType: 'application/json',
        ACL: 'public-read'
      }));

      setSyncStatus('success');
      addLog("Assets live on AWS Global Edge.");
      
      if (onSyncSuccess) onSyncSuccess();
    } catch (error: any) {
      setSyncStatus('error');
      addLog(`AWS Error: ${error.message}`);
    }
  };

  const stats = [
    { label: 'Integration', value: config.useExternalStore ? 'Beatstars' : 'Native', icon: <LinkIcon size={20} className="text-blue-500" /> },
    { label: 'AWS Requests', value: '248K', icon: <Server size={20} className="text-purple-500" /> },
    { label: 'Global Edge', value: 'Live', icon: <Globe size={20} className="text-green-500" /> },
    // Fix: Added missing 'Music' icon to stats configuration
    { label: 'Inventory', value: beats.length.toString(), icon: <Music size={20} className="text-amber-500" /> },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative w-full sm:max-w-6xl glass rounded-none sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-full sm:h-[90vh]">
        
        <div className="p-6 sm:p-8 border-b border-white/5 bg-black/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Creator Studio</h2>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">External & Cloud Management</p>
            </div>
          </div>
          
          <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto scrollbar-hide">
            {[
              { id: 'insights', label: 'Cloud Ops', icon: <BarChart3 size={14} /> },
              { id: 'upload', label: 'Upload', icon: <PlusCircle size={14} /> },
              { id: 'manage', label: 'Inventory', icon: <Layout size={14} /> },
              { id: 'storefront', label: 'Storefront', icon: <Settings size={14} /> },
              { id: 'sync', label: 'AWS Sync', icon: <Globe size={14} /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-12">
          {activeTab === 'insights' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 hover:border-purple-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-black/40 rounded-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                    </div>
                    <p className="text-3xl font-black italic tracking-tighter mb-1">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'storefront' && (
            <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-center">Store Configuration</h3>
                <div className="bg-purple-600/10 border border-purple-500/20 rounded-[2rem] p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-xs">External Store Integration</h4>
                      <p className="text-[10px] text-zinc-500 font-medium">Toggle between custom grid and Beatstars player.</p>
                    </div>
                    <button 
                      onClick={() => onConfigUpdate({ useExternalStore: !config.useExternalStore })}
                      className={`w-14 h-8 rounded-full transition-all relative ${config.useExternalStore ? 'bg-purple-600' : 'bg-zinc-800'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${config.useExternalStore ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  {config.useExternalStore && (
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Beatstars Profile/Player URL</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input 
                          placeholder="https://www.beatstars.com/jmendezbeatz" 
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-5 font-bold focus:border-purple-500 outline-none" 
                          value={config.externalStoreUrl} 
                          onChange={e => onConfigUpdate({ externalStoreUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Producer Name</label>
                      <input className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 font-black uppercase" value={brandingData.producerName} onChange={e => {
                        const newConfig = { ...brandingData, producerName: e.target.value };
                        setBrandingData(newConfig);
                        onConfigUpdate(newConfig);
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <form onSubmit={handleLocalPublish} className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Track Name</label>
                  <input required placeholder="E.G. TITAN" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-black uppercase text-lg focus:border-purple-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">BPM</label>
                    <input required type="number" placeholder="140" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold focus:border-purple-500 outline-none" value={formData.bpm} onChange={e => setFormData({...formData, bpm: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Key</label>
                    <input required placeholder="Cm" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold uppercase focus:border-purple-500 outline-none" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Local Audio Source (Staged)</label>
                  <div className="relative group">
                    <input type="file" accept="audio/*" required className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setSelectedAudio(e.target.files ? e.target.files[0] : null)} />
                    <div className={`w-full bg-white/5 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${selectedAudio ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 group-hover:border-purple-500/50'}`}>
                      <FileAudio size={32} className={selectedAudio ? 'text-blue-500' : 'text-zinc-600'} />
                      <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">{selectedAudio ? selectedAudio.name : 'Choose Master Audio'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Art Source</label>
                  <div className="relative group">
                    <input type="file" accept="image/*" required className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setSelectedImage(e.target.files ? e.target.files[0] : null)} />
                    <div className={`w-full bg-white/5 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${selectedImage ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 group-hover:border-purple-500/50'}`}>
                      <ImageIcon size={32} className={selectedImage ? 'text-blue-500' : 'text-zinc-600'} />
                      <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">{selectedImage ? selectedImage.name : 'Choose Artwork'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase italic text-xl hover:bg-blue-500 transition-all active:scale-95">STAGE BEAT</button>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in">
              {beats.length === 0 ? (
                <div className="text-center py-20 opacity-20 font-black uppercase tracking-[0.4em]">No beats staged</div>
              ) : (
                beats.map(beat => (
                  <div key={beat.id} className="bg-white/5 p-5 rounded-[2rem] flex items-center justify-between border border-white/5 hover:border-blue-500/20 transition-all">
                    <div className="flex items-center gap-6">
                      <img src={beat.coverArt} className="w-16 h-16 rounded-2xl object-cover" />
                      <div>
                        <h4 className="font-black italic uppercase text-lg tracking-tight">{beat.title}</h4>
                        <div className="flex gap-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                          <span>{beat.bpm} BPM</span>
                          <span className="text-blue-500">{beat.key}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => onDelete(beat.id)} className="p-3.5 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="max-w-4xl mx-auto space-y-12 py-12 animate-in fade-in">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Cloud size={48} className="text-blue-500" />
                </div>
                <h3 className="text-5xl font-black italic uppercase tracking-tighter">AWS Infrastructure Sync</h3>
                <p className="text-zinc-500 text-sm font-medium mt-4">Deploy staged assets and configuration directly to Amazon S3.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-blue-500" size={20} />
                    <h4 className="font-black uppercase tracking-widest text-xs">AWS Credentials</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <input placeholder="Access Key ID" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs" value={awsConfig.accessKeyId} onChange={e => setAwsConfig({...awsConfig, accessKeyId: e.target.value})} />
                    <input type="password" placeholder="Secret Access Key" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs" value={awsConfig.secretAccessKey} onChange={e => setAwsConfig({...awsConfig, secretAccessKey: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Region" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs" value={awsConfig.region} onChange={e => setAwsConfig({...awsConfig, region: e.target.value})} />
                      <input placeholder="S3 Bucket" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs" value={awsConfig.bucket} onChange={e => setAwsConfig({...awsConfig, bucket: e.target.value})} />
                    </div>
                  </div>
                  
                  <button onClick={handleAWSSync} disabled={syncStatus === 'loading'} className={`w-full py-5 rounded-2xl font-black uppercase italic text-lg transition-all flex items-center justify-center gap-3 ${syncStatus === 'loading' ? 'bg-zinc-800 text-zinc-600' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/20 active:scale-95'}`}>
                    {syncStatus === 'loading' ? <Loader2 className="animate-spin" size={24} /> : <Cloud size={24} />}
                    DEPLOY TO AWS CLOUD
                  </button>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-[3rem] p-8 flex flex-col h-[300px]">
                   <div className="flex items-center gap-3 mb-6">
                     <Terminal size={18} className="text-blue-400" />
                     <h4 className="font-black uppercase tracking-widest text-xs">Deployment Log</h4>
                   </div>
                   <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] scrollbar-hide">
                     {syncLog.map((log, i) => (
                       <div key={i} className="flex gap-3 text-blue-300">
                         <span className="opacity-30 shrink-0">[{i+1}]</span>
                         <span className="break-all">{log}</span>
                       </div>
                     ))}
                   </div>
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
