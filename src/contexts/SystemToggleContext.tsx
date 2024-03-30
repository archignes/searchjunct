// contexts/SystemToggleContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useStorageContext } from "./"; 

interface SystemToggleProviderProps {
    children: ReactNode;
}

interface SystemToggleContextType {
    toggleSystemDisabled: (systemId: string) => void;
    toggleSystemDeleted: (systemId: string) => void;
    systemsDisabled: Record<string, boolean>;
    systemsDeleted: Record<string, boolean>;
    isResetDisabled: boolean;
}

const SystemToggleContext = createContext<SystemToggleContextType>(
    {
        toggleSystemDisabled: () => {},
        toggleSystemDeleted: () => {},
        systemsDisabled: {},
        systemsDeleted: {},
        isResetDisabled: true,
    }
);

export const useSystemToggleContext = () => useContext(SystemToggleContext);

export const SystemToggleProvider: React.FC<SystemToggleProviderProps> = ({ children }) => {
    const { systemsDisabled, systemsDeleted, setSystemDisabled, setSystemDeleted } = useStorageContext();
    const [isResetDisabled, setIsResetDisabled] = useState<boolean>(true);

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
        setIsResetDisabled(!hasDeletedOrDisabledSystems);
    };

    return (
        <SystemToggleContext.Provider value={
            { 
                toggleSystemDisabled,
                toggleSystemDeleted,
                systemsDisabled,
                systemsDeleted,
                isResetDisabled,
            }}>
            {children}
        </SystemToggleContext.Provider>
    );
};
