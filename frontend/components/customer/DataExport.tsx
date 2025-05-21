import React, { useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

export default function DataExport() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setError('');
    try {
      if (!user) throw new Error('Not logged in');
      // Fetch profile
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error('Profile not found');
      const profile = userSnap.data();
      // Fetch transactions
      const txQuery = query(collection(db, 'transactions'), where('userId', '==', user.uid));
      const txSnap = await getDocs(txQuery);
      const transactions = txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Prepare data
      const exportData = {
        profile: { id: user.uid, ...profile },
        transactions,
      };
      // Download as JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mybanklite-data-${user.uid}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <button className="btn btn-secondary" onClick={handleExport} disabled={loading}>
        {loading ? 'Preparing...' : 'Download My Data (JSON)'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
} 