//Toolbar.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { useSystemsContext, System } from './SystemsContext';
import { useStorage } from './StorageContext';
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { StarFilledIcon, StarIcon, ChevronDownIcon, ChevronUpIcon, ReloadIcon, ShuffleIcon, GearIcon, QuestionMarkIcon, BoxIcon, CheckboxIcon, MinusIcon, DotFilledIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import InfoCard from "./InfoCard"
import SettingsCard from "./SettingsCard"
import ShareDropdownMenu from "./ShareDropdownMenu"
import { useSearch } from './SearchContext';


const Toolbar = () => {
  const { sortStatus,
    reloadSystems,
    customSort,
    setShuffleSystems,
    toggleExpandAll,
    expandAllStatus
     } = useSystemsContext();
  // Separate state for each popover
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { systemsSearched, systemsCustomOrder } = useStorage();
  // Toggle functions for each popover
  const toggleInfoOpen = () => setIsInfoOpen(!isInfoOpen);
  const toggleSettingsOpen = () => setIsSettingsOpen(!isSettingsOpen);
  const [disableCustomSortButton, setDisableCustomSortButton] = useState(true);
  useEffect(() => {
    if (systemsCustomOrder.length === 0) {
      setDisableCustomSortButton(true);
      return;
    }
    setDisableCustomSortButton(false);
  }, [systemsCustomOrder]);

  const { systemsCurrentOrder, checkboxStatuses } = useSystemsContext();



  const [fillStarIcon, setFillStarIcon] = useState(false);
  useEffect(() => {
    if (sortStatus === 'custom') {
      setFillStarIcon(true);
    } else {
      setFillStarIcon(false);
    }
  }, [sortStatus]);

  const { multiSelect, setMultiSelect } = useSearch();

  const handleMultiSelect = () => {
    if (multiSelect === false) {
      setMultiSelect(true);
    } else if (multiSelect === true) {
      setMultiSelect(false);
    }
  };


  

  return (
    <>
    <div id="toolbar" className="flex flex-row space-x-1 mt-1 justify-center items-center">
        {/* <Button
          id="multi-select-button"
          variant="outline"
          title="Select"
          onClick={handleMultiSelect}
          className="p-1 w-full"
        >
          <div className="relative w-max h-max">
            <Checkbox
              checked={multiSelect}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                ${!multiSelect ? "bg-gray-200" : "bg-white"
                }`}
              onCheckedChange={handleMultiSelect}
            />
          </div>
        </Button> */}
      <Button id="shuffle-button" variant="outline" title="Shuffle" onClick={setShuffleSystems}
          className="p-1 w-full hover:bg-blue-100">
        <ShuffleIcon />
      </Button>
        <Button
          id="expand-collapse-button"
          variant="outline"
          title={expandAllStatus ? "Collapse" : "Expand"}
          onClick={toggleExpandAll}
          className="hover:bg-blue-100 p-1 w-full"
        >
          <ChevronDownIcon
            className={`${expandAllStatus ? 'rotate-180' : ''
              } h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200`}
          />
        </Button>
      <Button
        id="custom-sort-button"
        variant="outline"
        title="Custom Sort"
        onClick={() => customSort("click")}
          className={`hover:bg-blue-100 p-1 w-full ${disableCustomSortButton && 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
          aria-disabled={disableCustomSortButton ? "true" : "false"}
      >
          {fillStarIcon ? <StarFilledIcon /> : <StarIcon />}
      </Button>
      <Button
        id="reload-button"
        variant="outline"
        title="Reload"
        onClick={reloadSystems}
          className={`hover:bg-blue-100
          p-1 w-full
          ${Object.values(systemsSearched).some(searched => searched) ? '' : 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}
        `}
        aria-disabled={!Object.values(systemsSearched).some(searched => searched) ? "true" : "false"}
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
      <ShareDropdownMenu/>
    </div>
    </>
  );
};
export default Toolbar;