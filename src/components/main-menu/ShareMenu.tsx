// toolbar/ShareMenu.tsx
import React, { useEffect, useState, useRef } from 'react'; 
import { Button } from "../ui/button";
import { CopyIcon } from '@radix-ui/react-icons';
import {
  Card,
  CardContent,
  CardTitle,
} from '../ui/card';

import { useQueryContext, useAddressContext } from '../../contexts';

const ShareCard: React.FC<{ className?: string }> = ({ className }) => {
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

  return (
    <Card className='rounded-md bg-white shadow-none mx-auto'>
      <CardTitle className='text-left pl-2 py-1 mb-2'>Share</CardTitle>
      <CardContent className="p-0 flex justify-center items-center flex-col">
          <Button variant="outline" id="copy-exact-url-button" className="w-[250px] hover:bg-blue-100 cursor-pointer"
              onClick={async (event) => {
                event.preventDefault();
                await navigator.clipboard.writeText(url || '');
                setIsExactURLCopyButtonClicked(true);
            }}><CopyIcon className="inline h-4 w-4 mr-2" />Copy Searchjunct search URL
          </Button>
          <div className="flex flex-col">
                <div className="text-sm p-1 my-1 w-full flex rounded-md justify-between items-center break-all">
                  <code>{typeof window !== "undefined" ? url : ''}</code>
                </div>
                {isExactURLCopyButtonClicked && <span className="text-xs text-gray-500">Copied!</span>}
              </div>
              <br/>
          <Button variant="outline" id="copy-root-url-button" className="w-[250px] hover:bg-blue-100 cursor-pointer"
              onClick={async (event) => {
                event.preventDefault();
                await navigator.clipboard.writeText(baseURL || '');
                setIsRootCopyButtonClicked(true);
            }}><CopyIcon className="inline h-4 w-4 mr-2" />Copy Searchjunct.com
          </Button>
              <div className="flex flex-col">
                <div className="text-sm p-1 my-1 w-full flex rounded-md justify-between items-center">
                  <code>{typeof window !== "undefined" ? baseURL : ''}</code>
                </div>
                {isRootCopyButtonClicked && <span className="text-xs text-gray-500">Copied!</span>}
              </div>
          
        </CardContent>
    </Card>

  );
}              

export default ShareCard;
