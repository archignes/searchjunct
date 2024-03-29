import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import SortingContainer from './SortingContainer';
import { useSystemsContext } from './contexts/SystemsContext';
import { useStorage } from './contexts/StorageContext';
import SearchSystemItem from './ui/SystemItem';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const SystemList = () => {
  const { systems, systemsCurrentOrder, systemsSkipped, activeSystem, setActiveSystem } = useSystemsContext();
  const { systemsSearched, systemsDisabled } = useStorage();
  const { systemsDeleted } = useStorage();
  const [isClient, setIsClient] = useState(false);
   

  console.log("systemsCurrentOrder", systemsCurrentOrder)
  console.log("systemsDeleted", systemsDeleted)
  console.log("activeSystem", activeSystem)

  const getVisibleSystems = useCallback(
    () => {
      const visibleSystems = systemsCurrentOrder.filter((system) => !systemsDeleted[system.id]);
      return visibleSystems;
    },
    [systemsCurrentOrder, systemsDeleted]
  );

  const listRef = useRef<List>(null); // Step 1: Create a ref for the List


  useEffect(() => {
    const firstVisibleSystem = getVisibleSystems().find((system) =>
      !(systemsDisabled?.[system.id]) &&
      !(systemsSearched?.[system.id]) &&
      !(systemsSkipped?.[system.id])
    );
    if (firstVisibleSystem) {
      setActiveSystem(firstVisibleSystem.id);
    }
  }, [getVisibleSystems, setActiveSystem, systemsDisabled, systemsSearched, systemsSkipped]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Step 3: Scroll to the active system when it changes
    const visibleSystems = getVisibleSystems();
    const activeIndex = visibleSystems.findIndex(system => system.id === activeSystem?.id);
    if (activeIndex !== -1 && listRef.current) {
      listRef.current.scrollToItem(activeIndex, 'smart'); // 'smart' smoothly scrolls the item into view if it's not already visible
    }
  }, [activeSystem, getVisibleSystems]);


  
  if (!isClient) {
    return null;
  }

  
  // Row renderer for react-window
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const system = getVisibleSystems()[index];
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

  const sortableMode = false
  return (
    <div id="systems-list" data-testid="system-list" className="flex flex-col space-y-1 mt-1 mx-5">
      {sortableMode ? (
        <SortingContainer include={getVisibleSystems()} />
      ) : (
        <List
          ref={listRef} // Step 1: Attach the ref here
          height={600}
          itemCount={getVisibleSystems().length}
          itemSize={60}
          width={'100%'}
          className='flex flex-col space-y-1'
        >
          {Row}
        </List>
      )}
      <div className="text-sm text-gray-500">
        <a className="underline hover:bg-blue-100 rounded-md p-1"
          href="https://github.com/danielsgriffin/searchjunct/blob/main/src/data/systems.json"
          target="_blank"
          rel="noopener noreferrer">
          Showing {getVisibleSystems().length} of {systems.length} systems
        </a>
      </div>
    </div>
  );
};

export default SystemList;