// SettingButtons.tsx

import React from 'react';
import { System } from '../../types/system';
import { Button } from '../ui/button';
import { CheckIcon } from '@radix-ui/react-icons';


export const OpenSourceLicense: React.FC<{ system: System }> = ({ system }) => {
  if (!system.openSourceLicense) {
    return null;
  }
  return (
      <div className="flex flex-wrap items-center">
        <span className="text-xs ml-1">Open Source?<CheckIcon className="h-5 w-5 pb-1 m-0 inline align-middle" /></span>
        <a href={system.githubLink} className="mx-auto sm:mx-0">
          <Button
            className="m-0 max-h-6 underline ml-1 pl-0 pb-1 hover:bg-blue-100 rounded-me font-normal justify-start text-left"
            variant="ghost"
            size="sm"
          >
            {system.openSourceLicense}
          </Button>
        </a>
      </div>
    )
  }