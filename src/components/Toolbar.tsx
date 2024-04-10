// toolbar/Toolbar.tsx
import React, { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { StarFilledIcon, StarIcon, ChevronDownIcon, ReloadIcon, ShuffleIcon } from "@radix-ui/react-icons";
import { useStorageContext,
  useSortContext,
  useSystemSearchContext,
  useSystemExpansionContext } from '../contexts';
import useFeatureFlag from '../hooks/useFeatureFlag';


const Toolbar = () => {
  const { isFeatureEnabled } = useFeatureFlag();
  const { sortStatus, customSort, setShuffleSystems } = useSortContext();
  const { systemsSearched, systemsCustomOrder } = useStorageContext();
  const { toggleExpandAll, expandAllStatus } = useSystemExpansionContext();
  const {reloadSystems} = useSystemSearchContext();


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

  return (
    <div id="toolbar" className="flex flex-row space-x-1 mt-1 justify-center items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="shuffle-button"
              variant="outline"
              onClick={() => setShuffleSystems(true)}
              className="p-1 w-9 hover:bg-blue-100"
            >
              <ShuffleIcon className="w-4 h-4" />
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
              variant="outline"
              onClick={toggleExpandAll}
              className={`p-1 w-9 ${expandAllStatus ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-current hover:bg-blue-100'}`}
            >
              <ChevronDownIcon
                className={`${expandAllStatus ? 'rotate-180 text-white' : ''} h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200`}
              />
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
              variant="outline"
              onClick={() => customSort("click")}
              className={`hover:bg-blue-100 p-1 w-9 ${disableCustomSortButton && 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
              aria-disabled={disableCustomSortButton}
            >
              {fillStarIcon ? <StarFilledIcon className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
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
              variant="outline"
              onClick={reloadSystems}
              className={`hover:bg-blue-100 p-1 w-9 ${Object.values(systemsSearched).some(searched => searched) ? '' : 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
              aria-disabled={!Object.values(systemsSearched).some(searched => searched)}
            >
              <ReloadIcon className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-base">
            {Object.values(systemsSearched).some(searched => searched) ? 'Reload' : 'Reload button is only available after a search has been initiated.'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;