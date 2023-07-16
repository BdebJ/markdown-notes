export default function NoNotes({ createNote }) {
    return (
        <>
            <div className="no--notes">
                <h1>You have no notes</h1>
                <button className="create--first--note" onClick={createNote}>
                    Create one now
                </button>
            </div>
        </>
    );
}
