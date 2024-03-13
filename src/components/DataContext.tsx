// DataContext.tsx
"use client"
import React, { createContext, useState, useEffect } from 'react';
import FlexSearch from 'flexsearch';
import { ReactNode } from 'react';
import systems from "src/data/systems.json";

export interface System {
    id: string;
    name: string;
    nondistinct_url?: boolean;
    base_url_for?: string[];
    account_required?: boolean;
    search_link: string;
    mobile_app_breaks_links_warning?: boolean;
}

interface DataContextType {
    systems: System[];
}

const defaultContextValue: DataContextType = {
    systems: systems,
};

type DataProviderProps = {
    children: ReactNode;
};

const DataContext = createContext<DataContextType>(defaultContextValue);

const index = new FlexSearch.Index({ tokenize: 'forward' });

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {


    return (
        <DataContext.Provider value={{ systems: systems }}>
            {children} {/* Now TypeScript knows about children */}
        </DataContext.Provider>
    );
};

export default DataContext;
