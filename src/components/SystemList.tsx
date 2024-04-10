// SystemList.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import SortingContainer from './SortingContainer';
import { useSystemsContext,
  useStorageContext,
  useSortContext,
  useSystemSearchContext } from '../contexts/';
import useFeatureFlag from '../hooks/useFeatureFlag';

const SystemList = () => {
  const { isFeatureEnabled } = useFeatureFlag();
 
  const { allSystems, activeSystem, setActiveSystem } = useSystemsContext();
  const { systemsSearched, systemsDisabled, systemsDeleted } = useStorageContext();
  const { systemsCurrentOrder } = useSortContext();
  const { systemsSkipped } = useSystemSearchContext();
  const [isClient, setIsClient] = useState(false);
  const visibleSystems = useMemo(
    () => systemsCurrentOrder.filter((system) => !systemsDeleted[system.id]),
    [systemsCurrentOrder, systemsDeleted]
  );

  const listRef = useRef<List>(null); // Step 1: Create a ref for the List

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


  if (!isFeatureEnabled('toolbar')) {
    return null;
  }
  
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