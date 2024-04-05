// ui/SystemItem.tsx 

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { MagnifyingGlassIcon, 
  DragHandleDots2Icon,
  ChevronDownIcon
} from '@radix-ui/react-icons';
import { useDroppable } from '@dnd-kit/core';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { Button } from '../ui/button';

import { System } from '../../types/system';
import SystemCard from '../cards/SystemCard';
import { useSystemExpansionContext,
  useQueryContext,
  useSystemSearchContext,
  useSearchContext, 
  useStorageContext,
  useAddressContext 
} from '../../contexts';
import { SystemTitle } from './SystemTitle';
import { FaviconImage } from './SystemTitle';
import { DeleteSystemButton, DisableSystemButton } from './SystemsButtons';


interface SortableItemProps {
  id: string;
  system: System;
  showDisableDeleteButtons: boolean;
  showDragHandle: boolean;
}

const SearchSystemItem: React.FC<SortableItemProps> = ({
  id,
  system,
  showDisableDeleteButtons,
  showDragHandle
}) => {
  const { systemsSkipped} = useSystemSearchContext();
   const {systemsDeleted, systemsDisabled, systemsSearched } = useStorageContext();
  const { expandAllStatus, setExpandedSystemCards, expandedSystemCards } = useSystemExpansionContext();
  const { submitSearch } = useSearchContext();
  const { urlSystems } = useAddressContext();
  const { isOver } = useDroppable({
    id,
  });

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
  const { preppedSearchLink } = useSearchContext();
  const { queryObject } = useQueryContext();


  const [everClickedReExpansionCollapse, setEverClickedReExpansionCollapse] = useState(false);

  const [isItemExpanded, setIsItemExpanded] = useState(false);

  const toggleItemExpanded = () => {
    setEverClickedReExpansionCollapse(true);
    setIsItemExpanded(!isItemExpanded);
  };

  useEffect(() => {
    setIsItemExpanded(expandAllStatus);

    // Update everAllExpanded when expandAllStatus becomes true
    if (expandAllStatus) {
      setEverClickedReExpansionCollapse(true);
    }
  }, [expandAllStatus]);

  // system param expansion
  useEffect(() => {
    if (typeof window !== 'undefined' && !everClickedReExpansionCollapse) {
      if (urlSystems && urlSystems.split(',').includes(system.id)) {
        setIsItemExpanded(true);
        if (!expandedSystemCards.includes(system.id)) {
          setExpandedSystemCards([...expandedSystemCards, system.id]);
        }
      }
    }
  }, [expandedSystemCards, urlSystems, setExpandedSystemCards, system.id, everClickedReExpansionCollapse]);

  return (
    <div className="w-full">
      <div className={`${isOver ? 'bg-blue-100' : ''}`}>
      <div
        ref={setItemRef}
        id={`sortable-item-${system.id}`}
        key={system.id}
        style={{
          ...style,
          touchAction: 'none', // Add this line to apply touch-action: none
        }}
          className={`min-h-9 ml-0 py-1 my-0 border rounded-md bg-background shadow-sm flex items-center justify-between space-x-4 mr-1 w-full
                    ${systemsDisabled?.[system.id] ? 'bg-orange-300 border-none' : ''}
                    ${systemsSkipped?.[system.id] ? 'bg-yellow-300 border-none' : ''}
                    ${systemsSearched?.[system.id] ? 'bg-gray-300' : ''}
                    ${systemsDeleted?.[system.id] ? '' : ''}
                    ${isDragging ? 'opacity-75 z-50 border-2 border-dashed border-blue-500' : 'opacity-100'}
                    ${isOver ? 'opacity-50' : ''}`}
      >
        <Accordion 
          type="single"
          className="w-full"
          collapsible
        >
          <AccordionItem value="item-1" className="border-none">
            <div className="w-full">
              <div className="w-full flex items-center">
                  <div className="w-full flex items-center ml-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a className="items-center flex space-x-1 hover:bg-blue-100 pl-2 pr-3 py-4 hover:rounded-md"
                            href={preppedSearchLink({ system, query: queryObject.query })}
                            onClick={(e) => { e.preventDefault(); submitSearch({ system: system }); }}>
                            <MagnifyingGlassIcon className="flex-shrink-0 w-4 h-4 cursor-pointer" />
                            <FaviconImage system={system} mini_mode={false} />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-base">Search with {system.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                <SystemTitle
                  className={`py-1 px-1 flex items-center flex-grow w-full`}
                  system={system}
                />
                    </div>
                  {showDisableDeleteButtons && (
                    <div className="flex justify-center space-x-1 pl-1 w-1/3">
                      <DisableSystemButton system={system} />
                      <DeleteSystemButton system={system} />
                    </div>
                  )}
            {showDragHandle && (
            <div
              ref={setDragHandleRef}
              id={`${system.id}-drag-handle`}
              {...attributes}
              {...listeners}
              className="handle py-4 px-3 hover:bg-blue-100 hover:rounded-md"
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {(isItemExpanded) ? (
                          <Button variant="ghost" aria-expanded={isItemExpanded ? "true" : "false"} className="px-2 mr-1 hover:bg-blue-100 hover:rounded-md flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
                            onClick={toggleItemExpanded}
                            aria-label={isItemExpanded ? "Collapse system card" : "Expand system card"}
                          >
                            <ChevronDownIcon className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isItemExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        ) :
                          (
                            <AccordionTrigger className="mr-1 hover:rounded-md hover:bg-blue-100 px-2" />
                          )}
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-base">Toggle system card</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
              </div>
                {(isItemExpanded) ? (
                  <div className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="p-0 pb-1">
                      <SystemCard system={system} />
                    </div>
                  </div>
                ) :(
                    <AccordionContent className="p-0 pb-1">
                      <SystemCard system={system} />
                </AccordionContent>
              )}
            </div>            
          </AccordionItem>
        </Accordion>
      </div>
      </div>
    </div>
  );
};

export default SearchSystemItem;