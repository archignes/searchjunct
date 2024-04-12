// ShortcutBar.tsx
//

import React, { useState, useEffect } from 'react';

import {
  useQueryContext, useStorageContext,
} from '../contexts';
import { MultisearchActionObjectBuckets } from './search/multisearch/ViewMultisearchShortcuts';

const ShortcutBar: React.FC = () => {
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


  let shortcutTypeLabel;
  if (shortcut && typeof shortcut.action === 'object') {
    shortcutTypeLabel = <p className="text-xs w-[200px] text-center text-gray-400">Multisearch Shortcut</p>;
  } else if (shortcut) {
    shortcutTypeLabel = <p className="text-xs w-[200px] text-center text-gray-400">Numbered Shortcut</p>;
  }

  return (
    <div id="shortcut-bar"
      className={`${shortcut ? 'mt-2 flex flex-row flex-wrap justify-center items-center mx-1' : 'hidden'} ${allShortcutSystemsSearched ? 'bg-gray-300' : ''}`}>
      {shortcutTypeLabel}
      <div className="rounded-md shadow-sm border p-1">
        {shortcut && (<div className="text-center">{allShortcutSystemsSearched ? <s>/{shortcut?.name}</s> : `/${shortcut?.name}`}</div>)}
        {shortcut && shortcut.action && typeof shortcut.action === 'object' ? 
          (<MultisearchActionObjectBuckets shortcut={shortcut.action}/>)
        : (<div className="border text-xs border-gray-300 rounded-md p-1">Search the next {shortcut?.name} systems</div>)}
      </div>
      </div>
  );
};


export default ShortcutBar;

