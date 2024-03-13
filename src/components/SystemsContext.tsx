// SystemsContext.tsx

import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { useStorage } from "./StorageContext"; 
import systemsData from "src/data/systems.json";
const systems: System[] = systemsData as System[];

export interface System {
    id: string;
    name: string;
    nondistinct_url?: boolean;
    base_url_for?: string[];
    account_required?: boolean;
    search_link: string;
    mobile_app_breaks_links_warning?: boolean;
    searched?: boolean;
    linkedin_link?: string;
    wikipedia_link?: string;
    twitter_link?: string;
    github_link?: string;
    discord_link?: string;
    open_source_license?: string;
    open_source_license_url?: string;
    nonprofit_verification?: string;
    web_search_system?: boolean;
    favicon?: boolean;
    about_link?: string;
    disabled?: boolean;
    deleted?: boolean;
}

interface SystemProviderProps {
    children: ReactNode;
}

interface SystemsContextType {
    systems: System[];
    sortStatus: 'abc' | 'zyx' | 'custom' | 'shuffled';
    activeSystem: System | undefined;
    customSort: () => void;
    shuffleSystems: () => void;
    reloadSystems: () => void;
    setActiveSystem: (systemId: string) => void;
    setSystemSearched: (systemId: string) => void;
    toggleAlphabeticalSortOrder: () => void;
    resetSystemsState: () => void;
    toggleSystemDisabled: (systemId: string) => void;
    toggleSystemDeleted: (systemId: string) => void;
    systemsCurrentOrder: System[];
    setSystemsCurrentOrder: (newOrder: System[]) => void;
    isResetDisabled: boolean;
}

// Create the context with a default value
const SystemsContext = createContext<SystemsContextType>(
    {
        systems: [], 
        activeSystem: systems[0],
        sortStatus: 'shuffled',
        customSort: () => { },
        shuffleSystems: () => { },
        reloadSystems: () => { },
        setActiveSystem: () => { },
        setSystemSearched: () => { },
        toggleAlphabeticalSortOrder: () => { },
        resetSystemsState: () => { },
        toggleSystemDisabled: () => { },
        toggleSystemDeleted: () => { },
        systemsCurrentOrder: systems,
        setSystemsCurrentOrder: () => {},
        isResetDisabled: true
    });

export const SystemTitle: React.FC<{ system: System, className?: string }> = ({ system, className }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <span className={`flex items-center ${className}`}>
            {hasMounted ? (
                <>
                    <img src={`/favicons/${system.id}.ico`} alt={`${system.name} favicon`} className="w-5 h-5 mr-2" />
                    {system.name}
                </>
            ) : (
                <span>Loading...</span>
            )}
        </span>
    );
};

// Export the useContext hook for SystemsContext
export const useSystemsContext = () => useContext(SystemsContext);

