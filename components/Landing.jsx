import React from "react"

export default function Landing({ createNewNote }) {
    return (
        <div className="no--notes">
            <h1>You have no notes</h1>
            <button className="create--first--note" onClick={createNewNote}>
                Create one now
            </button>
        </div>
    )
}