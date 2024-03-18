// SettingsCard.tsx

import React from 'react';
import { useSystemsContext } from './SystemsContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useStorage } from './StorageContext';
import SortingContainer from './SortingContainer';


const SettingsCard: React.FC = () => {
  const { isResetDisabled } = useSystemsContext();
  const { resetLocalStorage, updateSearchInitiatedBlock,
          initiateSearchImmediately, setInitiateSearchImmediately,
          customModeOnLoad, setCustomModeOnLoad,
          systemsCustomOrder
        } = useStorage();


  const toggleInitiateSearchImmediately = () => {
    updateSearchInitiatedBlock(true); 
    setInitiateSearchImmediately(!initiateSearchImmediately);
  }

  return (
      <Card id="settings-modal" 
          className='w-9/10 sm:w-2/3 sm:mx-auto md:w-3/7 lg:w-2/5 xl:w-1/4" rounded-md mx-auto'>
        <CardContent>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
        </CardContent>
      <div className='border rounded-md p-4 flex flex-col space-y-1 mx-2 mb-4'>
        <div className="mx-auto flex flex-col items-center space-y-2">
          <Label htmlFor="default-custom-mode" className="text-center w-2/3">
            Default to custom mode on load.
          </Label>
          <div className="inline-flex items-center">
            <Switch
                id="default-custom-mode"
                checked={customModeOnLoad}
                onCheckedChange={() => setCustomModeOnLoad(!customModeOnLoad)}
                className="focus-visible:ring-primary"
              />
            <span className={`ml-2 text-sm font-semibold ${customModeOnLoad ? 'text-green-500' : 'text-red-500'}`}>
              {customModeOnLoad ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {systemsCustomOrder.length === 0 && (
            <p className="ml-2 text-sm text-gray-500">Note: You do <span className='underline'>not</span> currently have a custom order is set.</p>
          )}
          </div>
        </div>
        <div className='border rounded-md p-4 flex flex-col space-y-1 mx-2 mb-4'>
          <div className="mx-auto flex flex-col items-center space-y-2">
            <Label htmlFor="initiate-search-immediately" className="text-center w-2/3 ">
              Immediately initiate URL-driven search upon page load.
            </Label>
            <div className="inline-flex items-center">
              <Switch
                id="initiate-search-immediately"
                checked={initiateSearchImmediately}
                onCheckedChange={toggleInitiateSearchImmediately}
                className="focus-visible:ring-primary"
              />
            <span id="initiate-search-immediately-status"
              className={`ml-2 text-sm font-semibold ${initiateSearchImmediately ? 'text-green-500' : 'text-red-500'}`}>
                {initiateSearchImmediately ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <p className="text-xs">
              Syntax: <code>/?q=%s</code>.
            </p>
            <p className="text-xs">For example, try <a className="underline" href="/?q=an+example+query" target="_blank" rel="noopener noreferrer">/?q=an+example+query</a>.
            </p>

          </div>
        </div>
        <div className='border rounded-md p-4 flex flex-col space-y-1 mx-2 mb-4'>
          <Label className="w-2/3 mx-auto text-center">
            This will remove all 'Systems' data stored in your browser's localStorage and reset preferences to default.
          </Label>
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
        </div>
        <div className='flex flex-col space-y-1 mx-2 mb-1'>
        <Label className="w-4/5 text-center mx-auto">
          You can drag and drop the systems to reorder them. Your changes will be saved automatically in your browser.
        </Label>
        </div>
      <SortingContainer showDisableDeleteButtons={true}/>
      </Card>
  );
};

export default SettingsCard;