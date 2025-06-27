import React from "react";
import "./FilePreviewModel.css";
import { HiMiniXMark } from "react-icons/hi2";

const FilePreviewModal = ({ fileUrl, onClose }) => {
  const isPDF = fileUrl?.endsWith(".pdf");

  return (
    <div className="file-preview-modal-overlay">
      <div className="file-preview-modal">
        <div className="file-preview-header">
          <h3>File Preview</h3>
          <HiMiniXMark className="close-icon" onClick={onClose} />
        </div>
        <div className="file-preview-content">
          {isPDF ? (
            <iframe src={fileUrl} width="100%" height="500px" title="PDF Preview" />
          ) : (
            <img src={fileUrl} alt="Preview" style={{ maxHeight: "500px", maxWidth: "100%" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
