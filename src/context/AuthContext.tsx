import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { MatrimonialProfile, PrivateContact, UserAccount } from '../types/matrimony';

// Bootstrapped admin email from runtime instructions
const ADMIN_EMAIL = 'bgsathyaraju@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  userAccount: UserAccount | null;
  currentProfile: MatrimonialProfile | null;
  privateContact: PrivateContact | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveCurrentProfile: (profile: Partial<MatrimonialProfile>, contact: Partial<PrivateContact>) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [currentProfile, setCurrentProfile] = useState<MatrimonialProfile | null>(null);
  const [privateContact, setPrivateContact] = useState<PrivateContact | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(
    currentUser && (
      currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      userAccount?.role === 'admin'
    )
  );

  const fetchUserData = async (user: User) => {
    try {
      // 1. Fetch or create UserAccount
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const isCurrentAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (userSnap.exists()) {
        const data = userSnap.data() as UserAccount;
        // Auto-promote bootstrapped admin if not already set
        if (isCurrentAdmin && data.role !== 'admin') {
          await setDoc(userRef, { role: 'admin', updatedAt: new Date().toISOString() }, { merge: true });
          data.role = 'admin';
        }
        setUserAccount(data);
      } else {
        const newAccount: UserAccount = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Community Member',
          role: isCurrentAdmin ? 'admin' : 'member',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, newAccount);
        setUserAccount(newAccount);
      }

      // 2. Fetch Matrimonial Profile for this user
      const profilesRef = collection(db, 'matrimonialProfiles');
      const q = query(profilesRef, where('userId', '==', user.uid));
      const profileDocs = await getDocs(q);

      if (!profileDocs.empty) {
        const pDoc = profileDocs.docs[0];
        const pData = { id: pDoc.id, ...pDoc.data() } as MatrimonialProfile;
        setCurrentProfile(pData);

        // Fetch private contact
        const contactRef = doc(db, 'users', user.uid, 'private', 'contact');
        const contactSnap = await getDoc(contactRef);
        if (contactSnap.exists()) {
          setPrivateContact(contactSnap.data() as PrivateContact);
        }
      } else {
        setCurrentProfile(null);
        setPrivateContact(null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserAccount(null);
        setCurrentProfile(null);
        setPrivateContact(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await fetchUserData(res.user);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await fetchUserData(res.user);
    } catch (err: any) {
      console.error('Email Sign In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateFirebaseProfile(res.user, { displayName: name });
      await fetchUserData(res.user);
    } catch (err: any) {
      console.error('Email Registration Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserAccount(null);
      setCurrentProfile(null);
      setPrivateContact(null);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchUserData(currentUser);
    }
  };

  const saveCurrentProfile = async (
    profileData: Partial<MatrimonialProfile>, 
    contactData: Partial<PrivateContact>
  ): Promise<string> => {
    if (!currentUser) throw new Error('You must be signed in to save a profile.');

    const isExisting = !!currentProfile?.id;
    const profileId = isExisting 
      ? currentProfile.id 
      : `SVK-${Math.floor(10000 + Math.random() * 90000)}`;

    const now = new Date().toISOString();

    const fullProfileData: MatrimonialProfile = {
      id: profileId,
      userId: currentUser.uid,
      fullName: profileData.fullName || currentUser.displayName || 'Community Member',
      gender: profileData.gender || 'groom',
      age: Number(profileData.age) || 26,
      dateOfBirth: profileData.dateOfBirth || '1998-01-01',
      surname: profileData.surname || '',
      fatherName: profileData.fatherName || '',
      motherName: profileData.motherName || '',
      maritalStatus: profileData.maritalStatus || 'Never Married',
      community: 'Suryavamsha Vadiyaraju Kshatriya',
      subCommunity: profileData.subCommunity || 'Vadiyaraju',
      gotra: profileData.gotra || 'Kashyapa',
      nativePlace: profileData.nativePlace || '',
      currentCity: profileData.currentCity || '',
      state: profileData.state || 'Andhra Pradesh',
      country: profileData.country || 'India',
      education: profileData.education || '',
      occupation: profileData.occupation || '',
      annualIncome: profileData.annualIncome || '',
      height: profileData.height || "5'8\" (172 cm)",
      languagesKnown: profileData.languagesKnown && profileData.languagesKnown.length > 0 ? profileData.languagesKnown : ['Telugu', 'English'],
      photoUrl: profileData.photoUrl || (profileData.gender === 'bride' 
        ? 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'),
      additionalPhotos: profileData.additionalPhotos || [],
      familyDetails: profileData.familyDetails || 'Traditional, close-knit Kshatriya royal lineage family.',
      partnerPreferences: profileData.partnerPreferences || {
        ageMin: 22,
        ageMax: 30,
        heightMin: "5'2\"",
        education: ['Any Graduate'],
        maritalStatus: ['Never Married']
      },
      profileDescription: profileData.profileDescription || 'Looking for an understanding life partner from the Suryavamsha Vadiyaraju Kshatriya community who values cultural heritage and family values.',
      approvalStatus: isExisting ? (currentProfile.approvalStatus || 'approved') : 'approved', // Auto-approved for fast onboarding or admin review
      isApproved: isExisting ? (currentProfile.isApproved ?? true) : true,
      isPublished: true,
      isSuspended: false,
      createdAt: isExisting ? currentProfile.createdAt : now,
      updatedAt: now
    };

    const targetProfileDoc = doc(db, 'matrimonialProfiles', profileId);

    try {
      await setDoc(targetProfileDoc, fullProfileData, { merge: true });

      // Save isolated private contact in /users/{userId}/private/contact
      const contactDoc = doc(db, 'users', currentUser.uid, 'private', 'contact');
      const contactPayload: PrivateContact = {
        userId: currentUser.uid,
        profileId: profileId,
        contactNumber: contactData.contactNumber || '',
        email: contactData.email || currentUser.email || '',
        alternateNumber: contactData.alternateNumber || '',
        address: contactData.address || '',
        allowVerifiedMembers: true,
        updatedAt: now
      };
      await setDoc(contactDoc, contactPayload, { merge: true });

      setCurrentProfile(fullProfileData);
      setPrivateContact(contactPayload);
      return profileId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'matrimonialProfiles/' + profileId);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userAccount,
      currentProfile,
      privateContact,
      isAdmin,
      loading,
      signInWithGoogle,
      signInWithEmail,
      registerWithEmail,
      logout,
      refreshProfile,
      saveCurrentProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
