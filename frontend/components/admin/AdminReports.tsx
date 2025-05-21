import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

function exportCSV(data: any[], filename: string) {
  const csvRows = [];
  const headers = Object.keys(data[0] || {});
  csvRows.push(headers.join(','));
  for (const row of data) {
    csvRows.push(headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  }
  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const userSnap = await getDocs(collection(db, 'users'));
        setUsers(userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        const txSnap = await getDocs(collection(db, 'transactions'));
        setTransactions(txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSavings = users.reduce((sum, u) => sum + (u.balance || 0), 0);
  const totalTransactions = transactions.length;
  const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-2">System Reports</h3>
      {loading ? (
        <div>Loading reports...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="mb-4">
            <div>Total Savings: <b>NGN {totalSavings.toLocaleString()}</b></div>
            <div>Total Transactions: <b>{totalTransactions}</b></div>
            <div>Total Deposits: <b>NGN {totalDeposits.toLocaleString()}</b></div>
            <div>Total Withdrawals: <b>NGN {totalWithdrawals.toLocaleString()}</b></div>
          </div>
          <div className="flex gap-4 mb-4">
            <button className="btn btn-secondary" onClick={() => exportCSV(users, 'users-report.csv')}>Export Customers (CSV)</button>
            <button className="btn btn-secondary" onClick={() => exportCSV(transactions, 'transactions-report.csv')}>Export Transactions (CSV)</button>
          </div>
          <div className="overflow-x-auto">
            <h4 className="font-bold mb-2">Recent Transactions</h4>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.createdAt?.toDate?.().toLocaleString?.() || ''}</td>
                    <td>{tx.userId}</td>
                    <td>{tx.type}</td>
                    <td>{tx.amount?.toLocaleString?.()}</td>
                    <td>{tx.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 