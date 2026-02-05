
import React from 'react';
import { Mail, Instagram, Youtube, ArrowLeft, Award, Zap, Headphones, Globe, Music2, Waves } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  producerName: string;
  contactEmail: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack, producerName, contactEmail }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white animate-in fade-in duration-700 pb-24">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[70] px-8 py-8 flex justify-between items-center pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto group flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl hover:bg-zinc-200 transition-all shadow-2xl"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Return to Store</span>
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="relative group lg:sticky lg:top-40">
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/20 to-pink-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" 
                alt="Jmendez Beatz Studio" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-600 rounded-[3rem] flex items-center justify-center rotate-12 shadow-2xl hidden md:flex">
                <Music2 size={64} className="text-white -rotate-12" />
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-600/10 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-6">
                Official Bio
              </div>
              <h1 className="text-6xl sm:text-7xl font-black italic uppercase tracking-tighter mb-8 leading-[0.85]">
                MEET <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{producerName}</span>
              </h1>
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed font-medium">
                <p>
                  <span className="text-white font-black">Jmendezbeatz</span> is a Chicago-based music producer, beatmaker, and audio engineer specializing in reggaeton, Latin trap, and melodic trap. With a strong focus on modern sound design and industry-ready quality, he creates original beats and delivers professional mixing and mastering tailored to today’s artists.
                </p>
                <p>
                  In addition to production, Jmendezbeatz offers <span className="text-purple-400">mobile studio services</span>, bringing a full recording and engineering setup directly to artists for a comfortable, efficient creative process. His goal is simple: help artists turn ideas into polished, release-ready records while maintaining their unique sound.
                </p>
              </div>
            </div>

            {/* Mixing and Mastering Section */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 group hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
                  <Headphones size={24} />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Mixing & Mastering</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed uppercase tracking-wide">
                Get that industry-standard punch and clarity. Professional post-production tailored to your specific genre and vocal style. 
              </p>
              <a 
                href={`mailto:${contactEmail}?subject=Mixing and Mastering Inquiry`}
                className="inline-flex items-center gap-3 bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all"
              >
                Inquire via Email <Mail size={16} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <Award className="text-purple-500 mb-3" size={24} />
                <h4 className="font-black uppercase text-xs tracking-widest mb-1">Chicago Based</h4>
                <p className="text-[10px] text-zinc-500 uppercase leading-tight">Rooted in the city's legendary creative energy.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <Waves className="text-pink-500 mb-3" size={24} />
                <h4 className="font-black uppercase text-xs tracking-widest mb-1">Mobile Studio</h4>
                <p className="text-[10px] text-zinc-500 uppercase leading-tight">Pro setup brought directly to your location.</p>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Connect with the Lab</h3>
              <div className="flex flex-col gap-4">
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-5 rounded-2xl transition-all border border-white/5 group">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Business Inquiries</p>
                    <p className="font-bold">{contactEmail}</p>
                  </div>
                </a>
                
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/jmendezbeatz/?hl=en" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white/5 hover:bg-[#E4405F] border border-white/5 hover:border-[#E4405F] p-5 rounded-2xl flex items-center justify-center transition-all group"
                  >
                    <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a 
                    href="https://www.youtube.com/@jmendezbeatz" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white/5 hover:bg-[#FF0000] border border-white/5 hover:border-[#FF0000] p-5 rounded-2xl flex items-center justify-center transition-all group"
                  >
                    <Youtube size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
                <Headphones size={32} className="mx-auto text-purple-500 opacity-50" />
                <h4 className="font-black uppercase tracking-widest text-sm">Artist Centric</h4>
                <p className="text-xs text-zinc-500 leading-relaxed uppercase">Helping you turn raw ideas into polished, release-ready records.</p>
            </div>
            <div className="space-y-4">
                <Globe size={32} className="mx-auto text-blue-500 opacity-50" />
                <h4 className="font-black uppercase tracking-widest text-sm">Industry Standard</h4>
                <p className="text-xs text-zinc-500 leading-relaxed uppercase">Modern sound design and sonic precision for the competitive market.</p>
            </div>
            <div className="space-y-4">
                <Zap size={32} className="mx-auto text-amber-500 opacity-50" />
                <h4 className="font-black uppercase tracking-widest text-sm">Efficiency</h4>
                <p className="text-xs text-zinc-500 leading-relaxed uppercase">Mobile services and streamlined engineering for a comfortable process.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
