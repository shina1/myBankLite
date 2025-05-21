import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const softDeleteCustomer = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Request not authenticated');
  }
  // Allow staff or admin
  const staffDoc = await db.collection('staff').doc(context.auth.uid).get();
  if (!staffDoc.exists || !['admin', 'staff'].includes(staffDoc.data()?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Only staff or admin can delete customers');
  }
  const { customerId } = data;
  if (!customerId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing customerId');
  }
  const userRef = db.collection('users').doc(customerId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Customer not found');
  }
  await userRef.update({ active: false });
  // Optionally, log this action in auditLogs
  await db.collection('auditLogs').add({
    action: 'soft_delete_customer',
    actorId: context.auth.uid,
    targetId: customerId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: {},
  });
  return { success: true };
}); 