import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import AuditLogList from '../../../components/admin/AuditLogList';

export default function AuditLogsPage() {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'admin') return <div>Access denied. Admins only.</div>;
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
      <AuditLogList />
    </div>
  );
} 