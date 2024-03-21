// SystemsContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useStorage } from "./StorageContext"; 
import systemsData from "../../data/systems.json";
import Image from 'next/image';

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
    sortStatus: 'abc' | 'zyx' | 'custom' | 'shuffled' | 'initial';
    activeSystem: System | undefined;
    customSort: (type?: string) => void;
    reloadSystems: () => void;
    setActiveSystem: (systemId: string) => void;
    setSystemSearched: (systemId: string) => void;
    toggleAlphabeticalSortOrder: () => void;
    resetSystemsState: () => void;
    toggleSystemDisabled: (systemId: string) => void;
    toggleSystemDeleted: (systemId: string) => void;
    systemsCurrentOrder: System[];
    setSystemsCurrentOrder: (newOrder: System[]) => void;
    setShuffleSystems: () => void;
    updateDragOrder: (newOrderedSystems: System[]) => void;
    isResetDisabled: boolean;
    initializeSystemsState: (systemsDisabled: any, systemsDeleted: any, systemsSearched: any) => System[];
    expandAllStatus: boolean;
    toggleExpandAll: () => void;
    checkboxStatuses: Record<string, boolean>;
    setCheckboxStatus: (systemId: string, status: boolean) => void;
}

export const shuffleSystems = () => {
    let shuffledSystems = [...systems];
    let isSameOrder = true;

    if (typeof window !== 'undefined') {
        const currentURL = window.location.href;
        if (currentURL.includes("?systems=")) {
            const systemIDs = currentURL.split('?systems=')[1].split(',');
            if (Array.isArray(systemIDs)) {
                const foundSystems = systemIDs.map(systemID => systems.find((system: System) => system.id === systemID)).filter(system => system !== undefined);
                if (foundSystems.length > 0) {
                    return foundSystems;
                } else {
                    throw new Error("No systems found for the given IDs.");
                }
            }
        }
    }

    // Ensure the shuffled array is different from the original
    while (isSameOrder) {
        for (let i = shuffledSystems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSystems[i], shuffledSystems[j]] = [shuffledSystems[j], shuffledSystems[i]];
        }

        // Check if the order is different from the original
        isSameOrder = shuffledSystems.every((system, index) => system === systems[index]);

        // If the order is still the same, reset shuffledSystems to original and try again
        if (isSameOrder) {
            shuffledSystems = [...systems];
        }
    }

    return shuffledSystems;
};



// Create the context with a default value
const SystemsContext = createContext<SystemsContextType>(
    {
        systems: [], 
        activeSystem: systems[0],
        sortStatus: 'initial',
        customSort: () => { },
        reloadSystems: () => { },
        setActiveSystem: () => { },
        setSystemSearched: () => { },
        toggleAlphabeticalSortOrder: () => { },
        resetSystemsState: () => { },
        toggleSystemDisabled: () => { },
        toggleSystemDeleted: () => { },
        systemsCurrentOrder: shuffleSystems() as System[],
        setSystemsCurrentOrder: () => { },
        setShuffleSystems: () => { },
        updateDragOrder: (newOrderedSystems: System[]) => { },
        isResetDisabled: true,
        initializeSystemsState: () => { return systems },
        expandAllStatus: false,
        toggleExpandAll: () => { },
        checkboxStatuses: {},
        setCheckboxStatus: (systemId: string, status: boolean) => { },
    });

