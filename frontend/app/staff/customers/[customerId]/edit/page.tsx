import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import EditCustomerForm from '../../../../../components/staff/EditCustomerForm';

export default function EditCustomerPage({ params }: { params: { customerId: string } }) {
  const { role, loading } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      setFetching(true);
      setError('');
      try {
        const ref = doc(db, 'users', params.customerId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCustomer({ id: snap.id, ...snap.data() });
        } else {
          setError('Customer not found');
        }
      } catch (err) {
        setError('Failed to fetch customer');
      } finally {
        setFetching(false);
      }
    };
    fetchCustomer();
  }, [params.customerId]);

  if (loading || fetching) return <div>Loading...</div>;
  if (role !== 'staff' && role !== 'admin') return <div>Access denied. Staff only.</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <EditCustomerForm customer={customer} />
    </div>
  );
} 