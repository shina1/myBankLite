import React from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import RecordTransactionForm from '../../../../../components/staff/RecordTransactionForm';

export default function RecordTransactionPage({ params }: { params: { customerId: string } }) {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'staff' && role !== 'admin') return <div>Access denied. Staff only.</div>;
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <RecordTransactionForm customerId={params.customerId} />
    </div>
  );
} 