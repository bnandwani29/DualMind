import { useCallback, useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { recordFaceSignals, recordLightLevel } from "../lib/telemetry";

export type FaceSnapshot = {
  detected: boolean;
  landmarks: Array<{ x: number; y: number }>;
  blinkCount: number;
  faceSeenFrames: number;
  closedEyeFrames: number;
  eyeAspectRatio: number | null;
  headYawProxy: number | null;
  headPitchProxy: number | null;
  gazeOffScreen: boolean | null;
  mouthOpenProxy: number | null;
  lightLevel: number | null;
  status: "idle" | "starting" | "live" | "error";
  message: string;
};

function distance(a?: { x: number; y: number }, b?: { x: number; y: number }) {
  return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
}
function eyeAspect(points: Array<{ x: number; y: number }>, ids: number[]) {
  const [outer, upper1, upper2, inner, lower2, lower1] = ids.map((id) => points[id]);
  const width = distance(outer, inner);
  return width ? (distance(upper1, lower1) + distance(upper2, lower2)) / (2 * width) : 0;
}

export function useFaceTracking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);
  const closedEyesRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const lastLightReadRef = useRef(0);
  const generationRef = useRef(0);
  const busyRef = useRef(false);
  const [snapshot, setSnapshot] = useState<FaceSnapshot>({ detected: false, landmarks: [], blinkCount: 0, faceSeenFrames: 0, closedEyeFrames: 0, eyeAspectRatio: null, headYawProxy: null, headPitchProxy: null, gazeOffScreen: null, mouthOpenProxy: null, lightLevel: null, status: "idle", message: "Camera is off" });

  const stop = useCallback(() => {
    generationRef.current += 1;
    busyRef.current = false;
    cancelAnimationFrame(animationRef.current);
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setSnapshot((current) => ({ ...current, detected: false, landmarks: [], status: "idle", message: "Camera is off" }));
  }, []);

  const start = useCallback(async () => {
    if (busyRef.current) return;
    landmarkerRef.current?.close(); landmarkerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null;
    busyRef.current = true;
    const generation = ++generationRef.current;
    setSnapshot({ detected: false, landmarks: [], blinkCount: 0, faceSeenFrames: 0, closedEyeFrames: 0, eyeAspectRatio: null, headYawProxy: null, headPitchProxy: null, gazeOffScreen: null, mouthOpenProxy: null, lightLevel: null, status: "starting", message: "Requesting camera access…" });
    closedEyesRef.current = false;
    setSnapshot((current) => ({ ...current, status: "starting", message: "Requesting camera access…" }));
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera access is unavailable. Open this app at localhost or use a secure HTTPS connection.");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      if (generation !== generationRef.current) { stream.getTracks().forEach((track) => track.stop()); return; }
      streamRef.current = stream;
      if (!videoRef.current) throw new Error("Camera preview could not be initialized. Reload this page and try again.");
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      if (generation !== generationRef.current) { stream.getTracks().forEach((track) => track.stop()); return; }
      setSnapshot((current) => ({ ...current, message: "Loading on-device face landmarks…" }));
      const wasmPath = `${import.meta.env.BASE_URL}mediapipe`;
      const modelPath = `${import.meta.env.BASE_URL}models/face_landmarker.task`;
      const vision = await FilesetResolver.forVisionTasks(wasmPath);
      if (generation !== generationRef.current) { stream.getTracks().forEach((track) => track.stop()); return; }
      let landmarker: FaceLandmarker;
      try {
        landmarker = await FaceLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: modelPath, delegate: "GPU" }, runningMode: "VIDEO", numFaces: 1, outputFaceBlendshapes: true, minFaceDetectionConfidence: 0.55, minFacePresenceConfidence: 0.55 });
      } catch {
        if (generation !== generationRef.current) { stream.getTracks().forEach((track) => track.stop()); return; }
        landmarker = await FaceLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: modelPath, delegate: "CPU" }, runningMode: "VIDEO", numFaces: 1, outputFaceBlendshapes: true, minFaceDetectionConfidence: 0.55, minFacePresenceConfidence: 0.55 });
      }
      if (generation !== generationRef.current) { landmarker.close(); stream.getTracks().forEach((track) => track.stop()); return; }
      landmarkerRef.current = landmarker;
      setSnapshot((current) => ({ ...current, status: "live", message: "Camera is processing on this device" }));

      const frame = () => {
        const video = videoRef.current;
        const model = landmarkerRef.current;
        if (!video || !model || video.readyState < 2) { animationRef.current = requestAnimationFrame(frame); return; }
        if (video.currentTime !== lastFrameRef.current) {
          lastFrameRef.current = video.currentTime;
          try {
            const result = model.detectForVideo(video, performance.now());
            const landmarks = result.faceLandmarks[0] || [];
            const blendshapes = result.faceBlendshapes[0]?.categories || [];
            const leftBlink = blendshapes.find((item) => item.categoryName === "eyeBlinkLeft")?.score || 0;
            const rightBlink = blendshapes.find((item) => item.categoryName === "eyeBlinkRight")?.score || 0;
            const eyesClosed = (leftBlink + rightBlink) / 2 > 0.52;
            const ear = landmarks.length ? (eyeAspect(landmarks, [33, 160, 158, 133, 153, 144]) + eyeAspect(landmarks, [362, 385, 387, 263, 373, 380])) / 2 : 0;
            const eyeCenterX = landmarks.length ? ((landmarks[33]?.x || 0) + (landmarks[263]?.x || 0)) / 2 : 0;
            const eyeCenterY = landmarks.length ? ((landmarks[33]?.y || 0) + (landmarks[263]?.y || 0)) / 2 : 0;
            const eyeWidth = landmarks.length ? distance(landmarks[33], landmarks[263]) : 0;
            const faceHeight = landmarks.length ? distance(landmarks[10], landmarks[152]) : 0;
            const nose = landmarks[1];
            const yaw = nose && eyeWidth ? (nose.x - eyeCenterX) / eyeWidth : 0;
            const pitch = nose && faceHeight ? (nose.y - eyeCenterY) / faceHeight : 0;
            const leftIris = landmarks.length >= 478 ? landmarks.slice(468, 473).reduce((sum, point) => sum + point.x, 0) / 5 : null;
            const rightIris = landmarks.length >= 478 ? landmarks.slice(473, 478).reduce((sum, point) => sum + point.x, 0) / 5 : null;
            const leftEyeWidth = Math.abs((landmarks[33]?.x || 0) - (landmarks[133]?.x || 0));
            const rightEyeWidth = Math.abs((landmarks[362]?.x || 0) - (landmarks[263]?.x || 0));
            const leftGaze = leftIris !== null && leftEyeWidth ? Math.abs((leftIris - landmarks[33].x) / (landmarks[133].x - landmarks[33].x || 1) - 0.5) * 2 : 0;
            const rightGaze = rightIris !== null && rightEyeWidth ? Math.abs((rightIris - landmarks[362].x) / (landmarks[263].x - landmarks[362].x || 1) - 0.5) * 2 : 0;
            const gazeOffScreen = (leftGaze + rightGaze) / 2 > 0.32;
            const mouthOpen = blendshapes.find((item) => item.categoryName === "jawOpen")?.score || 0;
            let blinkCount = 0;
            if (eyesClosed && !closedEyesRef.current) blinkCount = 1;
            closedEyesRef.current = eyesClosed;
            recordFaceSignals(landmarks.length > 0, blinkCount > 0, null, landmarks.length ? { closedEyes: eyesClosed || ear < 0.16, yaw, pitch, gaze: gazeOffScreen ? 1 : 0, eyeAspectRatio: ear, mouthOpen } : undefined);
            setSnapshot((current) => ({ ...current, detected: landmarks.length > 0, landmarks, blinkCount: current.blinkCount + blinkCount, faceSeenFrames: current.faceSeenFrames + (landmarks.length ? 1 : 0), closedEyeFrames: current.closedEyeFrames + (landmarks.length && (eyesClosed || ear < 0.16) ? 1 : 0), eyeAspectRatio: landmarks.length ? ear : current.eyeAspectRatio, headYawProxy: landmarks.length ? yaw : current.headYawProxy, headPitchProxy: landmarks.length ? pitch : current.headPitchProxy, gazeOffScreen: landmarks.length ? gazeOffScreen : current.gazeOffScreen, mouthOpenProxy: landmarks.length ? mouthOpen : current.mouthOpenProxy, message: landmarks.length ? "Face landmarks detected on this device" : "Move into view and face the screen" }));
            const now = performance.now();
            if (now - lastLightReadRef.current > 1200) {
              lastLightReadRef.current = now;
              const canvas = document.createElement("canvas"); canvas.width = 48; canvas.height = 36;
              const context = canvas.getContext("2d", { willReadFrequently: true });
              if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
                let luminance = 0;
                for (let i = 0; i < pixels.length; i += 4) luminance += 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
                const lightLevel = luminance / (pixels.length / 4);
                recordLightLevel(lightLevel);
                setSnapshot((current) => ({ ...current, lightLevel }));
              }
            }
          } catch (error) {
            landmarkerRef.current?.close(); landmarkerRef.current = null;
            streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null;
            if (videoRef.current) videoRef.current.srcObject = null;
            setSnapshot((current) => ({ ...current, status: "error", message: error instanceof Error ? error.message : "Face tracking stopped unexpectedly." }));
            return;
          }
        }
        animationRef.current = requestAnimationFrame(frame);
      };
      animationRef.current = requestAnimationFrame(frame);
    } catch (error) {
      if (generation !== generationRef.current) return;
      streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setSnapshot((current) => ({ ...current, status: "error", detected: false, landmarks: [], message: error instanceof Error ? error.message : "Could not start the camera." }));
    } finally { if (generation === generationRef.current) busyRef.current = false; }
  }, []);

  useEffect(() => () => {
    generationRef.current += 1;
    busyRef.current = false;
    cancelAnimationFrame(animationRef.current);
    landmarkerRef.current?.close();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  return { videoRef, snapshot, start, stop };
}
