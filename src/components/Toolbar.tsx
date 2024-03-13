//Toolbar.tsx

import React, { useState } from 'react';
import { useSystemsContext } from './SystemsContext';
import { Button } from "./ui/button";
import { StarFilledIcon, CaretDownIcon, CaretUpIcon, ReloadIcon, ShuffleIcon, GearIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import SettingsCard from "./SettingsCard"

const Toolbar = () => {
  const { sortStatus, shuffleSystems, reloadSystems, toggleAlphabeticalSortOrder, customSort } = useSystemsContext();
  const [isOpen, setIsOpen] = useState(false); // Define state for popover visibility

  const toggleOpen = () => setIsOpen(!isOpen); // Define a method to toggle the state


  return (
    <div className="flex flex-row space-x-1 mt-1 justify-center items-center">
      <Button id="shuffle-button" variant="outline" title="Shuffle" onClick={shuffleSystems} className="w-full">
        <ShuffleIcon />
      </Button>
      <Button id="sort-button" variant="outline" title={sortStatus === 'abc' ? "Sort Reverse Alphabetically" : "Sort Alphabetically"} onClick={toggleAlphabeticalSortOrder} className="w-full">
        <div className="flex items-center text-xs font-light tracking-tighter">{sortStatus === 'abc' ? <CaretUpIcon /> : <CaretDownIcon />}<span>abc</span></div>
      </Button>
      <Button id="custom-sort-button" variant="outline" title="Custom Sort" onClick={customSort} className="w-full">
        <StarFilledIcon />
      </Button>
      <Button id="reload-button" variant="outline" title="Reload" onClick={reloadSystems} className="w-full">
        <ReloadIcon />
      </Button>
      <Popover open={isOpen} onOpenChange={toggleOpen}>
        <PopoverTrigger asChild>
          <Button id="settings-button" variant="outline" title="Settings" className="w-full"> {/* Corrected the id */}
            <GearIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' style={{ width: "100vw" }} className='border-none bg-transparent shadow-none p-0'>
          <SettingsCard />
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default Toolbar;