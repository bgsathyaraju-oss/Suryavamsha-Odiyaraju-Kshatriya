import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { AppNotification, NotificationType } from '../types/matrimony';

const COLLECTION = 'notifications';

export async function createNotification(params: {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedProfileId?: string;
}): Promise<string> {
  try {
    const colRef = collection(db, COLLECTION);
    const newDoc = await addDoc(colRef, {
      recipientId: params.recipientId,
      type: params.type,
      title: params.title,
      message: params.message,
      relatedProfileId: params.relatedProfileId || '',
      isRead: false,
      createdAt: new Date().toISOString()
    });
    return newDoc.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, COLLECTION);
  }
}

export async function fetchNotifications(recipientId: string): Promise<AppNotification[]> {
  try {
    const colRef = collection(db, COLLECTION);
    const q = query(colRef, where('recipientId', '==', recipientId));
    const snap = await getDocs(q);
    const list: AppNotification[] = [];
    snap.forEach(doc => {
      list.push({ ...(doc.data() as AppNotification), id: doc.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION);
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { isRead: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION}/${id}`);
  }
}
