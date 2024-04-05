// toolbar/FeedbackMenu.tsx
import React, { useState } from 'react';
import { Button } from "../ui/button";
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const FeedbackDropdownMenu = () => {
  const [isFeedbackPopoverOpen, setIsFeedbackPopoverOpen] = useState(false);

  const toggleFeedbackPopover = () => {
    setIsFeedbackPopoverOpen(!isFeedbackPopoverOpen);
  };
  return (
    <DropdownMenu onOpenChange={toggleFeedbackPopover}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                id="feedback-button"
                variant="outline"
                className={`p-1 w-full ${isFeedbackPopoverOpen ? 'bg-blue-500 text-white' : 'text-current hover:bg-blue-100'}`}
              // note: bg-orange-300 if there are alerts, need to add this into a cleaner component
              >
                <ExclamationTriangleIcon className={`${isFeedbackPopoverOpen ? 'text-white' : 'text-current'}`} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-base">Feedback & Alerts</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent>
        <DropdownMenuLabel>Feedback & Alerts</DropdownMenuLabel>
        <p className="text-gray-500 text-sm p-2">Alerts</p>
        <p className="text-sm text-gray-500 p-2">There are no alerts at this time.</p>
        
        {/*Template: clean up <a href="https://github.com/archignes/searchjunct/issues/68" target="_blank" rel="noopener noreferrer"
          className="text-red-500 bg-orange-100 underline"><p className="text-sm text-red-500 p-2">
            <span className="font-bold">#68</span> Custom Sort is not currently working.
        </p></a> */}
        <DropdownMenuSeparator />
        <p className="p-2 text-sm">Feedback</p>
        <DropdownMenuItem className="hover:bg-blue-100 outline-1" onSelect={() => { window.open('https://github.com/archignes/searchjunct/issues/new', '_blank'); }}>Submit a new GitHub issue</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-blue-100 outline-1" onSelect={() => { window.open('https://github.com/archignes/searchjunct/issues', '_blank'); }}>See open GitHub issues</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeedbackDropdownMenu;
