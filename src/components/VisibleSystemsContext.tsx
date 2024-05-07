// VisibleSystemsContext.tsx

import React, { useContext, createContext, useMemo, useRef, ReactNode } from 'react';
import { System } from '../types/system';
import { useSystemsContext } from '../contexts/SystemsContext';
import { useStorageContext } from '../contexts/StorageContext';
import { useSortContext } from '../contexts/SortContext';

interface ContextProps {
  children: ReactNode;
}

interface VisibleSystemsContextType {
  visibleSystems: System[];
}

export const VisibleSystemsContext = createContext<VisibleSystemsContextType>({
  visibleSystems: []
});


export const useVisibleSystemsContext = () => useContext(VisibleSystemsContext);


export const VisibleSystemsProvider: React.FC<ContextProps> = ({ children }) => {
  const { allSystems, systemShortcutCandidates } = useSystemsContext();
  const { systemsDeleted } = useStorageContext();
  const { setSystemsCurrentOrder, systemsCurrentOrder } = useSortContext();
  const { sortStatus } = useSortContext();

  const shortcutCandidatesListRef = useRef<string[] | null>(null);
  const systemsCurrentOrderPreShortcutRef = useRef<System[] | null>(null);

  const visibleSystems = useMemo(() => {
    // console.log("Computing visible systems with:", { allSystems, systemsDeleted, systemShortcutCandidates, systemsCurrentOrder, sortStatus });

    if (!allSystems || !systemsCurrentOrder) {
      console.error("Required data not available");
      return []; // Return an empty array or suitable default to handle this case
    }

    let filteredSystems = allSystems.filter(
      (system) => !systemsDeleted[system.id]
    );

    if (sortStatus === 'param') {
      filteredSystems = filteredSystems.filter(
        (system) => systemsCurrentOrder.includes(system)
      );
    }

    if (Object.keys(systemShortcutCandidates).length > 0) {
      const currentShortcuts = shortcutCandidatesListRef.current?.sort().join(",");
      const newShortcuts = Object.keys(systemShortcutCandidates).sort().join(",");
      if (currentShortcuts !== newShortcuts) {
        shortcutCandidatesListRef.current = Object.keys(systemShortcutCandidates);
      } else {
        return filteredSystems;
      }

      if (systemsCurrentOrderPreShortcutRef.current === null) {
        systemsCurrentOrderPreShortcutRef.current = systemsCurrentOrder;
      }

      filteredSystems = filteredSystems.filter(
        (system) => systemShortcutCandidates[system.id]
      );
      filteredSystems.sort((a, b) => a.id.localeCompare(b.id));
      setSystemsCurrentOrder(filteredSystems);
      return filteredSystems;
    } else {
      if (systemsCurrentOrderPreShortcutRef.current) {
        setSystemsCurrentOrder(systemsCurrentOrderPreShortcutRef.current);
        systemsCurrentOrderPreShortcutRef.current = null;
      }
      shortcutCandidatesListRef.current = null;
      return filteredSystems.sort((a, b) =>
        systemsCurrentOrder.findIndex(system => system.id === a.id) -
        systemsCurrentOrder.findIndex(system => system.id === b.id)
      );
    }
  }, [allSystems, systemsDeleted, systemShortcutCandidates, systemsCurrentOrder, sortStatus, setSystemsCurrentOrder]);



  return (
    <VisibleSystemsContext.Provider value={{
      visibleSystems
    }}>
      {children}
    </VisibleSystemsContext.Provider>
  );
};


