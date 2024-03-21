import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface StorageContextType {
    initiateSearchImmediately: boolean;
    setInitiateSearchImmediately: (value: boolean) => void;
    searchInitiatedBlock: boolean;
    updateSearchInitiatedBlock: (value: boolean) => void;
    systemsDisabled: Record<string, boolean>;
    setSystemDisabled: (systemId: string, value: boolean) => void;
    systemsDeleted: Record<string, boolean>;
    setSystemDeleted: (systemId: string, value: boolean) => void;
    systemsCustomOrder: string[];
    setSystemsCustomOrder: (order: string[]) => void;
    resetLocalStorage: () => void;
    systemsSearched: Record<string, boolean>;
    setSystemsStateSearched: (systemId: string, value: boolean) => void;
    customModeOnLoad: boolean;
    setCustomModeOnLoad: (value: boolean) => void;
    showIntroModal: boolean;
    setShowIntroModal: (value: boolean) => void;
}

const StorageContext = createContext<StorageContextType>({
    initiateSearchImmediately: false,
    setInitiateSearchImmediately: () => { },
    searchInitiatedBlock: false,
    updateSearchInitiatedBlock: () => { },
    systemsDisabled: {},
    setSystemDisabled: () => { },
    systemsDeleted: {},
    setSystemDeleted: () => { },
    systemsCustomOrder: [],
    setSystemsCustomOrder: () => { },
    resetLocalStorage: () => { },
    systemsSearched: {},
    setSystemsStateSearched: () => { },
    customModeOnLoad: false,
    setCustomModeOnLoad: () => { },
    showIntroModal: true,
    setShowIntroModal: () => { }
});


export const useStorage = () => useContext(StorageContext);

export const StorageProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // SessionStorage
    const [systemsSearched, setSystemsStateSearched] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem('systemsSearched');
            return item ? JSON.parse(item) : {};
        }
        return {};
    });
    
    const [searchInitiatedBlock, setSearchInitiatedBlock] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = sessionStorage.getItem('searchInitiatedBlock');
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

        localStorage.removeItem('systemsCustomOrder');
        localStorage.removeItem('systemsDeleted');
        localStorage.removeItem('systemsDisabled');
    };


    // Update sessionStorage when values change
    useEffect(() => {
        sessionStorage.setItem('searchInitiatedBlock', searchInitiatedBlock ? 'true' : 'false');
    }, [searchInitiatedBlock]);

    // Update localStorage when values change
    useEffect(() => {
        localStorage.setItem('initiateSearchImmediately', JSON.stringify(initiateSearchImmediately));
        localStorage.setItem('customModeOnLoad', JSON.stringify(customModeOnLoad));
        localStorage.setItem('systemsDisabled', JSON.stringify(systemsDisabled));
        localStorage.setItem('systemsDeleted', JSON.stringify(systemsDeleted));
        localStorage.setItem('systemsCustomOrder', JSON.stringify(systemsCustomOrder));
    }, [initiateSearchImmediately, systemsDisabled, systemsDeleted, systemsCustomOrder, customModeOnLoad]);


    // Functions to update values
    const updateSearchInitiatedBlock = (value: boolean) => {
        setSearchInitiatedBlock(value);
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

    const contextValue = useMemo(
        () => ({
            initiateSearchImmediately,
            setInitiateSearchImmediately,
            searchInitiatedBlock,
            updateSearchInitiatedBlock,
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
            setShowIntroModal
        }),
        [
            initiateSearchImmediately,
            searchInitiatedBlock,
            systemsDisabled,
            systemsDeleted,
            systemsCustomOrder,
            systemsSearched,
            customModeOnLoad,
            setCustomModeOnLoad,
            showIntroModal,
            setShowIntroModal
        ]
    );



    return (
        <StorageContext.Provider value={contextValue}>
            {children}
        </StorageContext.Provider>
    );
};
