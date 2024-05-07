// SortingContainer.tsx 

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortContext } from '../contexts/';
import { System } from '../types/system';
import { useForm, FormProvider } from 'react-hook-form';
import SystemItemDraggable from './systems/DraggableItem';


const SortingContainer: React.FC<{ visibleSystems: System[] }> = ({ visibleSystems }) => {
    const { updateDragOrder, systemsCurrentOrder } = useSortContext();

    const sensors = useSensors(
        useSensor(PointerSensor, {
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

    const filteredSystems = visibleSystems.filter(system => systemsCurrentOrder.includes(system));

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <FormProvider {...form}>
                <SortableContext items={filteredSystems.map((system: System) => system.id)} strategy={verticalListSortingStrategy}>
                    {filteredSystems.map((system: System) => (
                        <div id={`${system.id}-bucket`} key={system.id} className="system-item w-full">
                            <SystemItemDraggable
                            id={system.id}
                            system={system}
                            showDisableDeleteButtons={true}
                            />
                        </div>
                    ))}
                </SortableContext>
            </FormProvider>
        </DndContext>
    );
};

export default SortingContainer;