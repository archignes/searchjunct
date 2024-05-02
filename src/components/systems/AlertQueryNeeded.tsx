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
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

import { SystemTitle } from "./Title";

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
              <span id={`system-search-link-${system.id}`} className="system-search-link items-center flex rounded-l-md hover:bg-blue-100 p-1 pr-2 hover:rounded-md"
                >
                <SystemTitle
                  className={`px-0 flex items-center flex-grow w-full ${activeSystemId === system.id ? 'text-lg' : 'text-base'}`}
                  system={system}
                  favicon_included={true}
                  focus_mode={activeSystemId === system.id}
                />
              </span>
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