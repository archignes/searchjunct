// contexts/SortContext.tsx
import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { System } from '../types/system';
import { useStorageContext, useSystemsContext, useAddressContext } from "./";


interface SortProviderProps {
    children: React.ReactNode;
    testSystems?: System[];
}

interface SortContextType {
    sortStatus: 'abc' | 'zyx' | 'param' | 'custom' | 'shuffled' | 'initial';
    customSort: (type?: string) => void;
    toggleAlphabeticalSortOrder: () => void;
    systemsCurrentOrder: System[];
    setSystemsCurrentOrder: (newOrder: System[]) => void;
    setShuffleSystems: (click?: boolean) => void;
    updateSortStatus: (newStatus: 'abc' | 'zyx' | 'param' | 'custom' | 'shuffled' | 'initial') => void;
    updateDragOrder: (newOrderedSystems: System[]) => void;
}
// contexts/SortContext.tsx
const SortContext = createContext<SortContextType>(
    {
        sortStatus: 'initial',
        customSort: () => { },
        toggleAlphabeticalSortOrder: () => { },
        systemsCurrentOrder: [],
        setSystemsCurrentOrder: () => { },
        setShuffleSystems: () => { },
        updateSortStatus: () => { },
        updateDragOrder: () => { },
    });

export const shuffleSystems = (systems: System[], manualTrigger: boolean = false) => {
    let shuffledSystems = [...systems];
    let isSameOrder = true;


    // If shuffle is not manually triggered, respect URL params
    if (!manualTrigger && typeof window !== 'undefined') {
        const currentURL = new URL(window.location.href);
        if (currentURL.searchParams.has("systems")) {
            const systemIDs = currentURL.searchParams.get("systems")?.split(',');
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
    // Shuffle logic remains the same
    while (isSameOrder) {
        for (let i = shuffledSystems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSystems[i], shuffledSystems[j]] = [shuffledSystems[j], shuffledSystems[i]];
        }

        isSameOrder = shuffledSystems.every((system, index) => system === systems[index]);
        if (isSameOrder) {
            shuffledSystems = [...systems];
        }
    }

    return shuffledSystems;
};

export const useSortContext = () => useContext(SortContext);

export const SortProvider: React.FC<SortProviderProps> = ({ children }) => {
    const { systemsCustomOrder,
        customModeOnLoad,
        setSystemsCustomOrder } = useStorageContext();
    const { systems, systemsState, setSystemsState } = useSystemsContext();
    const { updateURLQueryParams } = useAddressContext();

    const [systemsCurrentOrder, setSystemsCurrentOrder] = useState<System[]>(shuffleSystems(systems) as System[]);
    
    const [sortStatus, setSortStatus] = useState<'abc' | 'zyx' | 'param' | 'custom' | 'shuffled' | 'initial'>('initial');

    const updateSortStatus = (newStatus: 'abc' | 'zyx' | 'param' | 'custom' | 'shuffled' | 'initial') => {
        setSortStatus(newStatus);
    }


    // Define customSort function with useCallback for optimized performance
    const customSort = useCallback((type?: string) => {
        // Handle cases where sort is triggered by a click or initially
        if (type === "click" || type === "initial") {
            // Prevent setting custom sort if it's already active
            if (sortStatus === 'custom') {
                alert("Custom sort order is already active.");
                return;
            }
            // Alert if no custom sort order is set
            if (!systemsCustomOrder || systemsCustomOrder?.length === 0) {
                alert("No custom sort order has been saved. Please set up a custom sort order by dragging systems.");
                return;
            }
            // Retrieve custom order from storage
            const order: string[] = systemsCustomOrder;
            // Map the custom order to the systems state, filtering out any undefined entries
            const sortedSystems: System[] = order.reduce((acc: System[], id) => {
                const system = systems.find(system => system.id === id);
                if (system) acc.push(system);
                return acc;
            }, []);

            // Add any systems not in order (new systems) to the end of sortedSystems
            systems.forEach((system) => {
                if (!order.includes(system.id)) {
                    sortedSystems.push(system);
                }
            });
            // Update state with the sorted systems
            setSystemsState(sortedSystems);
            setSystemsCurrentOrder(sortedSystems);
            // Mark the sort status as custom
            updateSortStatus('custom');
            // Clear the systems parameter from the URL
            updateURLQueryParams([{ urlParam: 'systems', value: '' }]);
        } else if (customModeOnLoad && sortStatus === 'initial') {
            // If custom mode should be loaded initially and sort status is initial, trigger custom sort
            customSort(type="initial");
        }
    }, [updateURLQueryParams, setSystemsState, systems, systemsCustomOrder, sortStatus, customModeOnLoad]);

    // Effect to handle initial custom sort based on conditions
    useEffect(() => {
        // Check if custom mode should be loaded initially and sort status is 'initial'
        if (customModeOnLoad && sortStatus === 'initial') {
            // Trigger custom sort function
            customSort();
        }
    }, [customModeOnLoad, customSort, sortStatus]); // Dependencies for effect re-run

    useEffect(() => {
        if (systemsCustomOrder?.length === 0) {
            updateSortStatus('shuffled');
            return;
        }
    }, [systemsCustomOrder]);
   
    const toggleAlphabeticalSortOrder = () => {
        if (sortStatus === 'abc') {
            const sortedSystems = [...systemsState].sort((a, b) => b.name.localeCompare(a.name));
            setSystemsState(sortedSystems); // Update systemsState directly
            setSystemsCurrentOrder(sortedSystems); // Update systemsCurrentOrder
            updateSortStatus('zyx');
        } else {
            const sortedSystems = [...systemsState].sort((a, b) => a.name.localeCompare(b.name));
            setSystemsState(sortedSystems); // Update systemsState directly
            setSystemsCurrentOrder(sortedSystems); // Update systemsCurrentOrder
            updateSortStatus('abc');
        }
    };

    useEffect(() => {
        console.log("sortStatus", sortStatus)
    }, [sortStatus]);

    const setShuffleSystems = (click?: boolean) => {
        if (click) {
            setSystemsCurrentOrder(shuffleSystems(systems, click) as System[]);
            updateURLQueryParams([{ urlParam: 'systems', value: '' }]); // Remove the systems param
        } else {
            setSystemsCurrentOrder(shuffleSystems(systems) as System[]);
        }
        updateSortStatus('shuffled');
    }

    const updateDragOrder = (newOrderedSystems: System[]) => {
        setSystemsCurrentOrder(newOrderedSystems);
        setSystemsCustomOrder(newOrderedSystems.map(item => item.id));
        setSortStatus('custom');
    }

    return (
        <SortContext.Provider value={{
            sortStatus,
            updateSortStatus,
            customSort,
            toggleAlphabeticalSortOrder,
            systemsCurrentOrder,
            setSystemsCurrentOrder,
            setShuffleSystems,
            updateDragOrder,
        }}>
            {children}
        </SortContext.Provider>
    );
};