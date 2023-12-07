const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function registerUser(username, password) {
    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Registration failed: ${errorData.error}`);
        }

        const responseData = await response.json();
        console.log('message:', responseData.message);
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

export async function loginUser(username, password) {
    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Login failed: ${errorData.error}`);
        }

        // Successful login
        const responseData = await response.json();
        const accessToken = responseData.accessToken;
        console.log('Login successful. Access Token:', accessToken);

        localStorage.setItem('accessToken', accessToken);
    } catch (error) {
        console.error('Error logging in:', error.message);
        throw error; // Re-throw the error for the caller to handle if needed
    }
}

//For use later to persist user isntead of relogin
export async function validateToken(token) {
    try {
        const response = await fetch(`${BACKEND_URL}/validate-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Login failed: ${errorData.error}`);
        }

        const responseData = await response.json();
        console.log('Valodation successful:', responseData);
    } catch (error) {
        console.error('Error logging in:', error.message);
    }
}

export async function fetchNotes(setNotes) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
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
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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

export async function updateNoteText(noteId, updatedText) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${noteId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ updatedText }),
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
            headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
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
