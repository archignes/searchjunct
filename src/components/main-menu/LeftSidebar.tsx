// LeftSidebar.tsx

import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { GearIcon, SlashIcon, QuestionMarkIcon } from '@radix-ui/react-icons';
import { MainMenuButton } from './Button';
import SettingsCard from './SettingsCard';
import InfoCard from './Info';
import QuickShortcutsCard from './QuickShortcuts';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/src/components/ui/alert-dialog';
import { Button } from "@/src/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/src/components/ui/tooltip';
import { StarFilledIcon, StarIcon, ChevronDownIcon, ReloadIcon, ShuffleIcon } from "@radix-ui/react-icons";
import {
  useStorageContext,
  useSortContext,
  useSystemSearchContext,
  useSystemExpansionContext,
  useAppContext,
  useQueryContext
} from '@/contexts';

const ACTION_BUTTON_CLASSNAME = "p-0 h-7 px-1 flex items-center justify-center hover:bg-blue-100";

const LeftSidebar: React.FC<{ className?: string }> = ({ className }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This code runs after the component is mounted, which means it runs only on the client.
    setIsClient(true);
  }, []);


  const { sortStatus, customSort, setShuffleSystems } = useSortContext();
  const { systemsSearched, systemsCustomOrder } = useStorageContext();
  const { toggleExpandAll, expandAllStatus } = useSystemExpansionContext();
  const { reloadSystems } = useSystemSearchContext();
  const { isMainMenuExpanded } = useAppContext();
  const { queryObject } = useQueryContext();

  const isCustomSortButtonDisabled = useMemo(() => systemsCustomOrder.length === 0, [systemsCustomOrder]);
  const isReloadDisabled = useMemo(() => Object.values(systemsSearched).every(searched => !searched), [systemsSearched]);
  const isShuffleDisabled = useMemo(() => {
    return ['completion_shortcut', 'unsupported'].includes(queryObject.shortcut?.type || '');
  }, [queryObject.shortcut?.type]);

  const isSortStatusCustom = sortStatus === 'custom';

  
  const handleShuffle = useCallback(() => {
    if (!isShuffleDisabled) {
      setShuffleSystems(true);
    }
  }, [isShuffleDisabled, setShuffleSystems]);


  const customSortButtonClassHandler = useCallback((button: HTMLButtonElement) => {
    if (isSortStatusCustom) {
      button.classList.add('transition-colors', 'duration-1000', 'ease-in-out');
      button.classList.replace('hover:bg-blue-100', 'hover:bg-blue-500');
      setTimeout(() => button.classList.replace('hover:bg-blue-500', 'hover:bg-blue-100'), 1000);
    } else {
      customSort("click");
    }
  }, [isSortStatusCustom, customSort]);

  const handleCustomSortButtonClick = useCallback(() => {
    const button = document.getElementById('custom-sort-button') as HTMLButtonElement;
    if (button) {
      customSortButtonClassHandler(button);
    }
  }, [customSortButtonClassHandler]);

  if (!isClient) {
    // This will only render null on the client during the first render.
    // It avoids server-client markup mismatch that leads to hydration errors.
    return null;
  }

  return (
  <div className={`flex bg-gray-100 flex-col items-start ${className}`}>
      <MainMenuButton
        TargetTitle="Settings"
        TargetTooltip="Settings"
        TargetComponent={<SettingsCard />}
        TargetIcon={<GearIcon />} 
        ButtonIndex={0}
        />
      <MainMenuButton
        TargetTitle="Info"
        TargetTooltip="Info"
        TargetComponent={<InfoCard />}
        TargetIcon={<QuestionMarkIcon />}
        ButtonIndex={1}
      />
      <MainMenuButton
        TargetTitle="Shortcuts"
        TargetTooltip="Shortcuts"
        TargetComponent={<QuickShortcutsCard />}
        TargetIcon={<SlashIcon />}
        ButtonIndex={2}
      />
      <div id="action-buttons" className="mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="shuffle-button"
                variant="ghost"
                onClick={handleShuffle}
                className={`${ACTION_BUTTON_CLASSNAME} ${['completion_shortcut', 'unsupported'].includes(queryObject.shortcut?.type || '') ? 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300' : ''}`}
                aria-disabled={['completion_shortcut', 'unsupported'].includes(queryObject.shortcut?.type || '')}
              >
                <ShuffleIcon className="w-4 h-4" />
                {isMainMenuExpanded && <span className="ml-2 text-xs">Shuffle</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-base">
              {['completion_shortcut', 'unsupported'].includes(queryObject.shortcut?.type || '') ? "Shuffle not supported while systems list is controlled by systems shortcut" : "Shuffle"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="expand-collapse-button"
              variant="ghost"
              onClick={toggleExpandAll}
                className={`${ACTION_BUTTON_CLASSNAME} ${expandAllStatus ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-current hover:bg-blue-100'}`}
            >
              <ChevronDownIcon
                className={`${expandAllStatus ? 'rotate-180 text-white' : ''} h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200`}
              />

                {isMainMenuExpanded && <span className={`ml-2 text-xs ${expandAllStatus ? 'text-white' : 'text-current'}`}>{expandAllStatus ? 'Collapse' : 'Expand'}</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-base">{expandAllStatus ? 'Collapse All' : 'Expand All'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
              <Button
                id="custom-sort-button"
                variant="ghost"
                onClick={() => handleCustomSortButtonClick()}
                className={`${ACTION_BUTTON_CLASSNAME} ${isCustomSortButtonDisabled && 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
                aria-disabled={isSortStatusCustom}
              >
                {isSortStatusCustom ? <StarFilledIcon className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                {isMainMenuExpanded && <span className="ml-2 text-xs">Custom Sort</span>}
              </Button>

          </TooltipTrigger>
          <TooltipContent side="top" className="text-base">
              {isCustomSortButtonDisabled ? 'Custom Sort Unavailable' : (isSortStatusCustom ? 'Custom Sort Active' : 'Custom Sort')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
        {isReloadDisabled ? (
          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      id="reload-button"
                      variant="ghost"
                      onClick={reloadSystems}
                      className={`${ACTION_BUTTON_CLASSNAME} opacity-50 cursor-default bg-gray-300 hover:bg-gray-300`}
                      aria-disabled
                    >
                      <ReloadIcon className="w-4 h-4" />
                      {isMainMenuExpanded && <span className="ml-2 text-xs">Reload</span>}
                    </Button>
                  </TooltipTrigger>
                </AlertDialogTrigger>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reload is not available</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Reload clears the 'searched' status for all systems.
                Please perform a search to enable the reload button.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>OK</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id="reload-button"
                  variant="ghost"
                  onClick={reloadSystems}
                  className={`${ACTION_BUTTON_CLASSNAME}`}
                  aria-disabled={!Object.values(systemsSearched).some(searched => searched)}
                >
                  <ReloadIcon className="w-4 h-4" />
                  {isMainMenuExpanded && <span className="ml-2 text-xs">Reload</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-base flex flex-wrap overflow-auto break-words sm:flex-col">
                {Object.values(systemsSearched).some(searched => searched) ? 'Reload' : <span className="text-center">Reload button is only available<br />after a search has been initiated.</span>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
