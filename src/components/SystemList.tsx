// SystemList.tsx

import React, { useState, useEffect, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import SortingContainer from './SortingContainer';
import { useSystemsContext,
  useStorageContext,
  useSystemSearchContext, useSortContext } from '../contexts/';
import { System } from '../types/system';

import useFeatureFlag from '../hooks/useFeatureFlag';

const SystemList = () => {
  const { isFeatureEnabled } = useFeatureFlag();
  
  const { allSystems,
    activeSystem, setActiveSystem,
    systemShortcutCandidates } = useSystemsContext();
  const { systemsSearched, systemsDisabled, systemsDeleted } = useStorageContext();
  const { systemsSkipped } = useSystemSearchContext();
  const [isClient, setIsClient] = useState(false);
  
  const { setSystemsCurrentOrder, systemsCurrentOrder } = useSortContext();
  const { sortStatus } = useSortContext();
  
  const [visibleSystems, setVisibleSystems] = useState(allSystems);

  const listRef = useRef<List>(null);

  const systemsCurrentOrderPreShortcutRef = useRef<System[] | null>(null);
  // This effect ensures the visible systems are filtered, this was added
  // particularly to deal w/ the shortcuts.
  useEffect(() => {
    let filteredSystems = allSystems.filter(
      (system) => !systemsDeleted[system.id]
    );
    
    if (sortStatus === 'param') {
      // Filter the systems based on the current order specified in the sort context
      // This ensures that only systems included in the systemsCurrentOrder are shown
      filteredSystems = filteredSystems.filter(
        (system) => systemsCurrentOrder.includes(system));
    }
    
    if (Object.keys(systemShortcutCandidates).length > 0) {
      // Preserve the initial order of filtered systems before applying shortcuts
      // to restore if shortcuts are removed
      if (systemsCurrentOrderPreShortcutRef.current === null) {
        systemsCurrentOrderPreShortcutRef.current = systemsCurrentOrder;
      }
      console.log("systemShortcutCandidates", systemShortcutCandidates);
      filteredSystems = filteredSystems.filter(
        (system) => systemShortcutCandidates[system.id]
      );
      filteredSystems.sort((a, b) => a.id.localeCompare(b.id));
      setSystemsCurrentOrder(filteredSystems);
      console.log(filteredSystems);
    } else {
      if (systemsCurrentOrderPreShortcutRef.current) {
        setSystemsCurrentOrder(systemsCurrentOrderPreShortcutRef.current);
        systemsCurrentOrderPreShortcutRef.current = null;
      }
    }
    setVisibleSystems(filteredSystems.sort((a, b) => 
      systemsCurrentOrder.findIndex(system => system.id === a.id) - 
      systemsCurrentOrder.findIndex(system => system.id === b.id)
    ));
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
    const activeIndex = visibleSystems.findIndex(system => system.id === activeSystem?.id);
    if (activeIndex !== -1 && listRef.current) {
      listRef.current.scrollToItem(activeIndex, 'smart'); // 'smart' smoothly scrolls the item into view if it's not already visible
    }
  }, [activeSystem, visibleSystems]);

  
  if (!isClient) {
    return null;
  }

  return (
    <div id="systems-list" data-testid="system-list" className="flex flex-col space-y-1 mt-1">
      <SortingContainer include={visibleSystems} activeSystemId={activeSystem?.id} showDragHandleBoolean={false} />
      <div className="text-sm text-gray-500" data-testid="bottom-of-list-number-of-systems">
        <a className="underline hover:bg-blue-100 rounded-md p-1"
          href="https://github.com/danielsgriffin/searchjunct/blob/main/src/data/systems.json"
          target="_blank"
          rel="noopener noreferrer">
          Showing {visibleSystems.length} of {allSystems.length} systems
        </a>
      </div>
    </div>
  );
};

export default SystemList;