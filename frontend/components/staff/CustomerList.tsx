import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';

export default function CustomerList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      let q = collection(db, 'users');
      let snap;
      if (searchTerm) {
        // Simple client-side filter after fetching all (for MVP)
        snap = await getDocs(q);
        const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(
          all.filter(
            (c: any) =>
              c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.phone?.includes(searchTerm)
          )
        );
      } else {
        snap = await getDocs(q);
        setCustomers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(search);
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      {loading ? (
        <div>Loading customers...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.balance?.toLocaleString?.() ?? 0}</td>
                <td>
                  <Link href={`/staff/customers/${c.id}`} className="btn btn-xs btn-info">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 