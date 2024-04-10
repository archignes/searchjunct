// ui/SystemItem.tsx 

import React, { useState, useEffect, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { MagnifyingGlassIcon, 
  DragHandleDots2Icon,
  ChevronDownIcon
} from '@radix-ui/react-icons';
import { Query } from '../types';
import { useDroppable } from '@dnd-kit/core';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion-minus"
import { System } from '../types/system';
import SystemCard from './cards/SystemCard';
import { useSystemExpansionContext,
  useQueryContext,
  useSystemSearchContext,
  useSearchContext, 
  useStorageContext,
  useAddressContext, 
  useSortContext
} from '../contexts';
import { SystemTitle } from './SystemTitle';


interface SortableItemProps {
  id: string;
  system: System;
  showDisableDeleteButtons: boolean;
  showDragHandle: boolean;
  activeSystemId: string | undefined;
}


interface SystemAccordionItemProps {
  className?: string;
  system: System;
  showDragHandle: boolean;
  queryObject?: Query;
  activeSystemId?: string | undefined;
  submitSearch?: ({ system }: { system: System }) => void;
  getPreppedSearchLink?: ({ system, query }: { system: System; query: string }) => string;
  openItem?: string | undefined;
  setOpenItem?: (value: string | undefined) => void;
  attributes: any;
  listeners: any;
  setDragHandleRef: any;
}

const SystemAccordionItem: React.FC<SystemAccordionItemProps> = ({ 
  className,
  system,
  showDragHandle,
  queryObject,
  activeSystemId,
  submitSearch,
  getPreppedSearchLink,
  openItem,
  setOpenItem,
  attributes,
  listeners,
  setDragHandleRef
 }) => {
  return (
    <AccordionItem value="item-1" className={`${className} ${showDragHandle ? 'border rounded-md w-3/4 sm:w-full' : 'border-none'}`}>
      <div className="w-full flex justify-between">
        <div className="w-full flex items-center ml-1">
          {getPreppedSearchLink && submitSearch && queryObject &&  (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a className="items-center flex hover:bg-blue-100 p-1 hover:rounded-md"
                  href={getPreppedSearchLink({ system, query: queryObject.query })}
                  onClick={(e) => { e.preventDefault(); submitSearch({ system: system }); }}>
                  <MagnifyingGlassIcon
                    className={`flex-shrink-0 cursor-pointer
                              ${activeSystemId === system.id ? 'w-8 h-8' : 'w-4 h-4'}`} />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-base">Search with {system.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          )}
          {activeSystemId ? (

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className='p-0 px-0 mx-0'>
                <AccordionTrigger className="mr-1 hover:rounded-md hover:bg-blue-100 pr-2">
                  <SystemTitle
                    className={`px-0 flex items-center flex-grow w-full ${activeSystemId === system.id ? 'text-lg' : 'text-base'}`}
                    system={system}
                    favicon_included={true}
                  />
                  {(openItem === "item-1") && (
                    <ChevronDownIcon className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ml-1 ${openItem === "item-1" ? 'rotate-0' : 'rotate-180'}`} />
                  )}
                </AccordionTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-base">Toggle system card</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          ) : (<SystemTitle
            className={`px-0 flex items-center flex-grow w-full ${activeSystemId === system.id ? 'text-lg' : 'text-base'}`}
            system={system}
            favicon_included={true}
          />)}
        </div>
        {showDragHandle && (
          <div
            ref={setDragHandleRef}
            id={`${system.id}-drag-handle`}
            {...attributes}
            {...listeners}
            className="handle py-2 px-3 hover:bg-blue-100 hover:rounded-md"
            aria-label="Drag handle for reordering"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DragHandleDots2Icon className="w-5 h-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-base">Drag and sort</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      <AccordionContent className="p-0 pb-1">
        <SystemCard system={system} />
      </AccordionContent>
    </AccordionItem>
  );
};



const SearchSystemItem: React.FC<SortableItemProps> = ({
  id,
  system,
  showDisableDeleteButtons,
  showDragHandle,
  activeSystemId
}) => {
  const { systemsSkipped} = useSystemSearchContext();
  const { getPreppedSearchLink } = useSearchContext();
  const { queryObject } = useQueryContext();
  const {systemsDeleted, systemsDisabled, systemsSearched } = useStorageContext();
  const { expandAllStatus, setExpandedSystemCards, expandedSystemCards } = useSystemExpansionContext();
  const { submitSearch } = useSearchContext();
  const { urlSystems } = useAddressContext();
  const { isOver } = useDroppable({
    id,
  });
  const { systemsCurrentOrder } = useSortContext();

  const {
    attributes,
    listeners,
    setNodeRef: setDragHandleRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id, // Use the system ID directly
  });

  const { setNodeRef: setItemRef } = useSortable({
    id: id, // Use the system ID directly
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? 'shadow-lg' : '',
    zIndex: isDragging ? 'z-50' : 'z-0',
  };

  const [everClickedReExpansionCollapse, setEverClickedReExpansionCollapse] = useState(false);

  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Update everAllExpanded when any system card is expanded
    if (openItem === "item-1") {
      setEverClickedReExpansionCollapse(true);
    }
  }, [openItem]);

  useEffect(() => {
    if (expandAllStatus) {
      setOpenItem("item-1");
    } else {
      setOpenItem("item-0");
    }
  }, [expandAllStatus]);


  // system param expansion
  useEffect(() => {
    if (typeof window !== 'undefined' && !everClickedReExpansionCollapse) {
      if (urlSystems && urlSystems.split(',').includes(system.id)) {
        setOpenItem("item-1");
        if (!expandedSystemCards.includes(system.id)) {
          setExpandedSystemCards([...expandedSystemCards, system.id]);
        }
      }
    }
  }, [expandedSystemCards, urlSystems, setExpandedSystemCards, system.id, everClickedReExpansionCollapse]);

  const getSortOrder = useCallback(() => {
    const index = systemsCurrentOrder.findIndex(System => System.id === system.id.toString());
    return index + 1; // Adding 1 to make it human-readable (1-indexed instead of 0-indexed)
  }, [systemsCurrentOrder, system.id]);

  return (
    <div className={`w-full border rounded-md
          ${activeSystemId === system.id ? 'border-blue-500' : 'border-transparent'}`
        }>
      <div className={`${isOver ? 'bg-blue-100' : ''}`}>
      <div
        ref={setItemRef}
        id={`sortable-item-${system.id}`}
        key={system.id}
        style={{
          ...style,
          touchAction: 'none', // Add this line to apply touch-action: none
        }}
      >
      <Accordion value={openItem} onValueChange={setOpenItem}
          type="single"
            className={`w-full border rounded-md
              ${openItem === "item-1" ? 'shadow-sm' : 'border-transparent'}
              ${systemsDisabled?.[system.id] ? 'bg-orange-300 border-transparent' : ''}
              ${systemsSkipped?.[system.id] ? 'bg-yellow-300 border-transparent' : ''}
              ${systemsSearched?.[system.id] ? 'bg-gray-200' : ''}
              ${systemsDeleted?.[system.id] ? '' : ''}
              ${isDragging ? 'opacity-75 z-50 border-2 border-dashed border-blue-500' : 'opacity-100'}
              ${isOver ? 'opacity-50' : ''}
              ${showDragHandle ? 'bg-transparent' : 'border-none'}
              `}
          collapsible
        >
          {showDragHandle ? (
              <div className="grid grid-cols-10 items-start mx-auto w-[95%]">
                <span className="mx-2 col-start-1 text-right align-top" style={{ minWidth: '2ch', display: 'inline-flex', alignItems: 'start', textAlign: 'right' }}>{getSortOrder()}.</span>
                <SystemAccordionItem
                  className={'col-span-9'}
                  system={system}
                  showDragHandle={showDragHandle}
                  attributes={attributes}
                  listeners={listeners}
                  setDragHandleRef={setDragHandleRef}
                />
            </div>
          ) : (
          <SystemAccordionItem
            system={system}
            showDragHandle={showDragHandle}
            queryObject={queryObject}
            activeSystemId={activeSystemId}
            submitSearch={submitSearch}
            getPreppedSearchLink={getPreppedSearchLink}
            openItem={openItem}
            setOpenItem={setOpenItem}
            attributes={attributes}
            listeners={listeners}
            setDragHandleRef={setDragHandleRef}
          />
          )}
        </Accordion>
      </div>
      </div>
    </div>
  );
};

export default SearchSystemItem;