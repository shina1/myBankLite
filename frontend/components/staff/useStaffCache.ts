import { useEffect, useState } from 'react';
import { openDB } from 'idb';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const DB_NAME = 'mybanklite-staff-cache';
const DB_VERSION = 1;

export function useStaffCache() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dbInstance: any;
    const init = async () => {
      dbInstance = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          db.createObjectStore('customers', { keyPath: 'id' });
          db.createObjectStore('transactions', { keyPath: 'id' });
        },
      });
      // Load from cache
      const cachedCustomers = await dbInstance.getAll('customers');
      const cachedTransactions = await dbInstance.getAll('transactions');
      setCustomers(cachedCustomers);
      setTransactions(cachedTransactions);
      setLoading(false);
      // Sync with Firestore if online
      if (navigator.onLine) {
        const snap = await getDocs(collection(db, 'users'));
        const freshCustomers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(freshCustomers);
        await dbInstance.clear('customers');
        for (const c of freshCustomers) await dbInstance.put('customers', c);
        const txSnap = await getDocs(collection(db, 'transactions'));
        const freshTx = txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(freshTx);
        await dbInstance.clear('transactions');
        for (const t of freshTx) await dbInstance.put('transactions', t);
      }
    };
    init();
    // Optionally, listen for online/offline events to re-sync
    // Cleanup: close db on unmount
    return () => { dbInstance?.close?.(); };
  }, []);

  return { customers, transactions, loading };
} 