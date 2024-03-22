// SystemsList.tsx

import React, { useState, useEffect } from 'react';
import SortingContainer from './SortingContainer';
import { useSystemsContext } from './contexts/SystemsContext';
import { useStorage } from './contexts/StorageContext';


const SystemList = () => {
  const { systemsCurrentOrder } = useSystemsContext();
  const { systemsDeleted } = useStorage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loader/spinner
  }

  const getDeletedSystems = () => systemsCurrentOrder.filter((system) => systemsDeleted[system.id]);

  return (
    <div id="systems-list" data-testid="system-list" className="flex flex-col space-y-1 mt-1">
      <SortingContainer filterOut={getDeletedSystems()}/>
      <div className="text-sm text-gray-500"> 
        <a className="underline hover:bg-blue-100 rounded-md p-1"
        href="https://github.com/danielsgriffin/searchjunct/blob/main/src/data/systems.json"
        target="_blank"
        rel="noopener noreferrer">
          Number of systems: {systemsCurrentOrder.length}
        </a>
      </div>
    </div>
  );
};

export default SystemList;