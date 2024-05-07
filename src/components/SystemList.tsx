// SystemList.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useSystemsContext,
  useStorageContext,
  useSystemSearchContext,
  useQueryContext
} from '../contexts/';
import { System } from '../types/system';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import SystemItem from './systems/Item';
import { useVisibleSystemsContext } from './VisibleSystemsContext';

const SystemList = () => {
  const { queryObject } = useQueryContext();
  
  const { allSystems,
    activeSystem, setActiveSystem } = useSystemsContext();
  const { systemsSearched, systemsDisabled } = useStorageContext();
  const { systemsSkipped } = useSystemSearchContext();
  const [isClient, setIsClient] = useState(false);
  
 
  const activeSystemRef = useRef<HTMLDivElement | null>(null);
  
  const { visibleSystems } = useVisibleSystemsContext();

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
      {visibleSystems.map((system: System) => (
        <div id={`${system.id}-bucket`} key={system.id} className="system-item w-full">
          <SystemItem
                            system={system}
                            activeSystemId={activeSystem?.id}
                            />
                        </div>
      ))}
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