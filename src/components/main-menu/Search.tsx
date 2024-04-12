// Search.tsx
// Main Menu Settings Component: Manage your search settings.

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from '../ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { DeleteSystemButton } from '../SystemsButtons';
import { Alert, AlertDescription } from '../ui/alert';

import SearchSystemItem from '../SystemItem';
import { useSystemsContext } from '@/contexts/SystemsContext';
import { useStorageContext, useSystemToggleContext } from '@/contexts';
import ManageLocallyStoredSearchSystemsSheet from '../search/ManageLocallyStoredSearchSystems';
import AddSystem from './AddSystem';
import { SettingsItem, SettingsText, SettingsButton, SettingsSubtitle } from './SettingsItem';
import MiniSearchSystemItem from '../MiniSearchSystemItem';
import { System } from '@/types';
import { Switch } from '@/components/ui/switch';

const SearchSettings: React.FC = () => {
  const { updateFlagSearchInitiated,
    initiateSearchImmediately, setInitiateSearchImmediately,
     } = useStorageContext()

  const toggleInitiateSearchImmediately = () => {
    updateFlagSearchInitiated(true);
    setInitiateSearchImmediately(!initiateSearchImmediately);
  }
  
    return (
      <><ScrollArea className="h-[calc(100vh-45px)] sm:h-full w-[320px] sm:w-full">
        <div className="text-center my-2 sm:my-4">
          Manage search behavior.
        </div>
        <SettingsItem title="Immediately initiate URL-driven search upon page load." startOpen={true}>
          <div className="inline-flex items-center">
            <Switch
              id="initiate-search-immediately"
              checked={initiateSearchImmediately}
              onCheckedChange={toggleInitiateSearchImmediately}
              className="focus-visible:ring-primary text-xs"
            />
            <span id="initiate-search-immediately-status"
              className={`ml-2 text-xs font-semibold ${initiateSearchImmediately ? 'text-black' : 'text-gray-500'}`}>
              {initiateSearchImmediately ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <p className="text-xs">
            Syntax: <code>/?q=%s</code>.
          </p>
          <p className="text-xs">For example, try <a className="underline" href="/?q=an+example+query" target="_blank" rel="noopener noreferrer">/?q=an+example+query</a>.
          </p>
        </SettingsItem>
    </ScrollArea >
      </>
    );
};

export default SearchSettings;

