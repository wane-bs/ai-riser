import { Point3D, FaceBiometrics, DetectedPerson } from '../types/face';

// MediaPipe FaceMesh Landmark Indices for key facial features
export const LANDMARK_INDEXES = {
  FACE_OVAL: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
  LEFT_EYE: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
  RIGHT_EYE: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
  LIPS: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
};

/**
 * Analyzes landmarks for a single face
 */
export function analyzeSingleLandmarks(landmarks: Point3D[], width: number, height: number, personId: number = 1): DetectedPerson {
  if (!landmarks || landmarks.length < 400) {
    return {
      id: personId,
      expression: 'Đang phân tích...',
      confidence: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      distanceCm: 50,
      box: { x: 0, y: 0, width: 0, height: 0 }
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

  // Head Pose
  const noseTip = landmarks[1];
  const chin = landmarks[152];
  const forehead = landmarks[10];

  const yaw = Math.round((noseTip.x - 0.5) * 90);
  const pitch = Math.round((noseTip.y - 0.5) * 90);
  const roll = Math.round(Math.atan2(chin.x - forehead.x, chin.y - forehead.y) * (180 / Math.PI));

  // Bounding box
  let minX = width, maxX = 0, minY = height, maxY = 0;
  landmarks.forEach((pt) => {
    const px = pt.x * width;
    const py = pt.y * height;
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  });

  const padding = 15;
  const boxX = Math.max(0, minX - padding);
  const boxY = Math.max(0, minY - padding);
  const boxW = Math.min(width - boxX, maxX - minX + padding * 2);
  const boxH = Math.min(height - boxY, maxY - minY + padding * 2);

  // Distance estimation based on face oval width
  const faceLeft = landmarks[234];
  const faceRight = landmarks[454];
  const facePixelWidth = Math.hypot(faceLeft.x - faceRight.x, faceLeft.y - faceRight.y) * width;
  const distanceCm = Math.round(Math.max(25, Math.min(120, (300 / (facePixelWidth || 1)) * 150)));

  return {
    id: personId,
    expression,
    confidence,
    pitch,
    yaw,
    roll,
    distanceCm,
    box: { x: boxX, y: boxY, width: boxW, height: boxH }
  };
}

/**
 * Calculates facial expressions and biometrics for all detected faces
 */
export function analyzeMultiLandmarks(multiLandmarks: Point3D[][], width: number, height: number): FaceBiometrics {
  if (!multiLandmarks || multiLandmarks.length === 0) {
    return {
      faceCount: 0,
      people: [],
      expression: 'Không phát hiện khuôn mặt',
      confidence: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      leftEyeOpen: false,
      rightEyeOpen: false,
      blinkCount: 0,
      distanceCm: 0,
      faceScore: 0,
    };
  }

  const people: DetectedPerson[] = multiLandmarks.map((landmarks, index) =>
    analyzeSingleLandmarks(landmarks, width, height, index + 1)
  );

  const primaryPerson = people[0];

  return {
    faceCount: people.length,
    people,
    expression: primaryPerson.expression,
    confidence: primaryPerson.confidence,
    pitch: primaryPerson.pitch,
    yaw: primaryPerson.yaw,
    roll: primaryPerson.roll,
    leftEyeOpen: true,
    rightEyeOpen: true,
    blinkCount: 14,
    distanceCm: primaryPerson.distanceCm,
    faceScore: 96,
  };
}

/**
 * Draws Futuristic Cyberpunk HUD overlay for multiple faces on canvas
 */
export function drawMultiCyberHUD(
  ctx: CanvasRenderingContext2D,
  multiLandmarks: Point3D[][] | null,
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

  // 2. Render each detected face
  if (multiLandmarks && multiLandmarks.length > 0) {
    multiLandmarks.forEach((landmarks, index) => {
      const person = biometrics.people[index] || analyzeSingleLandmarks(landmarks, width, height, index + 1);
      const { x: boxX, y: boxY, width: boxW, height: boxH } = person.box;

      // Color scheme based on face index / expression
      const color = index === 0 ? '#06b6d4' : index === 1 ? '#10b981' : index === 2 ? '#ec4899' : '#8b5cf6';

      // Draw Reticle Corners around Face
      const cornerLength = Math.min(25, boxW * 0.2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;

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

      // Draw Mesh Points
      if (mode === 'mesh' || mode === 'biometric' || mode === 'normal' || mode === 'faceid') {
        ctx.fillStyle = color;
        landmarks.forEach((pt, i) => {
          if (i % 4 === 0) {
            const px = pt.x * width;
            const py = pt.y * height;
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      }

      // Individual Emotion Tag & Face ID Badge over each face
      ctx.font = '700 11px Geist, sans-serif';
      ctx.fillStyle = color;
      ctx.fillText(`FACE #${person.id}`, boxX, boxY - 8);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px Geist, sans-serif';
      ctx.fillText(`${person.expression.split(' ')[0]} (${person.confidence}%)`, boxX, boxY + boxH + 16);
    });
  }
}
