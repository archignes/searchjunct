// ui/SystemItem.tsx 

import React, { useState, useLayoutEffect, useCallback } from 'react';

import { Button } from '../ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Query } from '../../types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion-minus"
import { System } from '../../types/system';
import SystemAccordionCard from './Card.Accordion';
import {
  useSystemExpansionContext,
  useQueryContext,
  useSystemSearchContext,
  useSearchContext,
  useStorageContext,
  useAddressContext
} from '../../contexts';
import { SystemTitle } from './Title';
import AlertQueryNeeded from './AlertQueryNeeded';


interface SystemItemProps {
  system: System;
  activeSystemId: string | undefined;
  className?: string;
  showDisableDeleteButtons?: boolean;
}


interface SystemAccordionItemProps {
  className?: string;
  system: System;
  queryObject?: Query;
  activeSystemId?: string | undefined;
  submitSearch?: ({ system }: { system: System }) => void;
  getPreppedSearchLink?: ({ system, query }: { system: System; query: string }) => string;
  openItem?: string | undefined;
  setOpenItem?: (value: string | undefined) => void;
}

interface TitleToInitiateSearchProps {
  system: System;
  getPreppedSearchLink: ({ system, query }: { system: System; query: string }) => string;
  queryObject: Query;
  submitSearch: ({ system }: { system: System }) => void;
  activeSystemId: string | undefined;
}

export const TitleToInitiateSearch: React.FC<TitleToInitiateSearchProps> = ({
  system,
  getPreppedSearchLink,
  queryObject,
  submitSearch,
  activeSystemId
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a id={`system-search-link-${system.id}`} className="system-search-link items-center flex rounded-l-md hover:bg-blue-100 p-1 pr-2 hover:rounded-md"
            href={getPreppedSearchLink({ system, query: queryObject.query })}
            onClick={(e) => { e.preventDefault(); submitSearch({ system: system }); }}>
            <SystemTitle
              className={`px-0 flex items-center flex-grow w-full ${activeSystemId === system.id ? 'text-lg' : 'text-base'}`}
              system={system}
              favicon_included={true}
              focus_mode={activeSystemId === system.id}
            />
          </a>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-base">Search with {system.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


const SystemAccordionItem: React.FC<SystemAccordionItemProps> = React.memo(({
  className,
  system,
  queryObject,
  activeSystemId,
  submitSearch,
  getPreppedSearchLink,
  openItem,
  setOpenItem,
}) => {
  const handleAccordionToggle = (e: React.MouseEvent) => {
    // Prevents the accordion from toggling when clicking on TitleToInitiateSearch
    if ((e.target as HTMLElement).closest(`#system-search-link-${system.id}`)) {
      e.stopPropagation();
    } else if ((e.target as HTMLElement).closest(`#system-card-${system.id}`)) {
      e.stopPropagation();
    } else {
      if (setOpenItem) {
        setOpenItem(openItem === "item-1" ? undefined : "item-1");
      }
    }
  };

  return (
    <AccordionItem value="item-1" className={`rounded-md accordion-item-hover border-none ${className}`}
      onClick={handleAccordionToggle}>

      <div className="w-full flex justify-between">
        <div className="w-full flex items-center">
          {getPreppedSearchLink && submitSearch && queryObject && (
            <div>
              {system.searchLinkRequiresQuery && queryObject.query === "" ? (
                <AlertQueryNeeded
                  system={system}
                  getPreppedSearchLink={getPreppedSearchLink}
                  queryObject={queryObject}
                  submitSearch={submitSearch}
                  activeSystemId={activeSystemId}
                />
              ) : (
                <TitleToInitiateSearch
                  system={system}
                  getPreppedSearchLink={getPreppedSearchLink}
                  queryObject={queryObject}
                  submitSearch={submitSearch}
                  activeSystemId={activeSystemId}
                />
              )}
            </div>
          )}
          {activeSystemId ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className='p-0 px-0 mx-0'>
                  <AccordionTrigger asChild className="mr-0 pr-0">
                    <Button variant="ghost" className="p-0">
                      <ChevronDownIcon className={`chevron-icon h-4 w-4 mx-4 shrink-0 text-muted-foreground transition-transform duration-200 ml-1 ${openItem === "item-1" ? 'rotate-0 accordion-item-active' : 'rotate-180'}`} />                    </Button>
                  </AccordionTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-base">Toggle system card</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : ""}
        </div>
      </div>
      <AccordionContent className="p-0 pb-1">
        <SystemAccordionCard system={system} />
      </AccordionContent>
    </AccordionItem>
  );
});



const SystemItem: React.FC<SystemItemProps> = ({
  system,
  activeSystemId,
  className,
  showDisableDeleteButtons
}) => {
  const { systemsSkipped } = useSystemSearchContext();
  const { getPreppedSearchLink } = useSearchContext();
  const { queryObject } = useQueryContext();
  const { systemsDisabled, systemsSearched } = useStorageContext();
  const { expandAllStatus, setExpandedSystemCards, expandedSystemCards } = useSystemExpansionContext();
  const { submitSearch } = useSearchContext();

  const { urlSystems } = useAddressContext();

  const [everClickedReExpansionCollapse, setEverClickedReExpansionCollapse] = useState(false);

  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    // Update everAllExpanded when any system card is expanded
    if (openItem === "item-1") {
      setEverClickedReExpansionCollapse(true);
    }
  }, [openItem]);

  useLayoutEffect(() => {
    if (expandAllStatus) {
      setOpenItem("item-1");
    } else {
      setOpenItem("item-0");
    }
  }, [expandAllStatus]);

  // Inside the parent component of SystemAccordionItem, wrap setOpenItem with useCallback
  const setOpenItemStable = useCallback((value: string | undefined) => {
    setOpenItem(value);
  }, [setOpenItem]); // Add any dependencies if setOpenItem depends on props or state

  // system param expansion
  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && !everClickedReExpansionCollapse) {
      if (urlSystems && urlSystems.split(',').includes(system.id)) {
        setOpenItem("item-1");
        if (!expandedSystemCards.includes(system.id)) {
          setExpandedSystemCards([...expandedSystemCards, system.id]);
        }
      }
    }
  }, [expandedSystemCards, urlSystems, setExpandedSystemCards, system.id, everClickedReExpansionCollapse]);


  return (
    <Accordion value={openItem} onValueChange={setOpenItem}
      id={`item-${system.id}`}
      key={system.id}
      type="single"
      className={`w-full border rounded-md
            ${activeSystemId === system.id ? 'border-blue-500' : ''}
            ${openItem === "item-1" || activeSystemId === system.id ? '' : 'border-transparent'}
            ${activeSystemId === system.id ? 'min-h-10' : 'min-h-8'}
            ${systemsDisabled?.[system.id] ? 'bg-orange-300' : ''}
            ${systemsSkipped?.[system.id] ? 'bg-yellow-300' : ''}
            ${systemsSearched?.[system.id] ? 'bg-gray-200' : ''}`}
      collapsible
    >
      <SystemAccordionItem
        className={className}
        system={system}
        queryObject={queryObject}
        activeSystemId={activeSystemId}
        submitSearch={submitSearch}
        getPreppedSearchLink={getPreppedSearchLink}
        openItem={openItem}
        setOpenItem={setOpenItemStable}
      />
    </Accordion>
  );
};

export default SystemItem;