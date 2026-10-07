```mermaid
sequenceDiagram
    Note right of Browser: User creates a new note and presses 'Save'
    
    Browser->>Server: POST /new_note_spa
    activate Server
    Server-->>Browser: 201 Created
    deactivate Server

    Note right of Browser: JavaScript adds the note to the list and rerenders the notes
```