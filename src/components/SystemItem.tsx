//  SystemItem.tsx
import React, {useState} from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { System, SystemTitle } from './SystemsContext';
import { Button } from './ui/button';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import SystemCard from './SystemCard';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useSearch } from './SearchContext';
import { useDroppable } from '@dnd-kit/core';
import { DeleteSystemButton, DisableSystemButton } from './SystemsButtons';

export const SystemPopover = ({ system, isOpen, toggleOpen }: { system: System; isOpen: boolean; toggleOpen: () => void }) => {
  return (
    <Popover open={isOpen} onOpenChange={toggleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-4 p-0 m-0 rounded-r-md rounded-l-none">
          <DotsVerticalIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <SystemCard system={system} />
      </PopoverContent>
    </Popover>
  );
};


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
  hoveredItemId
}) => {
  const { handleSearch } = useSearch();
  const [openSystemId, setOpenSystemId] = useState<string | null>(null);
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id,
  });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Example: Apply a box shadow when dragging
    boxShadow: isDragging ? '0px 0px 10px rgba(0,0,0,0.5)' : 'none',
  };
   
  const togglePopover = (systemId: string) => {
    setOpenSystemId(openSystemId === systemId ? null : systemId);
  };

  return (
    <>
      <div
        ref={setDroppableNodeRef}
        className={`
        // ...
        ${isOver ? 'bg-blue-100' : ''}
      `}
      >
      <div
        ref={setNodeRef}
        id={system.id}
        key={system.id}
        style={style}
        {...attributes}
        {...listeners}
        className={`min-h-9 py-1 border rounded-md bg-background shadow-sm flex items-center justify-between space-x-4 pl-3 mx-1
                    ${systemsDisabled?.[system.id] ? 'bg-orange-300' : ''}
                    ${systemsSearched?.[system.id] ? 'bg-gray-300' : ''}
                    ${systemsDeleted?.[system.id] ? 'bg-red-500' : ''}
                    ${openSystemId === system.id ? 'border-blue-500' : ''}
                    ${isDragging ? 'opacity-75 z-10' : 'opacity-100'}` // Example: Change opacity when dragging
                  }>
        {hoveredItemId === system.id && (
          <div className="drop-indicator bg-blue-500 h-1 w-full"></div>
        )}
        <div onClick={() => handleSearch(system)} className="flex-grow">
          <SystemTitle className={`w-full rounded-md px-1
                                  ${systemsDisabled?.[system.id] ? 'bg-orange-300' : ''}
                                  ${systemsSearched?.[system.id] ? 'bg-gray-300' : ''}
                                  ${systemsDeleted?.[system.id] ? 'bg-white' : ''}`
                                 } system={system} />
        </div>
      {showDisableDeleteButtons && (
      <div className="flex justify-between w-1/3">
        <DisableSystemButton system={system} />
        <DeleteSystemButton system={system} />
      </div>
      )}
      <SystemPopover system={system} isOpen={openSystemId === system.id} toggleOpen={() => togglePopover(system.id)} />
    </div>
    </div>
    </>
  );
};

export default SearchSystemItem;