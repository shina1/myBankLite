import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const bulkImport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Request not authenticated');
  }
  const requester = await db.collection('staff').doc(context.auth.uid).get();
  if (!requester.exists || requester.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admin can import data');
  }
  const { type, data: rows } = data;
  if (!type || !Array.isArray(rows)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid import data');
  }
  let successCount = 0;
  let errorCount = 0;
  const errors: any[] = [];
  const batch = db.batch();
  if (type === 'customers') {
    for (const row of rows) {
      if (!row.name || !row.phone) {
        errorCount++;
        errors.push({ row, error: 'Missing name or phone' });
        continue;
      }
      const ref = db.collection('users').doc();
      batch.set(ref, {
        name: row.name,
        phone: row.phone,
        idNumber: row.idNumber || '',
        balance: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        active: true,
      });
      successCount++;
    }
  } else if (type === 'transactions') {
    for (const row of rows) {
      if (!row.userId || !row.type || !row.amount) {
        errorCount++;
        errors.push({ row, error: 'Missing userId, type, or amount' });
        continue;
      }
      if (!['deposit', 'withdrawal'].includes(row.type)) {
        errorCount++;
        errors.push({ row, error: 'Invalid type' });
        continue;
      }
      const amt = parseFloat(row.amount);
      if (isNaN(amt) || amt <= 0) {
        errorCount++;
        errors.push({ row, error: 'Invalid amount' });
        continue;
      }
      const ref = db.collection('transactions').doc();
      batch.set(ref, {
        userId: row.userId,
        type: row.type,
        amount: amt,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        note: row.note || '',
        recordedBy: context.auth.uid,
      });
      successCount++;
    }
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid import type');
  }
  await batch.commit();
  return { successCount, errorCount, errors };
}); 