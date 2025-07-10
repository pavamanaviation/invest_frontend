import React, { useEffect, useState } from 'react';
import PopupMessage from '../../components/PopupMessage/PopupMessage';
import API_BASE_URL from '../../config';
import "./AdminDroneDetails.css";
import { MdModeEdit, MdDelete, MdArrowForwardIos } from "react-icons/md";

const AdminViewDroneDetails = () => {
    const [drones, setDrones] = useState([]);
    const [popup, setPopup] = useState({
        show: false,
        message: '',
        type: 'info'
    });

    const adminId = sessionStorage.getItem('admin_id');

    const fetchDroneModels = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/view-drone-models`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ admin_id: adminId })
            });

            const data = await res.json();
            if (res.ok) {
                setDrones(data.drone_models || []);
            } else {
                setPopup({
                    show: true,
                    message: data.error || 'Failed to fetch drone models.',
                    type: 'error'
                });
            }
        } catch (err) {
            console.error('Error:', err);
            setPopup({
                show: true,
                message: 'Something went wrong while fetching drone data.',
                type: 'error'
            });
        }
    };

    useEffect(() => {
        fetchDroneModels();
    }, []);


    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState({ show: false, message: '', type: 'info' });
    useEffect(() => {
        let timeout;
        if (uploadMessage.show) {
            timeout = setTimeout(() => {
                setUploadMessage({ show: false, message: '', type: 'info' });
            }, 5000);
        }
        return () => clearTimeout(timeout);
    }, [uploadMessage]);

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setUploadMessage({ show: true, message: "Please select a file.", type: "error" });
            return;
        }

        const formData = new FormData();
        formData.append("admin_id", adminId);
        formData.append("file", selectedFile);

        try {
            const res = await fetch(`${API_BASE_URL}/upload-drone-models`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                let message = data.message || "Upload successful.";
                if (data.warning) {
                    message += ` ${data.warning}`;
                }

                setUploadMessage({
                    show: true,
                    message,
                    type: "success",
                });

                setSelectedFile(null);
                fetchDroneModels(); // Refresh drone list

                // Auto-close popup after 5 seconds
                setTimeout(() => {
                    setShowUploadPopup(false);
                    setUploadMessage({ show: false, message: "", type: "info" });
                }, 5000);

            } else {
                setUploadMessage({
                    show: true,
                    message: data.error || "Upload failed.",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
            setUploadMessage({
                show: true,
                message: "An unexpected error occurred while uploading.",
                type: "error",
            });
        }
    };


    return (
        <div className="admin-customer-container">
            <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />

            <div className="admin-customer-heading">Drone Details</div>
            <div className="admin-customer-upload">
                <button className='admin-customer-upload-btn' onClick={() => setShowUploadPopup(true)}> Upload Drone Models</button>
            </div>


            <table className="admin-customer-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Company Name</th>
                        <th>Model Name</th>
                        <th>Serial Number</th>
                        <th>UIN Number</th>
                        <th>Date of Model</th>
                        <th>Assigned</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {drones.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="no-data">No drone models found.</td>
                        </tr>
                    ) : (
                        drones.map((drone, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{drone.company_name}</td>
                                <td>{drone.model_name}</td>
                                <td>{drone.serial_number}</td>
                                <td>{drone.uin_number}</td>
                                <td>{drone.date_of_model}</td>
                                <td>{drone.assign_drone_status === 1 ? 'Yes' : 'No'}</td>
                                 <td>
                                                    <MdModeEdit className="admin-edit-icon" />
                                                    <MdDelete className="admin-delete-icon" />
                                                  </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {showUploadPopup && (
                <div className="admin-drone-overlay" onClick={() => setShowUploadPopup(false)}>
                    <div className="admin-drone-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Upload Drone Model Document</h3>
                        {uploadMessage.show && (
                            <div className={`popup-inline-message ${uploadMessage.type}`}>
                                <span className="popup-close-icon" onClick={() => setUploadMessage({ show: false, message: '', type: 'info' })}>×</span>
                                {uploadMessage.message}
                            </div>
                        )}


                        <div className="drone-input custom-upload-wrapper">
                            <label htmlFor="drone-model-file" className="drone-file-button">
                                Choose File
                            </label>
                            <input
                                type="file"
                                id="drone-model-file"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                className="hidden-file-input"

                            />
                            {selectedFile?.name && (
                                <div className="drone-file-name-display">{selectedFile.name}</div>
                            )}
                        </div>

                        <div className="admin-drone-actions">
                            <button className="secondary-button" onClick={() => {
                                setShowUploadPopup(false);
                                setSelectedFile(null);
                                setUploadMessage({ show: false, message: '', type: 'info' });
                            }}>
                                Cancel
                            </button>
                            <button className="primary-button" onClick={handleFileUpload}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>

            )}

        </div>
    );
};

export default AdminViewDroneDetails;
