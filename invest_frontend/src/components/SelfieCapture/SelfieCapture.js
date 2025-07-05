import React, { useRef, useState, useEffect } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import "./SelfieCapture.css";

const SelfieCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [model, setModel] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [lastFaceBox, setLastFaceBox] = useState(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    const loadedModel = await blazeface.load();
    setModel(loadedModel);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        detectFace(); // Begin detection loop
      }
    } catch (err) {
      alert("Unable to access the camera. Please check permissions.");
      console.error(err);
    }
  };

  const detectFace = async () => {
    if (!model || !videoRef.current) return;

    const video = videoRef.current;

    const runDetection = async () => {
      if (video.readyState === 4) {
        const predictions = await model.estimateFaces(video, false);

        if (predictions.length > 0) {
          const face = predictions[0];
          drawOverlay([face]);
          setLastFaceBox(face);
          setFaceDetected(true);

          // Estimate distance based on box width
          const boxWidth = face.bottomRight[0] - face.topLeft[0];
          const videoWidth = video.videoWidth;

          if (boxWidth / videoWidth < 0.3) {
            setInstruction("Move closer to the camera");
          } else if (boxWidth / videoWidth > 0.6) {
            setInstruction("Move slightly back");
          } else {
            setInstruction("Face centered. Ready to capture.");
          }

          // Detect spectacles (very basic heuristic)
          if (face.landmarks) {
            const [rightEye, leftEye] = face.landmarks;
            const eyeDist = Math.hypot(
              rightEye[0] - leftEye[0],
              rightEye[1] - leftEye[1]
            );
            if (eyeDist < 40) {
              setInstruction("Please remove spectacles for better clarity");
            }
          }
        } else {
          setFaceDetected(false);
          setInstruction("Face not detected. Align your face in the frame");
          drawOverlay([]);
        }
      }

      requestAnimationFrame(runDetection);
    };

    runDetection();
  };

  const drawOverlay = (predictions) => {
    const overlay = overlayRef.current;
    const video = videoRef.current;
    if (!overlay || !video) return;
  
    // Set canvas size to match actual rendered video size
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;
  
    // Also set canvas DOM style width/height to match video DOM size
    overlay.style.width = `${video.offsetWidth}px`;
    overlay.style.height = `${video.offsetHeight}px`;
  
    const ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  
    if (predictions.length > 0) {
      const face = predictions[0];
      const [x, y] = face.topLeft;
      const [x2, y2] = face.bottomRight;
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, x2 - x, y2 - y);
    }
  };
  
  

  const captureSelfie = () => {
    if (!faceDetected) {
      alert("Face not detected. Please align properly.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Crop to face box if available
      if (lastFaceBox) {
        const [x, y] = lastFaceBox.topLeft;
        const [x2, y2] = lastFaceBox.bottomRight;
        const w = x2 - x;
        const h = y2 - y;

        const faceImage = ctx.getImageData(x, y, w, h);
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.putImageData(faceImage, 0, 0);
        const croppedData = tempCanvas.toDataURL("image/png");

        setSelfieImage(croppedData);
        onCapture && onCapture(croppedData);
      } else {
        const imageData = canvas.toDataURL("image/png");
        setSelfieImage(imageData);
        onCapture && onCapture(imageData);
      }

      const stream = video.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const retake = () => {
    setSelfieImage(null);
    setFaceDetected(false);
    setInstruction("");
    startCamera();
  };

  return (
    <div className="selfie-capture-container">
      <label className="kyc-label">Take a Selfie</label>

      {!selfieImage ? (
        <>
          <div className="selfie-video-wrapper">
            <video ref={videoRef} autoPlay playsInline className="selfie-video" />
            <canvas ref={overlayRef} className="overlay-canvas" />
          </div>

          <div className="selfie-instructions">
            <p>{instruction}</p>
          </div>

          <div className="selfie-buttons">
            <button className="primary-button selfie-btn" onClick={startCamera}>
              Start Camera
            </button>
            <button
              className="primary-button selfie-btn"
              onClick={captureSelfie}
              disabled={!faceDetected}
            >
              {faceDetected ? "Capture Selfie" : "Align Face"}
            </button>
          </div>
        </>
      ) : (
        <>
          <img src={selfieImage} alt="Selfie" className="selfie-preview" />
          <div>
            <button className="primary-button selfie-btn" onClick={retake}>
              Retake Selfie
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default SelfieCapture;