import React, { useState } from 'react';
import Papa from 'papaparse';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';

export default function BulkImportForm() {
  const [type, setType] = useState<'customers' | 'transactions'>('customers');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setResult(null);
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      Papa.parse(f, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          setPreview(res.data as any[]);
        },
        error: (err) => setError('CSV parse error: ' + err.message),
      });
    } else {
      setPreview([]);
    }
  };

  const handleImport = async () => {
    if (!file || preview.length === 0) return;
    setImporting(true);
    setError('');
    setResult(null);
    try {
      const importFn = httpsCallable(functions, 'bulkImport');
      const res: any = await importFn({ type, data: preview });
      setResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="border rounded p-6 mb-6">
      <h3 className="font-bold text-lg mb-2">Bulk Import</h3>
      <div className="mb-2">
        <label className="mr-2">Import Type:</label>
        <select value={type} onChange={e => setType(e.target.value as any)} className="select select-bordered">
          <option value="customers">Customers</option>
          <option value="transactions">Transactions</option>
        </select>
      </div>
      <input type="file" accept=".csv" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs mb-2" />
      {preview.length > 0 && (
        <div className="mb-2">
          <b>Preview ({preview.length} rows):</b>
          <pre className="bg-gray-100 p-2 rounded text-xs max-h-40 overflow-auto">{JSON.stringify(preview.slice(0, 5), null, 2)}{preview.length > 5 ? '\n...more' : ''}</pre>
        </div>
      )}
      <button className="btn btn-primary" onClick={handleImport} disabled={importing || !file || preview.length === 0}>
        {importing ? 'Importing...' : 'Import'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <div className="mt-2 text-green-600">
          Imported: {result.successCount} | Failed: {result.errorCount}
          {result.errors && result.errors.length > 0 && (
            <pre className="text-xs text-red-500 whitespace-pre-wrap">{JSON.stringify(result.errors, null, 2)}</pre>
          )}
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500">
        <b>Customers CSV columns:</b> name, phone, idNumber<br />
        <b>Transactions CSV columns:</b> userId, type (deposit/withdrawal), amount, note (optional)
      </div>
    </div>
  );
} 