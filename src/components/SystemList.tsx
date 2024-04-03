import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import SortingContainer from './SortingContainer';
import { useSystemsContext,
  useStorageContext,
  useSortContext,
  useSystemSearchContext } from '../contexts/';
import SearchSystemItem from './ui/SystemItem';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import useFeatureFlag from '../hooks/useFeatureFlag';

const SystemList = () => {
  const { isFeatureEnabled } = useFeatureFlag();
 
  const { systems, activeSystem, setActiveSystem } = useSystemsContext();
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

  
  // Row renderer for react-window
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const system = visibleSystems[index];
    // Apply bottom margin to each item's style to create the gap
    const adjustedStyle = { ...style, marginBottom: '10px' };

    return (
      <div id={`${system.id}-bucket`} key={system.id} className="grid grid-cols-[auto_1fr] w-full" style={adjustedStyle}>
        <div className="flex items-center w-8 justify-center">{activeSystem && activeSystem.id === system.id && (
          <MagnifyingGlassIcon id="active-system" className="text-gray-500 w-8 h-8" />
        )}</div>
        <SearchSystemItem
          id={system.id}
          system={system}
          showDisableDeleteButtons={false}
          showDragHandle={false}
        />
      </div>
    );
  };
  



  return (
    <div id="systems-list" data-testid="system-list" className="flex flex-col space-y-1 mt-1 mr-8">
        <SortingContainer include={visibleSystems} />
      <div className="text-sm text-gray-500" data-testid="bottom-of-list-number-of-systems">
        <a className="underline hover:bg-blue-100 rounded-md p-1"
          href="https://github.com/danielsgriffin/searchjunct/blob/main/src/data/systems.json"
          target="_blank"
          rel="noopener noreferrer">
          Showing {visibleSystems.length} of {systems.length} systems
        </a>
      </div>
    </div>
  );
};

export default SystemList;