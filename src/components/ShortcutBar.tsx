// ShortcutBar.tsx
//

import React, { useState, useEffect } from 'react';

import {
  useQueryContext, useStorageContext,
} from '../contexts';
import { MultisearchActionObjectBuckets } from './search/multisearch/ViewMultisearchShortcuts';

const ShortcutBar = () => {
  const { queryObject } = useQueryContext();
  const { systemsSearched } = useStorageContext();
  const shortcut = queryObject.shortcut;

  const [allShortcutSystemsSearched, setAllShortcutSystemsSearched] = useState(false);

  useEffect(() => {
    let searched = false;
    if (shortcut && typeof shortcut.action === 'object') {
      const { always, randomly } = shortcut.action.systems;
      const allSystems = [...always, ...randomly];
      searched = allSystems.every(system => systemsSearched[system]);
    }
    setAllShortcutSystemsSearched(searched);
  }, [shortcut, systemsSearched]);

  
  return (
    <div id="shortcut-bar"
    className={`flex flex-row mt-2 justify-center rounded-md p-1 mx-1 items-center ${allShortcutSystemsSearched ? 'bg-gray-300' : ''}`}>
      {shortcut && (<div>{allShortcutSystemsSearched ? <s>/{shortcut?.name}</s> : `/${shortcut?.name}`}</div>)}
      {shortcut && shortcut.action && typeof shortcut.action === 'object' && 
        <MultisearchActionObjectBuckets shortcut={shortcut.action} />
      }
      </div>
  );
};


export default ShortcutBar;

