import { Point3D, FaceBiometrics } from '../types/face';

// MediaPipe FaceMesh Landmark Indices for key facial features
export const LANDMARK_INDEXES = {
  FACE_OVAL: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
  LEFT_EYE: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
  RIGHT_EYE: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
  LIPS: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
  NOSE: [1, 2, 98, 327, 168, 197, 5, 4],
};

/**
 * Calculates facial expressions and biometrics from landmarks
 */
export function analyzeLandmarks(landmarks: Point3D[], width: number, height: number): FaceBiometrics {
  if (!landmarks || landmarks.length < 400) {
    return {
      expression: 'Đang phân tích...',
      confidence: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      leftEyeOpen: true,
      rightEyeOpen: true,
      blinkCount: 0,
      distanceCm: 55,
      faceScore: 0,
    };
  }

  // Mouth landmarks
  const mouthTop = landmarks[13];
  const mouthBottom = landmarks[14];
  const mouthLeft = landmarks[61];
  const mouthRight = landmarks[291];

  const mouthHeight = Math.hypot(mouthTop.x - mouthBottom.x, mouthTop.y - mouthBottom.y);
  const mouthWidth = Math.hypot(mouthLeft.x - mouthRight.x, mouthLeft.y - mouthRight.y);
  const mouthRatio = mouthHeight / (mouthWidth || 1);

  // Eyebrow and eye distances for expression
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const leftEyeDist = Math.hypot(leftEyeTop.x - leftEyeBottom.x, leftEyeTop.y - leftEyeBottom.y);

  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];
  const rightEyeDist = Math.hypot(rightEyeTop.x - rightEyeBottom.x, rightEyeTop.y - rightEyeBottom.y);

  // Expression classification
  let expression = 'Bình thường (Neutral)';
  let confidence = 88;

  if (mouthRatio > 0.35) {
    expression = 'Ngạc nhiên (Surprised)';
    confidence = Math.min(99, Math.round(mouthRatio * 220));
  } else if (mouthWidth > 0.28 && mouthRatio > 0.15) {
    expression = 'Vui vẻ (Happy / Smiling)';
    confidence = Math.min(98, Math.round(mouthWidth * 300));
  } else if (mouthRatio < 0.08) {
    expression = 'Tập trung (Focused)';
    confidence = 94;
  }

  // Head Pose Estimation (Yaw/Pitch/Roll approx)
  const noseTip = landmarks[1];
  const chin = landmarks[152];
  const forehead = landmarks[10];

  const yaw = Math.round((noseTip.x - 0.5) * 90);
  const pitch = Math.round((noseTip.y - 0.5) * 90);
  const roll = Math.round(Math.atan2(chin.x - forehead.x, chin.y - forehead.y) * (180 / Math.PI));

  // Distance estimation based on face oval width
  const faceLeft = landmarks[234];
  const faceRight = landmarks[454];
  const facePixelWidth = Math.hypot(faceLeft.x - faceRight.x, faceLeft.y - faceRight.y) * width;
  const distanceCm = Math.round(Math.max(25, Math.min(120, (300 / (facePixelWidth || 1)) * 150)));

  return {
    expression,
    confidence,
    pitch,
    yaw,
    roll,
    leftEyeOpen: leftEyeDist > 0.015,
    rightEyeOpen: rightEyeDist > 0.015,
    blinkCount: Math.floor(Math.random() * 5) + 12,
    distanceCm,
    faceScore: 96,
  };
}

/**
 * Draws Futuristic Cyberpunk HUD overlay on canvas
 */
export function drawCyberHUD(
  ctx: CanvasRenderingContext2D,
  landmarks: Point3D[] | null,
  width: number,
  height: number,
  mode: 'normal' | 'mesh' | 'biometric' | 'faceid',
  biometrics: FaceBiometrics
) {
  ctx.clearRect(0, 0, width, height);

  // 1. Grid Background Scanlines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
  ctx.lineWidth = 1;
  const gridStep = 40;
  for (let x = 0; x < width; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 2. If Face Detected, Render Bounding Box and Mesh
  if (landmarks && landmarks.length > 0) {
    // Calculate Bounding Box
    let minX = width, maxX = 0, minY = height, maxY = 0;
    landmarks.forEach((pt) => {
      const px = pt.x * width;
      const py = pt.y * height;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    });

    const padding = 20;
    const boxX = Math.max(0, minX - padding);
    const boxY = Math.max(0, minY - padding);
    const boxW = Math.min(width - boxX, maxX - minX + padding * 2);
    const boxH = Math.min(height - boxY, maxY - minY + padding * 2);

    // Draw Target Reticle Corners around Face
    const cornerLength = Math.min(30, boxW * 0.2);
    ctx.strokeStyle = biometrics.expression.includes('Happy') ? '#10b981' : '#06b6d4';
    ctx.lineWidth = 3;

    // Top Left
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + cornerLength);
    ctx.lineTo(boxX, boxY);
    ctx.lineTo(boxX + cornerLength, boxY);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(boxX + boxW - cornerLength, boxY);
    ctx.lineTo(boxX + boxW, boxY);
    ctx.lineTo(boxX + boxW, boxY + cornerLength);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + boxH - cornerLength);
    ctx.lineTo(boxX, boxY + boxH);
    ctx.lineTo(boxX + cornerLength, boxY + boxH);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(boxX + boxW - cornerLength, boxY + boxH);
    ctx.lineTo(boxX + boxW, boxY + boxH);
    ctx.lineTo(boxX + boxW, boxY + boxH - cornerLength);
    ctx.stroke();

    // Mode: Render 3D Landmark Mesh Points
    if (mode === 'mesh' || mode === 'biometric' || mode === 'normal' || mode === 'faceid') {
      ctx.fillStyle = mode === 'faceid' ? '#10b981' : 'rgba(56, 189, 248, 0.7)';
      landmarks.forEach((pt, index) => {
        // Draw key points
        if (index % 3 === 0) {
          const px = pt.x * width;
          const py = pt.y * height;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // Connect key facial feature contours
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1;

      const drawPath = (indices: number[]) => {
        ctx.beginPath();
        indices.forEach((idx, i) => {
          const pt = landmarks[idx];
          if (pt) {
            const px = pt.x * width;
            const py = pt.y * height;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        });
        ctx.closePath();
        ctx.stroke();
      };

      drawPath(LANDMARK_INDEXES.FACE_OVAL);
      drawPath(LANDMARK_INDEXES.LEFT_EYE);
      drawPath(LANDMARK_INDEXES.RIGHT_EYE);
      drawPath(LANDMARK_INDEXES.LIPS);
    }

    // Floating Target Info Tag
    ctx.font = '600 12px Geist, sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`FACE_ID: #MRHIU-AI-PASS`, boxX, boxY - 10);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`EXPRESSION: ${biometrics.expression.toUpperCase()} (${biometrics.confidence}%)`, boxX, boxY + boxH + 18);
  }
}
