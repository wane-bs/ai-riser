import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Circle } from 'lucide-react';

export const TerminalBio: React.FC = () => {
  const [history, setHistory] = useState<Array<{ cmd: string; output: string | React.ReactNode }>>([
    {
      cmd: 'welcome',
      output: 'Mr.Híu Vision AI System v2.5. Type "help" to list available commands.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputVal.trim().toLowerCase();
    if (!command) return;

    let output: string | React.ReactNode = '';

    switch (command) {
      case 'help':
        output = (
          <div className="space-y-1 text-slate-300 font-mono text-xs">
            <p><span className="text-cyan-400 font-bold">bio</span> - Hiển thị thông tin cá nhân & định hướng</p>
            <p><span className="text-cyan-400 font-bold">skills</span> - Danh sách kỹ năng lập trình & AI Vision</p>
            <p><span className="text-cyan-400 font-bold">contact</span> - Thông tin liên hệ công việc</p>
            <p><span className="text-cyan-400 font-bold">scan</span> - Trạng thái camera & hệ thống sinh trắc học</p>
            <p><span className="text-cyan-400 font-bold">clear</span> - Xóa lịch sử terminal</p>
          </div>
        );
        break;

      case 'bio':
        output = 'Mr.Híu - Fullstack Engineer & Vision AI Researcher. Đam mê thiết kế các hệ thống Web tương tác cao, thiết kế giao diện Cinematic Glassmorphic và ứng dụng Trí tuệ Nhân tạo Máy tính.';
        break;

      case 'skills':
        output = 'Frontend: React, TypeScript, Tailwind CSS, WebGL. Backend: Node.js, Python, PostgreSQL. AI/ML: MediaPipe, TensorFlow, OpenCV, Face Mesh 468 Vertices.';
        break;

      case 'contact':
        output = 'Email: mrhiu.dev@vision.ai | Github: github.com/mrhiu-ai | Location: Ho Chi Minh City, Vietnam.';
        break;

      case 'scan':
        output = 'STATUS: ONLINE | CAMERA_API: WebRTC Active | MODEL: MediaPipe FaceMesh 468 Vertices Ready.';
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        output = `Command not recognized: "${command}". Type "help" for available commands.`;
    }

    setHistory((prev) => [...prev, { cmd: inputVal, output }]);
    setInputVal('');
  };

  return (
    <section id="terminal" className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="glass-panel rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3 text-red-500 fill-red-500" />
            <Circle className="w-3 h-3 text-amber-500 fill-amber-500" />
            <Circle className="w-3 h-3 text-emerald-500 fill-emerald-500" />
            <span className="text-xs font-mono text-slate-400 ml-2">mrhiu@vision-ai-terminal:~</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
            <TerminalIcon className="w-4 h-4" />
            <span>CLI_SHELL</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-xs text-slate-200 space-y-4 max-h-96 overflow-y-auto bg-slate-950/80">
          {history.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400">
                <span>mrhiu@vision-ai:~$</span>
                <span className="text-white font-bold">{item.cmd}</span>
              </div>
              <div className="pl-4 text-slate-300 leading-relaxed">{item.output}</div>
            </div>
          ))}

          {/* Form Input Line */}
          <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-bold">mrhiu@vision-ai:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Nhập lệnh (vd: help, bio, skills)..."
              className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs placeholder:text-slate-600"
            />
            <button type="submit" className="text-slate-500 hover:text-cyan-400">
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  );
};
