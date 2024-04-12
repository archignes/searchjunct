// ShortcutBar.tsx
//

import React, { useState, useEffect } from 'react';

import {
  useQueryContext, useStorageContext,
} from '../contexts';
import { MultisearchActionObjectBuckets } from './search/multisearch/ViewMultisearchShortcuts';
import {MultisearchActionObject} from '@/types';

const ShortcutBar: React.FC = () => {
  const { queryObject } = useQueryContext();
  const { systemsSearched } = useStorageContext();
  const shortcut = queryObject.shortcut;
  
  const [allShortcutSystemsSearched, setAllShortcutSystemsSearched] = useState(false);

  

  useEffect(() => {
    let searched = false;
    if (shortcut && 'action' in shortcut && shortcut.action && typeof shortcut.action === 'object' && 'systems' in shortcut.action) {
      const { always, randomly } = shortcut.action.systems;
      const allSystems = [...always, ...randomly];
      searched = allSystems.every(system => systemsSearched[system]);
    }
    setAllShortcutSystemsSearched(searched);
  }, [shortcut, systemsSearched]);

  let shortcutTypeLabel;
  if (shortcut && typeof shortcut.action === 'object') {
    shortcutTypeLabel = <p className="text-xs w-[200px] text-center text-gray-400">Multisearch Shortcut</p>;
  } else if (shortcut) {
    shortcutTypeLabel = <p className="text-xs w-[200px] text-center text-gray-400">Numbered Shortcut</p>;
  }

  if (shortcut && shortcut.type === 'systems_shortcut') {
    shortcutTypeLabel = <p className="text-xs w-[200px] text-center text-gray-400">Autocomplete Systems Shortcut</p>;
  }

  return (
    <div id="shortcut-bar"
      className={`${shortcut ? 'mt-2 flex flex-row flex-wrap justify-center items-center mx-1' : 'hidden'} ${allShortcutSystemsSearched ? 'bg-gray-300' : ''}`}>
      {shortcutTypeLabel}
      <div className="rounded-md shadow-sm border p-1">
        {shortcut && (<div className="text-center">{allShortcutSystemsSearched ? <s>/{shortcut?.name}</s> : `/${shortcut?.name}`}</div>)}
        {shortcut && shortcut.type === 'multisearch_object' && shortcut.action && typeof shortcut.action === 'object' && 'systems' in shortcut.action ? 
          (<MultisearchActionObjectBuckets shortcut={shortcut.action as MultisearchActionObject}/>)
        : shortcut && shortcut.type === 'multisearch_number' ?
          (<div className="border text-xs border-gray-300 rounded-md p-1">Search the next {shortcut?.name} systems</div>)
        : shortcut && shortcut.type === 'systems_shortcut' ?
          ("")
        : (<div className="border text-xs border-gray-300 rounded-md p-1">Unsupported shortcut type</div>)}
      </div>
      </div>
  );
};


export default ShortcutBar;

