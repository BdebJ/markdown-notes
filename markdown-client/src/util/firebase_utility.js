import { notesCollection, db } from '../config/firebase_config';
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';

const FIRESTORE_COLLECTION = import.meta.env.VITE_FIRESTORE_COLLECTION;

export async function fetchNotes(setNotes) {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
        const notesArr = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setNotes(notesArr);
    });
    return unsubscribe;
}

export async function createNewNote() {
    const newNote = {
        body: "# Type your markdown note's title here",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    return newNoteRef.id;
}

export async function updateNoteText(noteId, text) {
    const docRef = doc(db, FIRESTORE_COLLECTION, noteId);
    await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true });
}

export async function deleteNoteById(noteId) {
    const docRef = doc(db, FIRESTORE_COLLECTION, noteId);
    await deleteDoc(docRef);
}
