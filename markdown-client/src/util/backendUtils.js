const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchNotes(setNotes) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes`);
        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }
        const notesArr = await response.json();
        setNotes(notesArr);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

export async function createNewNote() {
    try {
        const response = await fetch(`${BACKEND_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to create new note');
        }

        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error creating new note:', error);
        return null;
    }
}

export async function updateNoteText(noteId, text) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error('Failed to update note text');
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error updating note text:', error);
        return null;
    }
}

export async function deleteNoteById(noteId) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${noteId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete note');
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error deleting note:', error);
        return null;
    }
}
