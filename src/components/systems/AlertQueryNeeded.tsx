// systems/AlertQueryNeeded.tsx

import React from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog";
import { System, Query } from "../../types";
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface AlertQueryNeededInterface {
  system: System;
  getPreppedSearchLink: ({ system, query }: { system: System; query: string }) => string;
  queryObject: Query;
  submitSearch: ({ system }: { system: System }) => void;
  activeSystemId: string | undefined;
}

const AlertQueryNeeded: React.FC<AlertQueryNeededInterface> = ({
  system,
  getPreppedSearchLink,
  queryObject,
  submitSearch,
  activeSystemId
}) => {
  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <AlertDialogTrigger asChild>
            <TooltipTrigger asChild>
              <div className="items-center flex hover:bg-blue-100 p-1 hover:rounded-md">
                <MagnifyingGlassIcon
                  className={`flex-shrink-0 cursor-pointer
                                  ${activeSystemId === system.id ? 'w-8 h-8' : 'w-4 h-4'}`}
                />
              </div>
            </TooltipTrigger>
          </AlertDialogTrigger>
          <TooltipContent side="right" className="text-base">Search with {system.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Query Required</AlertDialogTitle>
          <AlertDialogDescription>
          {system.searchLinkNote && (
            <p>{system.searchLinkNote}</p>
          )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>OK</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};

export default AlertQueryNeeded;