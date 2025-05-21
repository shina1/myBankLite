import React from 'react';
import Link from 'next/link';
import { useStaffCache } from './useStaffCache';

export default function CustomerList() {
  const { customers, loading } = useStaffCache();
  const [search, setSearch] = React.useState('');

  const filtered = customers.filter(
    (c: any) =>
      c.active !== false &&
      (c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search))
  );

  return (
    <div className="mt-6">
      <form onSubmit={e => e.preventDefault()} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
      </form>
      {loading ? (
        <div>Loading customers...</div>
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
            {filtered.map(c => (
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