import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import MiniStatementPDF from '../customer/MiniStatementPDF';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';

export default function CustomerProfile({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

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
  }, [customerId, deleted]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to deactivate this customer?')) return;
    setDeleting(true);
    setError('');
    try {
      const softDelete = httpsCallable(functions, 'softDeleteCustomer');
      await softDelete({ customerId });
      setDeleted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate customer');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading customer...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return null;

  return (
    <div className={`border rounded p-6 mb-6 ${customer.active === false ? 'bg-gray-100 opacity-60' : ''}`}>
      <h2 className="text-xl font-bold mb-2">{customer.name}</h2>
      <div className="mb-2">Phone: {customer.phone}</div>
      <div className="mb-2">Balance: NGN {customer.balance?.toLocaleString?.() ?? 0}</div>
      <div className="mb-2">ID: {customer.idNumber || 'N/A'}</div>
      <div className="mb-2">Status: <b>{customer.active === false ? 'Inactive' : 'Active'}</b></div>
      <div className="flex gap-4 mt-4">
        <Link href={`/staff/customers/${customerId}/transactions`} className="btn btn-info btn-sm">View Transactions</Link>
        <Link href={`/staff/customers/${customerId}/record`} className="btn btn-primary btn-sm">Record Transaction</Link>
        <MiniStatementPDF customerId={customerId} />
        {customer.active !== false && (
          <button className="btn btn-warning btn-sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deactivating...' : 'Deactivate Customer'}
          </button>
        )}
      </div>
      {customer.active === false && <div className="text-red-500 mt-2">This customer is inactive (soft deleted).</div>}
    </div>
  );
} 