// SystemsContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import systemsData from "../data/systems.json";
import { System } from "../types/system";

const systems: System[] = systemsData as System[];

interface SystemsProviderProps {
    children: ReactNode;
    testSystems?: System[];
}

interface SystemsContextType {
    systems: System[];
    activeSystem: System | undefined;
    setActiveSystem: (systemId: string) => void;
    initializeSystemsState: (systemsDisabled: any, systemsDeleted: any, systemsSearched: any) => void;
    systemsState: System[];
    setSystemsState: (systems: System[]) => void;
}

// Create the context with a default value
const SystemsContext = createContext<SystemsContextType>(
    {
        systems: [],
        activeSystem: undefined,
        setActiveSystem: () => { },
        initializeSystemsState: () => { return []; },
        systemsState: [],
        setSystemsState: () => { },
    });

// Export the useContext hook for SystemsContext
export const useSystemsContext = () => useContext(SystemsContext);

export const SystemsProvider: React.FC<SystemsProviderProps> = ({ children }) => {
    const [activeSystem, setActiveSystemState] = useState<System | undefined>(systems[0]);
    const [systemsState, setSystemsState] = useState<System[]>([]);

    const initializeSystemsState = useCallback((
        systemsDisabled: Record<string, boolean> = {},
        systemsDeleted: Record<string, boolean> = {},
        systemsSearched: Record<string, boolean> = {}
    ) => {
        setSystemsState(systems.map(system => ({
            ...system,
            searched: systemsSearched[system.id] ?? {},
            disabled: systemsDisabled[system.id] ?? {},
            deleted: systemsDeleted[system.id] ?? {},
        })));
    }, []);

    const setActiveSystem = (systemId: string) => {
        const matchingSystem = systems.find(system => system.id === systemId);
        setActiveSystemState(matchingSystem);
    };

    useEffect(() => {
        if (!activeSystem) {
            setActiveSystemState(systems[0]);
        }
    }, [activeSystem]);


    return (
        <SystemsContext.Provider value={
            {
                systems,
                activeSystem,
                setActiveSystem,
                initializeSystemsState,
                systemsState,
                setSystemsState,
            }}>
            {children}
        </SystemsContext.Provider>
    );
};