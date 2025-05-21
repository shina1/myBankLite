import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { role, signOut, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="w-full bg-gray-100 border-b mb-6 py-3 px-6 flex items-center justify-between">
      <div className="font-bold text-lg">
        <Link href="/">myBankLite</Link>
      </div>
      <div className="flex items-center space-x-4">
        {role === 'admin' && (
          <>
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/staff">Staff Management</Link>
            <Link href="/admin/reports">Reports</Link>
            <Link href="/admin/audit-logs">Audit Logs</Link>
          </>
        )}
        {role === 'staff' && (
          <>
            <Link href="/staff/dashboard">Dashboard</Link>
            <Link href="/staff/customers">Customers</Link>
            <Link href="/staff/transactions">Transactions</Link>
          </>
        )}
        {role === 'customer' && (
          <>
            <Link href="/customer/account">Account</Link>
            <Link href="/customer/transactions">Transactions</Link>
            <Link href="/customer/mini-statement">Mini-Statement</Link>
          </>
        )}
        {role && <button className="btn btn-sm btn-outline ml-4" onClick={signOut}>Sign Out</button>}
      </div>
    </nav>
  );
} 