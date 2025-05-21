import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function TransactionHistory({ customerId }: { customerId: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', customerId),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [customerId]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-2">Transaction History</h3>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Recorded By</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.createdAt?.toDate?.().toLocaleString?.() || ''}</td>
              <td>{tx.type}</td>
              <td>{tx.amount?.toLocaleString?.()}</td>
              <td>{tx.note}</td>
              <td>{tx.recordedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 