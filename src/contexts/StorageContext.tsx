import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { MultisearchActionObject } from '@/types';


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
    
    // user setting used in determining which systems are deleted
    systemsDeleted: Record<string, boolean>;
    setSystemDeleted: (systemId: string, value: boolean) => void;
    
    // user setting used in determining the order of systems in the custom mode
    systemsCustomOrder: string[];
    setSystemsCustomOrder: (order: string[]) => void;
    
    // UI event to reset localStorage re deleted, disabled, and custom order
    resetLocalStorage: () => void;
    
    // logs which systems have been searched with
    systemsSearched: Record<string, boolean>;
    setSystemsStateSearched: (systemId: string, value: boolean) => void;

    // UI event resets the search log
    resetLocalStorageSearched: () => void;
    
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
}

const StorageContext = createContext<StorageContextType>({
    initiateSearchImmediately: false,
    setInitiateSearchImmediately: () => { },
    flagSearchInitiated: false,
    updateFlagSearchInitiated: () => { },
    systemsDisabled: {},
    setSystemDisabled: () => { },
    systemsDeleted: {},
    setSystemDeleted: () => { },
    systemsCustomOrder: [],
    setSystemsCustomOrder: () => { },
    resetLocalStorage: () => { },
    systemsSearched: {},
    setSystemsStateSearched: () => { },
    resetLocalStorageSearched: () => { },
    customModeOnLoad: false,
    setCustomModeOnLoad: () => { },
    showIntroModal: true,
    setShowIntroModal: () => { },
    multisearchActionObjects: [],
    addMultisearchActionObject: () => { },
    removeMultisearchActionObject: () => { }
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
            // Ensure a default empty object is returned if storedValue is null
            return storedValue ? JSON.parse(storedValue) : {};
        }
        return {};
    });

    const [systemsDeleted, setSystemDeleted] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('systemsDeleted');
            // Ensure a default empty object is returned if storedValue is null
            return storedValue ? JSON.parse(storedValue) : {};
        }
        return {};
    });

    const [systemsCustomOrder, setSystemsCustomOrder] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('systemsCustomOrder');
            // Ensure a default empty array is returned if storedValue is null
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

    const resetLocalStorage = () => {
        setSystemsCustomOrder([]);
        setSystemDeleted({});
        setSystemDisabled({});
        setMultisearchShortcuts([]);

        localStorage.removeItem('systemsCustomOrder');
        localStorage.removeItem('systemsDeleted');
        localStorage.removeItem('systemsDisabled');
        localStorage.removeItem('multisearchActionObjects');
    };


    // Update sessionStorage when values change
    useEffect(() => {
        sessionStorage.setItem('flagSearchInitiated', flagSearchInitiated ? 'true' : 'false');
    }, [flagSearchInitiated]);

    // Update localStorage when values change
    useEffect(() => {
        localStorage.setItem('initiateSearchImmediately', JSON.stringify(initiateSearchImmediately));
        localStorage.setItem('customModeOnLoad', JSON.stringify(customModeOnLoad));
        localStorage.setItem('systemsDisabled', JSON.stringify(systemsDisabled));
        localStorage.setItem('systemsDeleted', JSON.stringify(systemsDeleted));
        localStorage.setItem('systemsCustomOrder', JSON.stringify(systemsCustomOrder));
        localStorage.setItem('showIntroModal', JSON.stringify(showIntroModal));
        localStorage.setItem('multisearchActionObjects', JSON.stringify(multisearchActionObjects));
    }, [initiateSearchImmediately, systemsDisabled, systemsDeleted, systemsCustomOrder, customModeOnLoad, showIntroModal, multisearchActionObjects]);


    // Functions to update values
    const updateFlagSearchInitiated = (value: boolean) => {
        setFlagSearchInitiated(value);
    };

    const updateSystemsSearched = (systemId: string, value: boolean) => {
        setSystemsStateSearched(prev => ({ ...prev, [systemId]: value }));
    };

    const resetLocalStorageSearched = () => {
        setSystemsStateSearched({});
    };
    
    
    const updateSystemDisabled = (systemId: string, value: boolean) => {
        setSystemDisabled(prev => ({ ...prev, [systemId]: value }));
    };

    const updateSystemDeleted = (systemId: string, value: boolean) => {
        setSystemDeleted(prev => ({ ...prev, [systemId]: value }));
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
            resetLocalStorage,
            systemsSearched,
            setSystemsStateSearched: updateSystemsSearched,
            resetLocalStorageSearched,
            customModeOnLoad,
            setCustomModeOnLoad,
            showIntroModal,
            setShowIntroModal,
            multisearchActionObjects,
            addMultisearchActionObject,
            removeMultisearchActionObject,
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
        ]
    );

    return (
        <StorageContext.Provider value={contextValue}>
            {children}
        </StorageContext.Provider>
    );
};