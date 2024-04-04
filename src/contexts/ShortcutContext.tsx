// contexts/ShortcutContext.tsx
// This context is responsible for handling shortcuts:
// - getting shortcut from query

import React, { useContext, createContext, ReactNode } from 'react';
import { useStorageContext } from './';
import { Shortcut, MultisearchActionObject} from '@/types';


// interface ShortcutProviderProps {
//     children: ReactNode;
//     multisearchActionObjects: MultisearchActionObject[];
//     addMultisearchActionObject: (shortcut: MultisearchActionObject) => void;
//     removeMultisearchActionObject: (shortcutName: string) => void;
//     getShortcutFromQuery: (query: string) => Shortcut | null;
// }

interface ShortcutContextType {
    multisearchActionObjects: MultisearchActionObject[];
    addMultisearchActionObject: (action: MultisearchActionObject) => void;
    removeMultisearchActionObject: (actionName: string) => void;
    getShortcutFromQuery: (query: string) => Shortcut | null;
}

const defaultShortcutContext: ShortcutContextType = {
    multisearchActionObjects: [],
    addMultisearchActionObject: () => { },
    removeMultisearchActionObject: () => { },
    getShortcutFromQuery: () => null
};

const ShortcutContext = createContext<ShortcutContextType>(defaultShortcutContext);

export const useShortcutContext = () => useContext(ShortcutContext);

export function getShortcutCandidate(query: string) {
    /**
     * Regular expression to find a candidate shortcut in a query string.
     * A candidate is identified by a single forward slash followed by non-whitespace characters.
     * The candidate must either:
     * - start the string (and have whitespace after),
     * - end the string (and have whitespace before),
     * - or be surrounded by whitespace.
     * This regex disqualifies any candidates immediately preceded by multiple forward slashes.
     */
    const regex = /(?:^|\s)\/(\S+)(?=\s|$)/g;
    const disqualifiedRegex = /\/{2,}\S+/; // Regex to check for multiple forward slashes before a string
    const disqualifiedMatches = query.match(disqualifiedRegex);
    const matches = Array.from(query.matchAll(regex));
    if (matches.length > 0 && disqualifiedMatches === null) {
        const shortcutCandidate = matches[0][1];
        return shortcutCandidate;
    }
    return null;
}

export const ShortcutProvider = ({ children }: { children: ReactNode }) => {
    const { multisearchActionObjects, addMultisearchActionObject, removeMultisearchActionObject } = useStorageContext();

    // getting shortcut from query
    
    const getShortcut = ({ type, shortcutCandidate, completed }: { type: 'multisearch_number' | 'multisearch_object', shortcutCandidate: string, completed: boolean }) => {
        if (type === 'multisearch_number') {
            return { type, name: shortcutCandidate, completed, action: Number(shortcutCandidate) } as Shortcut;
        }
        if (type === 'multisearch_object') {
            const shortcut = multisearchActionObjects.find(shortcut => shortcut.name === shortcutCandidate);
            if (!shortcut) return null;
            return { type, name: shortcut.name, completed, action: shortcut } as Shortcut;
        }
        return null;
    }
    
    const getShortcutFromQuery = (query: string) => {
        const shortcutCandidateName = getShortcutCandidate(query);  
        if (!shortcutCandidateName) {
            return null;
        }
        if (!isNaN(parseFloat(shortcutCandidateName))) {
            const shortcutCandidateNumber = parseFloat(shortcutCandidateName).toString();
            return getShortcut({type: 'multisearch_number', shortcutCandidate: shortcutCandidateNumber, completed: false});
        }
        if (shortcutCandidateName) {
            return getShortcut({type: 'multisearch_object', shortcutCandidate: shortcutCandidateName, completed: false});
        }
        return null;
    }


    return (
        <ShortcutContext.Provider value={{
            getShortcutFromQuery,
            multisearchActionObjects,
            addMultisearchActionObject,
            removeMultisearchActionObject
        }}>
            {children}
        </ShortcutContext.Provider>
    );
};