import MultisearchShortcut from '../../types/multisearch-shortcuts';
import { System } from '../../types/system';

interface HandleMultisearchProps {
    currentQuery: string,
    shortcut: MultisearchShortcut,
    systems: System[],
    cleanupSearch: (system: System, query: string) => void,
    preppedSearchLink: (system: System, query: string) => string
}

export default function HandleMultisearchShortcut({
    currentQuery,
    shortcut,
    systems,
    cleanupSearch,
    preppedSearchLink
}: HandleMultisearchProps) {
    const multisearchQuery = currentQuery.replace(`/${shortcut.name}`, "").trim();
    sessionStorage.setItem('searchInitiatedBlock', 'true');
    console.log('Handling multisearch shortcut: ', shortcut);
    let systemsMultisearched: string[] = [];

    navigator.clipboard.writeText(multisearchQuery)
    shortcut.systems.always.forEach(systemId => {
        const system = systems.find(s => s.id === systemId);
        if (system) {
            const url = preppedSearchLink(system, multisearchQuery);
            window.open(url, '_blank');
            systemsMultisearched.push(system.id);
        }
    });

    // Handle randomly selected systems
    // Shuffle the array of systems randomly
    const shuffledRandomSystems = shortcut.systems.randomly
        .map(id => ({ id, system: systems.find(s => s.id === id) }))
        .filter(entry => entry.system !== undefined) // Ensure the system exists
        .sort(() => 0.5 - Math.random()) // Shuffle
        .map(entry => entry.system); // Extract the system objects

    // Select the first 'count_from_randomly' systems after shuffle
    shuffledRandomSystems.slice(0, shortcut.count_from_randomly).forEach(system => {
        if (system) {
            console.log('Searching on system: ', system.name);
            const url = preppedSearchLink(system, multisearchQuery);
            window.open(url, '_blank');
            systemsMultisearched.push(system.id);
        }
    });
    systemsMultisearched.forEach(systemId => {
        const system = systems.find(s => s.id === systemId);
        if (system) {
            cleanupSearch(system, multisearchQuery);
        }
    });
}

