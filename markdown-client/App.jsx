import { useEffect, useState } from "react"
import { notesCollection, db } from "./config/firebase"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"

import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import NoNotes from "./components/NoNotes"

export default function App() {
    const FIRESTORE_COLLECTION = import.meta.env.VITE_FIRESTORE_COLLECTION

    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState("")
    const [tempNoteText, setTempNoteText] = useState("")

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentNote) {
                if (tempNoteText !== currentNote.body) {
                    updateNote(tempNoteText)
                }
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, FIRESTORE_COLLECTION, currentNoteId)
        await setDoc(
            docRef,
            { body: text, updatedAt: Date.now() },
            { merge: true }
        )
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, FIRESTORE_COLLECTION, noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[20, 80]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
                    </Split>
                    :
                    <NoNotes createNewNote={createNewNote} />
            }
        </main>
    )
}
