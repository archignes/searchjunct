// SystemsContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import systemsData from "../data/systems.json";
import { System } from "../types/system";
import { useStorageContext } from "./StorageContext";

// This transforms fields with "search_link" in .json to "searchLink"
const baseSystems: System[] = systemsData.map((system: any) => {
  const { search_link, search_link_joiner, search_link_note, ...rest } = system;
  return { 
    ...rest, 
    searchLink: search_link,
    searchLinkJoiner: search_link_joiner,
    searchLinkNote: search_link_note,
  };
}) as System[];


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
    getSystemsRequiringAccounts: () => System[];
    getSystemsWithoutQueryPlaceholder: () => System[];
    getAllDeletedStatus: (systemIds: System[]) => boolean;
    deleteSystemsBulk: (systemIds: System[]) => void;
    resetSystemShortcutCandidates: () => void;
    addSystemShortcutCandidate: (systemId: string) => void;
    systemShortcutCandidates: Record<string, boolean>;
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
        getSystemsRequiringAccounts: () => [],
        getSystemsWithoutQueryPlaceholder: () => [],
        getAllDeletedStatus: () => false,
        deleteSystemsBulk: () => {},
        resetSystemShortcutCandidates: () => {},
        addSystemShortcutCandidate: () => {},
        systemShortcutCandidates: {},
    });

// Export the useContext hook for SystemsContext
export const useSystemsContext = () => useContext(SystemsContext);

export const SystemsProvider: React.FC<SystemsProviderProps> = ({ children }) => {
    // allSystems is a combination of baseSystems and locally stored search systems
    const { locallyStoredSearchSystems, setSystemDeleted, systemsDeleted } = useStorageContext();
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


    const getSystemsRequiringAccounts = useCallback(() => {
        return allSystems.filter(system => system.account_required);
    }, [allSystems]);

    const getSystemsWithoutQueryPlaceholder = useCallback(() => {
        return allSystems.filter(system => !system.searchLink.includes('%s'));
    }, [allSystems]);

    const getAllDeletedStatus = useCallback((systems: System[]) => {
        // If any system is not deleted, return false
        return !systems.some(system => !systemsDeleted[system.id]);
    }, [systemsDeleted]);

    const deleteSystemsBulk = useCallback((systems: System[]) => {
        systems.forEach(system => {
            setSystemDeleted(system.id, true);
        });
    }, [setSystemDeleted]);



    const [systemShortcutCandidates, setSystemShortcutCandidates] = useState<Record<string, boolean>>({});
    const resetSystemShortcutCandidates = () => {
        setSystemShortcutCandidates({});
    }

    const addSystemShortcutCandidate = (systemId: string) => {
        setSystemShortcutCandidates(prevCandidates => {
            if (!prevCandidates[systemId]) {
                const updatedCandidates = { ...prevCandidates, [systemId]: true };
                return updatedCandidates;
            }
            return prevCandidates;
        });
    }


    return (
        <SystemsContext.Provider value={
            {
                baseSystems,
                activeSystem,
                setActiveSystem,
                initializeSystemsState,
                systemsState,
                setSystemsState,
                allSystems,
                getSystemsRequiringAccounts,
                getSystemsWithoutQueryPlaceholder,
                getAllDeletedStatus,
                deleteSystemsBulk,
                resetSystemShortcutCandidates,
                addSystemShortcutCandidate,
                systemShortcutCandidates,
            }}>
            {children}
        </SystemsContext.Provider>
    );
};