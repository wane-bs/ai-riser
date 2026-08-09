import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FaceRecognitionApp } from './components/FaceRecognitionApp';
import { PortfolioSection } from './components/PortfolioSection';
import { TerminalBio } from './components/TerminalBio';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [accessGranted, setAccessGranted] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id === 'vision-ai' ? 'vision-ai-app' : id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 font-geist selection:bg-cyan-500 selection:text-black">
      {/* Background Cinematic Video / Ambient Mesh Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={scrollToSection}
        cameraActive={true}
        accessGranted={accessGranted}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection
          onStartVisionAi={() => scrollToSection('vision-ai')}
          onExplorePortfolio={() => scrollToSection('portfolio')}
        />

        <FaceRecognitionApp
          onUnlockSecretResume={() => {
            setAccessGranted(true);
            scrollToSection('portfolio');
          }}
          accessGranted={accessGranted}
          setAccessGranted={setAccessGranted}
        />

        <PortfolioSection accessGranted={accessGranted} />

        <TerminalBio />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
