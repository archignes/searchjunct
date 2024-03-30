// contexts/QueryContext.tsx

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface QueryContextType {
    query: string;
    setQuery: (query: string) => void;
}

const QueryContext = createContext<QueryContextType>({
    query: '',
    setQuery: () => { },    
});

export const useQueryContext = () => useContext(QueryContext);

export const QueryProvider = ({ children }: { children: ReactNode }) => {
    const [query, setQuery] = useState('');

    return (
        <QueryContext.Provider value={{ query, setQuery }}>
            {children}
        </QueryContext.Provider>
    );
};