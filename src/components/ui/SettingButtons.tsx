// SystemButtons.tsx

import React from 'react';
import { useSystemsContext } from '../contexts/SystemsContext';
import { System } from '../../types/systems';
import { Button } from '../shadcn-ui/button';
import { useStorage } from '../contexts/StorageContext';

export const DisableSystemButton: React.FC<{ system: System }> = ({ system }) => {
  const { toggleSystemDisabled } = useSystemsContext();
  const { systemsDeleted, systemsDisabled } = useStorage();

  if (systemsDeleted?.[system.id]) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className={`h-6 w-1/2 border-none shadow-none hover:bg-red-300 ${!systemsDisabled?.[system.id] ? 'bg-orange-300' : 'text-white-500 bg-gray-300 hover:bg-blue-100'
        }`}
      onClick={() => toggleSystemDisabled?.(system.id)}
    >
      {systemsDisabled?.[system.id] ? 'Enable' : 'Disable'}
    </Button>
  )
};

export const DeleteSystemButton: React.FC<{ system: System }> = ({ system }) => {
  const { toggleSystemDeleted } = useSystemsContext();
  const { systemsDeleted } = useStorage();

  return (
    <Button
      variant={`${!systemsDeleted[system.id] ? 'destructive' : 'outline'}`}
      className={`h-6 w-1/2 mr-2 hover:text-black ${!systemsDeleted[system.id] ? '' : 'w-2/3 mx-auto hover:bg-blue-100 bg-white'
        }`}
      onClick={(event) => {
        event.stopPropagation();
        toggleSystemDeleted?.(system.id);
      }}
    >
      {systemsDeleted?.[system.id] ? 'Recover' : 'Delete'}
    </Button>
  )
};

