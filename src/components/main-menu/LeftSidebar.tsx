// LeftSidebar.tsx

import React from 'react';
import { PlusIcon, GearIcon, SlashIcon, ExclamationTriangleIcon, QuestionMarkIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { MainMenuButton } from './Button';
import SettingsCard from './SettingsCard';
import InfoCard from './Info';
import QuickShortcutsCard from './QuickShortcuts';
import SortCard from './Sort';
import AlertsCard from './Alerts';
import AddCard from './Systems';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { StarFilledIcon, StarIcon, ChevronDownIcon, ReloadIcon, ShuffleIcon } from "@radix-ui/react-icons";
import {
  useStorageContext,
  useSortContext,
  useSystemSearchContext,
  useSystemExpansionContext,
  useAppContext
} from '@/contexts';
import useFeatureFlag from '../../hooks/useFeatureFlag';


const LeftSidebar: React.FC<{ className?: string }> = ({ className }) => {
  const { isFeatureEnabled } = useFeatureFlag();
  const { sortStatus, customSort, setShuffleSystems } = useSortContext();
  const { systemsSearched, systemsCustomOrder } = useStorageContext();
  const { toggleExpandAll, expandAllStatus } = useSystemExpansionContext();
  const { reloadSystems } = useSystemSearchContext();
  const { isMainMenuExpanded } = useAppContext();


  const [disableCustomSortButton, setDisableCustomSortButton] = useState(false);
  useEffect(() => {
    setDisableCustomSortButton(systemsCustomOrder.length === 0);
  }, [systemsCustomOrder]);

  const [fillStarIcon, setFillStarIcon] = useState(false);
  useEffect(() => {
    setFillStarIcon(sortStatus === 'custom');
  }, [sortStatus]);

  if (!isFeatureEnabled('toolbar')) {
    return null;
  }

  const actionButtonClassName = "p-0 h-7 px-1 flex items-center justify-center hover:bg-blue-100";


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
      {/* <MainMenuButton
        TargetTitle="Add"
        TargetTooltip="Add"
        TargetComponent={<AddCard />}
        TargetIcon={<PlusIcon />}
        ButtonIndex={3}
      /> */}
      {/* <MainMenuButton
        TargetTitle="Alerts"
        TargetTooltip="Alerts"
        TargetComponent={<AlertsCard />}
        TargetIcon={<ExclamationTriangleIcon />}
        ButtonIndex={5}
      /> */}
      <div id="action-buttons" className="mt-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="shuffle-button"
              variant="ghost"
              onClick={() => setShuffleSystems(true)}
              className={`${actionButtonClassName}`}
            >
              <ShuffleIcon className="w-4 h-4" />
                {isMainMenuExpanded && <span className="ml-2 text-xs">Shuffle</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-base">Shuffle</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="expand-collapse-button"
              variant="ghost"
              onClick={toggleExpandAll}
              className={`${actionButtonClassName} ${expandAllStatus ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-current hover:bg-blue-100'}`}
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
              onClick={() => customSort("click")}
              className={`${actionButtonClassName} ${disableCustomSortButton && 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
              aria-disabled={disableCustomSortButton}
            >
              {fillStarIcon ? <StarFilledIcon className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                {isMainMenuExpanded && <span className="ml-2 text-xs">Custom Sort</span>}

            </Button>

          </TooltipTrigger>
          <TooltipContent side="top" className="text-base">
            {disableCustomSortButton ? 'Custom Sort Unavailable' : (fillStarIcon ? 'Custom Sort Active' : 'Custom Sort')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="reload-button"
              variant="ghost"
              onClick={reloadSystems}
              className={`${actionButtonClassName} ${Object.values(systemsSearched).some(searched => searched) ? '' : 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
              aria-disabled={!Object.values(systemsSearched).some(searched => searched)}
            >
              <ReloadIcon className="w-4 h-4" />
                {isMainMenuExpanded && <span className="ml-2 text-xs">Reload</span>}

            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-base flex flex-wrap overflow-auto break-words sm:flex-col">
            {Object.values(systemsSearched).some(searched => searched) ? 'Reload' : <span>Reload button is only available<br />after a search has been initiated.</span>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </div>
  </div>

)
}

export default LeftSidebar;
