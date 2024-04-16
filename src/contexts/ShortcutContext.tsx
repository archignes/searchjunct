// contexts/ShortcutContext.tsx
// This context is responsible for handling shortcuts:
// - getting shortcut from query

import React, { useContext, createContext, ReactNode, useMemo, useCallback, useState } from 'react';
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
    
    const getShortcut = useCallback(({ type, shortcutCandidate, completed }: { type: 'multisearch_number' | 'multisearch_object', shortcutCandidate: string, completed: boolean }) => {
        if (type === 'multisearch_number') {
            return { type, name: shortcutCandidate, completed, action: Number(shortcutCandidate) } as Shortcut;
        }
        if (type === 'multisearch_object') {
            const shortcut = multisearchActionObjects.find(shortcut => shortcut.name === shortcutCandidate);
            if (!shortcut) return null;
            return { type, name: shortcut.name, completed, action: shortcut } as Shortcut;
        }
        return null;
    }, [multisearchActionObjects]);
    
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
    const getSystemShortcutsAutocomplete = useCallback((input: string): {id: string, type: 'system_completion'}[] => 
        allSystems
            .filter(system => system.id.startsWith(input))
            .map(system => ({id: system.id, type: 'system_completion'})),
    [allSystems]);

    const getMultisearchShortcutsAutocomplete = useCallback((input: string): {name: string, type: 'multisearch_action_object_completion'}[] =>
        multisearchActionObjects
            .filter(shortcut => shortcut.name.startsWith(input))
            .map(shortcut => ({name: shortcut.name, type: 'multisearch_action_object_completion'})),
    [multisearchActionObjects]);

    const updateSystemShortcutCandidates = useCallback((possibleSystemCompletions: {id: string, type: 'system_completion'}[]) => {
        resetSystemShortcutCandidates();
        possibleSystemCompletions.forEach(system => {
            addSystemShortcutCandidate(system.id);
        });
    }, [resetSystemShortcutCandidates, addSystemShortcutCandidate]);
    
    const [lastQuery, setLastQuery] = useState<string | null>(null);
    const [lastShortcut, setLastShortcut] = useState<Shortcut | null>(null);

    const getShortcutFromQuery = useCallback((query: string) => {
        if (query === lastQuery) {
            return lastShortcut;
        } else {
            let shortcutType: ShortcutType;
            let action: ShortcutAction;

            const shortcutCandidateName = getShortcutCandidate(query);

            if (!shortcutCandidateName) {
                setLastQuery(query);
                setLastShortcut(null);
                return null;
            }
            if (!isNaN(parseFloat(shortcutCandidateName))) {
                const shortcutCandidateNumber = parseFloat(shortcutCandidateName).toString();
                const shortcut = getShortcut({ type: 'multisearch_number', shortcutCandidate: shortcutCandidateNumber, completed: false });
                setLastQuery(query);
                setLastShortcut(shortcut);
                return shortcut;
            }
            if (shortcutCandidateName) {
                const multisearchShortcut = getShortcut({ type: 'multisearch_object', shortcutCandidate: shortcutCandidateName, completed: false });
                if (multisearchShortcut) {
                    setLastQuery(query);
                    setLastShortcut(multisearchShortcut);
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
                    const shortcut = {
                        type: shortcutType,
                        name: shortcutCandidateName,
                        completed: false,
                        action: action
                    };
                    setLastQuery(query);
                    setLastShortcut(shortcut);
                    return shortcut;
                } else if (shortcutCandidateName === '/') {
                    resetSystemShortcutCandidates();
                    shortcutType = 'completion_shortcut';
                    action = {
                        multisearch_completions: multisearchActionObjects.map(shortcut => ({name: shortcut.name, type: 'multisearch_action_object_completion'})),
                        system_completions: []
                    };
                    const shortcut = {
                        type: shortcutType,
                        name: '/',
                        completed: false,
                        action: action
                    };
                    setLastQuery(query);
                    setLastShortcut(shortcut);
                    return shortcut;
                } else {
                    const possibleSystemCompletions = getSystemShortcutsAutocomplete(shortcutCandidateName);
                    if (possibleSystemCompletions.length > 0) {
                        updateSystemShortcutCandidates(possibleSystemCompletions);
                        shortcutType = 'completion_shortcut';
                        action = {
                            multisearch_completions: [],
                            system_completions: possibleSystemCompletions
                        };
                        const shortcut = {
                            type: shortcutType,
                            name: shortcutCandidateName,
                            completed: false,
                            action: action
                        };
                        setLastQuery(query);
                        setLastShortcut(shortcut);
                        return shortcut;
                    } else {
                        resetSystemShortcutCandidates();
                        shortcutType = 'unsupported';
                        action = 'unsupported';
                        const shortcut = {
                            type: shortcutType,
                            name: shortcutCandidateName,
                            completed: false,
                            action: action
                        };
                        setLastQuery(query);
                        setLastShortcut(shortcut);
                        return shortcut;
                    }
                }
            }
            return null;
        }
    }, [lastQuery, lastShortcut, getShortcut, shortcutStarts, getMultisearchShortcutsAutocomplete, getSystemShortcutsAutocomplete, updateSystemShortcutCandidates, resetSystemShortcutCandidates, multisearchActionObjects]);


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