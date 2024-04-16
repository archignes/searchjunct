// contexts/SortContext.tsx
import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from 'react';
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
    isInitialCustomSort: boolean;
    isUndoAvailable: boolean;
    isRedoAvailable: boolean;
    undoSort: () => void;
    redoSort: () => void;
    systemsCustomOrderSetting: string[];
    deleteCustomSortOrder: () => void;
    customModeOnLoadSetting: boolean;
    toggleCustomModeOnLoadSetting: () => void;
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
        isInitialCustomSort: false,
        isUndoAvailable: false,
        isRedoAvailable: false,
        undoSort: () => { },
        redoSort: () => { },
        systemsCustomOrderSetting: [],
        deleteCustomSortOrder: () => { },
        customModeOnLoadSetting: false,
        toggleCustomModeOnLoadSetting: () => { },
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
        setCustomModeOnLoad,
        setSystemsCustomOrder } = useStorageContext();
    const { allSystems, systemsState, setSystemsState } = useSystemsContext();
    const { updateURLQueryParams, urlSystems } = useAddressContext();

    // Check if allSystems is empty and initialize systemsCurrentOrder accordingly
    const [systemsCurrentOrder, setSystemsCurrentOrder] = useState<System[]>(
        allSystems.length > 0 ? shuffleSystems(allSystems) as System[] : []
    );
    
    const [sortStatus, setSortStatus] = useState<'abc' | 'zyx' | 'param' | 'custom' | 'shuffled' | 'initial'>('initial');

    const updateSortStatus = useCallback((newStatus: 'abc' | 'zyx' | 'param' | 'custom' | 'shuffled' | 'initial') => {
        setSortStatus(newStatus);
    }, [setSortStatus]);

    useEffect(() => {
        if (urlSystems.length > 0) {
            const systems = urlSystems.split(",");
            setSystemsCurrentOrder(systems.map((systemID: string) => allSystems.find(system => system.id === systemID) as System));
            updateSortStatus('param');
        }
    }, [urlSystems, allSystems, setSystemsCurrentOrder, updateSortStatus]);

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
    }, [updateURLQueryParams, setSystemsState, 
        allSystems, systemsCustomOrder, sortStatus,
        customModeOnLoad, urlSystems, updateSortStatus]);

    const toggleCustomModeOnLoadSetting = () => {
        if (!systemsCustomOrder || systemsCustomOrder?.length === 0) {
            return;
        } 
        if (customModeOnLoad) {
            setCustomModeOnLoad(false);
        } else {
            setCustomModeOnLoad(true);
        }
    }


    const deleteCustomSortOrder = () => {
        if (!systemsCustomOrder || systemsCustomOrder?.length === 0) {
            return;
        }
        setCustomSortHistory([]);
        setSystemsCustomOrder([]);
        setShuffleSystems(true);
    }

    // Effect to handle initial custom sort based on conditions
    useEffect(() => {
        // Check if custom mode should be loaded initially and sort status is 'initial'
        if (customModeOnLoad && sortStatus === 'initial') {
            // Trigger custom sort function
            customSort();
        }
    }, [customModeOnLoad, customSort, sortStatus]); // Dependencies for effect re-run

    useEffect(() => {
        if (systemsCustomOrder?.length === 0 && urlSystems.length === 0) {
            updateSortStatus('shuffled');
        }
    }, [systemsCustomOrder, urlSystems, updateSortStatus]);

    const alphabeticalSortedSystems = useMemo(() => {
        if (sortStatus === 'abc') {
            return [...systemsState].sort((a, b) => a.name.localeCompare(b.name));
        } else {
            return [...systemsState].sort((a, b) => b.name.localeCompare(a.name));
        }
    }, [sortStatus, systemsState]);

    const toggleAlphabeticalSortOrder = () => {
        setSystemsState(alphabeticalSortedSystems);
        setSystemsCurrentOrder(alphabeticalSortedSystems);
        updateSortStatus(sortStatus === 'abc' ? 'zyx' : 'abc');
    };

    // Sort history, undo/redo functionality
    const { customSortHistory, setCustomSortHistory } = useStorageContext();
    const [currentSortIndex, setCurrentSortIndex] = useState(customSortHistory.length - 1);
    const [isInitialCustomSort, setIsInitialCustomSort] = useState(false);

    useEffect(() => {
        // Ensure the currentSortIndex is updated when customSortHistory changes
        setCurrentSortIndex(customSortHistory.length - 1);
    }, [customSortHistory]);

    useEffect(() => {
        // Check if the current custom sort index is equal to the 0th index in customSortHistory
        setIsInitialCustomSort(currentSortIndex === 0);
    }, [currentSortIndex]);
    
    const getPreviousSortSystems = (newIndex: number) => {
        const previousSortSystemIds = customSortHistory[newIndex];
        return previousSortSystemIds
            .map(systemId => allSystems.find(system => system.id === systemId))
            .filter((system): system is System => system !== undefined);
    };

    const getNextSortSystems = (newIndex: number) => {
        const nextSortSystemIds = customSortHistory[newIndex];
        return nextSortSystemIds
            .map(systemId => allSystems.find(system => system.id === systemId))
            .filter((system): system is System => system !== undefined);
    };

    // Function to undo the last sort action
    const undoSort = () => {
        // Calculate the new index by decrementing the current index
        const newIndex = currentSortIndex - 1;
        // Check if the new index is valid
        if (newIndex >= 0) {
            const previousSortSystems = getPreviousSortSystems(newIndex);
            // Update the current order of systems to the previous sort
            setSystemsCurrentOrder(previousSortSystems);
            setSystemsState(previousSortSystems);
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
            const nextSortSystems = getNextSortSystems(newIndex);
            // Update the current order of systems to the next sort
            setSystemsCurrentOrder(nextSortSystems);
            setSystemsState(nextSortSystems);
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
    
    const isUndoAvailable = useMemo(() => {
        return currentSortIndex > 0 && customSortHistory.length > 1;
    }, [currentSortIndex, customSortHistory]);

    const isRedoAvailable = useMemo(() => {
        return currentSortIndex < customSortHistory.length - 1;
    }, [currentSortIndex, customSortHistory]);


    const setShuffleSystems = (click?: boolean) => {
        if (click) {
            const shuffledSystems = shuffleSystems(allSystems, click) as System[];
            setSystemsCurrentOrder(shuffledSystems);
            updateURLQueryParams([{ urlParam: 'systems', value: '' }]); // Remove the systems param
        } else {
            const shuffledSystems = shuffleSystems(allSystems) as System[];
            setSystemsCurrentOrder(shuffledSystems);
        }
        updateSortStatus('shuffled');

    }

    const updateDragOrder = (newOrderedSystems: System[]) => {
        setSystemsCurrentOrder(newOrderedSystems);
        setSystemsCustomOrder(newOrderedSystems.map(item => item.id));
        addSortToHistory(newOrderedSystems.map(item => item.id));
        setSortStatus('custom');
    }

    const customModeOnLoadSetting = customModeOnLoad;
    const systemsCustomOrderSetting = systemsCustomOrder;

    return (
        <SortContext.Provider value={{
            sortStatus,
            updateSortStatus,
            customSort,
            toggleAlphabeticalSortOrder,
            isInitialCustomSort,
            systemsCurrentOrder,
            setSystemsCurrentOrder,
            setShuffleSystems,
            updateDragOrder,
            undoSort,
            redoSort,
            systemsCustomOrderSetting,
            deleteCustomSortOrder,
            isUndoAvailable,
            isRedoAvailable,
            customModeOnLoadSetting,
            toggleCustomModeOnLoadSetting,
        }}>
            {children}
        </SortContext.Provider>
    );
};