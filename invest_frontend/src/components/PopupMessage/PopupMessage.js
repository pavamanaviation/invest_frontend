import React, { useEffect } from "react";
import "./PopupMessage.css";

const PopupMessage = ({ isOpen, onClose, message, type = "info", autoClose = true }) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  const icon = {
    success: "✔️",
    error: "❌",
    info: "ℹ️"
  }[type] || "ℹ️";

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={`popup-box ${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon">{icon}</div>
        <p>{message}</p>
        <button className="popup-close-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default PopupMessage;
