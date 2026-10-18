import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ShortlistedProfile, MatrimonialProfile } from '../types/matrimony';

const COLLECTION = 'shortlistedProfiles';

export async function toggleShortlist(userId: string, profile: MatrimonialProfile): Promise<boolean> {
  const shortlistId = `${userId}_${profile.id}`;
  const docRef = doc(db, COLLECTION, shortlistId);

  try {
    const colRef = collection(db, COLLECTION);
    const q = query(colRef, where('userId', '==', userId), where('profileId', '==', profile.id));
    const snap = await getDocs(q);

    if (!snap.empty) {
      await deleteDoc(docRef);
      return false; // Removed from shortlist
    } else {
      const payload: ShortlistedProfile = {
        id: shortlistId,
        userId,
        profileId: profile.id,
        profileName: profile.fullName,
        profileGender: profile.gender,
        profilePhotoUrl: profile.photoUrl,
        profileCity: profile.currentCity,
        profileAge: profile.age,
        profileGotra: profile.gotra,
        profileEducation: profile.education,
        profileOccupation: profile.occupation,
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, payload);
      return true; // Added to shortlist
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, COLLECTION);
  }
}

export async function fetchUserShortlist(userId: string): Promise<ShortlistedProfile[]> {
  try {
    const colRef = collection(db, COLLECTION);
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    const list: ShortlistedProfile[] = [];
    snap.forEach(doc => {
      list.push({ ...(doc.data() as ShortlistedProfile), id: doc.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION);
  }
}
