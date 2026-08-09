import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, Eye, Cpu, ShieldCheck, Zap, RefreshCw, Lock, Unlock, Sparkles, AlertCircle, User, Smile } from 'lucide-react';
import { FaceBiometrics, SystemStatus, Point3D } from '../types/face';
import { analyzeMultiLandmarks, drawMultiCyberHUD } from '../utils/faceEngine';

interface FaceRecognitionAppProps {
  onUnlockSecretResume: () => void;
  accessGranted: boolean;
  setAccessGranted: (granted: boolean) => void;
}

export const FaceRecognitionApp: React.FC<FaceRecognitionAppProps> = ({
  onUnlockSecretResume,
  accessGranted,
  setAccessGranted
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<SystemStatus>({
    cameraActive: false,
    modelLoaded: true,
    fps: 60,
    faceDetected: false,
    faceCount: 0,
    accessGranted: accessGranted,
    scanningMode: 'biometric',
  });

  const [biometrics, setBiometrics] = useState<FaceBiometrics>({
    faceCount: 0,
    people: [],
    expression: 'Đang khởi tạo...',
    confidence: 0,
    pitch: 0,
    yaw: 0,
    roll: 0,
    leftEyeOpen: true,
    rightEyeOpen: true,
    blinkCount: 14,
    distanceCm: 50,
    faceScore: 95,
  });

  const [scanningProgress, setScanningProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize MediaPipe FaceMesh for Single Face Tracking
  useEffect(() => {
    let animFrameId: number;
    let cameraInstance: any = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStatus((prev) => ({ ...prev, cameraActive: true }));
        }

        // Initialize MediaPipe FaceMesh via CDN global window object if available
        if ((window as any).FaceMesh && (window as any).Camera && videoRef.current) {
          const faceMesh = new (window as any).FaceMesh({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
          });

          // Single Face Detection Mode (maxNumFaces: 1)
          faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });

          faceMesh.onResults((results: any) => {
            if (canvasRef.current && videoRef.current) {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              if (!ctx) return;

              canvas.width = videoRef.current.videoWidth || 640;
              canvas.height = videoRef.current.videoHeight || 480;

              if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                // Take only the first detected face (Single Person Mode)
                const singleLandmarks: Point3D[][] = [results.multiFaceLandmarks[0]];
                const bio = analyzeMultiLandmarks(singleLandmarks, canvas.width, canvas.height);
                setBiometrics(bio);
                setStatus((prev) => ({
                  ...prev,
                  faceDetected: true,
                  faceCount: 1,
                }));

                drawMultiCyberHUD(ctx, singleLandmarks, canvas.width, canvas.height, status.scanningMode, bio);
              } else {
                setStatus((prev) => ({ ...prev, faceDetected: false, faceCount: 0 }));
                setBiometrics((prev) => ({ ...prev, faceCount: 0, people: [] }));
                drawMultiCyberHUD(ctx, null, canvas.width, canvas.height, status.scanningMode, biometrics);
              }
            }
          });

          cameraInstance = new (window as any).Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && faceMesh) {
                await faceMesh.send({ image: videoRef.current });
              }
            },
            width: 1280,
            height: 720,
          });

          cameraInstance.start();
        } else {
          renderFallbackLoop();
        }
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError('Không thể mở Webcam. Đang kích hoạt chế độ Giả lập Vision AI Single Person.');
        setStatus((prev) => ({ ...prev, cameraActive: false }));
        renderFallbackLoop();
      }
    };

    const renderFallbackLoop = () => {
      let angle = 0;
      const loop = () => {
        angle += 0.04;
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 640;
            canvas.height = 480;

            // Generate synthetic single-face landmarks
            const faceX = 0.50 + Math.sin(angle) * 0.04;
            const faceY = 0.45 + Math.cos(angle * 0.7) * 0.03;

            const demoFace: Point3D[] = Array.from({ length: 468 }, (_, i) => ({
              x: faceX + Math.cos((i / 468) * Math.PI * 2) * 0.16,
              y: faceY + Math.sin((i / 468) * Math.PI * 2) * 0.20,
              z: 0,
            }));

            const multiDemo = [demoFace];
            const bio = analyzeMultiLandmarks(multiDemo, canvas.width, canvas.height);

            // Cycle emotions in demo mode
            const emotionCycle = [
              'Cười (Happy 😄)',
              'Tức giận (Angry 😡)',
              'Buồn (Sad 😢)',
              'Ngạc nhiên (Surprised 😲)',
              'Sợ hãi (Fear 😱)',
              'Khó chịu (Disgust 🤢)',
              'Tập trung (Focused 🧐)',
              'Bình thường (Neutral 😐)'
            ];
            const idx = Math.floor((angle * 0.8) % emotionCycle.length);

            if (bio.people[0]) {
              bio.people[0].expression = emotionCycle[idx];
              bio.people[0].confidence = 96;
            }

            setBiometrics(bio);
            setStatus((prev) => ({ ...prev, faceDetected: true, faceCount: 1 }));

            drawMultiCyberHUD(ctx, multiDemo, canvas.width, canvas.height, status.scanningMode, bio);
          }
        }
        animFrameId = requestAnimationFrame(loop);
      };
      loop();
    };

    startCamera();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (cameraInstance) cameraInstance.stop();
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [status.scanningMode]);

  // Face ID Verification Scan Flow
  const triggerFaceScan = () => {
    setIsScanning(true);
    setScanningProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanningProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setAccessGranted(true);
        setStatus((prev) => ({ ...prev, accessGranted: true }));
        onUnlockSecretResume();
      }
    }, 200);
  };

  const currentPerson = biometrics.people[0];
  const isSmiling = currentPerson?.expression.includes('Cười') || currentPerson?.expression.includes('Happy');

  return (
    <section id="vision-ai-app" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>VISION AI: SINGLE PERSON RECOGNITION & EMOTION SUITE</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-geist">
          Nhận diện 1 Người & Cảm Xúc
        </h2>
        <p className="mt-4 text-slate-400 text-base">
          Tập trung nhận diện 1 người duy nhất, phân tích đầy đủ 8 cảm xúc vi mô thời gian thực và đo chỉ số sinh trắc học.
        </p>
      </div>

      {/* Main Vision AI Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera / Canvas Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 shadow-2xl bg-black aspect-video flex items-center justify-center">
            {/* Real Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-70"
            />

            {/* Cyberpunk HUD Overlay Canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover z-10 transform -scale-x-100"
            />

            {/* Corner HUD Reticle Graphics */}
            <div className="hud-corner-tl z-20"></div>
            <div className="hud-corner-tr z-20"></div>
            <div className="hud-corner-bl z-20"></div>
            <div className="hud-corner-br z-20"></div>

            {/* Scanning Progress Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
                <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white font-mono">BIOMETRIC FACE ID SCANNING...</h3>
                <p className="text-cyan-300 text-xs font-mono mt-1">Analyzing 468 Mesh Vertices & Landmark Geometry</p>
                <div className="w-64 h-3 bg-slate-900 rounded-full mt-6 overflow-hidden border border-cyan-500/40">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-200"
                    style={{ width: `${scanningProgress}%` }}
                  ></div>
                </div>
                <span className="text-emerald-400 font-mono text-sm mt-2">{scanningProgress}% COMPLETE</span>
              </div>
            )}

            {/* Top Bar Indicators over Canvas */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-xs font-mono text-cyan-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>FPS: 60 | SINGLE_PERSON_MODE</span>
              </div>

              {/* Single Face Counter Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-xs font-mono text-emerald-300 font-bold backdrop-blur-md">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>TARGET: {status.faceDetected ? '1 FACE DETECTED' : 'SEARCHING...'}</span>
              </div>
            </div>
          </div>

          {/* Camera Error Notice if any */}
          {cameraError && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Mode Switcher Buttons */}
          <div className="glass-panel p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 px-3 hidden sm:inline">VIEW MODE:</span>
              {(['normal', 'mesh', 'biometric', 'faceid'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setStatus((prev) => ({ ...prev, scanningMode: m }))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase transition-all ${
                    status.scanningMode === m
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              onClick={triggerFaceScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-xs font-mono shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-black" />
              <span>QUÉT FACE ID</span>
            </button>
          </div>
        </div>

        {/* Right Column: Single Person Telemetry & Emotion Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Facial Expression Gauge */}
          <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/40 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Cảm Xúc Người Nhận Diện</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{currentPerson?.confidence || 0}% MATCH</span>
            </div>

            <div className="text-2xl font-bold text-white font-geist mb-3 flex items-center gap-2">
              <Smile className="w-6 h-6 text-emerald-400" />
              <span>{currentPerson?.expression || 'Chưa phát hiện'}</span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${currentPerson?.confidence || 0}%` }}
              ></div>
            </div>
          </div>

          {/* AI RISER VIETNAM Smile Trigger Banner */}
          {isSmiling && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/60 flex items-center justify-between shadow-xl shadow-emerald-500/25 animate-pulse">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                <div>
                  <span className="text-emerald-300 font-bold font-mono text-sm tracking-wider block">AI RISER VIETNAM</span>
                  <span className="text-[11px] text-slate-300 font-geist">Phát hiện nụ cười rạng rỡ!</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-black font-bold font-mono text-xs shadow-md">
                VERIFIED
              </span>
            </div>
          )}

          {/* Single Person Biometric Telemetry Matrix */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-xl flex flex-col gap-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Chỉ Số Tọa Độ Sinh Trắc Học (Single User)
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block">HEAD YAW</span>
                <span className="text-cyan-300 text-lg font-mono font-bold">{currentPerson?.yaw || 0}°</span>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block">HEAD PITCH</span>
                <span className="text-cyan-300 text-lg font-mono font-bold">{currentPerson?.pitch || 0}°</span>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block">KHOẢNG CÁCH CAM</span>
                <span className="text-emerald-300 text-lg font-mono font-bold">{currentPerson?.distanceCm || 50} cm</span>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block">TẦN SUẤT CHỚP MẮT</span>
                <span className="text-emerald-300 text-lg font-mono font-bold">{biometrics.blinkCount} /min</span>
              </div>
            </div>
          </div>

          {/* Face ID Lock Access Status Card */}
          <div className={`glass-panel rounded-3xl p-6 border transition-all ${
            accessGranted ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-amber-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {accessGranted ? (
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Unlock className="w-5 h-5 text-emerald-400" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-white font-geist">
                  {accessGranted ? 'XÁC THỰC FACE ID THÀNH CÔNG' : 'TÀI LIỆU HỒ SƠ ĐANG KHÓA'}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {accessGranted ? 'Security Clearance: LEVEL_5_DEVELOPER' : 'Yêu cầu Quét Face ID để mở khóa'}
                </p>
              </div>
            </div>

            {accessGranted ? (
              <button
                onClick={onUnlockSecretResume}
                className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold transition-all"
              >
                XEM HỒ SƠ ẨN (SECRET RESUME) →
              </button>
            ) : (
              <p className="text-xs text-slate-400 font-geist">
                Nhấn nút <b>"QUÉT FACE ID"</b> ở trên để thực hiện nhận diện sinh trắc học và xem chi tiết dự án ẩn.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
