import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { ProductItem, ColumnDefinition, RFQMetadata } from '../types';

export interface SavedProject {
  id: string;
  ownerId: string;
  ownerEmail?: string;
  projectName: string;
  rfqNumber: string;
  targetCurrency: string;
  exchangeRateUsdToCny: number;
  metadata: RFQMetadata;
  columns: ColumnDefinition[];
  products: ProductItem[];
  updatedAt: string;
}

const COLLECTION_NAME = 'projects';

export async function saveProjectToFirestore(
  userId: string,
  userEmail: string,
  projectData: {
    id: string;
    projectName: string;
    rfqNumber: string;
    metadata: RFQMetadata;
    columns: ColumnDefinition[];
    products: ProductItem[];
  }
): Promise<void> {
  const path = `${COLLECTION_NAME}/${projectData.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, projectData.id);
    const payload: SavedProject = {
      id: projectData.id,
      ownerId: userId,
      ownerEmail: userEmail,
      projectName: projectData.projectName,
      rfqNumber: projectData.rfqNumber,
      targetCurrency: projectData.metadata.targetCurrency || 'RMB (¥)',
      exchangeRateUsdToCny: projectData.metadata.exchangeRateUsdToCny || 7.25,
      metadata: projectData.metadata,
      columns: projectData.columns,
      products: projectData.products,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProjectsFromFirestore(userId: string): Promise<SavedProject[]> {
  const path = COLLECTION_NAME;
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('ownerId', '==', userId)
    );
    const snap = await getDocs(q);
    const list: SavedProject[] = [];
    snap.forEach((d) => {
      list.push(d.data() as SavedProject);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${projectId}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, projectId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
