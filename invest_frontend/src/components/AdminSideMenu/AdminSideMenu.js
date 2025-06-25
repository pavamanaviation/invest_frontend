import React, { useState } from 'react';
import './AdminSideMenu.css';
import { Link, useLocation } from 'react-router-dom';
import { MdGroupAdd, MdSecurity, MdPeopleAlt, MdDocumentScanner, MdCurrencyRupee } from 'react-icons/md';
import { IoPeopleCircle } from "react-icons/io5";
import { FaStreetView } from 'react-icons/fa6';

const AdminSideMenu = () => {
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const location = useLocation();

  const toggleTeamDropdown = () => {
    setIsTeamOpen(!isTeamOpen);
  };

  const handleSubmenuClick = () => {
    setIsTeamOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-side-menu">
      <div className="admin-menu-section">
        <div className={`admin-menu-item ${location.pathname.includes('/add-team') || location.pathname.includes('/view-team') ? 'active' : ''}`} onClick={toggleTeamDropdown}>
          <MdPeopleAlt className="admin-icon" />
          <span className="admin-menu-title">Team</span>
          <span className={`admin-arrow ${isTeamOpen ? 'open' : ''}`}>&#9662;</span>
        </div>

        {isTeamOpen && (
          <div className="admin-submenu">
            <Link
              to="/add-team"
              className={`admin-submenu-item ${isActive("/add-team") ? "active" : ""}`}
              onClick={handleSubmenuClick}
            >
              <MdGroupAdd className="admin-icon" />
              Add Team
            </Link>
            <Link
              to="/view-team"
              className={`admin-submenu-item ${isActive("/view-team") ? "active" : ""}`}
              onClick={handleSubmenuClick}
            >
              <FaStreetView className="admin-icon" />
              View Team
            </Link>
          </div>
        )}
      </div>

      <div className="admin-menu-section">
        <Link to="/admin-access" className={`admin-menu-item ${isActive("/admin-access") ? "active" : ""}`}>
          <MdSecurity className="admin-icon" />
          <span className="admin-menu-title">Access</span>
        </Link>
      </div>

      <div className="admin-menu-section">
        <Link to="/admin-customer-details" className={`admin-menu-item ${isActive("/admin-customer-details") ? "active" : ""}`}>
          <MdPeopleAlt className="admin-icon" />
          <span className="admin-menu-title">Customer Details</span>
        </Link>
      </div>

      <div className="admin-menu-section">
        <Link to="/admin-kyc-details" className={`admin-menu-item ${isActive("/admin-kyc-details") ? "active" : ""}`}>
          <MdDocumentScanner className="admin-icon" />
          <span className="admin-menu-title">KYC Details</span>
        </Link>
      </div>

      <div className="admin-menu-section">
        <Link to="/admin-nominee-details" className={`admin-menu-item ${isActive("/nominee-details") ? "active" : ""}`}>
          <IoPeopleCircle className="admin-icon" />
          <span className="admin-menu-title">Nominee Details</span>
        </Link>
      </div>

      <div className="admin-menu-section">
        <Link to="/admin-payment-details" className={`admin-menu-item ${isActive("/payment-details") ? "active" : ""}`}>
          <MdCurrencyRupee className="admin-icon" />
          <span className="admin-menu-title">Payment Details</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSideMenu;
