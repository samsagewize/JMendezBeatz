import React from "react";
import { Mail, Music2 } from "lucide-react";

const PRODUCER_NAME = "Jmendez Beatz";
const CONTACT_EMAIL = "jmendezbeatz1@gmail.com";
const BEATSTARS_URL = "https://www.beatstars.com/jmendezbeatz";

const App: React.FC = () => {
  return (
    <div className="min-h-screen pb-20">
      {/* Minimal nav: logo + title + contact */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Music2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">{PRODUCER_NAME}</span>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="px-5 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
          >
            <Mail size={16} />
            Contact
          </a>
        </div>
      </nav>

      {/* Hero + BeatStars iframe */}
      <section className="pt-32 pb-10 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 -z-10 w-[300px] h-[300px] bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 gap-8">
            <div>
              <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-300">
                Beat Store
              </div>
              <h1 className="mt-6 text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.92]">
                FIND YOUR
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  {" "}SONIC IDENTITY
                </span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
                Browse, license, and purchase beats directly from BeatStars.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#beats"
                  className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all inline-flex items-center justify-center"
                >
                  Beats
                </a>
                <a
                  href={BEATSTARS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center"
                >
                  Open BeatStars
                </a>
              </div>

              <div id="beats" className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/40 relative scroll-mt-32">
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <div className="text-center px-6">
                    <div className="text-sm font-black uppercase tracking-widest text-gray-300">Loading BeatStars…</div>
                    <div className="mt-2 text-xs text-gray-500">If the embed is blocked, use “Open in new tab”.</div>
                  </div>
                </div>
                <iframe
                  title="JMendezBeatz BeatStars"
                  src={BEATSTARS_URL}
                  className="w-full"
                  style={{ height: 760 }}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={BEATSTARS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all inline-flex items-center justify-center"
                >
                  Open in new tab
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center"
                >
                  Contact
                </a>
              </div>

              <div className="mt-4 text-xs text-gray-500 max-w-2xl">
                If the embedded store doesn’t load in your browser, use “Open in new tab”.
              </div>
            </div>
          </div>

          <footer className="mt-16 pt-10 border-t border-white/5 opacity-60">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-xs font-medium uppercase tracking-[0.1em]">© 2026 {PRODUCER_NAME}. All rights reserved.</p>
              <div className="text-xs text-gray-500">Beats sold via BeatStars.</div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default App;
