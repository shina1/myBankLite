import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import CreateStaffForm from '../../../components/admin/CreateStaffForm';
import StaffList from '../../../components/admin/StaffList';

export default function AdminStaffPage() {
  const { role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (role !== 'admin') return <div>Access denied. Admins only.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Staff/Admin Management</h1>
      <CreateStaffForm />
      <StaffList />
    </div>
  );
} 