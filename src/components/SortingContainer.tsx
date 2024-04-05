// SortingContainer.tsx 

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { useSortContext, useSystemsContext, useSearchContext, useQueryContext } from '../contexts/';
import { System } from '../types/system';
import SearchSystemItem from './sj-ui/SystemItem';
import { isMobile } from 'react-device-detect';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useForm, FormProvider } from 'react-hook-form';

interface SortingContainerProps {
    showDisableDeleteButtons?: boolean;
    include: System[];
    isInsideSettingsCard?: boolean;
}

const SortingContainer: React.FC<SortingContainerProps> = ({ showDisableDeleteButtons = false, include = [] }) => {
    const { updateDragOrder, systemsCurrentOrder } = useSortContext();
    const { activeSystem } = useSystemsContext();
    const { preppedSearchLink, submitSearch } = useSearchContext();
    const { queryObject } = useQueryContext();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: isMobile
                ? { delay: 50, tolerance: 10 } // Adjusted settings for mobile
                : { delay: 100, tolerance: 5 } // Default settings for desktop
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return; // No reordering needed
        }

        // Assuming systemsCurrentOrder is an array of {id: string} objects
        const oldIndex = systemsCurrentOrder.findIndex(system => system.id === active.id);
        const newIndex = systemsCurrentOrder.findIndex(system => system.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
            const newOrderedSystems = arrayMove(systemsCurrentOrder, oldIndex, newIndex);
            updateDragOrder(newOrderedSystems);
        }
    };

    const form = useForm<{
        systems: string[];
    }>({
        defaultValues: {
            systems: [],
        },
    });

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <FormProvider {...form}>
                <SortableContext items={systemsCurrentOrder.map(system => system.id)} strategy={verticalListSortingStrategy}>
                    {systemsCurrentOrder.filter(system => include.includes(system)).map((system, index) => (    
                        <div id={`${system.id}-bucket`} key={system.id} className="grid grid-cols-[auto_1fr] w-full">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div id={`${system.id}-left-margin`} className="flex items-center group w-8 justify-center">{activeSystem && activeSystem.id === system.id && (
                                            <a className="group w-full flex items-center py-2 border-l border-t border-b rounded-l-md hover:bg-blue-100"
                                                href={preppedSearchLink({ system, query: queryObject.query })}
                                                onClick={(e) => { e.preventDefault(); submitSearch({ system: system }); }}>
                                                <MagnifyingGlassIcon id="active-system" className="text-gray-500 w-8 h-8" />
                                            </a>
                                        )}</div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-base">Search with {system.name}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <SearchSystemItem
                            id={system.id}
                            system={system}
                            showDisableDeleteButtons={showDisableDeleteButtons}
                            showDragHandle={true}
                        />
                        </div>
                    ))}
                </SortableContext>
            </FormProvider>
        </DndContext>
    );
};

export default SortingContainer;