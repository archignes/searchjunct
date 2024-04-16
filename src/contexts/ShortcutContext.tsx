// contexts/ShortcutContext.tsx
// This context is responsible for handling shortcuts:
// - getting shortcut from query

import React, { useContext, createContext, ReactNode, useMemo } from 'react';
import { useStorageContext } from './';
import { Shortcut, MultisearchActionObject, ShortcutType, ShortcutAction } from '@/types';
import { useSystemsContext } from './';

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
     * A candidate is identified by a single forward slash followed by non-whitespace characters,
     * or by a single forward slash at the end of the string.
     * The candidate must either:
     * - start the string (and have whitespace after),
     * - end the string (and have whitespace before or be the only character),
     * - or be surrounded by whitespace.
     * This regex disqualifies any candidates immediately preceded by multiple forward slashes.
     */
    const regex = /(?:^|\s)\/(\S*)(?=\s|$)/g;
    const disqualifiedRegex = /\/{2,}\S*/; // Regex to check for multiple forward slashes before a string
    const disqualifiedMatches = query.match(disqualifiedRegex);
    const matches = Array.from(query.matchAll(regex));
    if (matches.length > 0 && disqualifiedMatches === null) {
        const shortcutCandidate = matches[0][1];
        // Special case to allow a single '/' at the end of a string
        if (shortcutCandidate === '' && query.trim().endsWith('/')) {
            return '/';
        }
        return shortcutCandidate;
    }
    return null;
}

export const ShortcutProvider = ({ children }: { children: ReactNode }) => {
    const { multisearchActionObjects, addMultisearchActionObject, removeMultisearchActionObject } = useStorageContext();
    const { allSystems, resetSystemShortcutCandidates, addSystemShortcutCandidate } = useSystemsContext();

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
    
    const shortcutStarts = useMemo(() => {
        const shortcuts = multisearchActionObjects.map(shortcut => shortcut.name);
        const starts: string[] = [];
        shortcuts.forEach(shortcut => {
            for (let i = 1; i <= shortcut.length; i++) {
                starts.push(shortcut.substring(0, i));
            }
        });
        return starts;
    }, [multisearchActionObjects]);

    /**
     * Generates a list of system IDs starting with the given input.
     * This is used for autocomplete functionality by matching the input with system IDs.
     *
     * @param input The starting string to match system IDs against.
     * @returns A list of objects with system IDs that start with the input.
     */
    const getSystemShortcutsAutocomplete = (input: string): {id: string, type: 'system_completion'}[] => 
        allSystems
            .filter(system => system.id.startsWith(input))
            .map(system => ({id: system.id, type: 'system_completion'}));


    const getMultisearchShortcutsAutocomplete = (input: string): {name: string, type: 'multisearch_action_object_completion'}[] =>
        multisearchActionObjects
            .filter(shortcut => shortcut.name.startsWith(input))
            .map(shortcut => ({name: shortcut.name, type: 'multisearch_action_object_completion'}));


    const updateSystemShortcutCandidates = (possibleSystemCompletions: {id: string, type: 'system_completion'}[]) => {
        resetSystemShortcutCandidates();
        possibleSystemCompletions.forEach(system => {
            addSystemShortcutCandidate(system.id);
        });
    }
    /**
     * Retrieves the shortcut based on the query.
     * 
     * @param query The query string to match against.
     * @returns The shortcut based on the query (number, object, or system completions), or null if no shortcut is found.
     */
    const getShortcutFromQuery = (query: string) => {
        let shortcutType: ShortcutType;
        let action: ShortcutAction;

        const shortcutCandidateName = getShortcutCandidate(query);

        if (!shortcutCandidateName) {
            return null;
        }
        if (!isNaN(parseFloat(shortcutCandidateName))) {
            const shortcutCandidateNumber = parseFloat(shortcutCandidateName).toString();
            return getShortcut({ type: 'multisearch_number', shortcutCandidate: shortcutCandidateNumber, completed: false });
        }
        if (shortcutCandidateName) {
            const multisearchShortcut = getShortcut({ type: 'multisearch_object', shortcutCandidate: shortcutCandidateName, completed: false });
            if (multisearchShortcut) {
                return multisearchShortcut;
            } else if (shortcutStarts.includes(shortcutCandidateName)) {
                console.log("could be a multisearch object: ", shortcutCandidateName)
                shortcutType = 'completion_shortcut';
                const possibleMultisearchShortcuts = getMultisearchShortcutsAutocomplete(shortcutCandidateName);
                const possibleSystemShortcuts = getSystemShortcutsAutocomplete(shortcutCandidateName);
                if (possibleMultisearchShortcuts.length > 0) {
                    updateSystemShortcutCandidates(possibleSystemShortcuts);
                }
                action = { multisearch_completions: possibleMultisearchShortcuts, system_completions: possibleSystemShortcuts };
                return {
                    type: shortcutType,
                    name: shortcutCandidateName,
                    completed: false,
                    action: action
                }
            } else if (shortcutCandidateName === '/') {
                resetSystemShortcutCandidates();
                shortcutType = 'completion_shortcut';
                action = {
                    multisearch_completions: multisearchActionObjects.map(shortcut => ({name: shortcut.name, type: 'multisearch_action_object_completion'})),
                    system_completions: []
                };
                return {
                    type: shortcutType,
                    name: '/',
                    completed: false,
                    action: action
                };
            } else 
            {
                const possibleSystemCompletions = getSystemShortcutsAutocomplete(shortcutCandidateName);
                if (possibleSystemCompletions.length > 0) {
                    updateSystemShortcutCandidates(possibleSystemCompletions);
                    shortcutType = 'completion_shortcut';
                    action = {
                        multisearch_completions: [],
                        system_completions: possibleSystemCompletions
                    };
                    return {
                        type: shortcutType,
                        name: shortcutCandidateName,
                        completed: false,
                        action: action };
                } else {
                    resetSystemShortcutCandidates();
                    shortcutType = 'unsupported';
                    action = 'unsupported';
                    return {
                        type: shortcutType,
                        name: shortcutCandidateName,
                        completed: false,
                        action: action
                    };
                }
            }
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