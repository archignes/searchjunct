// AppContext.tsx

import React, { useContext, createContext, useState, ReactNode } from 'react';

interface AppProviderProps {
    children: ReactNode;
}   

interface AppContextType {
    settingsCardActive: boolean;
    setSettingsCardActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType>({
    settingsCardActive: false,
    setSettingsCardActive: () => {},
});


export const useAppContext = () => useContext(AppContext);


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [settingsCardActive, setSettingsCardActive] = useState<boolean>(false);
    
    return (
        <AppContext.Provider value={{ settingsCardActive, setSettingsCardActive }}>
            {children}
        </AppContext.Provider>
    );
};