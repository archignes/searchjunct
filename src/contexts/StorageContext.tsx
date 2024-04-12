import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { MultisearchActionObject } from '@/types';
import { System } from '@/types';

interface StorageContextType {
    // user setting used to initiate the first search immediately on load
    initiateSearchImmediately: boolean;
    setInitiateSearchImmediately: (value: boolean) => void;

    // flag used to skip or stop running searches via `initiateSearchImmediately`
    flagSearchInitiated: boolean;
    updateFlagSearchInitiated: (value: boolean) => void;

    // user setting used in determining which systems are disabled
    systemsDisabled: Record<string, boolean>;
    setSystemDisabled: (systemId: string, value: boolean) => void;
    getAnyDisabledStatus: (systems: System[]) => boolean;

    // user setting used in determining which systems are deleted
    systemsDeleted: Record<string, boolean>;
    setSystemDeleted: (systemId: string, value: boolean) => void;
    getAnyDeletedStatus: (systems: System[]) => boolean;
    
    // user setting used in determining the order of systems in the custom mode
    systemsCustomOrder: string[];
    setSystemsCustomOrder: (order: string[]) => void;
    
    // UI event to reset localStorage re deleted and disabled
    resetSystemsDeletedDisabled: () => void;
    
    // logs which systems have been searched with
    systemsSearched: Record<string, boolean>;
    setSystemsStateSearched: (systemId: string, value: boolean) => void;

    // UI event resets the search log
    resetSystemsDeletedDisabledSearched: () => void;
    
    // user setting used in determining if custom sort is set on load
    customModeOnLoad: boolean;
    setCustomModeOnLoad: (value: boolean) => void;
    
    // user setting used in determining to show the intro modal
    showIntroModal: boolean;
    setShowIntroModal: (value: boolean) => void;

    // default or user-defined multisearch shortcuts
    multisearchActionObjects: MultisearchActionObject[];
    addMultisearchActionObject: (shortcut: MultisearchActionObject) => void;
    removeMultisearchActionObject: (name: string) => void;

    // private search systems
    locallyStoredSearchSystems: System[];
    addLocallyStoredSearchSystem: (system: System) => void;
    updateLocallyStoredSearchSystem: (id: string, system: System) => void;
    removeLocallyStoredSearchSystem: (id: string) => void;
    importLocallyStoredSearchSystems: (systems: System[]) => void;
    exportLocallyStoredSearchSystems: () => System[];

    // history of custom sorts to support undo/redo
    customSortHistory: string[][];
    setCustomSortHistory: (history: string[][]) => void;
}

const StorageContext = createContext<StorageContextType>({
    initiateSearchImmediately: false,
    setInitiateSearchImmediately: () => { },
    flagSearchInitiated: false,
    updateFlagSearchInitiated: () => { },
    systemsDisabled: {},
    setSystemDisabled: () => { },
    getAnyDisabledStatus: () => false,
    systemsDeleted: {},
    setSystemDeleted: () => { },
    getAnyDeletedStatus: () => false,
    systemsCustomOrder: [],
    setSystemsCustomOrder: () => { },
    resetSystemsDeletedDisabled: () => { },
    systemsSearched: {},
    setSystemsStateSearched: () => { },
    resetSystemsDeletedDisabledSearched: () => { },
    customModeOnLoad: false,
    setCustomModeOnLoad: () => { },
    showIntroModal: true,
    setShowIntroModal: () => { },
    multisearchActionObjects: [],
    addMultisearchActionObject: () => { },
    removeMultisearchActionObject: () => { },
    locallyStoredSearchSystems: [],
    addLocallyStoredSearchSystem: () => { },
    updateLocallyStoredSearchSystem: () => { },
    removeLocallyStoredSearchSystem: () => { },
    importLocallyStoredSearchSystems: () => { },
    exportLocallyStoredSearchSystems: () => [],
    customSortHistory: [],
    setCustomSortHistory: () => {}
});

export const useStorageContext = () => useContext(StorageContext);

