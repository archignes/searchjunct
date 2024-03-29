// toolbar/ShortcutsMenu.tsx

import React, { useState } from 'react';
import { Button } from "../shadcn-ui/button";
import { SlashIcon } from '@radix-ui/react-icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn-ui/dropdown-menu"
import { useStorage } from '../contexts/StorageContext';
import { useSearch } from '../contexts/SearchContext';
import MultisearchShortcut from 'types/multisearch-shortcuts';

const ShortcutsDropdownMenu = () => {
  const { multisearchShortcuts } = useStorage();
  const { query, setQuery } = useSearch();
  const [isShortcutsPopoverOpen, setIsShortcutsPopoverOpen] = useState(false);

  const toggleShortcutsPopover = () => {
    setIsShortcutsPopoverOpen(!isShortcutsPopoverOpen);
  };
  return (
    <DropdownMenu onOpenChange={toggleShortcutsPopover}>
      <DropdownMenuTrigger asChild>
        <Button
          id="feedback-button"
          variant="outline"
          title="Shortcuts"
          className={`p-1 w-full ${isShortcutsPopoverOpen ? 'bg-blue-500 text-white' : 'text-current hover:bg-blue-100'}`}
        >
          <SlashIcon className={`${isShortcutsPopoverOpen ? 'text-white' : 'text-current'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Shortcuts</DropdownMenuLabel>
        <p className="text-gray-500 text-sm p-2">Query Shortcuts</p>
        <p className="text-sm text-gray-500 p-2">There are no query shortcuts at this time.</p>
        <DropdownMenuSeparator />
        <p className="p-2 text-sm">Multisearch Shortcuts</p>
        <Button variant="outline" size="sm" className="text-xs hover:bg-blue-100 mx-auto w-3/4"><a href="/multisearch">Manage multisearch shortcuts</a></Button>

        {multisearchShortcuts.map((shortcut: MultisearchShortcut, index) => (
          <DropdownMenuItem key={index} onSelect={() => {
            setQuery(query === "" ? `/${shortcut.name} ` : `${query} /${shortcut.name}`);
            const searchInput = document.getElementById('search-input') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              // Calculate the length of the text to move the cursor to the end
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
