import React, { useState } from 'react';
import { Camera, ChevronDown, Sparkles, ArrowRight, ShieldCheck, Cpu, Activity, Menu, X } from 'lucide-react';

interface HeroSectionProps {
  onStartVisionAi: () => void;
  onExplorePortfolio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartVisionAi,
  onExplorePortfolio
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white font-geist selection:bg-cyan-500 selection:text-black">
      {/* Background Full-Bleed Video (Exact URL from prompt.md) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4"
      />

      {/* Content sits directly over video at z-10 (No dark overlay gradient as specified in prompt.md) */}
      <div className="relative z-10 flex flex-col h-full justify-between p-4 md:p-8 max-w-7xl mx-auto">
        {/* Top Navigation Bar */}
        <header className="pt-2">
          <nav className="glass-panel-glow rounded-full px-6 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl bg-white/[0.06]">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-geist">
                nexum <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 font-mono ml-1">AI-OPS</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
              <a href="#vision-ai-app" onClick={onStartVisionAi} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <span>Vision AI App</span>
              </a>
              <a href="#portfolio" onClick={onExplorePortfolio} className="hover:text-cyan-400 transition-colors">
                <span>Portfolio & Skill</span>
              </a>
              <div className="relative group cursor-pointer flex items-center gap-1 hover:text-cyan-400 transition-colors">
                <span>Giải pháp AI</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-transform group-hover:rotate-180" />
              </div>
              <a href="#terminal" className="hover:text-cyan-400 transition-colors">
                <span>Terminal CLI</span>
              </a>
            </div>

            {/* Right Action Button */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={onStartVisionAi}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all shadow-md"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>LAUNCH VISION AI</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-200 hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Overlay + Slide-in Panel */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 p-5 glass-panel rounded-3xl border border-white/15 shadow-2xl backdrop-blur-2xl bg-black/80 flex flex-col gap-3">
              <a
                href="#vision-ai-app"
                onClick={() => { onStartVisionAi(); setMobileMenuOpen(false); }}
                className="py-2.5 px-4 rounded-xl hover:bg-white/10 text-slate-200 text-sm font-medium"
              >
                Vision AI App
              </a>
              <a
                href="#portfolio"
                onClick={() => { onExplorePortfolio(); setMobileMenuOpen(false); }}
                className="py-2.5 px-4 rounded-xl hover:bg-white/10 text-slate-200 text-sm font-medium"
              >
                Portfolio & Skill
              </a>
              <a
                href="#terminal"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 rounded-xl hover:bg-white/10 text-slate-200 text-sm font-medium"
              >
                Terminal CLI
              </a>
            </div>
          )}
        </header>

        {/* Bottom-Anchored Main Content Container (Exact layout architecture from prompt.md) */}
        <main className="mt-auto pb-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Left Column: Headline + Value Prop + Email CTA */}
          <div className="lg:col-span-7 flex flex-col justify-end">
            {/* Tag / Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-cyan-300 text-xs font-mono mb-4 w-max backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>NEXUM CINEMATIC AI-OPS PLATFORM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] font-geist">
              Chủ Động Vận Hành <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Thị Giác AI & Hồ Sơ
              </span>
            </h1>

            <p className="mt-4 text-slate-300 text-base md:text-lg max-w-xl leading-relaxed font-geist">
              Hệ thống AI-Ops thế hệ mới tích hợp quét sinh trắc học khuôn mặt thời gian thực, đo cảm xúc vi mô và mở khóa hồ sơ kỹ năng của <b>Mr.Híu</b>.
            </p>

            {/* Email CTA Form (Glassmorphism design) */}
            <form onSubmit={handleSubscribe} className="mt-6 flex items-center max-w-md">
              <div className="relative flex-1 glass-panel rounded-full border border-white/20 p-1.5 flex items-center shadow-xl backdrop-blur-xl bg-white/[0.08]">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none font-geist"
                  required
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold text-xs font-geist flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <span>{subscribed ? 'Đã gửi ✓' : 'Truy cập AI'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Two Glassmorphism Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Glass Card 1: Stat Number "42,500+" ONLY in Silkscreen font (Strict prompt constraint) */}
            <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30 backdrop-blur-2xl bg-white/[0.07] flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between text-cyan-400 text-xs font-mono uppercase tracking-wider">
                <span>Inference Rate</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="my-3">
                <span className="font-['Silkscreen'] text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-tight">
                  42,500+
                </span>
              </div>
              <p className="text-slate-300 text-xs font-geist leading-snug">
                Tọa độ Landmark sinh trắc học được xử lý mỗi phút.
              </p>
            </div>

            {/* Glass Card 2: AI Status & Precision Metrics */}
            <div className="glass-panel rounded-3xl p-6 border border-white/15 backdrop-blur-xl bg-white/[0.05] flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-mono uppercase tracking-wider">
                <span>Precision Score</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="my-3 text-3xl sm:text-4xl font-bold text-white font-mono">
                99.4%
              </div>
              <p className="text-slate-300 text-xs font-geist leading-snug">
                Độ chính xác nhận diện 8 cảm xúc vi mô trên trình duyệt.
              </p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};
