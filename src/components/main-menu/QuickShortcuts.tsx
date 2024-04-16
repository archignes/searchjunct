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

export const QuickShortcutButton: React.FC<{ name: string }> = ({ name }) => {
  const { queryObject, processTextInputForQueryObject } = useQueryContext();
  
  // supports clearing the textarea input of shortcut fragments (/foo, even complete shortcuts like /3) and a lone /
  const stripShortcutFragments = (inputString: string): string => {
    return inputString.replace(/(\/\S*|\s\/$)/g, "").trim();
  };

  const handleShortcutClick = (name: string) => {
    const strippedShortcutFragments = stripShortcutFragments(queryObject.rawString);
    const updatedQuery = `${strippedShortcutFragments} /${name}`.trim();
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
    <Button id={`shortcutbar-button-${name}`} size="sm" className="mx-1 hover:bg-blue-100" variant="outline" onClick={() => handleShortcutClick(name)}>/{name}</Button>
  )
};

const QuickShortcutsCard: React.FC = () => {
    const { multisearchActionObjects } = useShortcutContext();

    return (
      <Card className='rounded-md border-none bg-white shadow-none mx-auto'>
        <CardTitle className='text-left pl-2 py-1 mb-2'>Shortcuts</CardTitle>
        <CardContent className="p-0 flex justify-start items-start flex-col">
          {multisearchActionObjects.map((actionObject: MultisearchActionObject) => (
            <div className="flex flex-row items-start px-3 my-1 w-full" key={actionObject.name}>
              <QuickShortcutButton name={actionObject.name} />
              {actionObject.description && <p className="text-sm text-gray-500 px-2">{actionObject.description}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    );
};

export default QuickShortcutsCard;

