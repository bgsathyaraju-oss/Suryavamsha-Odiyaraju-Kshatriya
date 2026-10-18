import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ReportedProfile } from '../types/matrimony';

const COLLECTION = 'reportedProfiles';

export async function submitReport(params: {
  reporterId: string;
  reportedProfileId: string;
  reportedProfileName?: string;
  reason: string;
  details: string;
}): Promise<string> {
  try {
    const colRef = collection(db, COLLECTION);
    const newDoc = await addDoc(colRef, {
      reporterId: params.reporterId,
      reportedProfileId: params.reportedProfileId,
      reportedProfileName: params.reportedProfileName || '',
      reason: params.reason,
      details: params.details,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    return newDoc.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, COLLECTION);
  }
}

export async function fetchAllReports(): Promise<ReportedProfile[]> {
  try {
    const colRef = collection(db, COLLECTION);
    const snap = await getDocs(colRef);
    const list: ReportedProfile[] = [];
    snap.forEach(doc => {
      list.push({ ...(doc.data() as ReportedProfile), id: doc.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION);
  }
}

export async function updateReportStatus(
  reportId: string, 
  status: 'pending' | 'investigated' | 'dismissed' | 'actioned'
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, reportId);
    await updateDoc(docRef, { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION}/${reportId}`);
  }
}
