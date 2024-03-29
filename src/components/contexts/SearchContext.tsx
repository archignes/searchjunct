// SearchContext.tsx

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useSystemsContext } from './SystemsContext';
import { System } from "../../types/system";
import { useStorage } from './StorageContext';
import MultisearchShortcut from '../../types/multisearch-shortcuts';
import HandleMultisearch from '../multisearch/HandleMultisearch';

const SearchContext = createContext<{ 
    handleSearch: ({ system, urlQuery, skip }: { system?: System, urlQuery?: string, skip?: "skip" | "skipback" }) => void,
        query: string,
        setQuery: (query: string) => void,
        multiSelect: boolean
        setMultiSelect: (multiSelect: boolean) => void,
        preppedSearchLink: (system: System, query: string) => string
    }>({
    handleSearch: () => { },
    query: '',
    setQuery: () => { },
    multiSelect: false,
    setMultiSelect: () => { },
    preppedSearchLink: (system: System, query: string) => { return '' }
});

export function getShortcutCandidate(query: string) {
    // Updated to return a candidate if a single forward slash+shortcut appears anywhere in the string with whitespace around it, or at the start/end of the string, and disqualify if multiple forward slashes precede the shortcut
    const regex = /(?:^|\s)\/(\S+)(?=\s|$)/g;
    const disqualifiedRegex = /\/{2,}\S+/; // Regex to check for multiple forward slashes before a string
    const disqualifiedMatches = query.match(disqualifiedRegex);
    const matches = Array.from(query.matchAll(regex));
    if (matches.length > 0 && disqualifiedMatches === null) {
        // Returns the first matched shortcut without the leading forward slash if no disqualified matches found
        return matches[0][1];
    }
    return null;
}

