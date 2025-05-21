import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import AdminReports from '../../../components/admin/AdminReports';

export default function AdminReportsPage() {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'admin') return <div>Access denied. Admins only.</div>;
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">System Reports</h1>
      <AdminReports />
    </div>
  );
} 