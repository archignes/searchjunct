// SystemButtons.tsx

import React from 'react';
import { System } from '../../types/system';
import { Button } from '../ui/button';
import { useStorageContext, useSystemToggleContext } from '../../contexts';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export const DisableSystemButton: React.FC<{ system: System }> = ({ system }) => {
  const { toggleSystemDisabled } = useSystemToggleContext();
  const { systemsDeleted, systemsDisabled } = useStorageContext();

  if (typeof window === 'undefined') {
    return null; // Changed from return; to return null; for consistent rendering
  }

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

export const DeleteSystemButton: React.FC<{ system: System, inSettings?: boolean }> = ({ system, inSettings }) => {
  const { toggleSystemDeleted } = useSystemToggleContext();
  const { systemsDeleted } = useStorageContext();

  if (typeof window === 'undefined') {
    return null; // Changed from return; to return null; for consistent rendering
  }

  return (
    <>
    <div className="flex justify-end pt-2">
        {!systemsDeleted[system.id] && <Button
        variant={systemsDeleted[system.id] ? 'outline' : 'ghost'}
          className={`h-6 w-6 p-1 hover:text-black hover:bg-red-500 bg-white'}`}
        onClick={(event) => {
          event.stopPropagation();
          toggleSystemDeleted?.(system.id);
        }}
      >
        <DeleteIcon className='h-4 w-4 shrink-0' />
      </Button>
      }
    </div>
    {
    systemsDeleted?.[system.id] && (inSettings ? (
          <Button
            variant={systemsDeleted[system.id] ? 'outline' : 'ghost'}
            className={`h-6 w-100 p-1 bg-white'}`}
            onClick={(event) => {
              event.stopPropagation();
              toggleSystemDeleted?.(system.id);
            }}
          >
            Recover
          </Button>
    ): 
      <Alert className='bg-red-500 text-white border-none'>
        <AlertTitle>Deleted</AlertTitle>
        <AlertDescription>This system has been deleted. You can still manually search with it but it will not appear in the systems list on the home page.</AlertDescription>
        <Button
          variant='outline'
          className='h-5 w-[100px] ml-[50px] mt-2 bg-red-500 hover:bg-orange-300'
          onClick={() => toggleSystemDeleted?.(system.id)}
        >
          Recover
        </Button>
      </Alert>
    )
  }
  </>
  )
};

