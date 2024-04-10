// Shortcuts.tsx

import React from 'react';
import {
    Card,
    CardContent,
    CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

import { useShortcutContext, useQueryContext } from '@/contexts';
import { MultisearchActionObject } from '@/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ViewMultisearchSheet from '@/src/components/search/multisearch/MultisearchManagementSheet';

const ShortcutsCard: React.FC = () => {
    const { queryObject } = useQueryContext();
    const { multisearchActionObjects } = useShortcutContext();

    return (
        <>
            <Card className='rounded-md bg-white shadow-none mx-auto'>
                <CardTitle className='text-left pl-2 py-1 mb-2'>Shortcuts</CardTitle>
                <CardContent className="p-0 flex items-left flex-col">
                    {/* <Label className="text-left text-gray-500 text-sm p-2">Query Shortcuts</Label>
                    <p className="text-sm text-gray-500 p-2">There are no query shortcuts at this time.</p>
                    
                    <hr className="w-full"></hr> */}
                    <Label className="text-left text-sm p-2">Multisearch Shortcuts</Label>
                    <p className="text-xs text-gray-500 px-2">
                                Search with multiple systems at once.
                                You can create, edit, and delete multisearch shortcuts.
                                You can also use numbered shortcuts, like `/3`, to search the next # of available systems. 
                        </p>
                    <ViewMultisearchSheet/>
                        

                    {multisearchActionObjects.map((shortcut: MultisearchActionObject, index) => (
                        <div className="grid grid-cols-6 px-3 my-1" key={shortcut.name}>
                        <Button className="w-2/3 col-span-2" variant="outline" size="sm" onClick={() => {
                            const updatedQuery = `${queryObject.rawString} /${shortcut.name}`;
                            const searchInput = document.getElementById('search-input') as HTMLInputElement;
                            if (searchInput) {
                                searchInput.value = updatedQuery;
                                searchInput.focus();
                                // Move the cursor to the end of the text
                                const textLength = searchInput.value.length;
                                searchInput.setSelectionRange(textLength, textLength);
                            }
                        }}>/{shortcut.name}</Button>
                        { shortcut.description && <p className="col-span-4 text-sm text-gray-500 px-2 align-top">{shortcut.description}</p>}
                    </div>
                    ))}
                </CardContent>
            </Card>

        </>
    );
};

export default ShortcutsCard;

