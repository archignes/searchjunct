// contexts/SystemToggleContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import { useStorageContext } from "./"; 

interface SystemToggleProviderProps {
    children: ReactNode;
}

interface SystemToggleContextType {
    toggleSystemDisabled: (systemId: string) => void;
    toggleSystemDeleted: (systemId: string) => void;
    systemsDisabled: Record<string, boolean>;
    systemsDeleted: Record<string, boolean>;
    checkResetDisabled: () => boolean;
}

const SystemToggleContext = createContext<SystemToggleContextType>(
    {
        toggleSystemDisabled: () => {},
        toggleSystemDeleted: () => {},
        systemsDisabled: {},
        systemsDeleted: {},
        checkResetDisabled: () => false,
    }
);

export const useSystemToggleContext = () => useContext(SystemToggleContext);

export const SystemToggleProvider: React.FC<SystemToggleProviderProps> = ({ children }) => {
    const { systemsDisabled, systemsDeleted, setSystemDisabled, setSystemDeleted } = useStorageContext();

    const toggleSystemDisabled = (systemId: string) => {
        setSystemDisabled(systemId, !systemsDisabled[systemId]);
        checkResetDisabled();
    };

    const toggleSystemDeleted = (systemId: string) => {
        setSystemDeleted(systemId, !systemsDeleted[systemId]);
        checkResetDisabled();
    };

    const checkResetDisabled = () => {
        const hasDeletedOrDisabledSystems = Object.values(systemsDeleted).some(value => value) || Object.values(systemsDisabled).some(value => value);
        return !hasDeletedOrDisabledSystems;
    };

    return (
        <SystemToggleContext.Provider value={
            { 
                toggleSystemDisabled,
                toggleSystemDeleted,
                systemsDisabled,
                systemsDeleted,
                checkResetDisabled
            }}>
            {children}
        </SystemToggleContext.Provider>
    );
};
