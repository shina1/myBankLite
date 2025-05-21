import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import CustomerProfile from '../../../../components/staff/CustomerProfile';

export default function CustomerProfilePage({ params }: { params: { customerId: string } }) {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'staff' && role !== 'admin') return <div>Access denied. Staff only.</div>;
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <CustomerProfile customerId={params.customerId} />
    </div>
  );
} 