import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ConsultationRequest, ConsultationStatus, Consultant } from '../types/matrimony';
import { createNotification } from './notificationService';

const COLLECTION = 'consultationRequests';

export const MARRIAGE_CONSULTANTS: Consultant[] = [
  {
    id: 'consultant-1',
    name: 'Sri Varmaji (K. S. Raju)',
    title: 'Senior Community Matrimonial Counselor & Genealogist',
    experience: '22+ Years in Kshatriya Matrimonial Matchmaking',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    phone: '+91 98490 23456',
    whatsapp: '919849023456',
    bio: 'Dedicated counselor assisting Suryavamsha Vadiyaraju Kshatriya families across Andhra Pradesh, Telangana, Karnataka, and NRI circles in finding compatible alliances with family harmony.',
    specialties: ['Gotra & Vamsha Lineage Verification', 'Horoscope & Kundali Consultation', 'NRI Kshatriya Alliances', 'Confidential Family Mediation'],
    availableTimings: 'Mon - Sat: 10:00 AM - 7:00 PM IST'
  },
  {
    id: 'consultant-2',
    name: 'Smt. Vijaya Lakshmi Vadiyaraju',
    title: 'Senior Family Relations & Alliance Advisor',
    experience: '16+ Years in Community Social Welfare & Matrimony',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    phone: '+91 94401 78910',
    whatsapp: '919440178910',
    bio: 'Expert in bridging traditional values with aspirations of today\'s young doctors, engineers, and professionals. Provides personal guidance to parents and candidates.',
    specialties: ['Professional & Higher Education Alliances', 'Inter-city Coordination', 'Pre-marital Guidance'],
    availableTimings: 'Tue - Sun: 11:00 AM - 6:00 PM IST'
  }
];

export async function submitConsultationRequest(params: {
  userId: string;
  memberName: string;
  memberPhone: string;
  memberEmail?: string;
  preferredDate: string;
  preferredTime: string;
  requirements: string;
  consultantName?: string;
}): Promise<string> {
  try {
    const colRef = collection(db, COLLECTION);
    const now = new Date().toISOString();
    const docRef = await addDoc(colRef, {
      userId: params.userId,
      memberName: params.memberName,
      memberPhone: params.memberPhone,
      memberEmail: params.memberEmail || '',
      preferredDate: params.preferredDate,
      preferredTime: params.preferredTime,
      requirements: params.requirements,
      status: 'pending',
      notes: '',
      consultantName: params.consultantName || 'Sri Varmaji (K. S. Raju)',
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, COLLECTION);
  }
}

export async function fetchUserConsultationRequests(userId: string): Promise<ConsultationRequest[]> {
  try {
    const colRef = collection(db, COLLECTION);
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    const list: ConsultationRequest[] = [];
    snap.forEach(doc => {
      list.push({ ...(doc.data() as ConsultationRequest), id: doc.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION);
  }
}

export async function fetchAllConsultationRequests(): Promise<ConsultationRequest[]> {
  try {
    const colRef = collection(db, COLLECTION);
    const snap = await getDocs(colRef);
    const list: ConsultationRequest[] = [];
    snap.forEach(doc => {
      list.push({ ...(doc.data() as ConsultationRequest), id: doc.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION);
  }
}

export async function updateConsultationStatus(
  requestId: string,
  status: ConsultationStatus,
  notes?: string,
  userId?: string
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, requestId);
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }
    await updateDoc(docRef, updatePayload);

    // Notify user of status update
    if (userId) {
      const statusLabels: Record<ConsultationStatus, string> = {
        pending: 'Pending Review',
        accepted: 'Accepted & Scheduled',
        contacted: 'Contacted by Counselor',
        completed: 'Consultation Completed'
      };
      await createNotification({
        recipientId: userId,
        type: 'consultation_update',
        title: 'Marriage Consultation Status Update',
        message: `Your consultation request is now marked as "${statusLabels[status]}".`,
      }).catch(err => console.warn('Notification fail:', err));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION}/${requestId}`);
  }
}
