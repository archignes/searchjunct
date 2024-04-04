// search/HandleMultisearchObject.tsx

import { System, Query, MultisearchActionObject, Shortcut, PreppedSearchLinkParams } from '@/types';
import { CopyQueryToClipboard } from '.';
import {  } from '../../contexts/QueryContext';

export interface MultisearchObjectShortcut extends Shortcut {
    type: 'multisearch_object'
    action: MultisearchActionObject
}

export interface MultisearchObjectQuery extends Query {
    shortcut: MultisearchObjectShortcut
}


interface HandleMultisearchObjectProps {
    queryObject: MultisearchObjectQuery;
    systems: System[];
    cleanupSearch: (system: System, query: string, shortcut?: string) => void;
    preppedSearchLink: (params: PreppedSearchLinkParams) => string;
    systemsSearched: Record<string, boolean>;
}


function HandleMultisearchObject({
    queryObject,
    systems,
    cleanupSearch,
    preppedSearchLink,
    systemsSearched
}: HandleMultisearchObjectProps) {
    
    console.log('Handling multisearch shortcut: ', queryObject.shortcut.name);
    CopyQueryToClipboard({ query: queryObject.query })

    const { always, randomly } = queryObject.shortcut.action.systems;

    const alwaysSystems = systems.filter(system =>
        always.includes(system.id) && !systemsSearched[system.id]
    );

    const randomlySystems = systems.filter(
        (system) => randomly.includes(system.id) && !systemsSearched[system.id]
    );

    const selectedRandomSystems = [];
    for (let i = 0; i < queryObject.shortcut.action.count_from_randomly; i++) {
        if (randomlySystems.length === 0) break;
        const randomIndex = Math.floor(Math.random() * randomlySystems.length);
        const randomSystem = randomlySystems.splice(randomIndex, 1)[0];
        if (randomSystem) selectedRandomSystems.push(randomSystem);
    }
    let systemsToSearch = [...alwaysSystems, ...selectedRandomSystems];

    systemsToSearch.forEach((system) => {
        const url = preppedSearchLink({ system, query: queryObject.query });
        window.open(url, "_blank");
        cleanupSearch(system, queryObject.query);
        console.log("Searching on system: ", system.name);
    });
};

export default HandleMultisearchObject;