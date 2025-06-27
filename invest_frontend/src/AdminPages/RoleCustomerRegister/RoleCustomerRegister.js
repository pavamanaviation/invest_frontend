import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from "../../config";
import { MdModeEdit, MdDelete, MdArrowForwardIos, MdLocalPhone, MdVisibility } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FiMail } from "react-icons/fi";
import { IoCheckmarkOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const LIMIT = 10;

const RoleCustomerRegister = () => {
    const [customers, setCustomers] = useState([]);
    const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
    const [totalCount, setTotalCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [permissions, setPermissions] = useState({ can_view: false, can_edit: false, can_delete: false });
    const [isLoading, setIsLoading] = useState(true);

    const role_id = sessionStorage.getItem("role_id");

    const fetchCustomerRegisterData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/get-details`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role_id, model_name: "CustomerRegister" }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setCustomers(data.data || []);
            setPermissions({
                can_view: data.can_view,
                can_edit: data.can_edit,
                can_delete: data.can_delete,
            });
            setTotalCount(data.data?.length || 0);
        } catch (error) {
            setPopup({ isOpen: true, message: error.message, type: "error" });
        } finally {
            setIsLoading(false);
        }
    }, [role_id]);

    useEffect(() => {
        fetchCustomerRegisterData();
    }, [fetchCustomerRegisterData]);

    const handleEdit = (id) => {
        if (permissions.can_edit) {
            // Implement edit logic or navigation
            console.log("Edit ID:", id);
        }
    };

    const handleDelete = (id) => {
        if (permissions.can_delete) {
            // Implement delete logic
            console.log("Delete ID:", id);
        }
    };

    const handlePageChange = (direction) => {
        const newOffset = direction === "next" ? offset + LIMIT : Math.max(0, offset - LIMIT);
        setOffset(newOffset);
    };
    const paginatedData = customers.slice(offset, offset + LIMIT);
    const renderPagination = () => {
        const isNextDisabled = offset + LIMIT >= totalCount;
        const isPrevDisabled = offset === 0;

        return (
            <div className="pagination-controls">
                <button
                    className="pagination-btn"
                    disabled={isPrevDisabled}
                    onClick={() => handlePageChange("prev")}
                >
                    ⬅ Prev
                </button>
                <span className="pagination-page-info">
                    Page {Math.floor(offset / LIMIT) + 1} of {Math.ceil(totalCount / LIMIT)}
                </span>
                <button
                    className="pagination-btn"
                    disabled={isNextDisabled}
                    onClick={() => handlePageChange("next")}
                >
                    Next ➡
                </button>
            </div>

        );
    };

    return (
        <div className="role-customer-register-container">
            <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
            <div className="admin-customer-heading">Customer Registration Details</div>

            {!permissions.can_view ? (
                <div className="no-access-msg">🚫 You do not have permission to view this data.</div>
            ) : (
                <>
                    <table className="admin-customer-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Register Type</th>
                                <th>Register Status</th>
                                <th>Account Status</th>
                                <th>KYC Status</th>
                                <th>Payment Status</th>

                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center" }}>No customer records found.</td>
                                </tr>
                            ) : (
                                paginatedData.map((cust, idx) => (
                                    <tr key={cust.id}>
                                        <td>{offset + idx + 1}</td>
                                        <td>{cust.first_name}</td>
                                        <td>{cust.last_name}</td>
                                        <td>{cust.email}</td>
                                        <td>{cust.mobile_no}</td>
                                        <td>
                                            {cust.register_type === "google" ? (
                                                <FcGoogle />
                                            ) : cust.register_type === "Email" ? (
                                                <FiMail />
                                            ) : (
                                                <MdLocalPhone />
                                            )}
                                        </td>
                                        <td>
                                            {cust.register_status === 1 ? (
                                                <span className="admin-status-badge verified"><IoCheckmarkOutline /></span>
                                            ) : (
                                                <span className="admin-status-badge not-verified"><HiMiniXMark /></span>
                                            )}
                                        </td>
                                        <td>
                                            {cust.account_status === 1 ? (
                                                <span className="admin-status-badge verified"><IoCheckmarkOutline /></span>
                                            ) : (
                                                <span className="admin-status-badge not-verified"><HiMiniXMark /></span>
                                            )}
                                        </td>
                                        <td>
                                            {cust.kyc_accept_status === 1 ? (
                                                <span className="admin-status-badge verified"><IoCheckmarkOutline /></span>
                                            ) : (
                                                <span className="admin-status-badge not-verified"><HiMiniXMark /></span>
                                            )}
                                        </td>
                                        <td>
                                            {cust.payment_accept_status === 1 ? (
                                                <span className="admin-status-badge verified"><IoCheckmarkOutline /></span>
                                            ) : (
                                                <span className="admin-status-badge not-verified"><HiMiniXMark /></span>
                                            )}
                                        </td>
                                        <td>{cust.created_at}</td>
                                        <td>
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

export default RoleCustomerRegister;
