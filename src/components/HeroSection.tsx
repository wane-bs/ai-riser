import React from 'react';
import { Camera, Sparkles, ArrowRight, ShieldAlert, Cpu, Activity } from 'lucide-react';

interface HeroSectionProps {
  onStartVisionAi: () => void;
  onExplorePortfolio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartVisionAi,
  onExplorePortfolio
}) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-10 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Animated Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* Top Banner Tag */}
      <div className="relative z-10 my-auto pt-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-lg shadow-cyan-950/40">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>AI-OPS VISION PLATFORM v2.5</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-none font-geist">
          Mr.Híu <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Vision AI & Fullstack
          </span>
        </h1>

        <p className="mt-6 text-slate-300 text-lg sm:text-xl font-normal max-w-2xl leading-relaxed">
          Hệ thống Nhận diện Khuôn mặt Thời gian thực (Real-time Vision AI) tích hợp Hồ sơ Năng lực Lập trình viên. Trải nghiệm quét sinh trắc học và mở khóa Face ID bảo mật ngay trên trình duyệt.
        </p>

        {/* Action Buttons & CTA Input */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onStartVisionAi}
            className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold text-base shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Camera className="w-5 h-5 text-black" />
            <span>Mở Vision AI App</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={onExplorePortfolio}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full glass-panel hover:bg-slate-800/80 text-white font-medium text-base border border-slate-700/80 transition-all"
          >
            <span>Khám phá Portfolio</span>
          </button>
        </div>
      </div>

      {/* Bottom Anchored Content Grid */}
      <div className="relative z-10 mt-auto pt-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Left Column Status Card */}
        <div className="md:col-span-7 glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>System Telemetry</span>
            </div>
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              CLIENT_SIDE_AI_READY
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed font-geist">
            Xử lý mô hình thị giác máy tính 468 điểm (FaceMesh) trực tiếp tại trình duyệt bằng HTML5 WebGL & WebCam API. 100% On-device privacy.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>MODEL: MediaPipe FaceMesh</span>
            <span>LATENCY: ~12ms</span>
          </div>
        </div>

        {/* Right Column Glass Stat Cards (Featuring Silkscreen font for 42,500+) */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          {/* Card 1: Stat Number "42,500+" ONLY in Silkscreen font */}
          <div className="glass-panel-glow rounded-2xl p-5 border border-cyan-500/30 flex flex-col justify-between">
            <div className="text-cyan-400 text-xs font-mono uppercase">Inference Points</div>
            <div className="my-2">
              <span className="font-['Silkscreen'] text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-tight">
                42,500+
              </span>
            </div>
            <p className="text-slate-400 text-xs font-geist">Frame Landmarks Processed/min</p>
          </div>

          {/* Card 2: Status & Accuracy */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>Face ID Lock</span>
            </div>
            <div className="my-2 text-2xl font-bold text-white font-mono">
              99.4%
            </div>
            <p className="text-slate-400 text-xs font-geist">Biometric Verification Precision</p>
          </div>
        </div>
      </div>
    </section>
  );
};
