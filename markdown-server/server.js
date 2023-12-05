import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8888;
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const notesdbname = process.env.MONGO_DATABASE;
const notescollname = process.env.MONGO_NOTES_COLLECTION;

// Initialize Mongo
const uri = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function initializeDBConnection() {
    try {
        await client.connect();
        console.log(`Connected to database at ${new Date().toUTCString()}`);
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

initializeDBConnection();

const database = client.db(notesdbname);
const notesCollection = database.collection(notescollname);

// Fetch Notes - GET /notes
app.get('/notes', async (req, res) => {
    try {
        const notesCollectionArr = await notesCollection.find({}).toArray();
        const notesArr = notesCollectionArr.map((note) => {
            const { _id, ...rest } = note;
            return {
                id: _id,
                ...rest,
            };
        });
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
        const insertRes = await notesCollection.insertOne(newNote);
        res.json({ id: insertRes.insertedId });
    } catch (error) {
        console.error('Error creating new note:', error);
        res.status(500).json({ error: 'Failed to create new note' });
    }
});

// Update Note Text - PUT /notes/:noteId
app.put('/notes/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const { updatedText } = req.body;

        if (!ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: 'Invalid noteId format' });
        }

        const query = { _id: new ObjectId(noteId) };
        const updateDoc = {
            $set: {
                body: updatedText,
                updatedAt: Date.now(),
            },
        };
        const updateResult = await notesCollection.updateOne(query, updateDoc);

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

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

        if (!ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: 'Invalid noteId format' });
        }

        const deleteQuery = { _id: new ObjectId(noteId) };
        const deleteResult = await notesCollection.deleteOne(deleteQuery);

        if (deleteResult.matchedCount === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
