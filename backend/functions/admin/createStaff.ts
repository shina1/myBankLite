import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Callable function to create a staff/admin account
export const createStaff = functions.https.onCall(async (data, context) => {
  // Only allow admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Request not authenticated');
  }
  const requester = await db.collection('staff').doc(context.auth.uid).get();
  if (!requester.exists || requester.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admin can create staff');
  }

  const { name, email, password, role } = data;
  if (!name || !email || !password || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }
  if (!['admin', 'staff'].includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid role');
  }

  // Create Firebase Auth user
  let userRecord;
  try {
    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      disabled: false,
    });
  } catch (err: any) {
    throw new functions.https.HttpsError('already-exists', err.message);
  }

  // Add to staff collection
  await db.collection('staff').doc(userRecord.uid).set({
    id: userRecord.uid,
    name,
    email,
    role,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Audit log
  await db.collection('auditLogs').add({
    action: 'create_staff',
    actorId: context.auth.uid,
    targetId: userRecord.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: { name, email, role },
  });

  // Optionally, send welcome email here

  return { success: true, uid: userRecord.uid };
}); 