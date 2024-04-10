// AppContext.tsx

import React, { useContext, createContext, useState, ReactNode } from 'react';

interface AppProviderProps {
    children: ReactNode;
}   

interface AppContextType {
    settingsCardActive: boolean;
    setSettingsCardActive: (active: boolean) => void;
    isMainMenuExpanded: boolean;
    setIsMainMenuExpanded: (expanded: boolean) => void;
}

const AppContext = createContext<AppContextType>({
    settingsCardActive: false,
    setSettingsCardActive: () => {},
    isMainMenuExpanded: false,
    setIsMainMenuExpanded: () => {}
});


export const useAppContext = () => useContext(AppContext);


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [settingsCardActive, setSettingsCardActive] = useState<boolean>(false);
    const [isMainMenuExpanded, setIsMainMenuExpanded] = useState<boolean>(false);
    return (
        <AppContext.Provider value={{ settingsCardActive, setSettingsCardActive, isMainMenuExpanded, setIsMainMenuExpanded }}>
            {children}
        </AppContext.Provider>
    );
};