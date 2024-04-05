// toolbar/Toolbar.tsx
import React, { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { StarFilledIcon, StarIcon, ChevronDownIcon, ReloadIcon, ShuffleIcon, GearIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import InfoCard from "../cards/Info/InfoCard"
import SettingsCard from "../cards/Settings/SettingsCard"
import ShareDropdownMenu from "./ShareMenu"
import FeedbackDropdownMenu from "./FeedbackMenu"
import ShortcutsDropdownMenu from "./ShortcutsMenu"
import { useStorageContext,
  useAppContext,
  useSortContext,
  useSystemSearchContext,
  useSystemExpansionContext } from '../../contexts/';
import useFeatureFlag from '../../hooks/useFeatureFlag';


const Toolbar = () => {
  const { isFeatureEnabled } = useFeatureFlag();
  const { setSettingsCardActive } = useAppContext();
  const { sortStatus, customSort, setShuffleSystems } = useSortContext();
  const { systemsSearched, systemsCustomOrder } = useStorageContext();
  const { toggleExpandAll, expandAllStatus } = useSystemExpansionContext();
  const {reloadSystems} = useSystemSearchContext();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const toggleInfoOpen = () => setIsInfoOpen(!isInfoOpen);
  const toggleSettingsOpen = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setSettingsCardActive(!isSettingsOpen);
  };

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
              className="p-1 w-full hover:bg-blue-100"
            >
              <ShuffleIcon />
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
              className={`p-1 w-full ${expandAllStatus ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-current hover:bg-blue-100'}`}
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
              className={`hover:bg-blue-100 p-1 w-full ${disableCustomSortButton && 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
              aria-disabled={disableCustomSortButton}
            >
              {fillStarIcon ? <StarFilledIcon /> : <StarIcon />}
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
              className={`hover:bg-blue-100 p-1 w-full ${Object.values(systemsSearched).some(searched => searched) ? '' : 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
              aria-disabled={!Object.values(systemsSearched).some(searched => searched)}
            >
              <ReloadIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-base">
            {Object.values(systemsSearched).some(searched => searched) ? 'Reload' : 'Reload button is only available after a search has been initiated.'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Popover open={isInfoOpen} onOpenChange={toggleInfoOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button id="info-button" variant="outline"
                  className={`p-1 w-full ${isInfoOpen ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-current hover:bg-blue-100'}`}
                >
                  <QuestionMarkIcon
                    className={`${isInfoOpen ? 'text-white' : 'text-current'}`} />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-base">Info</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent align='end' style={{ width: "100vw" }} className='border-none bg-transparent shadow-none p-0'>
          <InfoCard />
        </PopoverContent>
      </Popover>
      <Popover open={isSettingsOpen} onOpenChange={toggleSettingsOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  id="settings-button"
                  variant="outline"
                  className={`p-1 w-full ${isSettingsOpen ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-current hover:bg-blue-100'}`}
                >
                  <GearIcon
                    className={`${isSettingsOpen ? 'text-white' : 'text-current'}`} />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-base">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent align='end' style={{ width: "100vw" }} className='border-none bg-transparent shadow-none p-0'>
          <SettingsCard />
        </PopoverContent>
      </Popover>
      <ShortcutsDropdownMenu />
      <FeedbackDropdownMenu />
      <ShareDropdownMenu />
    </div>
  );
};

export default Toolbar;