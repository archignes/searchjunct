import React, {useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { System, useSystemsContext } from './SystemsContext';
import { useStorage } from './StorageContext';
import SearchSystemItem from './SystemItem';

interface SortingContainerProps {
    showDisableDeleteButtons?: boolean;
    filterOut?: System[];
}

const SortingContainer: React.FC<SortingContainerProps> = ({ showDisableDeleteButtons = false, filterOut = [] }) => {
    const { toggleSystemDeleted, toggleSystemDisabled, systemsCurrentOrder, setSystemsCurrentOrder } = useSystemsContext();
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const {
        setSystemsCustomOrder, systemsDeleted, systemsDisabled, systemsSearched
    } = useStorage();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: { active: { id: string }, over: { id: string } }) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = systemsCurrentOrder.findIndex(system => system.id === active.id);
            const newIndex = systemsCurrentOrder.findIndex(system => system.id === over.id);
            const newOrderedSystems = arrayMove(systemsCurrentOrder, oldIndex, newIndex);
            setSystemsCurrentOrder(newOrderedSystems);
            setSystemsCustomOrder(newOrderedSystems.map(item => item.id));
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, itemId: string) => {
        event.preventDefault();
        console.log(`Dragging over item: ${itemId}`);
        setHoveredItemId(itemId);
        console.log(`Hovered Item ID set to: ${itemId}`);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd({
            active: { id: event.active.id.toString() },
            over: { id: event.over?.id.toString() || '' }
        })}>
            <SortableContext items={systemsCurrentOrder.map(system => system.id)} strategy={verticalListSortingStrategy}>
                {systemsCurrentOrder.filter(system => !filterOut.includes(system)).map(system => (
                    <div key={system.id} onDragOver={(event) => handleDragOver(event, system.id)}>
                        <SearchSystemItem
                            id={system.id}
                            system={system}
                            showDisableDeleteButtons={showDisableDeleteButtons}
                            toggleSystemDisabled={toggleSystemDisabled}
                            toggleSystemDeleted={toggleSystemDeleted}
                            systemsDeleted={systemsDeleted}
                            systemsDisabled={systemsDisabled}
                            systemsSearched={systemsSearched}
                            hoveredItemId={hoveredItemId}
                        />
                    </div>
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default SortingContainer;