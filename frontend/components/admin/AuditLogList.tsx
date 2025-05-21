import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AuditLogList() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');
      try {
        const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError('Failed to fetch audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div>Loading audit logs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-2">Audit Logs</h3>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Action</th>
            <th>Actor</th>
            <th>Target</th>
            <th>Timestamp</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.action}</td>
              <td>{log.actorId}</td>
              <td>{log.targetId}</td>
              <td>{log.timestamp?.toDate?.().toLocaleString?.() || ''}</td>
              <td><pre className="text-xs whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 