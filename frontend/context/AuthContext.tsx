import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'customer' | 'staff' | 'admin' | null;

interface AuthContextType {
  user: FirebaseUser | null;
  role: UserRole;
  staffProfile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  staffProfile: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [staffProfile, setStaffProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Check if user is staff/admin
        const staffRef = doc(db, 'staff', firebaseUser.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const staffData = staffSnap.data();
          setRole(staffData.role);
          setStaffProfile(staffData);
        } else {
          setRole('customer');
          setStaffProfile(null);
        }
      } else {
        setRole(null);
        setStaffProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, staffProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 