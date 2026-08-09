import React, { useState } from 'react';
import { Code, Cpu, Database, Globe, Layers, Award, Terminal, Lock, Unlock, ExternalLink, Github } from 'lucide-react';

interface PortfolioSectionProps {
  accessGranted: boolean;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ accessGranted }) => {
  const [activeCategory, setActiveCategory] = useState<'skills' | 'projects' | 'resume'>('skills');

  const skills = [
    { name: 'Computer Vision & AI (MediaPipe, TensorFlow, OpenCV)', level: 92, category: 'AI/ML' },
    { name: 'React.js / Next.js / TypeScript', level: 95, category: 'Frontend' },
    { name: 'Tailwind CSS & Glassmorphism Design', level: 98, category: 'Frontend' },
    { name: 'Node.js / Express / Python FastAPI', level: 90, category: 'Backend' },
    { name: 'PostgreSQL / MongoDB / Redis', level: 88, category: 'Database' },
    { name: 'Docker / CI/CD Pipeline / AWS', level: 85, category: 'DevOps' },
  ];

  const projects = [
    {
      title: 'Nexum AI-Ops Platform',
      desc: 'Hệ thống giám sát hạ tầng AI và quản trị mô hình học máy thời gian thực với giao diện Cinematic Dark HUD.',
      tags: ['React', 'Tailwind', 'AI-Ops', 'WebSockets'],
      link: '#',
    },
    {
      title: 'Vision AI Face ID Authenticator',
      desc: 'Ứng dụng quét khuôn mặt 468 điểm tọa độ trên Web Browser không cần lưu dữ liệu về Server (Zero-Trust Privacy).',
      tags: ['MediaPipe', 'WebGL', 'TypeScript', 'Canvas'],
      link: '#',
    },
    {
      title: 'Real-time Emotion Analytics Engine',
      desc: 'Công cụ phân tích cảm xúc khuôn mặt và đo lường khoảng cách sinh trắc học ứng dụng trong giáo dục trực tuyến.',
      tags: ['Computer Vision', 'Python', 'FastAPI', 'React'],
      link: '#',
    },
  ];

  return (
    <section id="portfolio" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-3">
          <Code className="w-4 h-4 text-cyan-400" />
          <span>DEVELOPER PROFILE & PROJECTS</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-geist">
          Hồ Sơ Năng Lực Mr.Híu
        </h2>
        <p className="mt-4 text-slate-400 text-base">
          Chuyên môn Lập trình Fullstack & Nghiên cứu ứng dụng Thị giác Máy tính (Vision AI).
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveCategory('skills')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'skills'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
              : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          Kỹ Năng Công Nghệ
        </button>

        <button
          onClick={() => setActiveCategory('projects')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'projects'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
              : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          Dự Án Nổi Bật
        </button>

        <button
          onClick={() => setActiveCategory('resume')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'resume'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          {accessGranted ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
          <span>Secret Resume</span>
        </button>
      </div>

      {/* Skills Matrix */}
      {activeCategory === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-700/80 hover:border-cyan-500/30 transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium text-base font-geist">{skill.name}</span>
                <span className="text-cyan-400 font-mono text-sm font-bold">{skill.level}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <span className="text-slate-500 text-xs font-mono mt-2 block">CATEGORY: {skill.category}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {activeCategory === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl border border-slate-700/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-geist mb-3">
                  {proj.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-geist">
                  {proj.desc}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.tags.map((t, tid) => (
                    <span key={tid} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-xs">
                      #{t}
                    </span>
                  ))}
                </div>

                <a
                  href={proj.link}
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-bold group-hover:translate-x-1 transition-transform"
                >
                  <span>XEM CHI TIẾT DỰ ÁN</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Secret Resume Panel (Requires Face ID Access) */}
      {activeCategory === 'resume' && (
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 shadow-2xl">
          {accessGranted ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white font-geist">SƠ YẾU LÝ LỊCH BẢO MẬT (SECRET RESUME)</h3>
                  <p className="text-emerald-400 text-xs font-mono mt-1">SECURITY CLEARANCE: LEVEL_5_VERIFIED BY FACE ID</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span>UNLOCKED</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-geist">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-xs font-mono block mb-1">VỊ TRÍ MỤC TIÊU</span>
                  <span className="text-white font-semibold">AI Software Engineer & Fullstack Lead</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-xs font-mono block mb-1">KINH NGHIỆM</span>
                  <span className="text-white font-semibold">5+ Năm Triển Khai Hệ Thống Web & Vision AI</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-xs font-mono block mb-1">LIÊN HỆ TRỰC TIẾP</span>
                  <span className="text-cyan-400 font-semibold font-mono">mrhiu.dev@vision.ai</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
                <p className="text-emerald-400 font-bold mb-2">// KINH NGHIỆM LÀM VIỆC CHI TIẾT:</p>
                <p>- Thiết kế và tối ưu hóa hệ thống máy học thị giác (Vision AI) thời gian thực trên nền tảng WebGL/Canvas.</p>
                <p>- Xây dựng các ứng dụng Web Enterprise với Next.js, React, Node.js và hệ thống Microservices.</p>
                <p>- Áp dụng triết lý bảo mật Zero-Trust và xử lý dữ liệu sinh trắc học hoàn toàn trên Client-side.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white font-geist">TÀI LIỆU YÊU CẦU XÁC THỰC FACE ID</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                Vui lòng truy cập thẻ <b>"Vision AI App"</b> và nhấn <b>"QUÉT FACE ID"</b> để mở khóa tài liệu hồ sơ ẩn của Mr.Híu.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
