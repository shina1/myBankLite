# myBankLite

Digitized microfinance operations for savings tracking, customer alerts, and reporting. Built with Next.js, Firebase, and modern best practices.

---

## Features
- **Customer, Staff, and Admin Portals**
- **Firebase Auth**: Phone login for customers, email/password for staff/admin
- **Firestore**: Secure, role-based data storage
- **WhatsApp Alerts**: Transactional notifications via Twilio
- **Bulk Import**: Admin can import customers/transactions from CSV
- **Soft Delete**: Customers are deactivated, not deleted
- **GDPR/Data Export**: Customers can download all their data
- **PWA & Offline Support**: Installable, works offline, staff cache for field use
- **Session Timeout**: Auto-logout after inactivity
- **Audit Logs**: All sensitive actions logged
- **Reporting**: Admin can export CSV, view stats
- **Customer Onboarding**: Profile completion after phone registration
- **Password Reset**: Staff/admin can reset password via email

---

## Setup & Development

### 1. **Clone & Install**
```bash
# Clone repo
# cd myBankLite
npm install
```

### 2. **Environment Variables**
Create `.env.local` in `frontend/` with your Firebase config:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. **Firebase Setup**
- Deploy Firestore rules and indexes from `firestore.rules` and `firestore.indexes.json`
- Set up Firebase Auth (phone, email/password)
- Add Twilio credentials to Firebase Functions config:
  ```bash
  firebase functions:config:set twilio.sid="..." twilio.token="..." twilio.whatsapp_from="..."
  ```

### 4. **Run Locally**
```bash
cd frontend
npm run dev
```

### 5. **Deploy**
- Deploy frontend (Vercel, Netlify, or Firebase Hosting)
- Deploy backend functions with Firebase CLI

---

## PWA & Offline
- App is installable and works offline (shell/UI)
- Staff customer/transaction data is cached for offline use (IndexedDB)

---

## Bulk Import
- Admin: `/admin/bulk-import` to upload CSV for customers or transactions
- See UI for required columns

---

## Data Export (GDPR)
- Customers: `/customer/account` → Download My Data (JSON)

---

## Security
- All sensitive actions are logged in `auditLogs`
- Firestore rules enforce role-based access
- Session timeout auto-logs out after 15 minutes inactivity

---

## Customization
- Replace `/public/icon-192.png` and `/public/icon-512.png` with your logo for PWA
- Update manifest and theme color as needed

---

## Contributing
PRs and issues welcome! See code comments for guidance on extending features.

---

## License
MIT

## Firestore Schema & Security Rules

- See `firestore.schema.md` for the database structure.
- See `