export const SystemTitle: React.FC<{ system: System, className?: string }> = ({ system, className }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <div className={`flex items-center m-0 p-0 ${className}`}>
            {hasMounted ? (
                <>
                    <Image src={`/favicons/${system.id}.ico`} alt={`${system.name} favicon`} width={15} height={15} quality={75} className="w-4 h-4 mr-2" />
                    {system.name}
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};



// Export the useContext hook for SystemsContext
export const useSystemsContext = () => useContext(SystemsContext);

export const SystemProvider: React.FC<SystemProviderProps> = ({ children }) => {
    const { systemsDisabled, systemsDeleted, systemsCustomOrder, systemsSearched, customModeOnLoad } = useStorage();
    const { setSystemDisabled, setSystemsCustomOrder, setSystemDeleted, setSystemsStateSearched } = useStorage()
    const [systemsCurrentOrder, setSystemsCurrentOrder] = useState<System[]>(shuffleSystems() as System[]);
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
    const [sortStatus, setSortStatus] = useState<'abc' | 'zyx' | 'custom' | 'shuffled' | 'initial'>('initial');

    const updateSortStatus = (newStatus: 'abc' | 'zyx' | 'custom' | 'shuffled' | 'initial') => {
        console.log("in updateSortStatus, new:", newStatus)
        setSortStatus(newStatus);
    }

    const [expandAllStatus, setExpandAllStatus] = useState(false);

    const toggleExpandAll = () => {
        setExpandAllStatus(!expandAllStatus);
    };

    const customSort = useCallback((type?: string) => {
        if (type === "click" || type === "initial") {
            if (sortStatus === 'custom') {
                alert("Custom sort order is already active.");
                return;
            }
            if (!systemsCustomOrder || systemsCustomOrder.length === 0) {
                alert("No custom sort order has been saved. Please set up a custom sort order in Settings first.");
                return;
            }
            const order: string[] = systemsCustomOrder
            const sortedSystems = order.map(id => systemsState.find(system => system.id === id)).filter(system => system) as System[];
            setSystemsState(sortedSystems);
            setSystemsCurrentOrder(sortedSystems);
            updateSortStatus('custom');
        } else if (customModeOnLoad && sortStatus === 'initial') {
            customSort(type="initial");
        }
    }, [systemsCustomOrder, systemsState, sortStatus, customModeOnLoad]);

    useEffect(() => {
        if (customModeOnLoad && sortStatus === 'initial') {
            customSort();
        }
    }, [customModeOnLoad, customSort, sortStatus]);

    useEffect(() => {
        const defaultSystemOrder = systems.map(system => system.id);
        const hasCustomOrder = systemsCustomOrder.length > 0 && !systemsCustomOrder.every((id, index) => id === defaultSystemOrder[index]);
        const hasDeletedOrDisabledSystems = Object.values(systemsDeleted).some(value => value) || Object.values(systemsDisabled).some(value => value);
        setIsResetDisabled(!hasCustomOrder && !hasDeletedOrDisabledSystems);
        
    }, [systemsCustomOrder, systemsDeleted, systemsDisabled]);


    useEffect(() => {
        if (systemsCustomOrder.length === 0) {
            updateSortStatus('shuffled');
            return;
        }
    }, [systemsCustomOrder]);
   


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
        if (Object.values(systemsSearched).length === 0) {
            alert("No systems have been searched in this session.")
            return;
        }
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
            updateSortStatus('zyx');
        } else {
            setSystemsState(currentSystems => {
                const sortedSystems = [...currentSystems].sort((a, b) => a.name.localeCompare(b.name));
                setSystemsCurrentOrder(sortedSystems); // Update systemsCurrentOrder
                return sortedSystems;
            });
            updateSortStatus('abc');
        }
    };


    const [checkboxStatuses, setCheckboxStatuses] = useState<Record<string, boolean>>({});

    const setCheckboxStatus = (systemId: string, status: boolean) => {
        setCheckboxStatuses({...checkboxStatuses, [systemId]: status});
    }

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

    const setShuffleSystems = () => {
        setSystemsCurrentOrder(shuffleSystems() as System[]);
        updateSortStatus('shuffled');
    }

    const updateDragOrder = (newOrderedSystems: System[]) => {
        setSystemsCurrentOrder(newOrderedSystems);
        setSystemsCustomOrder(newOrderedSystems.map(item => item.id));
        setSortStatus('custom');
    }



    return (
        <SystemsContext.Provider value={
            { 
                systems: systemsState,
                sortStatus,
                customSort,
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
                isResetDisabled,
                setShuffleSystems,
                updateDragOrder,
                initializeSystemsState,
                expandAllStatus,
                toggleExpandAll,
                checkboxStatuses,
                setCheckboxStatus,
            }}>
            {children}
        </SystemsContext.Provider>
    );
};