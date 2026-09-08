// src/contexts/EditorContext.jsx
import { createContext, useContext, useState } from 'react';

const EditorContext = createContext({});

export const useEditor = () => useContext(EditorContext);

export function EditorProvider({ children }) {
    const [currentVideo, setCurrentVideo] = useState(null);

    return (
        <EditorContext.Provider value={{ currentVideo, setCurrentVideo }}>
            {children}
        </EditorContext.Provider>
    );
}