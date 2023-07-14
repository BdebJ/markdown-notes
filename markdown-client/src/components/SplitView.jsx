import { fetchNotes, createNewNote, updateNoteText, deleteNoteById } from '../util/firebase_utility';
import { useEffect, useState } from 'react';

import Split from 'react-split';
import Sidebar from './Sidebar';
import Editor from './Editor';
import NoNotes from './NoNotes';

export default function SplitView() {
    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState('');
    const [tempNoteText, setTempNoteText] = useState('');

    const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0];
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

    useEffect(() => {
        const unsubscribe = fetchNotes(setNotes);
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!currentNoteId && notes.length > 0) {
            setCurrentNoteId(notes[0].id);
        }
    }, [currentNoteId, notes]);

    useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body);
        }
    }, [currentNote]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentNote && tempNoteText !== currentNote.body) {
                updateNoteText(currentNoteId, tempNoteText);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [currentNote, currentNoteId, tempNoteText]);

    const createNote = async () => {
        const newNoteId = await createNewNote();
        setCurrentNoteId(newNoteId);
    };

    const deleteNote = async (noteId) => {
        await deleteNoteById(noteId);
    };

    return notes.length > 0 ? (
        <>
            <Split sizes={[20, 80]} direction="horizontal" className="split">
                <Sidebar
                    notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNote}
                    deleteNote={deleteNote}
                />
                <Editor tempNoteText={tempNoteText} setTempNoteText={setTempNoteText} />
            </Split>
        </>
    ) : (
        <>
            <NoNotes createNote={createNote} />
        </>
    );
}
