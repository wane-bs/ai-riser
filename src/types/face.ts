export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export interface DetectedPerson {
  id: number;
  expression: string;
  confidence: number;
  pitch: number; // Head rotation up/down
  yaw: number;   // Head rotation left/right
  roll: number;  // Head tilt
  distanceCm: number;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FaceBiometrics {
  faceCount: number;
  people: DetectedPerson[];
  expression: string;
  confidence: number;
  pitch: number;
  yaw: number;
  roll: number;
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
  faceCount: number;
  accessGranted: boolean;
  scanningMode: 'normal' | 'mesh' | 'biometric' | 'faceid';
}
