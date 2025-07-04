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
import AdminCustomerDetails from './AdminPages/AdminCustomerDetails/AdminCustomerDetails';
import AdminCustomerMoreDetails from './AdminPages/AdminCustomerDetails/AdminCustomerMoreDetails';
import AdminKYCDetails from './AdminPages/AdminKYCDetails/AdminKYCDetails';
import AdminCustomerKYCMoreDetails from './AdminPages/AdminKYCDetails/AdminKYCMoreDetails';
import AdminNomineeDetails from './AdminPages/AdminNomineeDetails/AdminNomineeDetails';
import AdminNomineeMoreDetails from './AdminPages/AdminNomineeDetails/AdminNomineeMoreDetails';
import RoleDashboard from './AdminPages/RoleDashboard/RoleDashboard';
import RoleCustomerRegister from './AdminPages/RoleCustomerRegister/RoleCustomerRegister';
import RoleCustomerMore from './AdminPages/RoleCustomerMore/RoleCustomerMore';
import RoleKYCDetails from './AdminPages/RoleKYC/RoleKYC';
import RoleNomineeDetails from './AdminPages/RoleNominee/RoleNominee';
import AdminCustomerAllDetails from './AdminPages/AdminCustomerAllDetails/AdminCustomerAllDetails';
import AdminCustomerAllMoreDetails from './AdminPages/AdminCustomerAllDetails/AdminCustomerAllMoreDetails';


const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-verify-otp" element={<AdminVerifyOTP />} />


      {/* Protected/Admin Layout routes */}
      <Route path="/admin-dashboard" element={<AdminLayout> <AdminDashboard /></AdminLayout>} />
      <Route path="/add-team" element={<AdminLayout><AdminAddRole /></AdminLayout>} />
      <Route path="/edit-team" element={<AdminLayout><AdminEditRole /></AdminLayout>} />
      <Route path="/view-team" element={<AdminLayout><AdminViewRole /></AdminLayout>} />
      <Route path="/admin-access" element={<AdminLayout><AccessAndSecurity /></AdminLayout>} />
      <Route path="/admin-customer-details" element={<AdminLayout><AdminCustomerDetails /></AdminLayout>} />
      <Route path="/admin-customer-details" element={<AdminLayout><AdminCustomerDetails /></AdminLayout>} />
      <Route path="/admin/customers/:id" element={<AdminLayout><AdminCustomerMoreDetails /></AdminLayout>} />
      <Route path="/admin-kyc-details" element={<AdminLayout><AdminKYCDetails /></AdminLayout>} />
      <Route path="/admin/kyc/:id" element={<AdminLayout><AdminCustomerKYCMoreDetails /></AdminLayout>} />
      <Route path="/admin-nominee-details" element={<AdminLayout><AdminNomineeDetails /></AdminLayout>} />

      <Route path="/admin/nominees/:id" element={<AdminLayout><AdminNomineeMoreDetails /></AdminLayout>} />
      <Route path="/role-dashboard" element={<AdminLayout> <RoleDashboard /></AdminLayout>} />
      <Route path="/role-customer-details" element={<AdminLayout><RoleCustomerRegister/></AdminLayout>} />
      <Route path="/role-customer-more-details/" element={<AdminLayout><RoleCustomerMore/></AdminLayout>}/>
      <Route path="/role-kyc-details" element={<AdminLayout><RoleKYCDetails/></AdminLayout>} />
      <Route path="/role-nominee-details" element={<AdminLayout><RoleNomineeDetails/></AdminLayout>} />
      <Route path="/admin-customer-more-details" element={<AdminLayout><AdminCustomerAllDetails/></AdminLayout>} />
      <Route path="/admin-customer-more-all-details" element={<AdminLayout><AdminCustomerAllMoreDetails/></AdminLayout>} />


    </Routes>

  );
};

export default AdminRoutes;
