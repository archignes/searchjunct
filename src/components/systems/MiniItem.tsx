// ui/MiniSystemItem.tsx 

import React from 'react';
import { System } from '../../types/system';
import { useStorageContext } from '../../contexts/StorageContext';
import { SystemTitle } from './Title';
import { useSystemsContext } from '../../contexts/SystemsContext';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface MiniSystemItemProps {
  systemId: string;
  className?: string;
}

const MiniSystemItem: React.FC<MiniSystemItemProps> = ({ systemId, className }) => {
  const {systemsDeleted, systemsDisabled } = useStorageContext();
  const { allSystems } = useSystemsContext();
  const system = allSystems.find((system: System) => system.id === systemId);
  const { systemsSearched } = useStorageContext();

  if (!system) return <div><ExclamationTriangleIcon />This is not a system.</div>;

  return (
    <>
      <div
        id={system.id}
        key={system.id}
        className={`text-xs m-1 border rounded-md bg-background shadow-sm flex items-center justify-between space-x-1
                  ${systemsSearched?.[system.id] ? 'bg-gray-300 border-white' : ''}
                  ${systemsDisabled?.[system.id] ? 'bg-orange-300 border-none' : ''}
                  ${systemsDeleted?.[system.id] ? 'bg-red-300 border-none' : ''}
                  ${className}`}

      >
        <div className="w-full">
          <div className="flex items-center">
            <div className="w-full flex items-center">
              <SystemTitle
                className={`py-0 px-0 flex items-center`}
                system={system}
                mini_mode={true}
                favicon_included={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniSystemItem;