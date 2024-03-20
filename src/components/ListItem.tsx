// ListItem.tsx 

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSystemsContext, System, SystemTitle } from './SystemsContext';
import { MagnifyingGlassIcon, DragHandleDots2Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import SystemCard from './SystemCard';
import { useSearch } from './SearchContext';
import { useDroppable } from '@dnd-kit/core';
import { useFormContext } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import { DeleteSystemButton, DisableSystemButton } from './SystemsButtons';
import { Checkbox } from './ui/checkbox';


interface SortableItemProps {
  id: string;
  system: System;
  showDisableDeleteButtons: boolean;
  toggleSystemDisabled?: (id: string) => void;
  toggleSystemDeleted?: (id: string) => void;
  systemsDeleted: Record<string, boolean>;
  systemsDisabled: Record<string, boolean>;
  systemsSearched: Record<string, boolean>;
  expandAllStatus: boolean;
}

const SearchSystemItem: React.FC<SortableItemProps> = ({
  id,
  system,
  showDisableDeleteButtons,
  toggleSystemDisabled,
  toggleSystemDeleted,
  systemsDeleted,
  systemsDisabled,
  systemsSearched,
  expandAllStatus
}) => {
  const { handleSearch } = useSearch();
  const { setValue } = useFormContext();

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
  const { preppedSearchLink, query } = useSearch();

  const [isItemExpandable, setIsItemExpandable] = useState(false);
  const [isItemExpanded, setIsItemExpanded] = useState(false);
  const toggleItemExpanded = () => {
    setIsItemExpanded(!isItemExpanded);
  };

  useEffect(() => {
    setIsItemExpandable(expandAllStatus);
    setIsItemExpanded(expandAllStatus);
  }, [expandAllStatus]);

  useEffect(() => {
    console.log(`checking...\nisItemExpandable: ${isItemExpandable}\nexpandAllStatus: ${expandAllStatus}`);

  }, [isItemExpandable, expandAllStatus]);

  
  const { multiSelect, setMultiSelect } = useSearch();
  const { checkboxStatuses, setCheckboxStatus } = useSystemsContext();

  const [isChecked, setIsChecked] = useState(checkboxStatuses[system.id] || false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    setCheckboxStatus(system.id, checked);
  };


  // useEffect(() => {
  //   console.log(checkboxStatuses)
  // }, [checkboxStatuses]);
  
  
  return (
    <>
      <div className={`${isOver ? 'bg-blue-100' : ''}`}>
      <div
        ref={setItemRef}
        id={`sortable-item-${system.id}`}
        key={system.id}
        style={{
          ...style,
          touchAction: 'none', // Add this line to apply touch-action: none
        }}
        className={`min-h-9 py-1 border rounded-md bg-background shadow-sm flex items-center justify-between space-x-4 mx-1 w-5/7
                    ${systemsDisabled?.[system.id] ? 'bg-orange-300' : ''}
                    ${systemsSearched?.[system.id] ? 'bg-gray-300' : ''}
                    ${systemsDeleted?.[system.id] ? 'bg-red-500' : ''}
                    ${isDragging ? 'opacity-75 z-50' : 'opacity-100'}
                    ${isOver ? 'opacity-50' : ''}`}
      >
        <Accordion 
          type="single"
          className="w-full"
          collapsible
        >
          <AccordionItem value="item-1" className="border-none">
            <div className="w-full">
              <div className="flex items-center">
                  <a className="w-full flex items-center py-2 hover:bg-blue-100 px-2 ml-1 hover:rounded-md"
                   href={preppedSearchLink(system, query)}
                   onClick={(e) => { e.preventDefault(); handleSearch(system); }}>
                    {multiSelect ? (
                      <Checkbox
                        checked={isChecked}
                        className="w-4 h-4 m-3"
                        onCheckedChange={handleCheckboxChange}/>
                        ) : (
                      <MagnifyingGlassIcon className="w-4 h-4 cursor-pointer" />
                    )}
                <SystemTitle
                  className={`py-1 rounded-md px-1 flex items-center flex-grow`}
                  system={system}
                />
              </a>
            <div
              ref={setDragHandleRef}
              id={`${system.id}-drag-handle`}
              {...attributes}
              {...listeners}
                    className="handle py-4 px-3 hover:bg-blue-100 hover:rounded-md"
            >
              <DragHandleDots2Icon className="w-5 h-5 text-muted-foreground" />
            </div>
                {expandAllStatus ? (
                    <button className="px-2 mr-1 hover:bg-blue-100 hover:rounded-md flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
                    onClick={toggleItemExpanded}
                    title={isItemExpanded ? "Collapse" : "Expand"}
                  >
                    <ChevronDownIcon className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isItemExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  ) : (
                      <AccordionTrigger className="mr-1 hover:rounded-md hover:bg-blue-100 px-2" />
                  )}
              </div>
              {expandAllStatus && isItemExpanded ? (
                <div className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="p-0 pb-1">
                    <SystemCard system={system} />
                  </div>
                </div>
              ) : (
                    <AccordionContent className="p-0 pb-1">
                      <SystemCard system={system} />
                </AccordionContent>
              )}
            </div>
        {showDisableDeleteButtons && (
          <div className="flex justify-center space-x-1 pl-1 w-1/3">
            <DisableSystemButton system={system} />
            <DeleteSystemButton system={system} />
          </div>
        )}            
          </AccordionItem>
        </Accordion>
      </div>
      </div>
    </>
  );
};

export default SearchSystemItem;