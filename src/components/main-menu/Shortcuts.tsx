// Shortcuts.tsx

import React from 'react';
import { useQueryContext } from '@/contexts';
import ViewMultisearchShortcuts from '../search/multisearch/ViewMultisearchShortcuts';
import AddMultisearchActionObject from '../search/multisearch/AddMultisearchActionObject';
import { SettingsItem, SettingsText, SettingsButton } from './SettingsItem';


const ShortcutsCard: React.FC = () => {
    const { queryObject, processTextInputForQueryObject } = useQueryContext();    
    const setNumberedShortcutExample = () => {
        const updatedQuery = `${queryObject.rawString} /3 `;
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = updatedQuery;
            searchInput.focus();
            // Move the cursor to the end of the text
            const textLength = searchInput.value.length;
            searchInput.setSelectionRange(textLength, textLength);
            processTextInputForQueryObject(updatedQuery);
        }
    }
    return (
        <>
            <div className="text-center my-2 sm:my-4">
                Set shortcuts to search with multiple systems at once.
            </div>
                <SettingsItem title="Numbered Shortcuts" startOpen={true}>
                    <SettingsText lines={[
                        "You can use numbered shortcuts, in the form `/#`, to search the next # available systems.",
                        "For example, if you have 5 available systems, you can use `/3` to search the first three systems.",
                        "Try it! Click on this numbered shortcut to add it to your search:"
                    ]} />
                    <SettingsButton
                        onClick={() => { setNumberedShortcutExample() }}
                        label="/3"
                    />
                    </SettingsItem>
            <SettingsItem title="Multisearch Shortcuts">
                <SettingsText lines={[
                    "Search with multiple systems at once. You can create, edit, and delete multisearch shortcuts."
                ]} />
                <AddMultisearchActionObject />
                <ViewMultisearchShortcuts />
            </SettingsItem>
            </>
    );
};

export default ShortcutsCard;

