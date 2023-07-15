import { fetchNotes, createNewNote, updateNoteText, deleteNoteById } from '../util/backendUtils';
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
        fetchNotes(setNotes);
        //to do add mechanism to handle notes retrieval failure
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
        //to do add mechanism to handle updation failure
    }, [currentNote, currentNoteId, tempNoteText]);

    const createNote = async () => {
        const newNoteId = await createNewNote();
        fetchNotes(setNotes);
        setCurrentNoteId(newNoteId);
        //to do add mechanism to handle creation failure
    };

    const deleteNote = async (noteId) => {
        setNotes((prevNotes) => {
            const filteredNotes = prevNotes.filter((note) => note.id !== noteId);
            const firstNoteId =
                currentNoteId === noteId ? filteredNotes[0]?.id || '' : currentNoteId;
            setCurrentNoteId(firstNoteId);
            return filteredNotes;
        });

        await deleteNoteById(noteId);
        // to do: add mechanism to handle deletion failure
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
