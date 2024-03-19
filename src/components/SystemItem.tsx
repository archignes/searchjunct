// SystemItem.tsx 

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSystemsContext, System, SystemTitle } from './SystemsContext';
import { Button } from './ui/button';
import { MagnifyingGlassIcon, DragHandleDots2Icon, ChevronDownIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import SystemCard from './SystemCard';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
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
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
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
  hoveredItemId: string | null;
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
  hoveredItemId,
  expandAllStatus
}) => {
  const { handleSearch } = useSearch();
  const { setValue } = useFormContext();


  const [openSystemId, setOpenSystemId] = useState<string | null>(null);
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
    boxShadow: isDragging ? '0px 0px 10px rgba(0,0,0,0.5)' : 'none',
  };


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


  return (
    <>
      <div
        ref={setItemRef}
        id={`sortable-item-${system.id}`}
        key={system.id}
        style={style}
        className={`min-h-9 py-1 border rounded-md bg-background shadow-sm flex items-center justify-between space-x-4 pl-3 mx-1 w-5/7
                    ${systemsDisabled?.[system.id] ? 'bg-orange-300' : ''}
                    ${systemsSearched?.[system.id] ? 'bg-gray-300' : ''}
                    ${systemsDeleted?.[system.id] ? 'bg-red-500' : ''}
                    ${openSystemId === system.id ? 'border-blue-500' : ''}
                    ${isDragging ? 'opacity-75 z-10' : 'opacity-100'}
                    ${isOver ? 'bg-blue-100' : ''}`}
      >
        {hoveredItemId === system.id && (
          <div className="drop-indicator bg-blue-500 h-1 w-full"></div>
        )}
        <Accordion 
          type="single"
          className="w-full"
          collapsible
        >
          <AccordionItem value="item-1" className="border-none pr-2">
            <div className="w-full">
              <div className="flex items-center">
                {multiSelect === "open" || multiSelect === "some" || multiSelect === "all" ? (
                  <Checkbox
                    checked={isChecked}
                    className="w-5 h-5"
                    onCheckedChange={handleCheckboxChange}
                  />
            ) : (
              <MagnifyingGlassIcon onClick={() => handleSearch(system)} className="w-6 h-6 cursor-pointer" />
            )}
            <SystemTitle
              className={`w-full py-1 rounded-md px-1 flex items-center
                          ${systemsDisabled?.[system.id] ? 'bg-orange-300' : ''}
                          ${systemsSearched?.[system.id] ? 'bg-gray-300' : ''}
                          ${systemsDeleted?.[system.id] ? 'bg-white' : ''}`}
              system={system}
            />
            <div
              ref={setDragHandleRef}
              id={`${system.id}-drag-handle`}
              {...attributes}
              {...listeners}
              className="handle"
            >
              <DragHandleDots2Icon className="w-4 h-4" />
            </div>
                {expandAllStatus ? (
                  <button className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
                    onClick={toggleItemExpanded}
                    title={isItemExpanded ? "Collapse" : "Expand"}
                  >
                    <ChevronDownIcon className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isItemExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  ) : (
                  <AccordionTrigger />
                  )}
              </div>
              {expandAllStatus && isItemExpanded ? (
                <div className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="pb-4 pt-0">
                    <SystemCard system={system} />
                  </div>
                </div>
              ) : (
                <AccordionContent>
                  <SystemCard system={system} />
                </AccordionContent>
              )}
            </div>
        {showDisableDeleteButtons && (
          <div className="flex justify-between w-1/3">
            <DisableSystemButton system={system} />
            <DeleteSystemButton system={system} />
          </div>
        )}            
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default SearchSystemItem;