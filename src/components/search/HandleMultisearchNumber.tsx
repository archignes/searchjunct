import { System } from 'types/system';
import { PreppedSearchLinkParams } from 'types/search';
import {CopyQueryToClipboard} from './';
import { Query } from '@/src/types';
import { Shortcut } from '@/src/types';


export type MultisearchNumberShortcut = Shortcut & {
    type: 'multisearch_number'
    action: number
}

export interface MultisearchNumberQuery extends Query {
    shortcut: MultisearchNumberShortcut
}

interface HandleMultisearchNumberProps {
    queryObject: MultisearchNumberQuery,
    systemsToSearch: System[],
    cleanupSearch: (system: System, query: string, shortcut?: string) => void,
    preppedSearchLink: (params: PreppedSearchLinkParams) => string
}

export default function HandleMultisearchNumber({
    queryObject,
    systemsToSearch,
    cleanupSearch,
    preppedSearchLink
}: HandleMultisearchNumberProps) {
    CopyQueryToClipboard({ query: queryObject.query })

    const systemIds = systemsToSearch.map(system => system.id);
    const uniqueSystemIds = new Set(systemIds);
    if (systemIds.length !== uniqueSystemIds.size) {
        throw new Error("systemsToSearch contains duplicate systems.");
    }

    let systemsMultisearched: System[] = [];

    for (const system of systemsToSearch) {
        console.log('Searching on system: ', system.name);
        const url = preppedSearchLink({ system, query: queryObject.query });
        window.open(url, '_blank');
        systemsMultisearched.push(system);
    }
    systemsMultisearched.forEach(system => {
        cleanupSearch(system, queryObject.query);
    });
}

