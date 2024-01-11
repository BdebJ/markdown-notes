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
            const error = await response.json();
            throw error;
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw error;
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
            const error = await response.json();
            throw error;
        }
        const responseData = await response.json();
        const accessToken = responseData.accessToken;

        localStorage.setItem('accessToken', accessToken);
    } catch (error) {
        throw error;
    }
}

export async function fetchNotes() {
    try {
        const response = await fetch(`${BACKEND_URL}/notes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            if (response.status == 403) {
                window.location.href = '/login';
                return;
            }
            const error = await response.json();
            throw error;
        }
        const notesArr = await response.json();
        return notesArr;
    } catch (error) {
        throw error;
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
            const error = await response.json();
            throw error;
        }
        const data = await response.json();
        return data.id;
    } catch (error) {
        throw error;
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
            const error = await response.json();
            throw error;
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        throw error;
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
            const error = await response.json();
            throw error;
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        throw error;
    }
}

export async function logoutUser() {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
}
