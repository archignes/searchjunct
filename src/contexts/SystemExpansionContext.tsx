// SystemsContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSortContext } from "./";

interface SystemExpansionProviderProps {
    children: ReactNode;
}

interface SystemExpansionContextType {
    expandAllStatus: boolean;
    toggleExpandAll: () => void;
    expandedSystemCards: string[];
    setExpandedSystemCards: (systemIds: string[]) => void;
    setExpandAllStatus: (status: boolean) => void;
}

// Create the context with a default value
const SystemExpansionContext = createContext<SystemExpansionContextType>(
    {
        expandAllStatus: false,
        toggleExpandAll: () => { },
        expandedSystemCards: [],
        setExpandedSystemCards: () => { },
        setExpandAllStatus: () => { },
    });

// Export the useContext hook for SystemsContext
export const useSystemExpansionContext = () => useContext(SystemExpansionContext);

export const SystemExpansionProvider: React.FC<SystemExpansionProviderProps> = ({ children }) => {
    const { systemsCurrentOrder, updateSortStatus } = useSortContext();
    const [expandedSystemCards, setExpandedSystemCards] = useState<string[]>([]);

    const currentURL = typeof window !== 'undefined' ? window.location.href : '';

    useEffect(() => {
        if (typeof currentURL === 'string') {
            return;
        }
        const url = new URL(currentURL);
        if (url.searchParams.has("systems")) {
            updateSortStatus('param');
            setExpandedSystemCards(url.searchParams.get("systems")?.split(',') || []);
        }
    }, [currentURL, updateSortStatus]);

    const [expandAllStatus, setExpandAllStatus] = useState(false);

    const toggleExpandAll = () => {
        const newExpandAllStatus = !expandAllStatus;
        setExpandAllStatus(newExpandAllStatus);
        setExpandedSystemCards(newExpandAllStatus ? systemsCurrentOrder.map(system => system.id) : []);
    };

    return (
        <SystemExpansionContext.Provider value={
            { 
                expandAllStatus,
                toggleExpandAll,
                expandedSystemCards,
                setExpandedSystemCards,
                setExpandAllStatus,
            }}>
            {children}
        </SystemExpansionContext.Provider>
    );
};

