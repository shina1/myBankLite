import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';

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

const SESSION_TIMEOUT_MINUTES = 15;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [staffProfile, setStaffProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Session timeout logic
  useEffect(() => {
    if (!user) return;
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        auth.signOut();
        router.replace('/');
        alert('You have been signed out due to inactivity.');
      }, SESSION_TIMEOUT_MINUTES * 60 * 1000);
    };
    // Listen for user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user, router]);

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
          // Onboarding check for customers
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (!data.name || !data.idNumber) {
              router.replace('/customer/onboarding');
            }
          }
        }
      } else {
        setRole(null);
        setStaffProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

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