'use client';
import { doc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

/**
 * Updates a document in a Firestore collection.
 *
 * @param {string} collectionPath - The path to the collection.
 * @param {string} docId - The ID of the document to update.
 * @param {object} data - An object containing the fields and values to update.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export const updateDocument = (collectionPath: string, docId: string, data: object): Promise<void> => {
  const docRef = doc(firestore, collectionPath, docId);
  return updateDoc(docRef, data);
};
