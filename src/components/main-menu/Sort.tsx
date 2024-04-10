// Shortcuts.tsx

import React from 'react';

import { StarIcon } from '@radix-ui/react-icons';
import {
    Card,
    CardContent,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

import SortingContainer from '@/components/SortingContainer';
import { SettingsItemBox } from './SettingsCard';
import { useSortContext, useStorageContext } from '@/contexts';

const ShortcutsCard: React.FC = () => {
    const { systemsCurrentOrder, undoSort, redoSort, isUndoAvailable, isRedoAvailable } = useSortContext();
    const { systemsCustomOrder, customModeOnLoad, setCustomModeOnLoad } = useStorageContext();

    return (
        <>
            <Card className='rounded-md bg-white shadow-none mx-auto'>
                <ScrollArea className="h-[calc(100vh-45px)] overflow-x-hidden">
                <CardTitle className='text-left pl-2 py-1 mb-2'>Sort</CardTitle>
                <CardContent className="p-0 flex justify-center items-center flex-col">
                    <p
                        className="text-xs text-gray-500 px-2 w-[95%] break-words">
                        You can set a custom sort order for your system list.
                        The order is saved in your browser and will not be synced to other devices.
                        You can also undo or redo your sort. You can set the system list to your custom sort order
                        by hitting the <StarIcon className='w-4 h-4 inline' /> button.
                    </p>
                    <SettingsItemBox label="Default to your custom sort order on page load.">
                        <div className="inline-flex items-center">
                            <Switch
                                id="default-custom-mode"
                                checked={customModeOnLoad}
                                onCheckedChange={() => setCustomModeOnLoad(!customModeOnLoad)}
                                className="focus-visible:ring-primary"
                            />
                            <span className={`ml-2 text-xs font-semibold ${customModeOnLoad ? 'text-black' : 'text-gray-500'}`}>
                                {customModeOnLoad ? 'Enabled' : 'Disabled'}
                            </span>
                            
                        </div>
                        {systemsCustomOrder.length === 0 && (
                            <p className="ml-2 text-sm text-gray-500">Note: You do <span className='underline'>not</span> currently have a custom order is set.</p>
                        )}
                        <p
                            className="text-xs text-gray-500 px-2 w-[95%] break-words">
                            By default, the system list is sorted randomly on page load.
                        </p>
                    </SettingsItemBox>
                    <Label className="text-left text-gray-500 text-sm p-2">Drag the items to sort</Label>
                    <div className="flex justify-end gap-2 mb-1 items-center">
                        <Button onClick={undoSort} size="sm" disabled={!isUndoAvailable}>Undo</Button>
                        <Button onClick={redoSort} size="sm" disabled={!isRedoAvailable}>Redo</Button>
                    </div>

                        <SortingContainer include={systemsCurrentOrder} activeSystemId={undefined} showDragHandleBoolean={true} />
                </CardContent>
            </ScrollArea>

            </Card>

        </>
    );
};

export default ShortcutsCard;

