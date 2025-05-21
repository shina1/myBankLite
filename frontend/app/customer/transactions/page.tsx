import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import TransactionHistory from '../../../components/staff/TransactionHistory';

export default function CustomerTransactionsPage() {
  const { user, role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'customer') return <div>Access denied. Customers only.</div>;
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      <TransactionHistory customerId={user?.uid!} />
    </div>
  );
} 