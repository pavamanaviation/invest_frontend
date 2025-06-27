import React, { useState } from 'react';
import './AdminSideMenu.css';
import { Link, useLocation } from 'react-router-dom';
import {
  MdGroupAdd,
  MdSecurity,
  MdPeopleAlt,
  MdDocumentScanner,
  MdCurrencyRupee
} from 'react-icons/md';
import { IoPeopleCircle } from "react-icons/io5";
import { FaStreetView } from 'react-icons/fa6';

const AdminSideMenu = ({ isAdmin = false, modelNames = [] }) => {
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const location = useLocation();

  const toggleTeamDropdown = () => setIsTeamOpen(!isTeamOpen);
  const handleSubmenuClick = () => setIsTeamOpen(false);
  const isActive = (path) => location.pathname === path;
const hasAccess = (model) => isAdmin || model === "Dashboard" || modelNames.includes(model);
  // Route prefix based on user type
  const routePrefix = isAdmin ? "/admin" : "/role";

  const sidebarItems = [
      {
    model: "Dashboard",
    label: "Dashboard",
    icon: <MdPeopleAlt className="admin-icon" />,
    path: `${routePrefix}-dashboard`
  },
    {
      model: "CustomerRegister",
      label: "Customer Registration Details",
      icon: <MdPeopleAlt className="admin-icon" />,
      path: `${routePrefix}-customer-details`
    },
    {
      model: "CustomerMoreDetails",
      label: "Customer More Details",
      icon: <MdPeopleAlt className="admin-icon" />,
      path: `${routePrefix}-customer-more-details`
    },
    {
      model: "KYCDetails",
      label: "KYC Details",
      icon: <MdDocumentScanner className="admin-icon" />,
      path: `${routePrefix}-kyc-details`
    },
    {
      model: "NomineeDetails",
      label: "Nominee Details",
      icon: <IoPeopleCircle className="admin-icon" />,
      path: `${routePrefix}-nominee-details`
    },
    {
      model: "PaymentDetails",
      label: "Payment Details",
      icon: <MdCurrencyRupee className="admin-icon" />,
      path: `${routePrefix}-payment-details`
    },
    {
      model: "Access",
      label: "Access",
      icon: <MdSecurity className="admin-icon" />,
      path: `${routePrefix}-access`
    }
  ];

  return (
    <div className="admin-side-menu">


      {/* Render menu items dynamically */}
      {sidebarItems.map(({ model, label, icon, path }) =>
        hasAccess(model) && (
          <div className="admin-menu-section" key={model}>
            <Link to={path} className={`admin-menu-item ${isActive(path) ? "active" : ""}`}>
              {icon}
              <span className="admin-menu-title">{label}</span>
            </Link>
          </div>
        )
      )}

      
      {/* Team Section - Admin Only */}
      {isAdmin && (
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
      )}
    </div>
  );
};

export default AdminSideMenu;
