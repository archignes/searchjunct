// SearchContext.tsx

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useSystemsContext, System } from './SystemsContext';
import { useStorage } from './StorageContext';


const SearchContext = createContext<{ handleSearch: (system?: System, urlQuery?: string) => void, query: string, setQuery: (query: string) => void }>({
    handleSearch: () => { },
    query: '',
    setQuery: () => { },
});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const { setSystemSearched, systemsCurrentOrder, setActiveSystem } = useSystemsContext();
    const { systemsSearched, systemsDeleted, systemsDisabled } = useStorage();
    const [query, setQuery] = useState('');

    const getNextUnsearchedSystem = (updatedSystemsSearched?: Record<string, boolean>) => {
        const searched = updatedSystemsSearched || systemsSearched
        return systemsCurrentOrder.find(s => !searched[s.id] && !systemsDisabled[s.id] && !systemsDeleted[s.id]);
    }

    const handleSearch = (system?: System, urlQuery?: string) => {
        let currentQuery = urlQuery || query;
        let encodedQuery = encodeURIComponent(currentQuery).replace(/%20/g, '+');

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

        if (system.search_link) {
            navigator.clipboard.writeText(currentQuery).then(() => {
                console.log('Query copied to clipboard');
            }).catch(err => {
                console.error('Could not copy query to clipboard: ', err);
            });
        }

        const url = system.search_link.replace('%s', encodedQuery);
        window.open(url, '_blank');

        // Update the systemsSearched object directly
        const updatedSystemsSearched = { ...systemsSearched, [system.id]: true };
        setSystemSearched(system.id);
        sessionStorage.setItem('searchInitiatedBloc', 'true');
        console.log('Searchjunct: searched: ', system.id);

        // Find the next unsearched system based on the updated systemsSearched object
        const nextUnsearchedSystem = getNextUnsearchedSystem(updatedSystemsSearched);
        if (nextUnsearchedSystem) {
            console.log("Next unsearched system: ", nextUnsearchedSystem);
            setActiveSystem(nextUnsearchedSystem.id);
        }
    };

    return (
        <SearchContext.Provider value={{ handleSearch, query, setQuery }}>
            {children}
        </SearchContext.Provider>
    );
};