export const StorageProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // SessionStorage
    const [systemsSearched, setSystemsStateSearched] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem('systemsSearched');
            return item ? JSON.parse(item) : {};
        }
        return {};
    });
    
    const [flagSearchInitiated, setFlagSearchInitiated] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = sessionStorage.getItem('flagSearchInitiated');
            return storedValue ? JSON.parse(storedValue) : false;
        }
        return false;
    });

    // LocalStorage
    const [initiateSearchImmediately, setInitiateSearchImmediately] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('initiateSearchImmediately');
            return storedValue ? JSON.parse(storedValue) : false;
        }
        return false;
    });

    const [customModeOnLoad, setCustomModeOnLoad] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('customModeOnLoad');
            return storedValue ? JSON.parse(storedValue) : false;
        }
        return false;
    });

    const [systemsDisabled, setSystemDisabled] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('systemsDisabled');
            return storedValue ? JSON.parse(storedValue) : {};
        }
        return {};
    });

    const [systemsDeleted, setSystemDeleted] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('systemsDeleted');
            return storedValue ? JSON.parse(storedValue) : {};
        }
        return {};
    });

    const [systemsCustomOrder, setSystemsCustomOrder] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('systemsCustomOrder');
            return storedValue ? JSON.parse(storedValue) : [];
        }
        return [];
    });

    const [multisearchActionObjects, setMultisearchShortcuts] = useState<MultisearchActionObject[]>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('multisearchActionObjects');
            return storedValue ? JSON.parse(storedValue) : [];
        }
        return [];
    });

    const [showIntroModal, setShowIntroModal] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('showIntroModal');
            return storedValue ? JSON.parse(storedValue) : true;
        }
        return true;
    });

    const [locallyStoredSearchSystems, setLocallyStoredSearchSystems] = useState<System[]>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('locallyStoredSearchSystems');
            return storedValue ? JSON.parse(storedValue) : [];
        }
        return [];
    });

    const [customSortHistory, setCustomSortHistory] = useState<string[][]>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('customSortHistory');
            return storedValue ? JSON.parse(storedValue) : [];
        }
        return [];
    });

    const addLocallyStoredSearchSystem = useCallback((system: System) => {
        setLocallyStoredSearchSystems(prev => [...prev, system]);
    }, []);

    const updateLocallyStoredSearchSystem = useCallback((id: string, system: System) => {
        // First, remove the old system object from the array.
        // This ensures that if the system.id does not match the provided id,
        // the old system is removed.
        // Then, add the new system object to the array.
        // This ensures that if the system.id does not match the provided id,
        // the old system is removed, and the new one is added.
        setLocallyStoredSearchSystems(prev => [...prev.filter(s => s.id !== id), system]);
    }, []);

    const removeLocallyStoredSearchSystem = useCallback((id: string) => {
        setLocallyStoredSearchSystems(prev => prev.filter(system => system.id !== id));
    }, []); 
    
    const importLocallyStoredSearchSystems = useCallback((systems: System[]) => {
        setLocallyStoredSearchSystems(prev => [...prev, ...systems]);
    }, []);

    const exportLocallyStoredSearchSystems = useCallback(() => {
        return locallyStoredSearchSystems;
    }, [locallyStoredSearchSystems]);

    useEffect(() => {
        localStorage.setItem('locallyStoredSearchSystems', JSON.stringify(locallyStoredSearchSystems));
    }, [locallyStoredSearchSystems]);

    useEffect(() => {
        localStorage.setItem('customSortHistory', JSON.stringify(customSortHistory));
    }, [customSortHistory]);

    const resetSystemsDeletedDisabled = () => {
        setSystemDeleted({});
        setSystemDisabled({});

        localStorage.removeItem('systemsDeleted');
        localStorage.removeItem('systemsDisabled');
    };

    // Update sessionStorage when values change
    useEffect(() => {
        sessionStorage.setItem('flagSearchInitiated', flagSearchInitiated ? 'true' : 'false');
    }, [flagSearchInitiated]);

    // Update localStorage when values change
    useEffect(() => {
        localStorage.setItem('initiateSearchImmediately', JSON.stringify(initiateSearchImmediately));
    }, [initiateSearchImmediately]);

    useEffect(() => {
        localStorage.setItem('customModeOnLoad', JSON.stringify(customModeOnLoad));
    }, [customModeOnLoad]);

    useEffect(() => {
        localStorage.setItem('systemsDisabled', JSON.stringify(systemsDisabled));
    }, [systemsDisabled]);

    useEffect(() => {
        localStorage.setItem('systemsDeleted', JSON.stringify(systemsDeleted));
    }, [systemsDeleted]);

    useEffect(() => {
        localStorage.setItem('systemsCustomOrder', JSON.stringify(systemsCustomOrder));
    }, [systemsCustomOrder]);

    useEffect(() => {
        localStorage.setItem('showIntroModal', JSON.stringify(showIntroModal));
    }, [showIntroModal]);
    
    useEffect(() => {
        localStorage.setItem('multisearchActionObjects', JSON.stringify(multisearchActionObjects));
    }, [multisearchActionObjects]);

    // Functions to update values
    const updateFlagSearchInitiated = (value: boolean) => {
        setFlagSearchInitiated(value);
    };

    const updateSystemsSearched = (systemId: string, value: boolean) => {
        setSystemsStateSearched(prev => ({ ...prev, [systemId]: value }));
    };

    const resetSystemsDeletedDisabledSearched = () => {
        setSystemsStateSearched({});
    };
    
    const updateSystemDisabled = (systemId: string, value: boolean) => {
        setSystemDisabled(prev => ({ ...prev, [systemId]: value }));
    };

    const updateSystemDeleted = (systemId: string, value: boolean) => {
        setSystemDeleted(prev => ({ ...prev, [systemId]: value }));
    };

    const getAnyDeletedStatus = (systems: System[]) => {
        return Object.values(systemsDeleted).some(value => value);
    };

    const getAnyDisabledStatus = (systems: System[]) => {
        return Object.values(systemsDisabled).some(value => value);
    };

    // Inside your component or functional hook
    const addMultisearchActionObject = useCallback(
        (shortcut: { name: string; systems: { always: string[]; randomly: string[] }; count_from_randomly: number }) => {
            setMultisearchShortcuts(prev => {
                const shortcutExists = prev.some(s => s.name === shortcut.name);
                if (!shortcutExists) {
                    return [...prev, shortcut];
                }
                return prev;
            });
        },
        []
    ); // Add any dependencies if necessary

    const removeMultisearchActionObject = useCallback((name: string) => {
        setMultisearchShortcuts(prev => prev.filter(shortcut => shortcut.name !== name));
    }, []);

    const contextValue = useMemo(
        () => ({
            initiateSearchImmediately,
            setInitiateSearchImmediately,
            flagSearchInitiated,
            updateFlagSearchInitiated,
            systemsDisabled,
            systemsDeleted,
            setSystemDeleted: updateSystemDeleted,
            setSystemDisabled: updateSystemDisabled,
            systemsCustomOrder,
            setSystemsCustomOrder,
            resetSystemsDeletedDisabled,
            systemsSearched,
            setSystemsStateSearched: updateSystemsSearched,
            resetSystemsDeletedDisabledSearched,
            customModeOnLoad,
            setCustomModeOnLoad,
            showIntroModal,
            setShowIntroModal,
            multisearchActionObjects,
            addMultisearchActionObject,
            removeMultisearchActionObject,
            locallyStoredSearchSystems,
            addLocallyStoredSearchSystem,
            updateLocallyStoredSearchSystem,
            removeLocallyStoredSearchSystem,
            importLocallyStoredSearchSystems,
            exportLocallyStoredSearchSystems,
            customSortHistory,
            setCustomSortHistory,
            getAnyDeletedStatus,
            getAnyDisabledStatus
        }),
        [
            initiateSearchImmediately,
            flagSearchInitiated,
            systemsDisabled,
            systemsDeleted,
            systemsCustomOrder,
            systemsSearched,
            customModeOnLoad,
            setCustomModeOnLoad,
            showIntroModal,
            setShowIntroModal,
            multisearchActionObjects,
            addMultisearchActionObject,
            removeMultisearchActionObject,
            locallyStoredSearchSystems,
            addLocallyStoredSearchSystem,
            updateLocallyStoredSearchSystem,
            removeLocallyStoredSearchSystem,
            importLocallyStoredSearchSystems,
            exportLocallyStoredSearchSystems,
            customSortHistory,
            getAnyDeletedStatus,
            getAnyDisabledStatus
        ]
    );

    return (
        <StorageContext.Provider value={contextValue}>
            {children}
        </StorageContext.Provider>
    );
};