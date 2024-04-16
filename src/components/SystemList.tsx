// SystemList.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import SortingContainer from './SortingContainer';
import { useSystemsContext,
  useStorageContext,
  useSystemSearchContext,
  useSortContext,
  useQueryContext
} from '../contexts/';
import { System } from '../types/system';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const SystemList = () => {
  const { queryObject } = useQueryContext();
  const { allSystems,
    activeSystem, setActiveSystem,
    systemShortcutCandidates } = useSystemsContext();
  const { systemsSearched, systemsDisabled, systemsDeleted } = useStorageContext();
  const { systemsSkipped } = useSystemSearchContext();
  const [isClient, setIsClient] = useState(false);
  
  const { setSystemsCurrentOrder, systemsCurrentOrder } = useSortContext();
  const { sortStatus } = useSortContext();
  
  const listRef = useRef<List>(null);
  const activeSystemRef = useRef<HTMLDivElement | null>(null);


  const systemsCurrentOrderPreShortcutRef = useRef<System[] | null>(null);
  // This effect ensures the visible systems are filtered, this was added
  // particularly to deal w/ the shortcuts.
  const shortcutCandidatesListRef = useRef<string[] | null>(null);
  
  
  

  const visibleSystems = useMemo(() => {
    // Initial filtering to exclude deleted systems
    let filteredSystems = allSystems.filter(
      (system) => !systemsDeleted[system.id]
    );

    // Apply sorting if sortStatus is set to 'param'
    if (sortStatus === 'param') {
      // Ensures visibility of only those systems present in systemsCurrentOrder
      filteredSystems = filteredSystems.filter(
        (system) => systemsCurrentOrder.includes(system)
      );
    }

    // Check for system shortcuts then filter systems accordingly
    if (Object.keys(systemShortcutCandidates).length > 0) {
      // Check if system shortcut candidates have changed, using a string comparison
      const currentShortcuts = shortcutCandidatesListRef.current?.sort().join(",");
      const newShortcuts = Object.keys(systemShortcutCandidates).sort().join(",");
      if (currentShortcuts !== newShortcuts) {
        shortcutCandidatesListRef.current = Object.keys(systemShortcutCandidates);
      } else {
        return filteredSystems;
      }

      // Backup the current order before applying shortcuts for potential restoration
      if (systemsCurrentOrderPreShortcutRef.current === null) {
        systemsCurrentOrderPreShortcutRef.current = systemsCurrentOrder;
      }
      // Filter systems based on shortcut candidates and sort them by ID
      filteredSystems = filteredSystems.filter(
        (system) => systemShortcutCandidates[system.id]
      );
      // Update the current order of systems based on shortcuts
      filteredSystems.sort((a, b) => a.id.localeCompare(b.id));
      setSystemsCurrentOrder(filteredSystems);
      return filteredSystems;
    } else {
      // Restore the original order if no shortcuts are active
      if (systemsCurrentOrderPreShortcutRef.current) {
        setSystemsCurrentOrder(systemsCurrentOrderPreShortcutRef.current);
        systemsCurrentOrderPreShortcutRef.current = null;
      }
      shortcutCandidatesListRef.current = null;
      // Sort and set the visible systems based on the current order
      return filteredSystems.sort((a, b) =>
        systemsCurrentOrder.findIndex(system => system.id === a.id) -
        systemsCurrentOrder.findIndex(system => system.id === b.id)
      );
    }
  }, [allSystems, systemsDeleted, systemShortcutCandidates,
    systemsCurrentOrder, sortStatus, setSystemsCurrentOrder]);
  useEffect(() => {
    const firstVisibleSystem = visibleSystems.find((system) =>
      !(systemsDisabled?.[system.id]) &&
      !(systemsSearched?.[system.id]) &&
      !(systemsSkipped?.[system.id])
    );
    if (firstVisibleSystem) {
      setActiveSystem(firstVisibleSystem.id);
    }
  }, [visibleSystems, setActiveSystem, systemsDisabled, systemsSearched, systemsSkipped]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Step 3: Scroll to the active system when it changes
    if (activeSystemRef.current) {
      activeSystemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSystem]);
  
  if (!isClient) {
    return null;
  }

  if (queryObject.shortcut?.type === "unsupported") {
    return (
      <Alert variant="destructive" id="null-systems-list" className="flex w-2/3 mx-auto flex-col space-y-1 mt-4 text-center">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>There are no systems that match the shortcut: <code>{queryObject.shortcut.name}</code></AlertTitle>
        <AlertDescription>
          Please try a different shortcut.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div id="systems-list" data-testid="system-list" className="flex flex-col space-y-1 mt-1">
      <SortingContainer
        include={visibleSystems}
        activeSystemId={activeSystem?.id}
        showDragHandleBoolean={false}
        setActiveSystemRef={activeSystemRef}
      />
      <div className="text-sm text-gray-500" data-testid="bottom-of-list-number-of-systems">
        <a
          className="underline hover:bg-blue-100 rounded-md p-1"
          href="https://github.com/danielsgriffin/searchjunct/blob/main/src/data/systems.json"
          target="_blank"
          rel="noopener noreferrer"
        >
          Showing {visibleSystems.length} of {allSystems.length} systems
        </a>
      </div>
    </div>
  );
};

export default SystemList;