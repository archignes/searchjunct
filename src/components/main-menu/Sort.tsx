// Sort.tsx

import React from 'react';
import { StarIcon } from '@radix-ui/react-icons';
import { Button } from '@/src/components/ui/button';
import { Switch } from '@/src/components/ui/switch';
import SortingContainer from '@/src/components/SortingContainer';
import { useSortContext, useStorageContext } from '@/contexts';
import { SettingsItem, SettingsText } from './SettingsItem';

const ShortcutsCard: React.FC = () => {
    const { systemsCurrentOrder, undoSort, redoSort, isUndoAvailable, isRedoAvailable } = useSortContext();
    const { systemsCustomOrder, customModeOnLoad, setCustomModeOnLoad } = useStorageContext();

    return (
        <>
            <div className="text-center my-2 sm:my-4">
                Sort your system list.
            </div>
            <SettingsItem title="Custom Sort Order" startOpen={true}>
                <SettingsText lines={[
                    `You can set a custom sort order for your system list.
                    The order is saved in your browser and will not be synced to other devices.
                    You can also undo or redo your sort.`
                ]} />


                <p className="text-lg text-center text-gray-500 px-2 mx-auto w-[95%] sm:w-[60%] break-words">
                    You can set the system list to your custom sort order
                    by hitting the <StarIcon className='w-4 h-4 inline' /> button on the left sidebar.
                </p>

            </SettingsItem>
            <SettingsItem title="Default to your custom sort order on page load.">
                <div className="inline-flex items-center py-2">
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
                {systemsCustomOrder.length === 0 ? (<p className="py-1 text-sm text-gray-500">
                    You do <span className='underline'>not</span> currently have a custom order set.
                </p>) : (<p className="py-1 text-sm text-gray-500">
                        The system list will be sorted using your custom order on page load.
                    </p>
                )}
                <p
                    className="py-2 text-xs text-center text-gray-500 px-2 w-[95%] break-words">
                    Note: By default, the system list is sorted randomly on page load.
                </p>
            </SettingsItem>
            <SettingsItem title="Drag system items to sort.">
            <div className="flex justify-end gap-2 mb-1 items-center">
                <Button onClick={undoSort} size="sm" disabled={!isUndoAvailable}>Undo</Button>
                <Button onClick={redoSort} size="sm" disabled={!isRedoAvailable}>Redo</Button>
            </div>
                <SortingContainer include={systemsCurrentOrder} activeSystemId={undefined} showDragHandleBoolean={true} />
            </SettingsItem>
        </>
    );
};

export default ShortcutsCard;

