import React, { useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import jsPDF from 'jspdf';

export default function MiniStatementPDF({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch customer info
      const customerRef = doc(db, 'users', customerId);
      const customerSnap = await getDoc(customerRef);
      if (!customerSnap.exists()) throw new Error('Customer not found');
      const customer = customerSnap.data();
      // Fetch last 10 transactions
      const txQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', customerId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const txSnap = await getDocs(txQuery);
      const transactions = txSnap.docs.map(doc => doc.data());
      // Generate PDF
      const docPdf = new jsPDF();
      docPdf.setFontSize(14);
      docPdf.text('Mini Statement', 10, 10);
      docPdf.setFontSize(10);
      docPdf.text(`Name: ${customer.name}`, 10, 20);
      docPdf.text(`Phone: ${customer.phone}`, 10, 26);
      docPdf.text(`Balance: NGN ${customer.balance?.toLocaleString?.() ?? 0}`, 10, 32);
      docPdf.text('Last 10 Transactions:', 10, 40);
      let y = 48;
      transactions.forEach((tx: any, i: number) => {
        docPdf.text(
          `${i + 1}. ${tx.createdAt?.toDate?.().toLocaleString?.() || ''} | ${tx.type} | NGN ${tx.amount?.toLocaleString?.()} | ${tx.note || ''}`,
          10,
          y
        );
        y += 7;
      });
      docPdf.save(`mini-statement-${customer.phone}.pdf`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <button className="btn btn-secondary" onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Download Mini-Statement (PDF)'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
} 