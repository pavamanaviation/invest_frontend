import React, { useEffect, useState } from 'react';
import AdminSideMenu from '../AdminSideMenu/AdminSideMenu';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [modelNames, setModelNames] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const roleId = sessionStorage.getItem('role_id');
  const roleType = sessionStorage.getItem('role_type'); // "admin", "employee", etc.

  useEffect(() => {
    // Admin: no need to fetch
    if (roleType === 'admin') {
      setIsAdmin(true);
      setIsLoading(false);
    } else if (roleId) {
      // For roles, fetch their permitted models
      fetch('http://127.0.0.1:8000/get-models-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: roleId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.model_names && typeof data.model_names === 'object') {
            const models = Object.keys(data.model_names); // convert keys to array
            setModelNames(models);
          } else {
            setModelNames([]);
          }
          setIsLoading(false);
        })

        .catch((err) => {
          console.error('Error fetching model names:', err);
          setIsLoading(false);
        });
    } else {
      // If no role_id and not admin, skip API but also skip rendering
      console.warn('role_id is missing and not admin');
      setIsLoading(false);
    }
  }, [roleId, roleType]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSideMenu isAdmin={isAdmin} modelNames={modelNames} />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
