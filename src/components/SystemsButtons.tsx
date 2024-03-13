// SystemButtons.tsx

import React from 'react';
import { System, useSystemsContext } from './SystemsContext';
import { Button } from './ui/button';
import { useStorage } from './StorageContext';

export const DisableSystemButton: React.FC<{ system: System }> = ({ system }) => {
  const { toggleSystemDisabled } = useSystemsContext();
  const { systemsDeleted, systemsDisabled } = useStorage();

  if (systemsDeleted?.[system.id]) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className={`h-6 w-1/2 mr-2 ${!systemsDisabled?.[system.id] ? 'bg-orange-300' : 'text-green-500 bg-white'
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
      className={`h-6 w-1/2 mr-2 ml-1 ${!systemsDeleted[system.id] ? '' : 'w-2/3 mx-auto bg-white'
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

