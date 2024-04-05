// toolbar/ShortcutsMenu.tsx

import React, { useState } from 'react';
import { Button } from "../ui/button";
import { SlashIcon } from '@radix-ui/react-icons';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useStorageContext, useQueryContext } from '@/contexts';
import { MultisearchActionObject } from '@/types';

const ShortcutsDropdownMenu = () => {
  const { multisearchActionObjects } = useStorageContext();
  const { queryObject } = useQueryContext();
  const [isShortcutsPopoverOpen, setIsShortcutsPopoverOpen] = useState(false);

  const toggleShortcutsPopover = () => {
    setIsShortcutsPopoverOpen(!isShortcutsPopoverOpen);
  };
  return (
    <DropdownMenu onOpenChange={toggleShortcutsPopover}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                id="feedback-button"
                variant="outline"
                className={`p-1 w-full ${isShortcutsPopoverOpen ? 'bg-blue-500 text-white' : 'text-current hover:bg-blue-100'}`}
              >
                <SlashIcon className={`${isShortcutsPopoverOpen ? 'text-white' : 'text-current'}`} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-base">Shortcuts</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent>
        <DropdownMenuLabel>Shortcuts</DropdownMenuLabel>
        <p className="text-gray-500 text-sm p-2">Query Shortcuts</p>
        <p className="text-sm text-gray-500 p-2">There are no query shortcuts at this time.</p>
        <DropdownMenuSeparator />
        <p className="p-2 text-sm">Multisearch Shortcuts</p>
        <Button variant="outline" size="sm" className="text-xs hover:bg-blue-100 mx-auto w-3/4"><a href="/multisearch">Manage multisearch shortcuts</a></Button>

        {multisearchActionObjects.map((shortcut: MultisearchActionObject, index) => (
          <DropdownMenuItem key={index} onSelect={() => {
            const updatedQuery = `${queryObject.raw_string} /${shortcut.name}`;
            const searchInput = document.getElementById('search-input') as HTMLInputElement;
            if (searchInput) {
              searchInput.value = updatedQuery;
              searchInput.focus();
              // Move the cursor to the end of the text
              const textLength = searchInput.value.length;
              searchInput.setSelectionRange(textLength, textLength);
            }
          }}><span>/{shortcut.name}</span><span>: {shortcut.description}</span></DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShortcutsDropdownMenu;
