// SystemsList.tsx

import React, { useState, useEffect } from 'react';
import SortingContainer from './SortingContainer';
import { useSystemsContext } from './SystemsContext';
import { useStorage } from './StorageContext';


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
    <div id="systems-list" className="flex flex-col space-y-1 mt-1">
      <SortingContainer filterOut={getDeletedSystems()}/>
    </div>
  );
};

export default SystemList;