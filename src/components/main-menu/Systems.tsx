// Systems.tsx
// Main Menu Settings Component: Manage your search systems.

import React, { useState } from 'react';
import {
  CardFooter,
} from '../ui/card';
import { Button } from '@/src/components/ui/button';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { DeleteSystemButton } from '../systems/Buttons';

import SystemItem from '../systems/Item';
import { useSystemsContext } from '@/contexts/SystemsContext';
import { useStorageContext } from '@/contexts';
import ManageLocallyStoredSearchSystemsSheet from '../search/ManageLocallyStoredSearchSystems';
import AddSystem from './AddSystem';
import { SettingsItem, SettingsText, SettingsButton, SettingsSubtitle } from './SettingsItem';
import MiniSystemItem from '../systems/MiniItem';
import { System } from '@/types';

interface ShowFilteredSystemsProps {
  systems: System[];
  label: string;
}

const ShowFilteredSystems: React.FC<ShowFilteredSystemsProps> = ({ systems, label }) => {
  const [showing, setShowing] = useState(false);

  return (
    <>
      <details className="my-2 flex flex-col" open={showing} onToggle={() => setShowing(!showing)}>
        <summary className="cursor-pointer">{showing ? 'T' : 'See t'}he {systems.length} {label} {systems.length === 1 ? 'system' : 'systems'}</summary>
        <div className="flex flex-wrap">
          {systems.map(system => <MiniSystemItem className='w-auto' key={system.id} systemId={system.id} />)}
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
  const { locallyStoredSearchSystems } = useStorageContext();

  const systemsRequiringAccounts = getSystemsRequiringAccounts();
  const accountsRequiredAllDeletedStatus = getAllDeletedStatus(systemsRequiringAccounts);
  const systemsWithoutQueryPlaceholder = getSystemsWithoutQueryPlaceholder();
  const withoutQueryPlaceholderAllDeletedStatus = getAllDeletedStatus(systemsWithoutQueryPlaceholder);
  const anyDeletedStatus = getAnyDeletedStatus(allSystems);
  const anyDisabledStatus = getAnyDisabledStatus(allSystems);

 console.log("Deleted Systems:", systemsDeleted)


  return (
    <>
      <ScrollArea data-testid="systems-settings-scroll-area" className="h-[calc(100vh-45px)] sm:h-full w-[320px] sm:w-full">
        <div className="text-center my-2 sm:my-4">
          Manage your search systems.
        </div>
        <SettingsItem title="Quick Setup" startOpen={true}>
          <SettingsSubtitle subtitle="Remove Accounts-Required Systems" />
          <SettingsText lines={[
            "Start with only search systems that do not require accounts.",
            "This will remove all search systems that require accounts, they can be recovered in the 'Recover Deleted Systems' section."
          ]} />
          <ShowFilteredSystems systems={systemsRequiringAccounts} label="accounts-required" />
          <SettingsButton
            onClick={() => deleteSystemsBulk(systemsRequiringAccounts)}
            ariaDisabled={accountsRequiredAllDeletedStatus}
            label="Remove Accounts-Required"
            status={accountsRequiredAllDeletedStatus ? "Activated" : ""}
          />
          <SettingsSubtitle subtitle="Remove Systems Without Query Placeholders" />
          <SettingsText lines={[
            "Start with only search systems that provide URL-based search results.",
            "Currently, when a search system does not support query placeholders (indicated in the searchLinks with a `%s`), it is not possible to open a link directly to the search results for a query on that system.",
            "This will remove all search systems that do not support query placeholders, they can be recovered in the 'Recover Deleted Systems' section."
          ]} />
          <ShowFilteredSystems systems={systemsWithoutQueryPlaceholder} label="without-query-placeholder" />
          <SettingsButton
            onClick={() => deleteSystemsBulk(systemsWithoutQueryPlaceholder)}
            ariaDisabled={withoutQueryPlaceholderAllDeletedStatus}
            label="Remove Systems Without Query Placeholders"
            status={withoutQueryPlaceholderAllDeletedStatus ? "Activated" : ""}
          />
        </SettingsItem>
        <SettingsItem title="Reset Systems" disabled={!(anyDeletedStatus || anyDisabledStatus)}>
          <SettingsText lines={[
            "This will reset all search systems to their default settings (re-enabling disabled systems and recovering deleted systems)."
          ]} />
          <SettingsButton
            label="Reset Deleted & Disabled Systems"
            onClick={() => resetSystemsDeletedDisabled()}
            ariaDisabled={!(anyDeletedStatus || anyDisabledStatus)}
            status={!(anyDeletedStatus || anyDisabledStatus) ? "No deleted or disabled systems" : ""}
          />
        </SettingsItem>
        <SettingsItem title="Recover Deleted Systems" disabled={!anyDeletedStatus}>
          <SettingsText lines={[
            "Recover deleted search systems individually or in bulk."
          ]} />
          <SettingsButton
            label="Recover All Deleted Systems"
            onClick={() => Object.keys(systemsDeleted).forEach(systemId => setSystemDeleted(systemId, false))}
            ariaDisabled={!anyDeletedStatus}
            status={anyDeletedStatus ? "" : "No deleted systems"}
          />
          <div id="settings-systems-list">
            {Object.values(systemsDeleted).some(Boolean) && (
              Object.entries(systemsDeleted)
                .filter(([_, value]) => value)
                .map(([systemId]) => {
                  const system = allSystems.find((system) => system.id === systemId);
                  if (!system) {
                    console.error(`System with ID ${systemId} not found.`);
                    return null;
                  }
                  return (
                    <div key={systemId} className="flex w-full">
                      <SystemItem
                        system={system}
                        showDisableDeleteButtons={true}
                        activeSystemId={undefined}
                      />
                      <DeleteSystemButton system={system} inSettings={true} />
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
          <SettingsSubtitle subtitle="Add Search System" />
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
      </ScrollArea>
    </>
  );
};

export default SystemsSettings;