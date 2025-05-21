import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Link from 'next/link';
import MiniStatementPDF from '../../../components/customer/MiniStatementPDF';

export default function CustomerAccountPage() {
  const { user, role, loading } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchCustomer = async () => {
      setFetching(true);
      setError('');
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCustomer({ id: snap.id, ...snap.data() });
        } else {
          setError('Account not found');
        }
      } catch (err) {
        setError('Failed to fetch account');
      } finally {
        setFetching(false);
      }
    };
    fetchCustomer();
  }, [user]);

  if (loading || fetching) return <div>Loading...</div>;
  if (role !== 'customer') return <div>Access denied. Customers only.</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return null;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Account Summary</h1>
      <div className="border rounded p-6 mb-6">
        <div className="mb-2 font-bold">{customer.name}</div>
        <div className="mb-2">Phone: {customer.phone}</div>
        <div className="mb-2">Balance: <b>NGN {customer.balance?.toLocaleString?.() ?? 0}</b></div>
        <div className="flex gap-4 mt-4">
          <Link href="/customer/transactions" className="btn btn-info btn-sm">View Transactions</Link>
          <MiniStatementPDF customerId={user.uid} />
        </div>
      </div>
    </div>
  );
} 