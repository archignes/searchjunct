// SortingContainer.tsx 

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSystemsContext } from './contexts/SystemsContext';
import { System } from '../types/system';
import SearchSystemItem from './ui/SystemItem';
import { isMobile } from 'react-device-detect';

import { useForm, FormProvider } from 'react-hook-form';

interface SortingContainerProps {
    showDisableDeleteButtons?: boolean;
    filterOut?: System[];
    isInsideSettingsCard?: boolean;
}

const SortingContainer: React.FC<SortingContainerProps> = ({ showDisableDeleteButtons = false, filterOut = [] }) => {
    const { updateDragOrder, systemsCurrentOrder } = useSystemsContext();


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
                    {systemsCurrentOrder.filter(system => !filterOut.includes(system)).map((system, index) => (
                        <div key={system.id} className="w-full">
                            <SearchSystemItem
                                id={system.id}
                                system={system}
                                showDisableDeleteButtons={showDisableDeleteButtons}
                            />
                        </div>
                    ))}
                </SortableContext>
            </FormProvider>
        </DndContext>
    );
};

export default SortingContainer;