import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from "../../config";
import { IoCheckmarkOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import femaleImage from "../../assets/female.png";
import maleImage from "../../assets/male.png";
import { MdModeEdit, MdDelete, MdVisibility } from "react-icons/md";

const LIMIT = 10;

const RoleCustomerMore = () => {
    const [data, setData] = useState([]);
    const [permissions, setPermissions] = useState({ can_view: false });
    const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
    const [offset, setOffset] = useState(0);
    const role_id = sessionStorage.getItem("role_id");

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/get-details`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role_id, model_name: "CustomerMoreDetails" }),
            });

            const resData = await response.json();

            if (resData.error) throw new Error(resData.error);

            setData(resData.data || []);
            setPermissions({ can_view: resData.can_view });
        } catch (error) {
            setPopup({ isOpen: true, message: error.message, type: "error" });
        }
    }, [role_id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const paginatedData = data.slice(offset, offset + LIMIT);

    const renderStatus = (val) =>
        val === 1 ? (
            <span className="admin-status-badge verified"><IoCheckmarkOutline /></span>
        ) : (
            <span className="admin-status-badge not-verified"><HiMiniXMark /></span>
        );

    const renderPagination = () => {
        const isNextDisabled = offset + LIMIT >= data.length;
        const isPrevDisabled = offset === 0;

        return (
            <div className="pagination-controls">
                <button
                    className="pagination-btn"
                    disabled={isPrevDisabled}
                    onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                >
                    ⬅ Prev
                </button>
                <span className="pagination-page-info">
                    Page {Math.floor(offset / LIMIT) + 1} of {Math.ceil(data.length / LIMIT)}
                </span>
                <button
                    className="pagination-btn"
                    disabled={isNextDisabled}
                    onClick={() => setOffset(offset + LIMIT)}
                >
                    Next ➡
                </button>
            </div>
        );
    };

    return (
        <div className="admin-customer-container">
            <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
            <div className="admin-customer-heading">Customer More Details</div>

            {!permissions.can_view ? (
                <div className="no-access-msg">🚫 You do not have permission to view this data.</div>
            ) : (
                <>
                    <table className="admin-customer-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Customer ID</th>
                                <th>DOB</th>
                                <th>Gender</th>
                                <th>Profession</th>
                                <th>Designation</th>
                                <th>Address</th>
                                <th>Pincode</th>
                                <th>Selfie</th>
                                <th>Signature</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>No records found.</td>
                                </tr>
                            ) : (
                                paginatedData.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{offset + idx + 1}</td>
                                        <td>{item.customer_id}</td>
                                        <td>{item.dob}</td>
                                        <td>
                                            <img
                                                src={item.gender === "female" ? femaleImage : maleImage}
                                                alt={item.gender}
                                                className="gender-avatar-img"
                                            />
                                        </td>
                                        <td>{item.profession}</td>
                                        <td>{item.designation}</td>
                                        <td>
                                            {[item.address, item.city, item.mandal, item.district, item.state, item.country]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </td>
                                        <td>{item.pincode}</td>
                                        <td>{renderStatus(item.selfie_status)}</td>
                                        <td>{renderStatus(item.signature_status)}</td>
                                        <td>{item.created_at}</td>
                                        <td>
                                            {permissions.can_view && (
                                                <MdVisibility
                                                    title="View"
                                                    className="action-icon view-icon"
                                                />
                                            )}
                                            {permissions.can_edit && (
                                                <MdModeEdit
                                                    title="Edit"
                                                    className="action-icon edit-icon"
                                                />
                                            )}
                                            {permissions.can_delete && (
                                                <MdDelete
                                                    title="Delete"
                                                    className="action-icon delete-icon"
                                                />
                                            )}
                                            {!permissions.can_view && !permissions.can_edit && !permissions.can_delete && (
                                                <span>–</span>
                                            )}
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {renderPagination()}
                </>
            )}
        </div>
    );
};

export default RoleCustomerMore;
