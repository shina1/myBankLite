import React from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import TransactionHistory from '../../../../../components/staff/TransactionHistory';

export default function CustomerTransactionsPage({ params }: { params: { customerId: string } }) {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'staff' && role !== 'admin') return <div>Access denied. Staff only.</div>;
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <TransactionHistory customerId={params.customerId} />
    </div>
  );
} 