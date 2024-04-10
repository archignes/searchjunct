// search/HandleMultisearchNumber.tsx
import React from 'react';
import { System } from'@/types';
import { PreppedSearchLinkParams } from'@/types';
import {CopyQueryToClipboard} from './';
import { Query } from '@/types';
import { Shortcut } from '@/types';
import LaunchSearch from './LaunchSearch';

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
    getPreppedSearchLink: (params: PreppedSearchLinkParams) => string
}

const HandleMultisearchNumber: React.FC<HandleMultisearchNumberProps> = ({
    queryObject,
    systemsToSearch,
    cleanupSearch,
    getPreppedSearchLink
}: HandleMultisearchNumberProps) => {
    CopyQueryToClipboard({ query: queryObject.query })

    const systemIds = systemsToSearch.map(system => system.id);
    const uniqueSystemIds = new Set(systemIds);
    if (systemIds.length !== uniqueSystemIds.size) {
        throw new Error("systemsToSearch contains duplicate systems.");
    }

    let systemsMultisearched: System[] = [];

    for (const system of systemsToSearch) {
        console.log('Searching on system: ', system.name);
        const url = getPreppedSearchLink({ system, query: queryObject.query });
        LaunchSearch({ preppedSearchLink: url, system, queryObject: queryObject });
        systemsMultisearched.push(system);
    }
    systemsMultisearched.forEach(system => {
        cleanupSearch(system, queryObject.query);
    });
    return <></>
}

export default HandleMultisearchNumber;

