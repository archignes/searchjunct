// Systems.tsx
// Main Menu Settings Component: Manage your search systems.

import React, { useState } from 'react';
import {
    CardFooter,
} from '../ui/card';
import { Button } from '@/src/components/ui/button';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { DeleteSystemButton } from '../SystemsButtons';

import SearchSystemItem from '../SystemItem';
import { useSystemsContext } from '@/contexts/SystemsContext';
import { useStorageContext } from '@/contexts';
import ManageLocallyStoredSearchSystemsSheet from '../search/ManageLocallyStoredSearchSystems';
import AddSystem from './AddSystem';
import { SettingsItem, SettingsText, SettingsButton, SettingsSubtitle } from './SettingsItem';
import MiniSearchSystemItem from '../MiniSearchSystemItem';
import { System } from '@/types';

const ShowFilteredSystems: React.FC<{systems: System[], label: string}> = ({systems, label}) => {
  const [showing, setShowing] = useState(false);

  return (
    <>
      <details className="my-2 flex flex-col" open={showing} onToggle={() => setShowing(!showing)}>
        <summary className="cursor-pointer">{showing ? 'T' : 'See t'}he {systems.length} {label} {systems.length === 1 ? 'system' : 'systems'}</summary>
        <div className="flex flex-wrap">
          {systems.map(system => <MiniSearchSystemItem className='w-auto' key={system.id} systemId={system.id} />)}
        </div>
      </details>
    </>
  );
};

const SystemsSettings: React.FC = () => {
  const { allSystems,
    getSystemsRequiringAccounts,
    getSystemsWithoutQueryPlaceholder,
    getAllDeletedStatus,
    deleteSystemsBulk } = useSystemsContext();
  const { resetSystemsDeletedDisabled, setSystemDeleted, systemsDeleted } = useStorageContext();
  const { getAnyDeletedStatus, getAnyDisabledStatus } = useStorageContext();
  const {locallyStoredSearchSystems} = useStorageContext();


    return (
      <><ScrollArea className="h-[calc(100vh-45px)] sm:h-full w-[320px] sm:w-full">
        <div className="text-center my-2 sm:my-4">
          Manage your search systems.
        </div>
        <SettingsItem title="Quick Setup" startOpen={true}>
          <SettingsSubtitle subtitle="Remove Accounts-Required Systems"/>
          <SettingsText lines={[
            "Start with only search systems that do not require accounts.",
            "This will remove all search systems that require accounts, they can be recovered in the 'Recover Deleted Systems' section."
          ]} />
          <ShowFilteredSystems systems={getSystemsRequiringAccounts()} label="accounts-required" />
          <SettingsButton
            onClick={() => { deleteSystemsBulk(getSystemsRequiringAccounts());}}
            ariaDisabled={getAllDeletedStatus(getSystemsRequiringAccounts())}
            label="Remove Accounts-Required"
            status={getAllDeletedStatus(getSystemsRequiringAccounts()) ? "Activated" : ""}
          />
          <SettingsSubtitle subtitle="Remove Systems Without Query Placeholders"/>
          <SettingsText lines={[
            "Start with only search systems that provide URL-based search results.",
            "Currently, when a search system does not support query placeholders (indicated in the search_links with a `%s`), it is not possible to open a link directly to the search results for a query on that system.",
            "This will remove all search systems that do not support query placeholders, they can be recovered in the 'Recover Deleted Systems' section."
          ]} />
          <ShowFilteredSystems systems={getSystemsWithoutQueryPlaceholder()} label="without-query-placeholder" /> 
          <SettingsButton
            onClick={() => { deleteSystemsBulk(getSystemsWithoutQueryPlaceholder()); }}
            ariaDisabled={getAllDeletedStatus(getSystemsWithoutQueryPlaceholder())}
            label="Remove Systems Without Query Placeholders"
            status={getAllDeletedStatus(getSystemsWithoutQueryPlaceholder()) ? "Activated" : ""}
          />
        </SettingsItem>
        <SettingsItem title="Reset Systems" disabled={!(getAnyDeletedStatus(allSystems) || getAnyDisabledStatus(allSystems))}>
          <SettingsText lines={[
            "This will reset all search systems to their default settings (re-enabling disabled systems and recovering deleted systems)."
          ]} />
          <SettingsButton           
            label="Reset Deleted & Disabled Systems"
            onClick={() => { resetSystemsDeletedDisabled(); }}
            ariaDisabled={!(getAnyDeletedStatus(allSystems) || getAnyDisabledStatus(allSystems))}
            status={!(getAnyDeletedStatus(allSystems) || getAnyDisabledStatus(allSystems)) ? "No deleted or disabled systems" : ""}
          />
        </SettingsItem>
        <SettingsItem title="Recover Deleted Systems" disabled={!getAnyDeletedStatus(allSystems)}>
          <SettingsText lines={[
            "Recover deleted search systems individually or in bulk."
          ]} />
          <SettingsButton
            label="Recover All Deleted Systems"
            onClick={() => { Object.keys(systemsDeleted).forEach(systemId => setSystemDeleted(systemId, false)); }}
            ariaDisabled={!getAnyDeletedStatus(allSystems)}
            status={getAnyDeletedStatus(allSystems) ? "" : "No deleted systems"}
          />
          <div id="settings-systems-list">
            {Object.values(systemsDeleted).every(value => value) && (
              Object.entries(systemsDeleted).filter(([_, value]) => value).map(([systemId, _], index) => {
                const system = allSystems.find((system) => system.id === systemId);
                if (!system) {
                  console.error(`System with ID ${systemId} not found.`);
                  return null;
                }
                return (
                  <div key={systemId} className="flex w-full">
                    <SearchSystemItem
                      id={systemId}
                      system={system}
                      showDisableDeleteButtons={true}
                      showDragHandle={false}
                      activeSystemId={undefined}
                    />
                    <DeleteSystemButton system={system} />
                  </div>
                );
              })
            )}
          </div>
        </SettingsItem>
        <SettingsItem title="Locally Stored Search Systems">
          <SettingsText lines={[
            `You have ${locallyStoredSearchSystems.length.toString()} locally stored search system${locallyStoredSearchSystems.length !== 1 ? 's' : ''}.`
          ]} />
        <ManageLocallyStoredSearchSystemsSheet />
      
        <SettingsSubtitle subtitle="Add Search System"/>
          <SettingsText lines={[
            "Add a new search system to your locally stored systems list.",
            "These systems are only available to you. They will be saved in",
            "your web browser and will not be synced to other devices."
          ]} />
            <AddSystem />
          </SettingsItem>    
          <CardFooter className='flex p-2 bg-gray-200 flex-col items-center'>
            <span className="text-sm">You can suggest a system to be added to the public systems list here:</span>
            <Button variant="outline" className='mt-1'>
              <GitHubLogoIcon className='w-4 h-4 mr-2' />
              <a href="https://github.com/archignes/searchjunct/issues/new" target="_blank" rel="noopener noreferrer">
                Add Search System to Public List
              </a>
            </Button>
          </CardFooter>
    </ScrollArea >
      </>
    );
};

export default SystemsSettings;

