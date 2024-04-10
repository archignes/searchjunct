// Info_About.tsx

import React from 'react';

import {
  Card,
  CardContent,
  CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import SearchSystemItem from '../SystemItem';
import { Button } from '../ui/button';
import { useSystemsContext,
  useStorageContext,
  useSystemToggleContext } from '../../contexts';


import { Alert, AlertDescription } from '../ui/alert';


export const SettingsItemBox: React.FC<{children: React.ReactNode, label: string}> = ({ children, label }) => {
  return (
    <div className='w-[90%] my-2 mx-auto flex flex-col px-1 space-y-1 border rounded-md shadow-sm'>
      <Label htmlFor="default-custom-mode" className="text-left w-2/3 text-xs text-gray-700">
        {label}
      </Label>

      {children}
      <hr className='w-full bg-gray-200' />
    </div>
  );
};


const SettingsCard: React.FC = () => {

  const { allSystems } = useSystemsContext();
  const { isResetDisabled } = useSystemToggleContext();
  const { resetLocalStorage, updateFlagSearchInitiated,
    initiateSearchImmediately, setInitiateSearchImmediately,
    systemsDeleted } = useStorageContext();



  const toggleInitiateSearchImmediately = () => {
    updateFlagSearchInitiated(true);
    setInitiateSearchImmediately(!initiateSearchImmediately);
  }


  return (
    <Card className='rounded-md bg-white shadow-none mx-auto'>
      <div className="w-[320px] sm:w-full">
      <CardTitle className='text-left pl-2 py-1 mb-2'>Settings</CardTitle>
        <CardContent className="p-0 flex items-left flex-col">
        
          <SettingsItemBox label="Immediately initiate URL-driven search upon page load.">
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
          </SettingsItemBox>
          <SettingsItemBox label="Reset Local Storage">
            <Alert className='mt-2 w-[95%] mx-auto'>
            <AlertDescription>
              This will remove all 'Systems' data stored in your browser's localStorage and reset preferences to default.
            </AlertDescription>
          </Alert>
          <Button
            variant="destructive"
            onClick={resetLocalStorage}
            disabled={isResetDisabled}
          >
            Reset Local Storage
          </Button>
          {isResetDisabled && (
            <p className="text-xs text-center">No preferences are saved. You're using the default settings.</p>
          )}
          </SettingsItemBox>
          <SettingsItemBox label="Deleted Systems">
        <div id="settings-systems-list">
          {Object.values(systemsDeleted).every(value => !value) ? (
            <Alert className='w-full'>
              <AlertDescription>
                No systems have been deleted.
              </AlertDescription>
            </Alert>
          ) : (
            Object.entries(systemsDeleted).filter(([_, value]) => value).map(([systemId, _], index) => {
              const system = allSystems.find((system) => system.id === systemId);
              if (!system) {
                console.error(`System with ID ${systemId} not found.`);
                return null;
              }
              return (
                <div key={systemId} className="w-full">
                  <SearchSystemItem
                    id={systemId}
                    system={system}
                    showDisableDeleteButtons={true}
                    showDragHandle={false}
                    activeSystemId={undefined}
                  />
                </div>
              );
            })
          )}
        </div>
        </SettingsItemBox>

      </CardContent>
      </div>
    </Card>
  );
};

export default SettingsCard;

