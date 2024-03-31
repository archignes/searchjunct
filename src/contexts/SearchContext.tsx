// SearchContext.tsx

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useStorageContext, useSystemsContext, useSortContext, useSystemSearchContext } from './';
import { System } from "../types/system";
import HandleSearch, { getShortcutCandidate, handleShortcutSearch, handleSkipLogic } from '../components/search/HandleSearch';
import { SearchContextType, getNextUnsearchedSystemParams } from '../types/search';


const SearchContext = createContext<SearchContextType>({
    submitSearch: () => { },
    query: '',
    setQuery: () => { },
    getNextUnsearchedSystem: () => undefined,
    getNextUnsearchedSystems: () => [],
    preppedSearchLink: () => ''
});

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const { systemsCurrentOrder } = useSortContext();
    const { setSystemSearched, systemsSkipped, updateSystemsSkipped } = useSystemSearchContext();
    const { systemsSearched, systemsDeleted, systemsDisabled, multisearchShortcuts } = useStorageContext();
    const { setActiveSystem, systems } = useSystemsContext();
    const [query, setQuery] = useState('');


    const getLastSkippedSystem = useCallback(() => {
        // Create a shallow copy of the array and reverse it to avoid mutating the original array
        const reversedSystems = [...systemsCurrentOrder].reverse();
        return reversedSystems.find(s => systemsSkipped[s.id]);
    }, [systemsCurrentOrder, systemsSkipped]);



    const getNextUnsearchedSystems = useCallback((params: getNextUnsearchedSystemParams) => {
        const { updatedSystemsSearched, numberOfSystems = 1, skipSteps = 1 } = params;
        const searched = updatedSystemsSearched || systemsSearched;
        let unsearchedSystems = [];
        for (let i = 0; i < systemsCurrentOrder.length && unsearchedSystems.length < numberOfSystems; i++) {
            const system = systemsCurrentOrder[i];
            if (!searched[system.id] &&
                !systemsDisabled[system.id] &&
                !systemsDeleted[system.id] &&
                !systemsSkipped[system.id] &&
                i >= skipSteps - 1) {
                unsearchedSystems.push(system);
            }
        }
        return unsearchedSystems;
    }, [systemsSearched, systemsCurrentOrder, systemsDisabled, systemsDeleted, systemsSkipped]);

    const getNextUnsearchedSystem = useCallback((params: getNextUnsearchedSystemParams) => {
        return getNextUnsearchedSystems(params)[0];
    }, [getNextUnsearchedSystems]);

    const preppedSearchLink = useCallback(({ system, query }: { system: System; query: string }) => {
        if (!system) {
            console.error("System is undefined in preppedSearchLink");
            return '';
        }
        if (query === '' && system.base_url) {
            return system.base_url;
        }
        return system.search_link.replace('%s', encodeURIComponent(query)).replace(/%20/g, '+');
    }, []);

    const cleanupSearch = useCallback((system: System | undefined, currentQuery: string) => {
        if (!system) {
            console.error("System is undefined in cleanupSearch");
            return;
        }
        const updatedSystemsSearched = { ...systemsSearched, [system.id]: true };
        updateSystemsSkipped(system.id, false);
        setSystemSearched(system.id);
        sessionStorage.setItem('searchInitiatedBlock', 'true');

        document.title = currentQuery === "" ? "Searchjunct" : `[${currentQuery}] - Searchjunct`;

        const nextUnsearchedSystem = getNextUnsearchedSystem({ updatedSystemsSearched: updatedSystemsSearched });
        if (nextUnsearchedSystem) {
            setActiveSystem(nextUnsearchedSystem.id);
        }
    }, [systemsSearched, updateSystemsSkipped, setSystemSearched, getNextUnsearchedSystem, setActiveSystem]);


    const handleShortcutLogic = useCallback((currentQuery: string) => {
        const shortcutCandidate = getShortcutCandidate(currentQuery);
        if (shortcutCandidate) {
            handleShortcutSearch({
                currentQuery,
                shortcutCandidate,
                systems,
                multisearchShortcuts,
                cleanupSearch,
                preppedSearchLink,
                getNextUnsearchedSystems
            });
            return true;
        }
        return false;
    }, [systems, multisearchShortcuts, getNextUnsearchedSystems, cleanupSearch, preppedSearchLink]);


    const handleQueryFormatting = useCallback((currentQuery: string) => {
        if (currentQuery.endsWith("/") && !currentQuery.endsWith("//")) {
            currentQuery = currentQuery.slice(0, -1);
            console.warn("Search query ends with a single forward slash. Single forward slash is used to bypass initiateSearchImmediately. Forward slash is being removed. Use two forward slashes to render an ending single forward slash in your query.");
        }
        return currentQuery;
    }, []);


    const submitSearch = useCallback(
        ({ system, urlQuery, skip }: { system?: System; urlQuery?: string; skip?: "skip" | "skipback" }) => {
            let currentQuery = urlQuery || query;

            if (handleShortcutLogic(currentQuery)) {
                return;
            }

            currentQuery = handleQueryFormatting(currentQuery);

            if (skip && handleSkipLogic({ skip, getNextUnsearchedSystem, getLastSkippedSystem, updateSystemsSkipped, handleSearch: submitSearch })) {
                return;
            }

            system = system || getNextUnsearchedSystem({});

            if (!system) {
                console.warn("No unsearched system found");
                return;
            }

            HandleSearch({
                system,
                currentQuery,
                getLastSkippedSystem,
                updateSystemsSkipped,
                handleSearch: submitSearch,
                systemsDisabled,
                systemsDeleted,
                systemsCurrentOrder,
                preppedSearchLink,
                cleanupSearch,
            });
        },
        [
            systemsDeleted,
            systemsDisabled,
            systemsCurrentOrder,
            query,
            getNextUnsearchedSystem,
            updateSystemsSkipped,
            preppedSearchLink,
            cleanupSearch,
            getLastSkippedSystem,
            handleShortcutLogic,
            handleQueryFormatting,
        ]
    );


    return (
        <SearchContext.Provider value={{
            submitSearch,
            query,
            setQuery,
            getNextUnsearchedSystem,
            getNextUnsearchedSystems,
            preppedSearchLink
        }}>
            {children}
        </SearchContext.Provider>
    );
};