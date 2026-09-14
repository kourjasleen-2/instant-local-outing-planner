import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  WhereFilterOp,
  QueryConstraint,
  DocumentData,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Firestore service for managing data
 */

// Generic CRUD operations

/**
 * Get a document by ID
 */
export const getDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

/**
 * Get all documents from a collection
 */
export const getDocuments = async <T = DocumentData>(
  collectionName: string
): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
};

/**
 * Query documents with filters
 */
export const queryDocuments = async <T = DocumentData>(
  collectionName: string,
  filters: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>,
  orderByField?: string,
  limitCount?: number
): Promise<T[]> => {
  const constraints: QueryConstraint[] = filters.map((filter) =>
    where(filter.field, filter.operator, filter.value)
  );

  if (orderByField) {
    constraints.push(orderBy(orderByField));
  }

  if (limitCount) {
    constraints.push(limit(limitCount));
  }

  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
};

/**
 * Add a new document
 */
export const addDocument = async <T = DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Update a document
 */
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// Glimmr-specific functions

/**
 * Save a place to Firestore
 */
export const savePlace = async (placeData: any) => {
  return await addDocument('places', placeData);
};

/**
 * Get all places
 */
export const getPlaces = async () => {
  return await getDocuments('places');
};

/**
 * Get places by area
 */
export const getPlacesByArea = async (area: string) => {
  return await queryDocuments('places', [
    { field: 'area', operator: '==', value: area },
  ]);
};

/**
 * Save an outing plan
 */
export const saveOutingPlan = async (planData: any) => {
  return await addDocument('outings', planData);
};

/**
 * Get user's outing history
 */
export const getUserOutings = async (userId: string) => {
  return await queryDocuments(
    'outings',
    [{ field: 'userId', operator: '==', value: userId }],
    'createdAt'
  );
};

/**
 * Update outing status
 */
export const updateOutingStatus = async (
  outingId: string,
  status: string
) => {
  await updateDocument('outings', outingId, { status });
};

// Utility to convert Firestore Timestamp to Date
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};
