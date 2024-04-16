// ShortcutBar.tsx
import React, { useState, useEffect } from 'react';
import { useQueryContext, useStorageContext } from '../contexts';
import { MultisearchActionObjectBuckets } from './search/multisearch/ViewMultisearchShortcuts';
import { MultisearchActionObject, completionArrays } from '@/types';
import { QuickShortcutButton } from './main-menu/QuickShortcuts';

const ShortcutBar: React.FC = () => {
  const { queryObject } = useQueryContext();
  const { systemsSearched } = useStorageContext();
  const shortcut = queryObject.shortcut;
  const [allShortcutSystemsSearched, setAllShortcutSystemsSearched] = useState(false);

  useEffect(() => {
    let searched = false;
    if (
      shortcut &&
      'action' in shortcut &&
      shortcut.action &&
      typeof shortcut.action === 'object' &&
      'systems' in shortcut.action
    ) {
      const { always, randomly } = shortcut.action.systems;
      const allSystems = [...always, ...randomly];
      searched = allSystems.every(system => systemsSearched[system]);
    }
    setAllShortcutSystemsSearched(searched);
  }, [shortcut, systemsSearched]);

  const [completionType, setCompletionType] = useState<string>('');
  const [possibleMultisearchShortcutCompletions, setPossibleMultisearchShortcutCompletions] = useState<completionArrays['multisearch_completions']>([]);
  const [systemsShortcutsAvailable, setSystemsShortcutsAvailable] = useState(false);
  useEffect(() => {
    if (
      shortcut &&
      shortcut.type === 'completion_shortcut' &&
      typeof shortcut.action === 'object' &&
      'multisearch_completions' in shortcut.action
      && shortcut.action.multisearch_completions.length > 0
    ) {
      setPossibleMultisearchShortcutCompletions(shortcut.action.multisearch_completions);
      setCompletionType('multisearch_object_completion_possible');
    } else {
      setPossibleMultisearchShortcutCompletions([]);
      setCompletionType('');
    }

    if (
      shortcut &&
      shortcut.type === 'completion_shortcut' &&
      typeof shortcut.action === 'object' &&
      'system_completions' in shortcut.action &&
      shortcut.action.system_completions.length > 0) {
      setSystemsShortcutsAvailable(true);
    }
    
  }, [shortcut]);

  let shortcutTypeLabel;
  if (completionType === 'multisearch_object_completion_possible') {
    shortcutTypeLabel = <p className="text-xs w-[200px] text-center text-gray-400">Available Shortcuts: </p>;
  } else if (shortcut) {
    switch (shortcut.type) {
      case 'multisearch_object':
      case 'multisearch_number':
        shortcutTypeLabel = (
          <p className="text-xs w-[200px] text-center text-gray-400">
            {shortcut.type === 'multisearch_object' ? 'Multisearch Shortcut' : 'Numbered Shortcut'}
          </p>
        );
        break;
      case 'completion_shortcut':
        shortcutTypeLabel = "";
        break;
      default:
        shortcutTypeLabel = <p className="text-xs w-[200px] text-center text-gray-400">Unsupported Shortcut</p>;
    }
  }

  return (
    <div
      id="shortcut-bar"
      className={`${shortcut ? 'mt-2 flex flex-row flex-wrap justify-center items-center mx-1' : 'hidden'} ${allShortcutSystemsSearched ? 'bg-gray-300' : ''
        }`}
    >
      {shortcutTypeLabel}
      {shortcut && shortcut.type !== 'unsupported' && (
        <div className="rounded-md shadow-sm border p-1">
          {shortcut && completionType !== 'multisearch_object_completion_possible' && (
            <div className="text-center">{allShortcutSystemsSearched ? <s>/{shortcut?.name}</s> : `/${shortcut?.name}`}</div>
          )}
          {shortcut && shortcut.type === 'multisearch_object' && shortcut.action && typeof shortcut.action === 'object' && 'systems' in shortcut.action ? (
            <MultisearchActionObjectBuckets shortcut={shortcut.action as MultisearchActionObject} />
          ) : shortcut && shortcut.type === 'multisearch_number' ? (
            <div className="border text-xs border-gray-300 rounded-md p-1">Search the next {shortcut?.name} systems</div>
          ) : shortcut && completionType === 'multisearch_object_completion_possible' && (
            <div>
              {Array.isArray(possibleMultisearchShortcutCompletions) &&
                possibleMultisearchShortcutCompletions.map((item: { name: string; type: 'multisearch_action_object_completion' }) => (
                  <QuickShortcutButton key={item.name} name={item.name} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortcutBar;