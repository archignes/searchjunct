import { System } from 'types/system';
import { PreppedSearchLinkParams } from 'types/search';
import {CopyQueryToClipboard} from './';

interface HandleMultisearchNumberProps {
    currentQuery: string,
    systemsToSearch: System[],
    shortcut: string,
    cleanupSearch: (system: System, query: string) => void,
    preppedSearchLink: (params: PreppedSearchLinkParams) => string
}

export default function HandleMultisearchNumber({
    currentQuery,
    systemsToSearch,
    shortcut,
    cleanupSearch,
    preppedSearchLink
}: HandleMultisearchNumberProps) {
    const multisearchQuery = currentQuery.replace(`/${shortcut}`, "").trim();
    CopyQueryToClipboard({ query: multisearchQuery })

    const systemIds = systemsToSearch.map(system => system.id);
    const uniqueSystemIds = new Set(systemIds);
    if (systemIds.length !== uniqueSystemIds.size) {
        throw new Error("systemsToSearch contains duplicate systems.");
    }

    let systemsMultisearched: System[] = [];

    for (const system of systemsToSearch) {
        console.log('Searching on system: ', system.name);
        const url = preppedSearchLink({ system, query: multisearchQuery });
        window.open(url, '_blank');
        systemsMultisearched.push(system);
    }
    systemsMultisearched.forEach(system => {
        cleanupSearch(system, multisearchQuery);
    });
}

