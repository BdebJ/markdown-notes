import jwt from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8888;
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const dbname = process.env.MONGO_DATABASE;
const notescollname = process.env.MONGO_NOTES_COLLECTION;
const usercollname = process.env.MONGO_USER_COLLECTION;
const secretaccesskey = process.env.SECRET_ACCESS_TOKEN;

// Initialize Mongo
const uri = `mongodb://${username}:${password}@${host}`;
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

const database = client.db(dbname);
const notesCollection = database.collection(notescollname);
const userCollection = database.collection(usercollname);

// Auth Helper Functions
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ error: 'User not authorized' });

    jwt.verify(token, secretaccesskey, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token no longer valid' });
        req.user = user;
        next();
    });
}

async function findUserByUsername(username) {
    return await userCollection.findOne({ username });
}

// User Registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for duplicate username
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        await userCollection.insertOne(newUser);

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

//User Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await findUserByUsername(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const accessToken = jwt.sign(
            { userId: user._id, username: user.username },
            secretaccesskey,
            { expiresIn: '4h' }
        );
        res.json({ accessToken });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

// Fetch Notes - GET /notes
app.get('/notes', authenticateToken, async (req, res) => {
    try {
        const notesCollectionArr = await notesCollection
            .find({ ownerId: req.user.userId })
            .toArray();
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
app.post('/notes', authenticateToken, async (req, res) => {
    try {
        const newNote = {
            body: '#Type your markdown text here',
            ownerId: req.user.userId,
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

// Update Note Text - POST /notes/:noteId
app.post('/notes/:noteId', authenticateToken, async (req, res) => {
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
app.delete('/notes/:noteId', authenticateToken, async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
