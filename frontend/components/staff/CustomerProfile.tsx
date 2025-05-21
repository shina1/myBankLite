import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import MiniStatementPDF from '../customer/MiniStatementPDF';

export default function CustomerProfile({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError('');
      try {
        const ref = doc(db, 'users', customerId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCustomer({ id: snap.id, ...snap.data() });
        } else {
          setError('Customer not found');
        }
      } catch (err) {
        setError('Failed to fetch customer');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  if (loading) return <div>Loading customer...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return null;

  return (
    <div className="border rounded p-6 mb-6">
      <h2 className="text-xl font-bold mb-2">{customer.name}</h2>
      <div className="mb-2">Phone: {customer.phone}</div>
      <div className="mb-2">Balance: NGN {customer.balance?.toLocaleString?.() ?? 0}</div>
      <div className="mb-2">ID: {customer.idNumber || 'N/A'}</div>
      <div className="flex gap-4 mt-4">
        <Link href={`/staff/customers/${customerId}/transactions`} className="btn btn-info btn-sm">View Transactions</Link>
        <Link href={`/staff/customers/${customerId}/record`} className="btn btn-primary btn-sm">Record Transaction</Link>
        <MiniStatementPDF customerId={customerId} />
      </div>
    </div>
  );
} 