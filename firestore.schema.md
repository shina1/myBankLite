# Firestore Schema for myBankLite

## Collections

### 1. users (customers)
- **id**: string (Firestore doc ID, also used as auth UID)
- **name**: string
- **phone**: string (E.164 format, unique)
- **balance**: number (current savings balance)
- **createdAt**: timestamp
- **idNumber**: string (optional, government ID or similar)

### 2. transactions
- **id**: string (Firestore doc ID)
- **userId**: string (reference to users.id)
- **type**: string ('deposit' | 'withdrawal')
- **amount**: number
- **createdAt**: timestamp
- **note**: string (optional)
- **recordedBy**: string (staffId)

### 3. staff
- **id**: string (Firestore doc ID, also used as auth UID)
- **name**: string
- **email**: string (unique)
- **role**: string ('admin' | 'staff')
- **active**: boolean
- **createdAt**: timestamp

### 4. auditLogs
- **id**: string (Firestore doc ID)
- **action**: string (e.g., 'create_transaction', 'edit_customer')
- **actorId**: string (staffId)
- **targetId**: string (optional, e.g., userId or transactionId)
- **timestamp**: timestamp
- **details**: map (optional, additional info) 