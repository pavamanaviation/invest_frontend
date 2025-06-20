import React from 'react';
import AdminSideMenu from '../AdminSideMenu/AdminSideMenu';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSideMenu />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
