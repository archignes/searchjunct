// contexts/SystemSearchContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useStorageContext, useSystemsContext } from "./"; 

interface SystemSearchProviderProps {
    children: ReactNode;
}

interface SystemSearchContextType {
    setSystemSearched: (systemId: string) => void;
    systemsSkipped: Record<string, boolean>;
    updateSystemsSkipped: (systemId: string, value: boolean) => void;
    reloadSystems: () => void;
}

// Create the context with a default value
const SystemSearchContext = createContext<SystemSearchContextType>(
    {
        setSystemSearched: () => { },
        systemsSkipped: {},
        updateSystemsSkipped: () => { },
        reloadSystems: () => { }
    });

// Export the useContext hook for SystemsContext
export const useSystemSearchContext = () => useContext(SystemSearchContext);

export const SystemSearchProvider: React.FC<SystemSearchProviderProps> = ({ children }) => {
    const { systemsState, setSystemsState, initializeSystemsState } = useSystemsContext();
    const { systemsSearched, setSystemsStateSearched, systemsDisabled, systemsDeleted } = useStorageContext();
    
    const [systemsSkipped, setSystemsSkipped] = useState<Record<string, boolean>>({});
    const updateSystemsSkipped = (systemId: string, value: boolean) => {
        setSystemsSkipped({ ...systemsSkipped, [systemId]: value });
    }

    const setSystemSearched = (systemId: string) => {
        setSystemsStateSearched(systemId, true);
        const updatedSystems = systemsState.map(system => {
            if (system.id === systemId) {
                return { ...system, searched: true };
            }
            return system;
        });
        setSystemsState(updatedSystems);
    };

    const reloadSystems = () => {
        if (Object.values(systemsSearched).length === 0) {
            alert("No systems have been searched in this session.")
            return;
        }
        Object.keys(systemsSearched).forEach(key => {
            systemsSearched[key] = false;
        });
        initializeSystemsState(systemsDisabled, systemsDeleted, systemsSearched);
    };

    return (
        <SystemSearchContext.Provider value={
            { 
                reloadSystems,
                setSystemSearched,
                systemsSkipped,
                updateSystemsSkipped
            }}>
            {children}
        </SystemSearchContext.Provider>
    );
};

