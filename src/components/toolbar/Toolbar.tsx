import React, { useEffect, useState } from 'react';
import { useSystemsContext } from '../contexts/SystemsContext';
import { useStorage } from '../contexts/StorageContext';
import { Button } from "../shadcn-ui/button";
import { StarFilledIcon, StarIcon, ChevronDownIcon, ReloadIcon, ShuffleIcon, GearIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn-ui/popover"
import InfoCard from "../cards/InfoCard"
import SettingsCard from "../cards/SettingsCard"
import ShareDropdownMenu from "./ShareMenu"
import FeedbackDropdownMenu from "./FeedbackMenu"
import { useSearch } from '../contexts/SearchContext';
import { useAppContext } from '../contexts/AppContext';

const Toolbar = () => {
  const { setSettingsCardActive } = useAppContext();
  const {
    sortStatus,
    reloadSystems,
    customSort,
    setShuffleSystems,
    toggleExpandAll,
    expandAllStatus,
  } = useSystemsContext();
  const { systemsSearched, systemsCustomOrder } = useStorage();

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

  return (
    <div id="toolbar" className="flex flex-row space-x-1 mt-1 justify-center items-center">
      <Button
        id="shuffle-button"
        variant="outline"
        title="Shuffle"
        onClick={() => setShuffleSystems(true)}
        className="p-1 w-full hover:bg-blue-100"
      >
        <ShuffleIcon />
      </Button>
      <Button
        id="expand-collapse-button"
        variant="outline"
        title={expandAllStatus ? 'Collapse All' : 'Expand All'}
        onClick={toggleExpandAll}
        className={`p-1 w-full ${expandAllStatus ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-current hover:bg-blue-100'}`}
      >
        <ChevronDownIcon
          className={`${expandAllStatus ? 'rotate-180 text-white' : ''} h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200`}
        />
      </Button>
      <Button
        id="custom-sort-button"
        variant="outline"
        title="Custom Sort"
        onClick={() => customSort("click")}
        className={`hover:bg-blue-100 p-1 w-full ${disableCustomSortButton && 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
        aria-disabled={disableCustomSortButton}
      >
        {fillStarIcon ? <StarFilledIcon /> : <StarIcon />}
      </Button>
      <Button
        id="reload-button"
        variant="outline"
        title="Reload"
        onClick={reloadSystems}
        className={`hover:bg-blue-100 p-1 w-full ${Object.values(systemsSearched).some(searched => searched) ? '' : 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
        aria-disabled={!Object.values(systemsSearched).some(searched => searched)}
      >
        <ReloadIcon />
      </Button>
      <Popover open={isInfoOpen} onOpenChange={toggleInfoOpen}>
        <PopoverTrigger asChild>
          <Button id="info-button" variant="outline" title="Info"
            className={`p-1 w-full ${isInfoOpen ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-current hover:bg-blue-100'}`}
          >
            <QuestionMarkIcon
              className={`${isInfoOpen ? 'text-white' : 'text-current'}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' style={{ width: "100vw" }} className='border-none bg-transparent shadow-none p-0'>
          <InfoCard />
        </PopoverContent>
      </Popover>
      <Popover open={isSettingsOpen} onOpenChange={toggleSettingsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="settings-button"
            variant="outline"
            title="Settings"
            className={`p-1 w-full ${isSettingsOpen ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-current hover:bg-blue-100'}`}
          >
            <GearIcon
              className={`${isSettingsOpen ? 'text-white' : 'text-current'}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' style={{ width: "100vw" }} className='border-none bg-transparent shadow-none p-0'>
          <SettingsCard />
        </PopoverContent>
      </Popover>
      <FeedbackDropdownMenu />
      <ShareDropdownMenu />
    </div>
  );
};

export default Toolbar;