export const getShortcut = (multisearchShortcuts: MultisearchShortcut[], shortcutCandidate: string) => {
    console.log('Getting shortcut: ', shortcutCandidate);
    console.log('Multisearch shortcuts: ', multisearchShortcuts);
    const shortcut = multisearchShortcuts.find(shortcut => shortcut.name === shortcutCandidate);
    console.log('Shortcut: ', shortcut);
    return shortcut
}

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [multiSelect, setMultiSelect] = useState(false);
    const { setSystemSearched, systemsCurrentOrder,
        setActiveSystem, systemsSkipped, updateSystemsSkipped, systems } = useSystemsContext();
    const { systemsSearched, systemsDeleted, systemsDisabled, multisearchShortcuts } = useStorage();
    const [query, setQuery] = useState('');


    const getLastSkippedSystem = useCallback(() => {
        const lastSkippedSystem = [...systemsCurrentOrder].reverse().find(s => systemsSkipped[s.id]);
        return lastSkippedSystem;
    }, [systemsCurrentOrder, systemsSkipped]);


    const getNextUnsearchedSystem = useCallback((updatedSystemsSearched?: Record<string, boolean>, skipSteps: number = 1) => {
        const searched = updatedSystemsSearched || systemsSearched;
        let unsearchedSystems = systemsCurrentOrder.filter(
            s => !searched[s.id] && !systemsDisabled[s.id] && !systemsDeleted[s.id] && !systemsSkipped[s.id]);
        return unsearchedSystems[skipSteps - 1]; // Assuming skipSteps starts from 1 for the next system, 2 for the next next system, etc.
    }, [systemsSearched, systemsCurrentOrder, systemsDisabled, systemsDeleted, systemsSkipped]);


    const preppedSearchLink = useCallback((system: System, query: string) => {
        if (query === '' && system.base_url) {
            return system.base_url;
        }
        return system.search_link.replace('%s', encodeURIComponent(query)).replace(/%20/g, '+');
    }, []);


    const cleanupSearch = useCallback((system: System, currentQuery: string) => {
        const updatedSystemsSearched = { ...systemsSearched, [system.id]: true };
        updateSystemsSkipped(system.id, false);
        setSystemSearched(system.id);
        sessionStorage.setItem('searchInitiatedBlock', 'true');
        console.log('Searchjunct: searched: ', system.id);

        if (currentQuery === "") {
            document.title = "Searchjunct";
        } else {
            console.log('Updating document title:', `[${currentQuery}] - Searchjunct`);
            document.title = `[${currentQuery}] - Searchjunct`;
        }

        // Find the next unsearched system based on the updated systemsSearched object
        const nextUnsearchedSystem = getNextUnsearchedSystem(updatedSystemsSearched);
        if (nextUnsearchedSystem) {
            console.log("Next unsearched system: ", nextUnsearchedSystem);
            setActiveSystem(nextUnsearchedSystem.id);
        }
    }, [systemsSearched, updateSystemsSkipped, setSystemSearched, getNextUnsearchedSystem, setActiveSystem]);

    const handleSearch = useCallback(({ system, urlQuery, skip }: { system?: System, urlQuery?: string, skip?: "skip" | "skipback" }) => {
        let currentQuery = urlQuery || query;
        console.log('Current query: ', currentQuery);
        // Detect if the query contains a shortcut
        const shortcutCandidate = getShortcutCandidate(currentQuery)
        console.log('Shortcut candidate: ', shortcutCandidate);
        if (shortcutCandidate) {
            console.log('Shortcut candidate condition met');
            const shortcut = getShortcut(multisearchShortcuts, shortcutCandidate);
            console.log('Shortcut: ', shortcut);
            if (shortcut) {
                HandleMultisearch({
                    currentQuery: currentQuery,
                    shortcut,
                    systems,
                    cleanupSearch,
                    preppedSearchLink
                });
                return;
            }
        }
        if (currentQuery.endsWith("/") && !currentQuery.endsWith("//")) {
            currentQuery = currentQuery.slice(0, -1);
            console.log("Warning: Search query ends with a single forward slash. Single forward slash is used to bypass initiateSearchImmediately. Forward slash is being removed. Use two forward slashes to render an ending single forward slash in your query.");
        }

        if (skip === "skip") {
            const skipSteps = 2;
            const systemSkipped = getNextUnsearchedSystem(undefined);
            system = getNextUnsearchedSystem(undefined, skipSteps);
            if (!system) {
                return;
            }
            updateSystemsSkipped(systemSkipped.id, true);
            return;
        } else if (skip === "skipback") {
            system = getLastSkippedSystem();
            if (!system) {
                return;
            }
            updateSystemsSkipped(system.id, false);
            handleSearch({ system: system as System });
            return;
        }
                
        system = system || getNextUnsearchedSystem();

        if (!system) {
            return;
        }
        if (systemsDisabled[system.id] || systemsDeleted[system.id]) {
            const enabledSystem = systemsCurrentOrder.find(s => !systemsDisabled[s.id] && !systemsDeleted[s.id]);
            if (enabledSystem !== undefined) {
                handleSearch({ system: enabledSystem as System, urlQuery: currentQuery });
            }
            return;
        }

        if (currentQuery !== '' && system.search_link && !system.search_link.includes('%s')) {
            navigator.clipboard.writeText(currentQuery).then(() => {
                console.log('Query copied to clipboard');
            }).catch(err => {
                console.error('Could not copy query to clipboard: ', err);
            });
        }

        const url = preppedSearchLink(system, currentQuery);
        window.open(url, '_blank');
        cleanupSearch(system, currentQuery);

    }, [
        systems,
        systemsDeleted,
        systemsDisabled,
        systemsCurrentOrder,
        query,
        getNextUnsearchedSystem,
        getLastSkippedSystem,
        updateSystemsSkipped,
        preppedSearchLink,
        cleanupSearch,
        multisearchShortcuts
    ]);

    return (
        <SearchContext.Provider value={{
            handleSearch,
            query,
            setQuery,
            multiSelect,
            setMultiSelect,
            preppedSearchLink }}>
            {children}
        </SearchContext.Provider>
    );
};