export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export interface FaceBiometrics {
  expression: string;
  confidence: number;
  pitch: number; // Head rotation up/down
  yaw: number;   // Head rotation left/right
  roll: number;  // Head tilt
  leftEyeOpen: boolean;
  rightEyeOpen: boolean;
  blinkCount: number;
  distanceCm: number;
  faceScore: number;
}

export interface SystemStatus {
  cameraActive: boolean;
  modelLoaded: boolean;
  fps: number;
  faceDetected: boolean;
  accessGranted: boolean;
  scanningMode: 'normal' | 'mesh' | 'biometric' | 'faceid';
}
