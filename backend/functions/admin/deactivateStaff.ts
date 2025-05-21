import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// Callable function to deactivate a staff/admin account
export const deactivateStaff = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Request not authenticated');
  }
  const requester = await db.collection('staff').doc(context.auth.uid).get();
  if (!requester.exists || requester.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admin can deactivate staff');
  }

  const { staffId } = data;
  if (!staffId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing staffId');
  }

  // Set active=false in Firestore
  await db.collection('staff').doc(staffId).update({ active: false });

  // Disable Firebase Auth user
  await admin.auth().updateUser(staffId, { disabled: true });

  // Audit log
  await db.collection('auditLogs').add({
    action: 'deactivate_staff',
    actorId: context.auth.uid,
    targetId: staffId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: {},
  });

  return { success: true };
}); 