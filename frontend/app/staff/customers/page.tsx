import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import CustomerList from '../../../components/staff/CustomerList';

export default function StaffCustomersPage() {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (role !== 'staff' && role !== 'admin') return <div>Access denied. Staff only.</div>;
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <CustomerList />
    </div>
  );
} 