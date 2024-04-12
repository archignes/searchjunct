// QuickShortcuts.tsx

import React from 'react';
import {
    Card,
    CardContent,
    CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { useShortcutContext, useQueryContext } from '@/contexts';
import { MultisearchActionObject } from '@/types';

const QuickShortcutsCard: React.FC = () => {
    const { queryObject, processTextInputForQueryObject } = useQueryContext();
    const { multisearchActionObjects } = useShortcutContext();

    const handleShortcutClick = (shortcutName: string) => {
        const updatedQuery = `${queryObject.rawString} /${shortcutName}`;
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = updatedQuery;
            searchInput.focus();
            // Move the cursor to the end of the text
            const textLength = searchInput.value.length;
            searchInput.setSelectionRange(textLength, textLength);
            processTextInputForQueryObject(updatedQuery);
        }
    };

    return (
      <Card className='rounded-md border-none bg-white shadow-none mx-auto'>
        <CardTitle className='text-left pl-2 py-1 mb-2'>Shortcuts</CardTitle>
        <CardContent className="p-0 flex justify-start items-start flex-col">
          {multisearchActionObjects.map((shortcut: MultisearchActionObject) => (
            <div className="flex flex-row items-start px-3 my-1 w-full" key={shortcut.name}>
              <Button className="hover:bg-blue-100" variant="outline" onClick={() => handleShortcutClick(shortcut.name)}>/{shortcut.name}</Button>
              {shortcut.description && <p className="text-sm text-gray-500 px-2">{shortcut.description}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    );
};

export default QuickShortcutsCard;

