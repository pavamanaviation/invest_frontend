import React, { useRef, useState } from "react";
import "./SelfieCapture.css"; // Optional: for styling

const SelfieCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selfieImage, setSelfieImage] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Unable to access the camera. Please check permissions.");
      console.error(err);
    }
  };

  const captureSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setSelfieImage(imageData);
      onCapture && onCapture(imageData);

      // Stop camera
      const stream = video.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const retake = () => {
    setSelfieImage(null);
    startCamera();
  };

  return (
    <div className="selfie-capture-container">
      <label className="kyc-label">Take a Selfie</label>
      {!selfieImage ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="selfie-video" />
          <div className="selfie-buttons">
            <button className="primary-button" onClick={startCamera}>
              Start Camera
            </button>
            <button className="primary-button" onClick={captureSelfie}>
              Capture Selfie
            </button>
          </div>
        </>
      ) : (
        <>
          <img src={selfieImage} alt="Selfie" className="selfie-preview" />
          <div>

          <button className="primary-button" onClick={retake}>
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
