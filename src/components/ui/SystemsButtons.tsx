// SystemButtons.tsx

import React from 'react';
import { System } from '../../types/system';
import { Button } from '../shadcn-ui/button';
import { useStorageContext, useSystemToggleContext } from '../../contexts/';
import DeleteIcon from '@mui/icons-material/Delete';

export const DisableSystemButton: React.FC<{ system: System }> = ({ system }) => {
  const { toggleSystemDisabled } = useSystemToggleContext();
  const { systemsDeleted, systemsDisabled } = useStorageContext();

  if (systemsDeleted?.[system.id]) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className={`h-5 w-[100px] ${!systemsDisabled?.[system.id] ? 'hover:bg-orange-300' : 'text-white-500 bg-gray-300 hover:bg-blue-100'
        }`}
      onClick={() => toggleSystemDisabled?.(system.id)}
    >
      {systemsDisabled?.[system.id] ? 'Enable' : 'Disable'}
    </Button>
  )
};

export const DeleteSystemButton: React.FC<{ system: System }> = ({ system }) => {
  const { toggleSystemDeleted } = useSystemToggleContext();
  const { systemsDeleted } = useStorageContext();

  return (
    <div className="flex justify-end">
      <Button
        variant={systemsDeleted[system.id] ? 'outline' : 'ghost'}
        className={`h-5 hover:text-black hover:bg-red-500 bg-white ${!systemsDeleted[system.id] ? 'w-5' : 'text-white-500 bg-gray-300'
          }`}
        onClick={(event) => {
          event.stopPropagation();
          toggleSystemDeleted?.(system.id);
        }}
      >
        {systemsDeleted?.[system.id] ? 'Recover' : <DeleteIcon className='h-4 w-4 p-1' />}
      </Button>
    </div>
  )
};

