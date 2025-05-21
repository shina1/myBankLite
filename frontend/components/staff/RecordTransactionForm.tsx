import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, functions } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { httpsCallable } from 'firebase/functions';

export default function RecordTransactionForm({ customerId, onSuccess }: { customerId: string, onSuccess?: () => void }) {
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) throw new Error('Invalid amount');
      // Add transaction
      await addDoc(collection(db, 'transactions'), {
        userId: customerId,
        type,
        amount: amt,
        createdAt: serverTimestamp(),
        note,
        recordedBy: user?.uid,
      });
      // Update user balance
      const userRef = doc(db, 'users', customerId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error('User not found');
      const prevBalance = userSnap.data().balance || 0;
      const newBalance = type === 'deposit' ? prevBalance + amt : prevBalance - amt;
      if (newBalance < 0) throw new Error('Insufficient balance');
      await updateDoc(userRef, { balance: newBalance });
      // Send WhatsApp alert (non-blocking)
      try {
        const sendAlert = httpsCallable(functions, 'sendWhatsAppAlert');
        await sendAlert({
          phone: userSnap.data().phone,
          type,
          amount: amt,
          balance: newBalance,
        });
      } catch (waErr: any) {
        setError('Transaction saved, but WhatsApp alert failed: ' + (waErr.message || '')); // Non-blocking
      }
      setSuccess('Transaction recorded!');
      setAmount(''); setNote(''); setType('deposit');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to record transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 border rounded">
      <h3 className="font-bold text-lg mb-2">Record Transaction</h3>
      <select value={type} onChange={e => setType(e.target.value as 'deposit' | 'withdrawal')} className="select select-bordered w-full">
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="input input-bordered w-full" required min="1" />
      <input type="text" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} className="input input-bordered w-full" />
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Recording...' : 'Record'}</button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
} 