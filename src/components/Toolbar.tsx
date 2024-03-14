//Toolbar.tsx

import React, { useEffect, useState } from 'react';
import { useSystemsContext } from './SystemsContext';
import { useStorage } from './StorageContext';
import { Button } from "./ui/button";
import { StarFilledIcon, StarIcon, CaretDownIcon, CaretUpIcon, ReloadIcon, ShuffleIcon, GearIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import InfoCard from "./InfoCard"
import SettingsCard from "./SettingsCard"



const Toolbar = () => {
  const { sortStatus, reloadSystems, toggleAlphabeticalSortOrder, customSort, setShuffleSystems } = useSystemsContext();
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

  const [fillStarIcon, setFillStarIcon] = useState(false);
  useEffect(() => {
    if (sortStatus === 'custom') {
      setFillStarIcon(true);
    } else {
      setFillStarIcon(false);
    }
  }, [sortStatus]);


  return (
    <>
    <div id="toolbar" className="flex flex-row space-x-1 mt-1 justify-center items-center">
      <Button id="shuffle-button" variant="outline" title="Shuffle" onClick={setShuffleSystems} className="w-full">
        <ShuffleIcon />
      </Button>
      <Button id="sort-button" variant="outline" title={sortStatus === 'abc' ? "Sort Reverse Alphabetically" : "Sort Alphabetically"} onClick={toggleAlphabeticalSortOrder} className="w-full">
        <div className="flex items-center text-xs font-light tracking-tighter">{sortStatus === 'abc' ? <CaretUpIcon /> : <CaretDownIcon />}<span>abc</span></div>
      </Button>
      <Button
        id="custom-sort-button"
        variant="outline"
        title="Custom Sort"
        onClick={() => customSort("click")}
          className={`w-full ${disableCustomSortButton && 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}`}
          aria-disabled={disableCustomSortButton ? "true" : "false"}
      >
          {fillStarIcon ? <StarFilledIcon /> : <StarIcon />}
      </Button>
      <Button
        id="reload-button"
        variant="outline"
        title="Reload"
        onClick={reloadSystems}
        className={`
          w-full
          ${Object.values(systemsSearched).some(searched => searched) ? '' : 'opacity-50 cursor-default bg-gray-300 hover:bg-gray-300'}
        `}
        aria-disabled={!Object.values(systemsSearched).some(searched => searched) ? "true" : "false"}
      >
        <ReloadIcon />
      </Button>
      <Popover open={isInfoOpen} onOpenChange={toggleInfoOpen}>
        <PopoverTrigger asChild>
          <Button id="info-button" variant="outline" title="Info" className="w-full">
            <QuestionMarkIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' style={{ width: "100vw" }} className='border-none bg-transparent shadow-none p-0'>
          <InfoCard />
        </PopoverContent>
      </Popover>
      <Popover open={isSettingsOpen} onOpenChange={toggleSettingsOpen}>
        <PopoverTrigger asChild>
          <Button id="settings-button" variant="outline" title="Settings" className="w-full">
            <GearIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' style={{ width: "100vw" }} className='border-none bg-transparent shadow-none p-0'>
          <SettingsCard />
        </PopoverContent>
      </Popover>
    </div>
    </>
  );
};
export default Toolbar;