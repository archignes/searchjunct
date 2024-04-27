// SortingContainer.tsx 

import React, { useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortContext } from '../contexts/';
import { System } from '../types/system';
import SearchSystemItem from './systems/SystemItem';
import { useForm, FormProvider } from 'react-hook-form';

interface SortingContainerProps {
    showDisableDeleteButtons?: boolean;
    include: System[];
    isInsideSettingsCard?: boolean;
    activeSystemId: string | undefined;
    showDragHandleBoolean: boolean;
    setActiveSystemRef: React.MutableRefObject<HTMLDivElement | null>;
}

const SortingContainer: React.FC<SortingContainerProps> = (
    { showDisableDeleteButtons = false, include = [], activeSystemId, showDragHandleBoolean = false, setActiveSystemRef }) => {
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

    const filteredSystems = useMemo(() => {
        return systemsCurrentOrder.filter(system => include.includes(system));
    }, [systemsCurrentOrder, include]);

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <FormProvider {...form}>
                <SortableContext items={filteredSystems.map((system: System) => system.id)} strategy={verticalListSortingStrategy}>
                    {filteredSystems.map((system: System) => (
                        <div id={`${system.id}-bucket`} key={system.id} className="system-item w-full">
                            <SearchSystemItem
                            id={system.id}
                            system={system}
                            showDisableDeleteButtons={showDisableDeleteButtons}
                            showDragHandle={showDragHandleBoolean}
                            activeSystemId={activeSystemId}
                        />
                        </div>
                    ))}
                </SortableContext>
            </FormProvider>
        </DndContext>
    );
};

export default SortingContainer;