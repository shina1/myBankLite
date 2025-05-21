import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function EditCustomerForm({ customer, onSuccess }: { customer: any, onSuccess?: () => void }) {
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [idNumber, setIdNumber] = useState(customer.idNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const ref = doc(db, 'users', customer.id);
      await updateDoc(ref, { name, phone, idNumber });
      setSuccess('Profile updated!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 border rounded mb-6">
      <h3 className="font-bold text-lg mb-2">Edit Customer Profile</h3>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="input input-bordered w-full" required />
      <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="input input-bordered w-full" required />
      <input type="text" placeholder="ID Number" value={idNumber} onChange={e => setIdNumber(e.target.value)} className="input input-bordered w-full" />
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
} 