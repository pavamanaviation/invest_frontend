import React, { useState } from 'react';
import './AdminSideMenu.css';
import { Link } from 'react-router-dom';
import { MdGroupAdd } from 'react-icons/md';
import { MdSecurity } from 'react-icons/md';
import { MdPeopleAlt } from "react-icons/md";
import { FaStreetView } from 'react-icons/fa6';

const AdminSideMenu = () => {
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  const toggleTeamDropdown = () => {
    setIsTeamOpen(!isTeamOpen);
  };

  return (
    <div className="admin-side-menu">
      <div className="admin-menu-section">
        <div className="admin-menu-item" onClick={toggleTeamDropdown}>
          <MdPeopleAlt className="admin-icon" />
          <span className="admin-menu-title">Team</span>
          <span className={`admin-arrow ${isTeamOpen ? 'open' : ''}`}>&#9662;</span>
        </div>
        
        {isTeamOpen && (
          <div className="admin-submenu">
            <Link to="/add-team" className="admin-submenu-item">
              <MdGroupAdd className="admin-icon" />
              Add Team
            </Link>
            <Link to="/view-team" className="admin-submenu-item">
              <FaStreetView className="admin-icon" />
              View Team
            </Link>
          </div>
        )}
      </div>
     <div className="admin-menu-section">
  <Link to="/admin-access" className="admin-menu-item">
    <MdSecurity className="admin-icon" />
    <span className="admin-menu-title">Access</span>
  </Link>
</div>


    </div>
  );
};

export default AdminSideMenu;
