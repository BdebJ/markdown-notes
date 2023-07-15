import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Firestore } from '@google-cloud/firestore/build/src/index.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

// Initialize Firestore
const firestore = new Firestore({
    projectId: process.env.FIREBASE_PROJECT_ID,
    keyFilename: process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH,
});

const PORT = process.env.PORT;
const FIRESTORE_COLLECTION = 'notes';

// Fetch Notes - GET /notes
app.get('/notes', async (req, res) => {
    try {
        const snapshot = await firestore.collection(FIRESTORE_COLLECTION).get();
        const notesArr = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        res.json(notesArr);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Create New Note - POST /notes
app.post('/notes', async (req, res) => {
    try {
        const newNote = {
            body: '#Type your markdown text here',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const docRef = await firestore.collection(FIRESTORE_COLLECTION).add(newNote);
        res.json({ id: docRef.id });
    } catch (error) {
        console.error('Error creating new note:', error);
        res.status(500).json({ error: 'Failed to create new note' });
    }
});

// //Testing
// app.post('/notes', async (req, res) => {
//     try {
//         const newNote = {
//             body: '',
//             createdAt: Date.now(),
//             updatedAt: Date.now(),
//         };
//         const docRef = await firestore.collection(FIRESTORE_COLLECTION).add(newNote);

//         await docRef.update({ body: docRef.id });

//         const updatedNote = await docRef.get();

//         res.json({ id: updatedNote.id });
//     } catch (error) {
//         console.error('Error creating new note:', error);
//         res.status(500).json({ error: 'Failed to create new note' });
//     }
// });

// Update Note Text - PUT /notes/:noteId
app.put('/notes/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const { text } = req.body;
        const docRef = firestore.collection(FIRESTORE_COLLECTION).doc(noteId);
        await docRef.update({ body: text, updatedAt: Date.now() });
        res.json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error('Error updating note text:', error);
        res.status(500).json({ error: 'Failed to update note text' });
    }
});

// Delete Note By ID - DELETE /notes/:noteId
app.delete('/notes/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const docRef = firestore.collection(FIRESTORE_COLLECTION).doc(noteId);
        await docRef.delete();
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
