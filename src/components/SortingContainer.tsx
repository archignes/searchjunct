// SortingContainer.tsx 

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { System, useSystemsContext } from './SystemsContext';
import { useStorage } from './StorageContext';
import SearchSystemItem from './ListItem';
import {
    Form,
} from "./ui/form"
import { useForm, FormProvider, SubmitHandler, useWatch } from 'react-hook-form';
import { useSearch } from './SearchContext';

interface SortingContainerProps {
    showDisableDeleteButtons?: boolean;
    filterOut?: System[];
}

const SortingContainer: React.FC<SortingContainerProps> = ({ showDisableDeleteButtons = false, filterOut = [] }) => {
    const { toggleSystemDeleted, updateDragOrder, toggleSystemDisabled, systemsCurrentOrder, expandAllStatus } = useSystemsContext();
    const { systemsDeleted, systemsDisabled, systemsSearched } = useStorage();
    const { multiSelect, setMultiSelect } = useSearch();
    const { checkboxStatuses, setCheckboxStatus } = useSystemsContext();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
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
                    {systemsCurrentOrder.filter(system => !filterOut.includes(system)).map(system => (
                        <div key={system.id} className="w-full">
                            <SearchSystemItem
                                id={system.id}
                                system={system}
                                showDisableDeleteButtons={showDisableDeleteButtons}
                                toggleSystemDisabled={toggleSystemDisabled}
                                toggleSystemDeleted={toggleSystemDeleted}
                                systemsDeleted={systemsDeleted}
                                systemsDisabled={systemsDisabled}
                                systemsSearched={systemsSearched}
                                expandAllStatus={expandAllStatus}
                            />
                        </div>
                    ))}
                </SortableContext>
            </FormProvider>
        </DndContext>
    );
};

export default SortingContainer;