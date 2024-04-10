// Shortcuts.tsx

import React from 'react';
import {
    Card,
    CardContent,
    CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

import { useSortContext } from '@/contexts';
import SortingContainer from '@/components/SortingContainer';

const ShortcutsCard: React.FC = () => {
    const { systemsCurrentOrder } = useSortContext();

    return (
        <>
            <Card className='rounded-md bg-white shadow-none mx-auto'>
                <CardTitle className='text-left pl-2 py-1 mb-2'>Sort</CardTitle>
                <CardContent className="p-0 flex justify-center items-center flex-col">
                    <Label className="text-left text-gray-500 text-sm p-2">Drag the items to sort</Label>
                                            
                    <ScrollArea className="h-[calc(100vh-200px)] overflow-x-hidden">
                        <SortingContainer include={systemsCurrentOrder} activeSystemId={undefined} showDragHandleBoolean={true} />
                    </ScrollArea>
                </CardContent>
            </Card>

        </>
    );
};

export default ShortcutsCard;

