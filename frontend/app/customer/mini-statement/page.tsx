import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import MiniStatementPDF from '../../../components/customer/MiniStatementPDF';

export default function MiniStatementPage() {
  const { user, role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'customer') return <div>Access denied. Customers only.</div>;
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Download Mini-Statement</h1>
      <MiniStatementPDF customerId={user?.uid!} />
    </div>
  );
} 