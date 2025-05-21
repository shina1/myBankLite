import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function CreateCustomerForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (!name || !phone) throw new Error('Name and phone are required');
      await addDoc(collection(db, 'users'), {
        name,
        phone,
        idNumber,
        balance: 0,
        createdAt: serverTimestamp(),
      });
      setSuccess('Customer created!');
      setName(''); setPhone(''); setIdNumber('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 border rounded mb-6">
      <h3 className="font-bold text-lg mb-2">Create New Customer</h3>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="input input-bordered w-full" required />
      <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="input input-bordered w-full" required />
      <input type="text" placeholder="ID Number" value={idNumber} onChange={e => setIdNumber(e.target.value)} className="input input-bordered w-full" />
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Customer'}</button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
} 