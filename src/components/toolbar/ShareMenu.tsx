// toolbar/ShareMenu.tsx
import React, { useEffect, useState, useRef } from 'react'; 
import { Button } from "../shadcn-ui/button";
import { Share2Icon } from '@radix-ui/react-icons';
import { CopyIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn-ui/dropdown-menu"
import { useQueryContext, useAddressContext } from '../../contexts/';

const ShareDropdownMenu = () => {
  const { setQueryObjectIntoURL } = useQueryContext();
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
  const { baseURL, url } = useAddressContext();
  const isInitialClickRef = useRef(true);
  const [isRootCopyButtonClicked, setIsRootCopyButtonClicked] = useState(false);
  const [isExactURLCopyButtonClicked, setIsExactURLCopyButtonClicked] = useState(false);
  
  // This useEffect hook is triggered when the share popover is opened.
  //On the initial click, it performs several actions:
  // 1. Calls setQueryObjectIntoURL() to update the URL with query parameters reflecting the current state.
  // 2. Resets the states of both copy button indicators to false, indicating that neither the
  //exact URL nor the root URL has been copied yet.
  // 3. Sets isInitialClickRef.current to false to prevent these actions from running on subsequent
  // popover opens during the same component lifecycle.
  // When the component unmounts or before the next time this effect runs, it resets
  // isInitialClickRef.current to true, preparing it for the next initial click.
  useEffect(() => {
    if (isSharePopoverOpen && isInitialClickRef.current) {
      setIsExactURLCopyButtonClicked(false);
      setIsRootCopyButtonClicked(false);
      setQueryObjectIntoURL();
      isInitialClickRef.current = false;
    } else {
      isInitialClickRef.current = true; // Reset for the next time popover opens
    };
  }, [isSharePopoverOpen, setQueryObjectIntoURL]);

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
          className={`p-1 w-full ${isSharePopoverOpen ? 'bg-blue-500 text-white' : 'text-current hover:bg-blue-100'}`}
        >
          <Share2Icon className={`${isSharePopoverOpen ? 'text-white' : 'text-current'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[350px] mr-5">
        <DropdownMenuLabel>Share</DropdownMenuLabel>
        <DropdownMenuItem id="copy-exact-url-button" className="hover:bg-blue-100 cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            await navigator.clipboard.writeText(url || '');
            setIsExactURLCopyButtonClicked(true);
          }}>
          <div className="flex flex-col">
            <div><CopyIcon className="inline h-4 w-4 mr-2" />Copy Searchjunct search URL</div>
            <div className="text-sm p-1 my-1 w-full flex border rounded-md justify-between items-center">
              <code>{typeof window !== "undefined" ? url : ''}</code>
            </div>
            {isExactURLCopyButtonClicked && <span className="text-xs text-gray-500">Copied!</span>}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
            <DropdownMenuItem id="copy-root-url-button" className="hover:bg-blue-100 cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            await navigator.clipboard.writeText(baseURL || '');
            setIsRootCopyButtonClicked(true);
          }}>
              <div className="flex flex-col">
                <div><CopyIcon className="inline h-4 w-4 mr-2" />Copy Searchjunct.com</div>
                <div className="text-sm p-1 my-1 w-full flex border rounded-md justify-between items-center">
              <code>{typeof window !== "undefined" ? baseURL : ''}</code>
                </div>
            {isRootCopyButtonClicked && <span className="text-xs text-gray-500">Copied!</span>}
              </div>
            </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareDropdownMenu;
