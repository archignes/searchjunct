// SearchContext.tsx

import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import { useSystemsContext } from './SystemsContext';
import { System } from "../../types/systems";
import { useStorage } from './StorageContext';


const SearchContext = createContext<{ 
        handleSearch: (system?: System, urlQuery?: string, skip?: "skip" | "skipback") => void,
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


export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [multiSelect, setMultiSelect] = useState(false);
    const { setSystemSearched, systemsCurrentOrder,
        setActiveSystem, systemsSkipped, updateSystemsSkipped } = useSystemsContext();
    const { systemsSearched, systemsDeleted, systemsDisabled } = useStorage();
    const [query, setQuery] = useState('');


    const getLastSkippedSystem = () => {
        const lastSkippedSystem = [...systemsCurrentOrder].reverse().find(s => systemsSkipped[s.id]);
        return lastSkippedSystem;
    }

    const getNextUnsearchedSystem = (updatedSystemsSearched?: Record<string, boolean>, skipSteps: number = 1) => {
        const searched = updatedSystemsSearched || systemsSearched;
        let unsearchedSystems = systemsCurrentOrder.filter(
            s => !searched[s.id] && !systemsDisabled[s.id] && !systemsDeleted[s.id] && !systemsSkipped[s.id]);
        return unsearchedSystems[skipSteps - 1]; // Assuming skipSteps starts from 1 for the next system, 2 for the next next system, etc.
    }

    const preppedSearchLink = (system: System, query: string) => {
        if (query === '' && system.base_url) {
            return system.base_url;
        }
        return system.search_link.replace('%s', encodeURIComponent(query)).replace(/%20/g, '+');
    }

    const handleSearch = useCallback((system?: System, urlQuery?: string, skip?: "skip" | "skipback") => {
        let currentQuery = urlQuery || query;
        let encodedQuery = encodeURIComponent(currentQuery).replace(/%20/g, '+');
        
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
            handleSearch(system);
            return;
        }
        
        system = system || getNextUnsearchedSystem();

        if (!system) {
            return;
        }

        if (systemsDisabled[system.id] || systemsDeleted[system.id]) {
            const enabledSystem = systemsCurrentOrder.find(s => !systemsDisabled[s.id] && !systemsDeleted[s.id]);
            if (enabledSystem !== undefined) {
                handleSearch(enabledSystem as System, currentQuery);
            }
            return;
        }

        if (query !== '' && system.search_link && !system.search_link.includes('%s')) {
            navigator.clipboard.writeText(currentQuery).then(() => {
                console.log('Query copied to clipboard');
            }).catch(err => {
                console.error('Could not copy query to clipboard: ', err);
            });
        }

        const url = preppedSearchLink(system, currentQuery);
        window.open(url, '_blank');

        // Update the systemsSearched object directly
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

    }, [systemsSearched,
        systemsDeleted,
        systemsDisabled,
        systemsCurrentOrder,
        setSystemSearched,
        setActiveSystem,
        query,
        getNextUnsearchedSystem,
        getLastSkippedSystem,
        updateSystemsSkipped,
        preppedSearchLink
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