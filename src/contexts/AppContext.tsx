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
    isManageLocallyStoredSearchSystemsOpen: boolean;
    toggleIsManageLocallyStoredSearchSystemsOpen: () => void;
    isAddSearchSystemOpen: boolean;
    toggleIsAddSearchSystemOpen: () => void;
    isMultisearchManagementSheetOpen: boolean;
    toggleIsMultisearchManagementSheetOpen: () => void;
}

export const AppContext = createContext<AppContextType>({
    settingsCardActive: false,
    setSettingsCardActive: () => {},
    isMainMenuExpanded: false,
    setIsMainMenuExpanded: () => {},
    isManageLocallyStoredSearchSystemsOpen: false,
    toggleIsManageLocallyStoredSearchSystemsOpen: () => {},
    isAddSearchSystemOpen: false,
    toggleIsAddSearchSystemOpen: () => {},
    isMultisearchManagementSheetOpen: false,
    toggleIsMultisearchManagementSheetOpen: () => {},
});


export const useAppContext = () => useContext(AppContext);


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [settingsCardActive, setSettingsCardActive] = useState<boolean>(false);
    const [isMainMenuExpanded, setIsMainMenuExpanded] = useState<boolean>(false);
    const [isManageLocallyStoredSearchSystemsOpen, setIsManageLocallyStoredSearchSystemsOpen] = useState<boolean>(false);
    const [isAddSearchSystemOpen, setIsAddSearchSystemOpen] = useState<boolean>(false);
    const [isMultisearchManagementSheetOpen, setIsMultisearchManagementSheetOpen] = useState<boolean>(false);

    const toggleIsMultisearchManagementSheetOpen = () => {
        setIsMultisearchManagementSheetOpen(!isMultisearchManagementSheetOpen);
    }

    const toggleIsManageLocallyStoredSearchSystemsOpen = () => {
        setIsManageLocallyStoredSearchSystemsOpen(!isManageLocallyStoredSearchSystemsOpen);
    }

    const toggleIsAddSearchSystemOpen = () => {
        setIsAddSearchSystemOpen(!isAddSearchSystemOpen);
    }


    return (
        <AppContext.Provider value={{
            settingsCardActive, setSettingsCardActive,
            isMainMenuExpanded, setIsMainMenuExpanded,
            isManageLocallyStoredSearchSystemsOpen, toggleIsManageLocallyStoredSearchSystemsOpen,
            isMultisearchManagementSheetOpen, toggleIsMultisearchManagementSheetOpen,
            isAddSearchSystemOpen, toggleIsAddSearchSystemOpen
        }}>
            {children}
        </AppContext.Provider>
    );
};