import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to myBankLite</h1>
      <div className="space-x-4">
        <Link href="/customer/login" className="btn btn-primary">Customer Login</Link>
        <Link href="/staff/login" className="btn btn-secondary">Staff/Admin Login</Link>
      </div>
    </main>
  );
} 