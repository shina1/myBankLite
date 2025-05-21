import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import twilio from 'twilio';

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const fromNumber = functions.config().twilio.whatsapp_from;
const client = twilio(accountSid, authToken);

admin.initializeApp();

export const sendWhatsAppAlert = functions.https.onCall(async (data, context) => {
  const { phone, type, amount, balance } = data;
  if (!phone || !type || !amount || balance === undefined) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }
  let message;
  if (type === 'deposit') {
    message = `You have deposited NGN ${amount.toLocaleString()}. Your new balance is NGN ${balance.toLocaleString()}. - MicroBank`;
  } else if (type === 'withdrawal') {
    message = `You have withdrawn NGN ${amount.toLocaleString()}. Your new balance is NGN ${balance.toLocaleString()}. - MicroBank`;
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid transaction type');
  }
  try {
    await client.messages.create({
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${phone}`,
      body: message,
    });
    return { success: true };
  } catch (err: any) {
    throw new functions.https.HttpsError('internal', err.message);
  }
}); 