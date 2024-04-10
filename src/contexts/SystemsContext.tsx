// SystemsContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import systemsData from "../data/systems.json";
import { System } from "../types/system";
import { useStorageContext } from "./StorageContext";

const baseSystems: System[] = systemsData as System[];

interface SystemsProviderProps {
    children: ReactNode;
    testSystems?: System[];
}

interface SystemsContextType {
    baseSystems: System[];
    allSystems: System[];
    activeSystem: System | undefined;
    setActiveSystem: (systemId: string) => void;
    initializeSystemsState: (systemsDisabled: any, systemsDeleted: any, systemsSearched: any) => void;
    systemsState: System[];
    setSystemsState: (systems: System[]) => void;
}

// Create the context with a default value
const SystemsContext = createContext<SystemsContextType>(
    {
        baseSystems: [],
        allSystems: [],
        activeSystem: undefined,
        setActiveSystem: () => { },
        initializeSystemsState: () => { return []; },
        systemsState: [],
        setSystemsState: () => { },
    });

// Export the useContext hook for SystemsContext
export const useSystemsContext = () => useContext(SystemsContext);

export const SystemsProvider: React.FC<SystemsProviderProps> = ({ children }) => {
    // allSystems is a combination of baseSystems and locally stored search systems
    const { locallyStoredSearchSystems } = useStorageContext();
    const allSystems = useMemo(() => [...locallyStoredSearchSystems, ...baseSystems], [locallyStoredSearchSystems]);

    const [activeSystem, setActiveSystemState] = useState<System | undefined>(allSystems[0]);
    const [systemsState, setSystemsState] = useState<System[]>([]);

    const initializeSystemsState = useCallback((
        systemsDisabled: Record<string, boolean> = {},
        systemsDeleted: Record<string, boolean> = {},
        systemsSearched: Record<string, boolean> = {}
    ) => {
        setSystemsState(allSystems.map(system => ({
            ...system,
            searched: systemsSearched[system.id] ?? {},
            disabled: systemsDisabled[system.id] ?? {},
            deleted: systemsDeleted[system.id] ?? {},
        })));
    }, [allSystems]);

    const setActiveSystem = (systemId: string) => {
        const matchingSystem = allSystems.find(system => system.id === systemId);
        setActiveSystemState(matchingSystem);
    };

    useEffect(() => {
        if (!activeSystem) {
            setActiveSystemState(allSystems[0]);
        }
    }, [activeSystem, allSystems]);    

    return (
        <SystemsContext.Provider value={
            {
                baseSystems,
                activeSystem,
                setActiveSystem,
                initializeSystemsState,
                systemsState,
                setSystemsState,
                allSystems
            }}>
            {children}
        </SystemsContext.Provider>
    );
};