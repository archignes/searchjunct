// toolbar/FeedbackMenu.tsx
import React, { useState } from 'react';
import { Button } from "../shadcn-ui/button";
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn-ui/dropdown-menu"

const FeedbackDropdownMenu = () => {
  const [isFeedbackPopoverOpen, setIsFeedbackPopoverOpen] = useState(false);

  const toggleFeedbackPopover = () => {
    setIsFeedbackPopoverOpen(!isFeedbackPopoverOpen);
  };
  return (
    <DropdownMenu onOpenChange={toggleFeedbackPopover}>
      <DropdownMenuTrigger asChild>
        <Button
          id="feedback-button"
          variant="outline"
          title="Feedback & Alerts"
          className={`p-1 w-full ${isFeedbackPopoverOpen ? 'bg-blue-500 text-white' : 'text-current hover:bg-blue-100'}`}
        >
          <ExclamationTriangleIcon className={`${isFeedbackPopoverOpen ? 'text-white' : 'text-current'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Feedback & Alerts</DropdownMenuLabel>
        <p className="text-gray-500 text-sm p-2">Alerts</p>
        <p className="text-sm text-gray-500 p-2">There are no alerts at this time.</p>
        <DropdownMenuSeparator />
        <p className="p-2 text-sm">Feedback</p>
        <DropdownMenuItem className="hover:bg-blue-100 outline-1" onSelect={() => { window.open('https://github.com/archignes/searchjunct/issues/new', '_blank'); }}>Submit a new GitHub issue</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-blue-100 outline-1" onSelect={() => { window.open('https://github.com/archignes/searchjunct/issues', '_blank'); }}>See open GitHub issues</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeedbackDropdownMenu;
