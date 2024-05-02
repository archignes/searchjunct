// ui/SystemItem.tsx 

import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleDots2Icon} from '@radix-ui/react-icons';
import { System } from '../../types/system';

import { useSortContext} from '../../contexts';
import { SystemTitle } from './Title';

interface SystemItemDraggableProps {
  system: System
  id: string
  showDisableDeleteButtons: boolean
}

export function SystemItemDraggable({system, id, showDisableDeleteButtons}: SystemItemDraggableProps) {
  const { systemsCurrentOrder } = useSortContext();

  const { isOver } = useDroppable({
    id,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id, // Use the system ID directly
  });

  const getSortOrder = useCallback(() => {
    const index = systemsCurrentOrder.findIndex(System => System.id === system.id.toString());
    return index + 1; // Adding 1 to make it human-readable (1-indexed instead of 0-indexed)
  }, [systemsCurrentOrder, system.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? 'shadow-lg' : '',
    zIndex: isDragging ? 'z-50' : 'z-0',
  };

  return (
    <div className="grid grid-cols-10 my-1 mx-auto w-[95%]">
      <span className="h-9 col-start-1 min-w-[2ch] max-w-[3ch] py-2 text-right">
          {getSortOrder()}.
      </span>
      <div className={`flex flex-row justify-between items-center col-span-7 border pl-2 rounded-md ${isOver ? 'bg-blue-100' : ''}`}
        id={`sortable-item-${system.id}`}
        key={system.id}
        style={{
          ...style,
          touchAction: 'none', // Add this line to apply touch-action: none
        }}>
          <SystemTitle system={system} favicon_included={true} />
          <div
            ref={setNodeRef}
            id={`${system.id}-drag-handle`}
            {...attributes}
            {...listeners}
            className={`handle py-2 px-3 hover:bg-blue-100 hover:rounded-md
              ${isDragging ? 'opacity-75 z-50 border-2 border-dashed border-blue-500' : 'opacity-100'}
              ${isOver ? 'opacity-50' : ''}`}
            aria-label="Drag handle for reordering">
            <DragHandleDots2Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

export default SystemItemDraggable;