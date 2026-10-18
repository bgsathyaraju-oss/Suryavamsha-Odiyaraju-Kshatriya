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
  addDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Interest, InterestStatus } from '../types/matrimony';
import { createNotification } from './notificationService';

const COLLECTION = 'interests';

export async function sendInterest(params: {
  senderId: string;
  senderProfileId: string;
  senderName: string;
  senderPhotoUrl: string;
  recipientId: string;
  recipientProfileId: string;
  message?: string;
}): Promise<string> {
  try {
    // Check if interest already sent between these two profiles
    const colRef = collection(db, COLLECTION);
    const q = query(
      colRef, 
      where('senderId', '==', params.senderId),
      where('recipientProfileId', '==', params.recipientProfileId)
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      const existingDoc = existing.docs[0];
      const data = existingDoc.data() as Interest;
      if (data.status !== 'withdrawn') {
        throw new Error('You have already expressed interest in this profile.');
      }
    }

    const interestId = `${params.senderId}_${params.recipientProfileId}`;
    const now = new Date().toISOString();

    const newInterest: Interest = {
      id: interestId,
      senderId: params.senderId,
      senderProfileId: params.senderProfileId,
      senderName: params.senderName,
      senderPhotoUrl: params.senderPhotoUrl,
      recipientId: params.recipientId,
      recipientProfileId: params.recipientProfileId,
      status: 'pending',
      message: params.message || 'Expresses sincere interest in connecting for matrimony.',
      createdAt: now,
      updatedAt: now
    };

    await setDoc(doc(db, COLLECTION, interestId), newInterest);

    // Send in-app notification to recipient
    if (params.recipientId) {
      await createNotification({
        recipientId: params.recipientId,
        type: 'interest_received',
        title: 'New Matrimonial Interest Received',
        message: `${params.senderName} (${params.senderProfileId}) has expressed interest in your profile.`,
        relatedProfileId: params.senderProfileId
      }).catch(err => console.warn('Could not dispatch notification:', err));
    }

    return interestId;
  } catch (err) {
    if (err instanceof Error && err.message.includes('already expressed interest')) {
      throw err;
    }
    handleFirestoreError(err, OperationType.WRITE, COLLECTION);
  }
}

export async function fetchSentInterests(senderId: string): Promise<Interest[]> {
  try {
    const colRef = collection(db, COLLECTION);
    const q = query(colRef, where('senderId', '==', senderId));
    const snap = await getDocs(q);
    const list: Interest[] = [];
    snap.forEach(doc => {
      list.push({ ...doc.data() as Interest, id: doc.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION);
  }
}

export async function fetchReceivedInterests(recipientId: string): Promise<Interest[]> {
  try {
    const colRef = collection(db, COLLECTION);
    const q = query(colRef, where('recipientId', '==', recipientId));
    const snap = await getDocs(q);
    const list: Interest[] = [];
    snap.forEach(doc => {
      list.push({ ...doc.data() as Interest, id: doc.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION);
  }
}

export async function updateInterestStatus(
  interest: Interest,
  status: InterestStatus,
  recipientName?: string
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, interest.id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });

    if (status === 'accepted' && interest.senderId) {
      await createNotification({
        recipientId: interest.senderId,
        type: 'interest_accepted',
        title: 'Interest Accepted! 🎉',
        message: `${recipientName || 'A member'} accepted your expression of interest. You can now request or view contact details.`,
        relatedProfileId: interest.recipientProfileId
      }).catch(err => console.warn('Notification error:', err));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION}/${interest.id}`);
  }
}
