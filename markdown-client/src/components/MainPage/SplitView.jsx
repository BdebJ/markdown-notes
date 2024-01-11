import Split from 'react-split';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    fetchNotes,
    createNewNote,
    updateNoteText,
    deleteNoteById,
    logoutUser,
} from '../../util/backendUtils';
import Sidebar from '../Sidebar/Sidebar';
import Editor from '../Editor/Editor';
import { StyledButton } from '../Auth/AuthComponents';
import './SplitView.css';

export default function SplitView() {
    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState('');
    const [tempNoteText, setTempNoteText] = useState('');

    const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0];
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

    useEffect(() => {
        fetchNotes()
            .then((notesArr) => {
                setNotes(notesArr);
            })
            .catch((rej) => {
                toast.error(`Error: ${rej.error}`);
            });
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
        let updateErrorFlag = false;
        const timeoutId = setTimeout(() => {
            if (currentNote && tempNoteText !== currentNote.body) {
                setNotes((prevNotes) => {
                    return prevNotes.map((note) => {
                        if (note.id === currentNoteId) {
                            return { ...note, body: tempNoteText, updatedAt: Date.now() };
                        }
                        return note;
                    });
                });
                updateNoteText(currentNoteId, tempNoteText).catch((rej) => {
                    console.log(updateErrorFlag);
                    if (!updateErrorFlag) {
                        updateErrorFlag = true;
                        console.log(updateErrorFlag);
                        toast.error(`Error: ${rej.error}`);
                        setTimeout(() => {
                            updateErrorFlag = false;
                        }, 5000);
                    }
                });
            }
        }, 250);
        return () => clearTimeout(timeoutId);
    }, [currentNote, currentNoteId, tempNoteText]);

    const createNote = async () => {
        createNewNote()
            .then((newNoteId) => {
                setCurrentNoteId(newNoteId);
                fetchNotes()
                    .then((notesArr) => {
                        setNotes(notesArr);
                    })
                    .catch((rej) => {
                        toast.error(`Error: ${rej.error}`);
                    });
            })
            .catch((rej) => {
                toast.error(`Error: ${rej.error}`);
            });
    };

    const deleteNote = async (noteId) => {
        deleteNoteById(noteId)
            .then(() => {
                setNotes((prevNotes) => {
                    const filteredNotes = prevNotes.filter((note) => note.id !== noteId);
                    const firstNoteId =
                        currentNoteId === noteId ? filteredNotes[0]?.id || '' : currentNoteId;
                    setCurrentNoteId(firstNoteId);
                    return filteredNotes;
                });
            })
            .catch((rej) => {
                toast.error(`Error: ${rej.error}`);
            });
    };

    return notes.length > 0 ? (
        <>
            <ToastContainer />
            <StyledButton text="Logout" style="elegant" id="logout--btn" onClick={logoutUser} />
            <Split sizes={[15, 85]} direction="horizontal" className="split">
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
            <ToastContainer />
            <StyledButton text="Logout" style="elegant" id="logout--btn" onClick={logoutUser} />
            <div className="no--notes">
                <h1>You have no notes</h1>
                <button className="create--first--note" onClick={createNote}>
                    Create one now
                </button>
            </div>
        </>
    );
}
