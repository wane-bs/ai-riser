import React from 'react';
import { Cpu, Heart, Github, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-white font-bold text-sm font-geist">Mr.Híu // Vision AI & Portfolio</span>
            <p className="text-slate-500 text-xs font-mono">Real-time Biometric Vision Framework</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            Zero-Trust Privacy Verified
          </span>
          <span>© {new Date().getFullYear()} Mr.Híu. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
