import { System } from '../../types/system';

interface HandleMultisearchNumberProps {
    currentQuery: string,
    systemsToSearch: System[],
    cleanupSearch: (system: System, query: string) => void,
    preppedSearchLink: (system: System, query: string) => string
}

export default function HandleMultisearchNumber({
    currentQuery,
    systemsToSearch,
    cleanupSearch,
    preppedSearchLink
}: HandleMultisearchNumberProps) {
    const multisearchQuery = currentQuery.replace(`/${systemsToSearch.length}`, "").trim();
    sessionStorage.setItem('searchInitiatedBlock', 'true');
    let systemsMultisearched: System[] = [];

    navigator.clipboard.writeText(multisearchQuery)

    for (const system of systemsToSearch) {
        console.log('Searching on system: ', system.name);
        const url = preppedSearchLink(system, multisearchQuery);
        window.open(url, '_blank');
        systemsMultisearched.push(system);
    }
    systemsMultisearched.forEach(system => {
        cleanupSearch(system, multisearchQuery);
    });
}

