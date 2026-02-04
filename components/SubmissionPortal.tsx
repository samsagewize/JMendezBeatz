
import React, { useState } from 'react';
import { 
  X, UploadCloud, FileAudio, ImageIcon, CheckCircle2, 
  ChevronRight, Info, Music, ShieldCheck, DollarSign
} from 'lucide-react';
import { Beat } from '../types';

interface SubmissionPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (beat: Omit<Beat, 'id' | 'producer'> & { producer: string }) => void;
}

const SubmissionPortal: React.FC<SubmissionPortalProps> = ({ isOpen, onClose, onUpload }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    producer: '',
    bpm: 140,
    key: 'Cm',
    tags: '',
    priceLease: 29.99,
    priceExclusive: 499.99
  });

  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()),
      audioUrl: selectedAudio ? URL.createObjectURL(selectedAudio) : '',
      coverArt: selectedImage ? URL.createObjectURL(selectedImage) : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop',
      description: `Community submission by ${formData.producer}`,
      allowOffers: true
    });
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
        
        {/* Progress Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 w-12 rounded-full transition-all ${step >= s ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/5'}`} />
            ))}
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 sm:p-12">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UploadCloud size={32} className="text-purple-500" />
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Join the Crate</h2>
                <p className="text-zinc-500 text-sm font-medium">Submit your production to the community marketplace.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Your Artist Name</label>
                  <input required placeholder="E.G. METRO BOOMIN" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-black uppercase focus:border-purple-500 outline-none" value={formData.producer} onChange={e => setFormData({...formData, producer: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Beat Title</label>
                  <input required placeholder="E.G. SKYFALL" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-black uppercase focus:border-purple-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
              </div>

              <button onClick={handleNext} disabled={!formData.producer || !formData.title} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase italic text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                Continue <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Sonic Details</h2>
                <p className="text-zinc-500 text-sm font-medium">Tag your track for better discoverability.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">BPM</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none" value={formData.bpm} onChange={e => setFormData({...formData, bpm: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Key</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold uppercase outline-none" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Tags (Comma Separated)</label>
                <input placeholder="Trap, Dark, Ambient..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 bg-white/5 text-zinc-500 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-white/10 transition-all">Back</button>
                <button onClick={handleNext} className="flex-[2] bg-white text-black py-5 rounded-3xl font-black uppercase italic text-lg hover:bg-zinc-200 transition-all">Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Media Upload</h2>
                <p className="text-zinc-500 text-sm font-medium">Drag and drop your high-quality assets.</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input type="file" accept="audio/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setSelectedAudio(e.target.files ? e.target.files[0] : null)} />
                  <div className={`w-full bg-white/5 border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all ${selectedAudio ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 group-hover:border-purple-500/50'}`}>
                    <FileAudio size={40} className={selectedAudio ? 'text-purple-500' : 'text-zinc-600'} />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      {selectedAudio ? selectedAudio.name : 'Drop Your Master Audio'}
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setSelectedImage(e.target.files ? e.target.files[0] : null)} />
                  <div className={`w-full bg-white/5 border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all ${selectedImage ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 group-hover:border-purple-500/50'}`}>
                    <ImageIcon size={40} className={selectedImage ? 'text-purple-500' : 'text-zinc-600'} />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      {selectedImage ? selectedImage.name : 'Drop Cover Artwork'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-3xl flex items-center gap-4">
                <ShieldCheck className="text-purple-500 shrink-0" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assets are verified for industry standards and hosted on AWS S3 for secure distribution.</p>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 bg-white/5 text-zinc-500 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-white/10 transition-all">Back</button>
                <button onClick={handleSubmit} disabled={!selectedAudio || !selectedImage} className="flex-[2] bg-purple-600 text-white py-5 rounded-3xl font-black uppercase italic text-lg hover:bg-purple-500 shadow-xl shadow-purple-900/20 transition-all disabled:opacity-50">FINALIZE UPLOAD</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-20 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={56} className="text-green-500 animate-bounce" />
              </div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Live in the Crate!</h2>
              <p className="text-zinc-500 max-w-sm mx-auto font-medium">Your track has been staged. It will appear on the community marketplace instantly.</p>
              
              <div className="flex flex-col gap-3">
                <button onClick={onClose} className="bg-white text-black py-5 rounded-3xl font-black uppercase italic text-lg hover:bg-zinc-200 transition-all">Go to Store</button>
                <button onClick={() => { setStep(1); setFormData({title: '', producer: '', bpm: 140, key: 'Cm', tags: '', priceLease: 29.99, priceExclusive: 499.99}); setSelectedAudio(null); setSelectedImage(null); }} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">Upload Another</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionPortal;
