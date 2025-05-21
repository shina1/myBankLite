import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import BulkImportForm from '../../../components/admin/BulkImportForm';

export default function BulkImportPage() {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'admin') return <div>Access denied. Admins only.</div>;
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Bulk Import</h1>
      <BulkImportForm />
    </div>
  );
} 