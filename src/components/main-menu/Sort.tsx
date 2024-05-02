// Sort.tsx

import React, { useRef } from 'react';
import { StarIcon } from '@radix-ui/react-icons';
import { Button } from '@/src/components/ui/button';
import { Switch } from '@/src/components/ui/switch';
import SortingContainer from '@/src/components/SortingContainer';
import { useSortContext } from '@/contexts';
import { SettingsItem, SettingsButton, SettingsText } from './SettingsItem';
import SystemItemDraggable from '@/src/components/systems/DraggableItem';

const ShortcutsCard: React.FC = () => {
    const { 
        systemsCurrentOrder, 
        systemsCustomOrderSetting, 
        customModeOnLoadSetting, 
        undoSort, 
        redoSort, 
        isUndoAvailable, 
        isRedoAvailable, 
        isInitialCustomSort,
        deleteCustomSortOrder, 
        toggleCustomModeOnLoadSetting 
    } = useSortContext();

    return (
        <>
            <div className="text-center my-2 sm:my-4">
                Sort your system list.
                <br></br><span className='text-xs text-gray-500'>
                    The system list dafaults to sort randomly on page load.
                </span>
                {systemsCustomOrderSetting.length === 0 ? (<p className="py-1 text-sm text-gray-500">
                    You do <span className='underline'>not</span> currently have a custom order set.
                </p>) : (<p className="py-1 text-sm text-gray-500">
                    The system list will be sorted using your custom order on page load.
                </p>
                )}
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
            <SettingsItem title={`Delete custom sort order`} disabled={systemsCustomOrderSetting?.length === 0} >
                <SettingsButton
                    onClick={() => deleteCustomSortOrder()}
                    ariaDisabled={systemsCustomOrderSetting?.length === 0}
                    label="Delete custom sort order"
                />
                <SettingsText lines={[
                    `This will delete your custom sort order and your custom sort history`
                ]} />
            </SettingsItem>
            <SettingsItem title={`Default to your custom sort order on page${systemsCustomOrderSetting.length === 0 ? "." : customModeOnLoadSetting ? ': Enabled' : ': Disabled'}`}
                disabled={systemsCustomOrderSetting?.length === 0} >
                <div className="inline-flex items-center py-2">
                    <Switch
                        id="default-custom-mode"
                        checked={customModeOnLoadSetting}
                        onCheckedChange={() => toggleCustomModeOnLoadSetting()}
                        aria-disabled={systemsCustomOrderSetting?.length === 0}
                        className="focus-visible:ring-primary"
                    />
                    <span className={`ml-2 text-xs font-semibold ${customModeOnLoadSetting ? 'text-black' : 'text-gray-500'}`}>
                        {systemsCustomOrderSetting?.length === 0 ? 'Not Available' : customModeOnLoadSetting ? 'Enabled' : 'Disabled'}
                    </span>

                </div>

            </SettingsItem>
            <SettingsItem title="Drag system items to sort.">
                
            <div className="flex justify-end gap-2 mb-1 items-center">
                <span className="text-xs text-gray-500">
                    {isInitialCustomSort ? "This is your initial custom sort." : ""}
                </span>
                <Button onClick={undoSort} size="sm" disabled={!isUndoAvailable}>Undo</Button>
                <Button onClick={redoSort} size="sm" disabled={!isRedoAvailable}>Redo</Button>
            </div>
                <SortingContainer include={systemsCurrentOrder} activeSystemId={undefined} showDragHandleBoolean={true} setActiveSystemRef={useRef<HTMLDivElement | null>(null)} />
            </SettingsItem>
        </>
    );
};

export default ShortcutsCard;

