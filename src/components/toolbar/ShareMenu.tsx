// toolbar/ShareMenu.tsx
import React, { useState } from 'react'; 
import { Button } from "../shadcn-ui/button";
import { Share2Icon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn-ui/dropdown-menu"
import { useSearch } from '../contexts/SearchContext';

const initiateShare = (query: string) => {
  setURLWithQuery(query);
  copyURLToClipboard(query);
}

const copyURLToClipboard = (query: string) => {
  navigator.clipboard.writeText(query);
}

const setURLWithQuery = (query: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('q', query);
  window.history.pushState({}, '', url.toString());
}

const currentURL = typeof window !== "undefined" ? window.location.href : '';
const baseURL = currentURL.split('?')[0] || '';

const ShareDropdownMenu = () => {
  const { query} = useSearch();
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);

  const toggleSharePopover = () => {
    setIsSharePopoverOpen(!isSharePopoverOpen);
  };
  return (
    <DropdownMenu onOpenChange={toggleSharePopover}>
      <DropdownMenuTrigger asChild>
        <Button
          id="share-button"
          variant="outline"
          title="Share"
          onClick={() => {
            initiateShare(query);
          }}
          className={`w-full ${isSharePopoverOpen ? 'bg-blue-500 text-white' : 'text-current hover:bg-blue-100'}`}
        >
          <Share2Icon className={`${isSharePopoverOpen ? 'text-white' : 'text-current'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Share</DropdownMenuLabel>
        <p className="text-sm p-2">This URL has been copied to your clipboard.</p>
        <code className="text-sm p-2">{typeof window !== "undefined" ? currentURL : ''}</code>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => {navigator.clipboard.writeText(baseURL || ''); alert(`Searchjunct URL copied to clipboard!\n${baseURL}`);}}>Copy Searchjunct URL</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareDropdownMenu;
