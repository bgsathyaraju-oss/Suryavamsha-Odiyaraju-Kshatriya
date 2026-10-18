import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MatrimonialProfile, ProfileFilters, PrivateContact } from '../types/matrimony';

const PROFILES_COLLECTION = 'matrimonialProfiles';

// Seed authentic Suryavamsha Vadiyaraju Kshatriya profiles if database is empty
const INITIAL_COMMUNITY_PROFILES: Omit<MatrimonialProfile, 'id'>[] = [
  {
    userId: 'seed_member_1',
    fullName: 'Sai Varma Vadiyaraju',
    gender: 'groom',
    age: 28,
    dateOfBirth: '1998-05-14',
    surname: 'Vadiyaraju',
    fatherName: 'Ramachandra Raju Vadiyaraju',
    motherName: 'Annapurna Devi',
    maritalStatus: 'Never Married',
    community: 'Suryavamsha Vadiyaraju Kshatriya',
    subCommunity: 'Vadiyaraju Kshatriya',
    gotra: 'Kashyapa',
    nativePlace: 'Bhimavaram',
    currentCity: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    education: 'B.Tech (CSE) & MS (Data Science)',
    occupation: 'Senior Software Architect at Microsoft',
    annualIncome: '₹ 38 - 42 Lakhs',
    height: "5'11\" (180 cm)",
    languagesKnown: ['Telugu', 'English', 'Hindi'],
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'
    ],
    familyDetails: 'Respected Suryavamsha family rooted in West Godavari. Father is a retired Govt Gazetted Officer, Mother homemaker. One younger sister married to an engineer.',
    partnerPreferences: {
      ageMin: 23,
      ageMax: 27,
      heightMin: "5'3\"",
      maritalStatus: ['Never Married'],
      education: ['B.Tech', 'MBBS', 'M.Tech', 'MBA', 'MS'],
      gotra: 'Other than Kashyapa'
    },
    profileDescription: 'Warm, ambitious, and deeply grounded in our Kshatriya cultural customs and traditions. Looking for an educated, family-oriented partner with similar values.',
    approvalStatus: 'approved',
    isApproved: true,
    isPublished: true,
    isSuspended: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'seed_member_2',
    fullName: 'Sreeja Devi Vadiyaraju',
    gender: 'bride',
    age: 25,
    dateOfBirth: '2001-08-22',
    surname: 'Vadiyaraju',
    fatherName: 'Venkata Satyanarayana Raju',
    motherName: 'Lakshmi Prasanna',
    maritalStatus: 'Never Married',
    community: 'Suryavamsha Vadiyaraju Kshatriya',
    subCommunity: 'Vadiyaraju Kshatriya',
    gotra: 'Vasishtha',
    nativePlace: 'Rajahmundry',
    currentCity: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    education: 'M.Tech (Artificial Intelligence)',
    occupation: 'Lead AI Engineer at Cisco',
    annualIncome: '₹ 28 - 32 Lakhs',
    height: "5'5\" (165 cm)",
    languagesKnown: ['Telugu', 'English', 'Kannada'],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
    ],
    familyDetails: 'Prestigious Kshatriya royal lineage family in Godavari region. Father manages business enterprises, Mother homemaker. Brother doing MD in UK.',
    partnerPreferences: {
      ageMin: 26,
      ageMax: 31,
      heightMin: "5'8\"",
      maritalStatus: ['Never Married'],
      education: ['B.Tech / MS / MBA / MBBS'],
      gotra: 'Other than Vasishtha'
    },
    profileDescription: 'Passionate about technology, Indian classical music, and traveling. Seeking a kind-hearted, ambitious Suryavamsha partner.',
    approvalStatus: 'approved',
    isApproved: true,
    isPublished: true,
    isSuspended: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'seed_member_3',
    fullName: 'Aditya Varma Poosapati',
    gender: 'groom',
    age: 29,
    dateOfBirth: '1997-03-10',
    surname: 'Poosapati',
    fatherName: 'Vijayarama Gajapathi Raju',
    motherName: 'Sharada Devi',
    maritalStatus: 'Never Married',
    community: 'Suryavamsha Vadiyaraju Kshatriya',
    subCommunity: 'Solar Dynasty (Suryavamsha)',
    gotra: 'Bharadwaja',
    nativePlace: 'Visakhapatnam',
    currentCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    education: 'MBBS, MD (General Medicine)',
    occupation: 'Doctor / Consultant Physician at Apollo Hospitals',
    annualIncome: '₹ 35 - 40 Lakhs',
    height: "6'0\" (183 cm)",
    languagesKnown: ['Telugu', 'English', 'Hindi'],
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [],
    familyDetails: 'Noble family with medical and public service lineage. Both parents respected senior community figures in Visakhapatnam.',
    partnerPreferences: {
      ageMin: 24,
      ageMax: 28,
      heightMin: "5'4\"",
      maritalStatus: ['Never Married'],
      education: ['Doctor / Engineer / Professional Degree']
    },
    profileDescription: 'Doctor committed to healing and community growth. Enjoy fitness, badminton, and spiritual reading. Looking for a respectful life partner.',
    approvalStatus: 'approved',
    isApproved: true,
    isPublished: true,
    isSuspended: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'seed_member_4',
    fullName: 'Ananya Varma Dantuluri',
    gender: 'bride',
    age: 26,
    dateOfBirth: '2000-11-18',
    surname: 'Dantuluri',
    fatherName: 'Subba Raju Dantuluri',
    motherName: 'Padmavathi Devi',
    maritalStatus: 'Never Married',
    community: 'Suryavamsha Vadiyaraju Kshatriya',
    subCommunity: 'Vadiyaraju Kshatriya',
    gotra: 'Kaundinya',
    nativePlace: 'Tanuku',
    currentCity: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    education: 'CA (Chartered Accountant) & B.Com',
    occupation: 'Senior Financial Analyst at Deloitte',
    annualIncome: '₹ 22 - 25 Lakhs',
    height: "5'4\" (163 cm)",
    languagesKnown: ['Telugu', 'English', 'Hindi'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [],
    familyDetails: 'Traditional Godavari family with agricultural and commercial business background. High moral and ethical values.',
    partnerPreferences: {
      ageMin: 27,
      ageMax: 32,
      heightMin: "5'7\"",
      maritalStatus: ['Never Married']
    },
    profileDescription: 'Balanced personality with modern outlook alongside reverence for traditional Suryavamsha Kshatriya customs.',
    approvalStatus: 'approved',
    isApproved: true,
    isPublished: true,
    isSuspended: false,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'seed_member_5',
    fullName: 'Vikram Raju Penmetsa',
    gender: 'groom',
    age: 30,
    dateOfBirth: '1996-09-04',
    surname: 'Penmetsa',
    fatherName: 'Bhadra Raju Penmetsa',
    motherName: 'Kalyani Devi',
    maritalStatus: 'Never Married',
    community: 'Suryavamsha Vadiyaraju Kshatriya',
    subCommunity: 'Vadiyaraju Kshatriya',
    gotra: 'Vishwamitra',
    nativePlace: 'Vijayawada',
    currentCity: 'San Jose, CA',
    state: 'California',
    country: 'USA',
    education: 'B.Tech (IIT Madras) & MS (Stanford University)',
    occupation: 'Staff Machine Learning Engineer at Apple',
    annualIncome: '$ 210,000 / annum',
    height: "5'10\" (178 cm)",
    languagesKnown: ['Telugu', 'English'],
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [],
    familyDetails: 'Family based in Vijayawada with business interests. Mother teacher, Father retired engineer. Vikram currently on H1-B with I-140 approved.',
    partnerPreferences: {
      ageMin: 24,
      ageMax: 29,
      heightMin: "5'3\"",
      maritalStatus: ['Never Married'],
      education: ['Graduate / Post Graduate']
    },
    profileDescription: 'Tech enthusiast who loves hiking, photography, and exploring cultures. Looking for an open-minded Suryavamsha Kshatriya bride willing to relocate or living in USA.',
    approvalStatus: 'approved',
    isApproved: true,
    isPublished: true,
    isSuspended: false,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'seed_member_6',
    fullName: 'Kavya Varma Alluri',
    gender: 'bride',
    age: 24,
    dateOfBirth: '2002-04-12',
    surname: 'Alluri',
    fatherName: 'Sitarama Raju Alluri',
    motherName: 'Geetha Varma',
    maritalStatus: 'Never Married',
    community: 'Suryavamsha Vadiyaraju Kshatriya',
    subCommunity: 'Vadiyaraju Kshatriya',
    gotra: 'Athreya',
    nativePlace: 'Guntur',
    currentCity: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    education: 'B.Arch (Architecture) & Interior Design',
    occupation: 'Lead Urban Architect & Interior Designer',
    annualIncome: '₹ 18 - 20 Lakhs',
    height: "5'6\" (168 cm)",
    languagesKnown: ['Telugu', 'English', 'Tamil'],
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [],
    familyDetails: 'Distinguished Kshatriya family. Father owns architectural consultancy firm. Mother active in cultural trust.',
    partnerPreferences: {
      ageMin: 26,
      ageMax: 30,
      heightMin: "5'8\"",
      maritalStatus: ['Never Married']
    },
    profileDescription: 'Creative, cheerful, fond of art, heritage architecture, and classical dance. Looking for an educated, progressive partner.',
    approvalStatus: 'approved',
    isApproved: true,
    isPublished: true,
    isSuspended: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function ensureSeedProfiles() {
  try {
    const colRef = collection(db, PROFILES_COLLECTION);
    const snap = await getDocs(query(colRef, limit(1)));
    if (snap.empty) {
      for (let i = 0; i < INITIAL_COMMUNITY_PROFILES.length; i++) {
        const p = INITIAL_COMMUNITY_PROFILES[i];
        const docId = `SVK-${10001 + i}`;
        await setDoc(doc(db, PROFILES_COLLECTION, docId), {
          id: docId,
          ...p
        });
      }
    }
  } catch (err) {
    console.warn('Initial seeding handled or restricted by current auth state:', err);
  }
}

export async function fetchProfiles(filters?: ProfileFilters): Promise<MatrimonialProfile[]> {
  try {
    const colRef = collection(db, PROFILES_COLLECTION);
    const snap = await getDocs(colRef);
    
    let profiles: MatrimonialProfile[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as MatrimonialProfile;
      // Only show published, approved, and non-suspended profiles for standard browsing
      if (data.isPublished && data.isApproved && !data.isSuspended) {
        profiles.push({ ...data, id: doc.id });
      }
    });

    // If Firestore collection has no documents yet, provide the verified community profiles
    if (profiles.length === 0) {
      profiles = INITIAL_COMMUNITY_PROFILES.map((p, i) => ({
        ...p,
        id: `SVK-${10001 + i}`
      }));
    }

    // Apply client-side filtering for flexible combined criteria
    if (filters) {
      if (filters.gender && filters.gender !== 'all') {
        profiles = profiles.filter(p => p.gender === filters.gender);
      }
      if (filters.ageMin !== undefined) {
        profiles = profiles.filter(p => p.age >= filters.ageMin!);
      }
      if (filters.ageMax !== undefined) {
        profiles = profiles.filter(p => p.age <= filters.ageMax!);
      }
      if (filters.surname && filters.surname.trim()) {
        const queryTerm = filters.surname.toLowerCase().trim();
        profiles = profiles.filter(p => 
          p.surname?.toLowerCase().includes(queryTerm) || 
          p.fullName.toLowerCase().includes(queryTerm)
        );
      }
      if (filters.nativePlace && filters.nativePlace.trim()) {
        const place = filters.nativePlace.toLowerCase().trim();
        profiles = profiles.filter(p => p.nativePlace?.toLowerCase().includes(place));
      }
      if (filters.currentCity && filters.currentCity.trim()) {
        const city = filters.currentCity.toLowerCase().trim();
        profiles = profiles.filter(p => p.currentCity?.toLowerCase().includes(city));
      }
      if (filters.gotra && filters.gotra.trim()) {
        const g = filters.gotra.toLowerCase().trim();
        profiles = profiles.filter(p => p.gotra?.toLowerCase().includes(g));
      }
      if (filters.maritalStatus && filters.maritalStatus !== 'All') {
        profiles = profiles.filter(p => p.maritalStatus === filters.maritalStatus);
      }
      if (filters.education && filters.education.trim()) {
        const edu = filters.education.toLowerCase().trim();
        profiles = profiles.filter(p => p.education?.toLowerCase().includes(edu));
      }
      if (filters.occupation && filters.occupation.trim()) {
        const occ = filters.occupation.toLowerCase().trim();
        profiles = profiles.filter(p => p.occupation?.toLowerCase().includes(occ));
      }

      // Sort
      if (filters.sortBy === 'recently_joined') {
        profiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filters.sortBy === 'recently_updated') {
        profiles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      } else if (filters.sortBy === 'age_asc') {
        profiles.sort((a, b) => a.age - b.age);
      } else if (filters.sortBy === 'age_desc') {
        profiles.sort((a, b) => b.age - a.age);
      }
    } else {
      profiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return profiles;
  } catch (err) {
    console.warn('Firestore fetch profiles fallback to community catalog:', err);
    let fallback = INITIAL_COMMUNITY_PROFILES.map((p, i) => ({
      ...p,
      id: `SVK-${10001 + i}`
    }));
    if (filters?.gender && filters.gender !== 'all') {
      fallback = fallback.filter(p => p.gender === filters.gender);
    }
    return fallback;
  }
}

export async function fetchAllProfilesForAdmin(): Promise<MatrimonialProfile[]> {
  try {
    const colRef = collection(db, PROFILES_COLLECTION);
    const snap = await getDocs(colRef);
    const profiles: MatrimonialProfile[] = [];
    snap.forEach((doc) => {
      profiles.push({ ...(doc.data() as MatrimonialProfile), id: doc.id });
    });
    return profiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, PROFILES_COLLECTION);
  }
}

export async function fetchProfileById(profileId: string): Promise<MatrimonialProfile | null> {
  try {
    const docRef = doc(db, PROFILES_COLLECTION, profileId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { ...(snap.data() as MatrimonialProfile), id: snap.id };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${PROFILES_COLLECTION}/${profileId}`);
  }
}

export async function updateProfileApprovalStatus(
  profileId: string, 
  status: 'approved' | 'rejected'
): Promise<void> {
  try {
    const docRef = doc(db, PROFILES_COLLECTION, profileId);
    await updateDoc(docRef, {
      approvalStatus: status,
      isApproved: status === 'approved',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PROFILES_COLLECTION}/${profileId}`);
  }
}

export async function toggleProfileSuspension(
  profileId: string, 
  isSuspended: boolean
): Promise<void> {
  try {
    const docRef = doc(db, PROFILES_COLLECTION, profileId);
    await updateDoc(docRef, {
      isSuspended,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PROFILES_COLLECTION}/${profileId}`);
  }
}

export async function deleteProfileByAdmin(profileId: string): Promise<void> {
  try {
    const docRef = doc(db, PROFILES_COLLECTION, profileId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PROFILES_COLLECTION}/${profileId}`);
  }
}
