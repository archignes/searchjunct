// SearchContext.tsx

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { useStorageContext,
    useQueryContext,
    useSystemsContext,
    useSortContext,
    useSystemSearchContext,
 } from './';
import { System } from "../types/system";
import HandleSearch, { ShortcutQuery, handleShortcutSearch, handleSkipLogic } from '../components/search/HandleSearch';
import { getNextUnsearchedSystemParams } from '../types/search';

type SearchContextType = {
    submitSearch: ({ system, urlQuery, skip }: { system?: System, urlQuery?: string, skip?: "skip" | "skipback" }) => void,
    getNextUnsearchedSystem: ({ updatedSystemsSearched, skipSteps }: getNextUnsearchedSystemParams) => System | undefined,
    getNextUnsearchedSystems: ({ updatedSystemsSearched, skipSteps }: getNextUnsearchedSystemParams) => System[],
    preppedSearchLink: ({ system, query }: { system: System, query: string }) => string
};


const SearchContext = createContext<SearchContextType>({
    submitSearch: () => { },
    getNextUnsearchedSystem: () => undefined,
    getNextUnsearchedSystems: () => [],
    preppedSearchLink: () => ''
});

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const { systemsCurrentOrder } = useSortContext();
    const { setSystemSearched, systemsSkipped, updateSystemsSkipped } = useSystemSearchContext();
    const { initiateSearchImmediately, systemsSearched, systemsDeleted, systemsDisabled, flagSearchInitiated, updateFlagSearchInitiated } = useStorageContext();
    const { setActiveSystem, systems } = useSystemsContext();
    const { queryObject, setQueryObjectIntoURL } = useQueryContext();
    const initiateSearchImmediatelyRef = useRef(true);


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

    const cleanupSearch = useCallback((system: System | undefined, query_searched: string) => {
        updateFlagSearchInitiated(true);

        if (!system) {
            console.error("System is undefined in cleanupSearch");
            return;
        }
        const updatedSystemsSearched = { ...systemsSearched, [system.id]: true };
        updateSystemsSkipped(system.id, false);
        setSystemSearched(system.id);
        sessionStorage.setItem('flagSearchInitiated', 'true');
        setQueryObjectIntoURL()
        document.title = query_searched === "" ? "Searchjunct" : `[${query_searched}] - Searchjunct`;

        const nextUnsearchedSystem = getNextUnsearchedSystem({ updatedSystemsSearched: updatedSystemsSearched });
        if (nextUnsearchedSystem) {
            setActiveSystem(nextUnsearchedSystem.id);
        }
    }, [systemsSearched,
        updateFlagSearchInitiated,
        updateSystemsSkipped,
        setSystemSearched,
        getNextUnsearchedSystem,
        setActiveSystem,
        setQueryObjectIntoURL
    ]);


    const submitSearch = useCallback(
        ({ system, skip }: { system?: System; skip?: "skip" | "skipback" }) => {
            
            if (queryObject.shortcut) {
                handleShortcutSearch({
                    queryObject: queryObject as ShortcutQuery,
                    systems,
                    cleanupSearch,
                    preppedSearchLink,
                    getNextUnsearchedSystems
                });
                return true;
            }

            if (skip && handleSkipLogic({ skip, getNextUnsearchedSystem, getLastSkippedSystem, updateSystemsSkipped, handleSearch: submitSearch })) {
                return;
            }

            system = system || getNextUnsearchedSystem({}); // Allows user to directly click a system.

            if (!system) {
                console.warn("No unsearched system found");
                return;
            }

            HandleSearch({
                system,
                currentQuery: queryObject.query,
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
            systems,
            getNextUnsearchedSystem,
            getNextUnsearchedSystems,
            updateSystemsSkipped,
            preppedSearchLink,
            cleanupSearch,
            getLastSkippedSystem,
            queryObject,            
        ]
    );


    

    useEffect(() => {
        if (initiateSearchImmediately && !flagSearchInitiated && initiateSearchImmediatelyRef.current) {
            if (queryObject.query && queryObject.from_address_bar) {
                submitSearch({});
                initiateSearchImmediatelyRef.current = false;
            }
        }
    }, [queryObject,
        initiateSearchImmediately,
        flagSearchInitiated,
        initiateSearchImmediatelyRef,
        systemsSearched,
        submitSearch]);

    return (
        <SearchContext.Provider value={{
            submitSearch,
            getNextUnsearchedSystem,
            getNextUnsearchedSystems,
            preppedSearchLink,
        }}>
            {children}
        </SearchContext.Provider>
    );
};