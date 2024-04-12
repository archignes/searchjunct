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
    isUndoAvailable: boolean;
    isRedoAvailable: boolean;
    undoSort: () => void;
    redoSort: () => void;
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
        isUndoAvailable: false,
        isRedoAvailable: false,
        undoSort: () => { },
        redoSort: () => { },
    });

export const shuffleSystems = (allSystems: System[], manualTrigger: boolean = false) => {
    let shuffledSystems = [...allSystems];
    let isSameOrder = true;


    // If shuffle is not manually triggered, respect URL params
    if (!manualTrigger && typeof window !== 'undefined') {
        const currentURL = new URL(window.location.href);
        if (currentURL.searchParams.has("systems")) {
            const systemIDs = currentURL.searchParams.get("systems")?.split(',');
            if (Array.isArray(systemIDs)) {
                const foundSystems = systemIDs.map(systemID => allSystems.find((system: System) => system.id === systemID)).filter(system => system !== undefined);
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

        isSameOrder = shuffledSystems.every((system, index) => system === allSystems[index]);
        if (isSameOrder) {
            shuffledSystems = [...allSystems];
        }
    }

    return shuffledSystems;
};

export const useSortContext = () => useContext(SortContext);

export const SortProvider: React.FC<SortProviderProps> = ({ children }) => {
    const { systemsCustomOrder,
        customModeOnLoad,
        setSystemsCustomOrder } = useStorageContext();
    const { allSystems, systemsState, setSystemsState } = useSystemsContext();
    const { updateURLQueryParams, urlSystems } = useAddressContext();

    const [systemsCurrentOrder, setSystemsCurrentOrder] = useState<System[]>(shuffleSystems(allSystems) as System[]);
    
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
                // alert("No custom sort order has been saved. Please set up a custom sort order by dragging systems.");
                return;
            }
            // Retrieve custom order from storage
            const order: string[] = systemsCustomOrder;
            // Map the custom order to the systems state, filtering out any undefined entries
            const sortedSystems: System[] = order.reduce((acc: System[], id) => {
                const system = allSystems.find(system => system.id === id);
                if (system) acc.push(system);
                return acc;
            }, []);

            // Add any systems not in order (new systems) to the end of sortedSystems
            allSystems.forEach((system) => {
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
        } else if (customModeOnLoad && sortStatus === 'initial' && urlSystems.length === 0) {
            // If custom mode should be loaded initially and sort status is initial, trigger custom sort
            customSort(type="initial");
        }
    }, [updateURLQueryParams, setSystemsState, allSystems, systemsCustomOrder, sortStatus, customModeOnLoad, urlSystems]);

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


    // Sort history, undo/redo functionality
    const { customSortHistory, setCustomSortHistory } = useStorageContext();
    const [currentSortIndex, setCurrentSortIndex] = useState(customSortHistory.length - 1);

    useEffect(() => {
        // Ensure the currentSortIndex is updated when customSortHistory changes
        setCurrentSortIndex(customSortHistory.length - 1);
    }, [customSortHistory]);
    // Function to undo the last sort action
    const undoSort = () => {
        // Calculate the new index by decrementing the current index
        const newIndex = currentSortIndex - 1;
        // Check if the new index is valid
        if (newIndex >= 0) {
            // Retrieve the system IDs from the custom sort history at the new index
            const previousSortSystemIds = customSortHistory[newIndex];
            // Map the system IDs to their corresponding system objects, ensuring no undefined values
            const previousSortSystems = previousSortSystemIds
                .map(systemId => systemsState.find(system => system.id === systemId))
                .filter((system): system is System => system !== undefined);
            // Update the current order of systems to the previous sort
            setSystemsCurrentOrder(previousSortSystems);
            // Update the current sort index to the new index
            setCurrentSortIndex(newIndex);
            // Update the sort status to 'custom' to reflect the undo action
            updateSortStatus('custom');
        }
    };

    // Function to redo the last undone sort action
    const redoSort = () => {
        // Calculate the next index in the sort history
        const newIndex = currentSortIndex + 1;
        // Check if the next index is within the bounds of the sort history
        if (newIndex < customSortHistory.length) {
            // Retrieve the system IDs for the next sort from the history
            const nextSortSystemIds = customSortHistory[newIndex];
            // Map the system IDs to their corresponding system objects
            // and filter out any undefined values
            const nextSortSystems = nextSortSystemIds
                .map(systemId => systemsState.find(system => system.id === systemId))
                .filter((system): system is System => system !== undefined);
            // Update the current order of systems to the next sort
            setSystemsCurrentOrder(nextSortSystems);
            // Update the current sort index to the new index
            setCurrentSortIndex(newIndex);
            // Update the sort status to 'custom' to reflect the redo action
            updateSortStatus('custom');
        }
    };

    const addSortToHistory = (newSort: string[]) => {
        // If a new sort is added after undoing, remove all sorts that came after the current index
        const updatedHistory = [...customSortHistory.slice(0, currentSortIndex + 1), newSort];
        setCustomSortHistory(updatedHistory);
        setCurrentSortIndex(updatedHistory.length - 1); // Update index to the new latest sort
    };

    const isUndoAvailable = currentSortIndex > 0;
    const isRedoAvailable = currentSortIndex < customSortHistory.length - 1;




    const setShuffleSystems = (click?: boolean) => {
        if (click) {
            setSystemsCurrentOrder(shuffleSystems(allSystems, click) as System[]);
            updateURLQueryParams([{ urlParam: 'systems', value: '' }]); // Remove the systems param
        } else {
            setSystemsCurrentOrder(shuffleSystems(allSystems) as System[]);
        }
        updateSortStatus('shuffled');
    }

    const updateDragOrder = (newOrderedSystems: System[]) => {
        setSystemsCurrentOrder(newOrderedSystems);
        setSystemsCustomOrder(newOrderedSystems.map(item => item.id));
        addSortToHistory(newOrderedSystems.map(item => item.id));
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
            undoSort,
            redoSort,
            isUndoAvailable,
            isRedoAvailable,
        }}>
            {children}
        </SortContext.Provider>
    );
};