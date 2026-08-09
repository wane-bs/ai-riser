import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, Eye, Cpu, ShieldCheck, Zap, RefreshCw, Lock, Unlock, Sparkles, AlertCircle, Users, Smile, User } from 'lucide-react';
import { FaceBiometrics, SystemStatus, Point3D, DetectedPerson } from '../types/face';
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

  // Initialize MediaPipe FaceMesh for Multi-Face Tracking
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

          // Enable Multi-face Detection (Up to 4 faces)
          faceMesh.setOptions({
            maxNumFaces: 4,
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
                const multiLandmarks: Point3D[][] = results.multiFaceLandmarks;
                const bio = analyzeMultiLandmarks(multiLandmarks, canvas.width, canvas.height);
                setBiometrics(bio);
                setStatus((prev) => ({
                  ...prev,
                  faceDetected: true,
                  faceCount: bio.faceCount,
                }));

                drawMultiCyberHUD(ctx, multiLandmarks, canvas.width, canvas.height, status.scanningMode, bio);
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
        setCameraError('Không thể mở Webcam. Đang kích hoạt chế độ Giả lập Multi-Face AI.');
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

            // Generate synthetic demo multi-face landmarks (2 faces in demo mode)
            const face1X = 0.35 + Math.sin(angle) * 0.04;
            const face1Y = 0.45 + Math.cos(angle * 0.7) * 0.03;

            const face2X = 0.70 + Math.cos(angle * 0.5) * 0.03;
            const face2Y = 0.50 + Math.sin(angle * 0.8) * 0.03;

            const demoFace1: Point3D[] = Array.from({ length: 468 }, (_, i) => ({
              x: face1X + Math.cos((i / 468) * Math.PI * 2) * 0.14,
              y: face1Y + Math.sin((i / 468) * Math.PI * 2) * 0.18,
              z: 0,
            }));

            const demoFace2: Point3D[] = Array.from({ length: 468 }, (_, i) => ({
              x: face2X + Math.cos((i / 468) * Math.PI * 2) * 0.12,
              y: face2Y + Math.sin((i / 468) * Math.PI * 2) * 0.16,
              z: 0,
            }));

            const multiDemo = [demoFace1, demoFace2];
            const bio = analyzeMultiLandmarks(multiDemo, canvas.width, canvas.height);

            // Set emotions for demo
            if (bio.people[0]) bio.people[0].expression = 'Vui vẻ (Happy / Smiling)';
            if (bio.people[1]) bio.people[1].expression = 'Ngạc nhiên (Surprised)';

            setBiometrics(bio);
            setStatus((prev) => ({ ...prev, faceDetected: true, faceCount: 2 }));

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

  return (
    <section id="vision-ai-app" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>MULTI-FACE VISION AI & EMOTION DASHBOARD</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-geist">
          Đếm Số Mặt & Phân Tích Cảm Xúc
        </h2>
        <p className="mt-4 text-slate-400 text-base">
          Theo dõi cùng lúc nhiều khuôn mặt (Multi-face tracking), phân tích cảm xúc riêng biệt cho từng người và đo chỉ số sinh trắc học thời gian thực.
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
                <span>FPS: 60 | MULTI_FACE_TRACKING</span>
              </div>

              {/* Multi-face Counter Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-xs font-mono text-emerald-300 font-bold backdrop-blur-md">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>FACIAL COUNT: {biometrics.faceCount}</span>
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

        {/* Right Column: Multi-person Emotion Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Total Faces Counter Dashboard Card */}
          <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/40 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Số Lượng Khuôn Mặt</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">REAL-TIME TELEMETRY</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-['Silkscreen'] text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                {biometrics.faceCount}
              </span>
              <span className="text-slate-400 text-sm font-geist">khuôn mặt được phát hiện</span>
            </div>
          </div>

          {/* Individual Person Emotions List */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Smile className="w-4 h-4 text-cyan-400" />
                <span>Cảm Xúc Từng Người</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">{biometrics.people.length} Active</span>
            </div>

            {biometrics.people.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {biometrics.people.map((person) => (
                  <div key={person.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-mono text-xs text-cyan-400 font-bold">
                        #{person.id}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white font-geist block">{person.expression}</span>
                        <span className="text-xs text-slate-400 font-mono">Góc quay: Y{person.yaw}° | P{person.pitch}°</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-400 font-bold block">{person.confidence}%</span>
                      <span className="text-[10px] font-mono text-slate-500">{person.distanceCm}cm</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 font-mono text-xs">
                Chưa phát hiện khuôn mặt nào trước ống kính camera.
              </div>
            )}
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