export const SystemProvider: React.FC<SystemProviderProps> = ({ children }) => {
    const { systemsDisabled, systemsDeleted, systemsCustomOrder, systemsSearched, customModeOnLoad } = useStorage();
    const { setSystemDisabled, setSystemDeleted, setSystemsStateSearched } = useStorage()
    const [systemsCurrentOrder, setSystemsCurrentOrder] = useState<System[]>(systems);
    const [isResetDisabled, setIsResetDisabled] = useState<boolean>(true);
    
    const initializeSystemsState = (
        systemsDisabled: Record<string, boolean> = {},
        systemsDeleted: Record<string, boolean> = {},
        systemsSearched: Record<string, boolean> = {}
        ) => {
        return systems.map(system => ({
            ...system,
            searched: systemsSearched[system.id] ?? false,
            disabled: systemsDisabled[system.id] ?? false,
            deleted: systemsDeleted[system.id] ?? false,
        }));
    };
    const [systemsState, setSystemsState] = useState<System[]>(
        () => initializeSystemsState(systemsDisabled, systemsDeleted, systemsSearched));
    const [activeSystem, setActiveSystemState] = useState<System | undefined>(() => systems[0]);
    const [sortStatus, setSortStatus] = useState<'abc' | 'zyx' | 'custom' | 'shuffled'>('shuffled');

    useEffect(() => {
        if (customModeOnLoad && systemsCustomOrder.length > 0) {
            setSystemsCurrentOrder(
                systemsCustomOrder.map(id => systems.find(system => system.id === id))
                .filter((system): system is System => system !== undefined)
            );
            setSortStatus('custom');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const defaultSystemOrder = systems.map(system => system.id);
        const hasCustomOrder = systemsCustomOrder.length > 0 && !systemsCustomOrder.every((id, index) => id === defaultSystemOrder[index]);
        const hasDeletedOrDisabledSystems = Object.values(systemsDeleted).some(value => value) || Object.values(systemsDisabled).some(value => value);
        setIsResetDisabled(!hasCustomOrder && !hasDeletedOrDisabledSystems);
        
    }, [systemsCustomOrder, systemsDeleted, systemsDisabled]);


    useEffect(() => {
        if (systemsCustomOrder.length === 0) {
            setSystemsCurrentOrder(systems);
            return;
        }

        setSystemsCurrentOrder(systemsCustomOrder.map((id) =>
            systems.find((system) => system.id === id)
            ).filter((system): system is System => system !== undefined)
        );
    }, [systemsCustomOrder]);
   
    const shuffleSystems = () => {
        setSystemsState(currentSystems => {
            let shuffledSystems = [...currentSystems];
            for (let i = shuffledSystems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledSystems[i], shuffledSystems[j]] = [shuffledSystems[j], shuffledSystems[i]]; // swap
            }
            setActiveSystemState(shuffledSystems[0]);
            setSystemsCurrentOrder(shuffledSystems);
            return shuffledSystems;
        });
        setSortStatus('shuffled');
    };

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

    const setActiveSystem = (systemId: string) => {
        const matchingSystem = systemsCurrentOrder.find(system => system.id === systemId);
        if (matchingSystem) {
            setActiveSystemState(matchingSystem);
        } else {
            const firstUnsearchedSystem = systemsCurrentOrder.find(system => !systemsSearched[system.id]);
            setActiveSystemState(firstUnsearchedSystem || systemsCurrentOrder[0]);
        }
    };

    if (!activeSystem) {
        const firstUnsearchedSystem = systemsState.find(system => !system.searched);
        setActiveSystemState(firstUnsearchedSystem || systems[0]);
    }

    const resetSystemsState = () => {
        setSystemsState(systems);
    }

    const reloadSystems = () => {
        console.log('reloadSystems')
        Object.keys(systemsSearched).forEach(key => {
            systemsSearched[key] = false;
        });
        setSystemsState(initializeSystemsState(systemsDisabled, systemsDeleted, systemsSearched));
    };

    const toggleAlphabeticalSortOrder = () => {
        console.log("in toggleAlphabeticalSortOrder")
        if (sortStatus === 'abc') {
            setSystemsState(currentSystems => {
                const sortedSystems = [...currentSystems].sort((a, b) => b.name.localeCompare(a.name));
                setSystemsCurrentOrder(sortedSystems); // Update systemsCurrentOrder
                return sortedSystems;
            });
            setSortStatus('zyx');
        } else {
            setSystemsState(currentSystems => {
                const sortedSystems = [...currentSystems].sort((a, b) => a.name.localeCompare(b.name));
                setSystemsCurrentOrder(sortedSystems); // Update systemsCurrentOrder
                return sortedSystems;
            });
            setSortStatus('abc');
        }
    };

    const customSort = () => {
        if (!systemsCustomOrder || systemsCustomOrder.length === 0) {
            alert("No custom sort order has been saved. Please set up a custom sort order in Settings first.");
            return;
        }
        const order: string[] = systemsCustomOrder
        const sortedSystems = order.map(id => systemsState.find(system => system.id === id)).filter(system => system) as System[];
        setSystemsState(sortedSystems);
        setSystemsCurrentOrder(sortedSystems);
    };

    const toggleSystemDisabled = (systemId: string) => {
        setSystemDisabled(systemId, !systemsDisabled[systemId]);
    };

    const toggleSystemDeleted = (systemId: string) => {
        setSystemDeleted(systemId, !systemsDeleted[systemId]);
    };

    useEffect(() => {
        console.log("sortStatus", sortStatus)
    }, [sortStatus]);


    useEffect(() => {
        setSystemsState((prevSystems) =>
            prevSystems.map((system) => ({
                ...system,
                disabled: systemsDisabled[system.id] || false,
                deleted: systemsDeleted[system.id] || false,
                searched: systemsSearched[system.id] || false,
            }))
        );
    }, [systemsDisabled, systemsDeleted, systemsSearched]);

    return (
        <SystemsContext.Provider value={
            { 
                systems: systemsState,
                sortStatus,
                customSort,
                shuffleSystems,
                reloadSystems,
                setActiveSystem,
                setSystemSearched,
                toggleAlphabeticalSortOrder,
                activeSystem,
                resetSystemsState,
                toggleSystemDisabled,
                toggleSystemDeleted,
                systemsCurrentOrder,
                setSystemsCurrentOrder,
                isResetDisabled
            }}>
            {children}
        </SystemsContext.Provider>
    );
};