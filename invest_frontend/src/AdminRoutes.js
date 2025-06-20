import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './AdminPages/AdminLogin/AdminLogin';
import AdminVerifyOTP from './AdminPages/AdminVerifyOTP/AdminVerifyOTP';
import AdminDashboard from './AdminPages/AdminDashboard/AdminDashboard';
import AdminAddRole from './AdminPages/AdminAddRole/AdminAddRole';
import AdminLayout from './components/AdminLayout/AdminLayout';
import AdminViewRole from './AdminPages/AdminViewRole/AdminViewRole';
import AdminEditRole from './AdminPages/AdminEditRole/AdminEditRole';
import AccessAndSecurity from './AdminPages/AdminAccess/AdminAccess'; // correct path


const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-verify-otp" element={<AdminVerifyOTP />} />


      {/* Protected/Admin Layout routes */}
      <Route path="/admin-dashboard" element={ <AdminLayout> <AdminDashboard /></AdminLayout> }/>
      <Route path="/add-team" element={<AdminLayout><AdminAddRole /></AdminLayout>}/>
      <Route path="/edit-team" element={ <AdminLayout><AdminEditRole /></AdminLayout> }/>
      <Route path="/view-team" element={ <AdminLayout><AdminViewRole /></AdminLayout>}/>
      <Route path="/admin-access" element={<AdminLayout><AccessAndSecurity /></AdminLayout>} />

    </Routes>
    
  );
};

export default AdminRoutes;
