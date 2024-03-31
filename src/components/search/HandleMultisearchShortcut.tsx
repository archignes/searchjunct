import { System } from '../../types/system';
import MultisearchShortcut from '../../types/multisearch-shortcuts';
import { PreppedSearchLinkParams } from '../../types/search';
import { CopyQueryToClipboard } from './';

interface HandleMultisearchShortcutProps {
    currentQuery: string;
    shortcut: MultisearchShortcut;
    systems: System[];
    cleanupSearch: (system: System, query: string) => void;
    preppedSearchLink: (params: PreppedSearchLinkParams) => string;
}


const HandleMultisearchShortcut = ({
    currentQuery,
    shortcut,
    systems,
    cleanupSearch,
    preppedSearchLink,
}: HandleMultisearchShortcutProps) => {
    console.log('Handling multisearch shortcut: ', shortcut);
    if (!shortcut.systems) {
        console.warn('Invalid shortcut provided:', shortcut);
        return;
    }
    const multisearchQuery = currentQuery.replace(`/${shortcut.name}`, "").trim();
    CopyQueryToClipboard({ query: multisearchQuery })

    const { always, randomly } = shortcut.systems;

    const alwaysSystems = systems.filter(system =>
        always.includes(system.id)
    );

    const randomlySystems = systems.filter(
        (system) => randomly.includes(system.id)
    );

    const selectedRandomSystems = [];
    for (let i = 0; i < shortcut.count_from_randomly; i++) {
        if (randomlySystems.length === 0) break;
        const randomIndex = Math.floor(Math.random() * randomlySystems.length);
        const randomSystem = randomlySystems.splice(randomIndex, 1)[0];
        if (randomSystem) selectedRandomSystems.push(randomSystem);
    }
    const systemsToSearch = [...alwaysSystems, ...selectedRandomSystems];

    systemsToSearch.forEach((system) => {
        const url = preppedSearchLink({ system, query: multisearchQuery });
        window.open(url, "_blank");
        cleanupSearch(system, multisearchQuery);
        console.log("Searching on system: ", system.name);
    });
};

export default HandleMultisearchShortcut;