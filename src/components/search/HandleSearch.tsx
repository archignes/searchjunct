import { System } from 'types/system';
import MultisearchShortcut from 'types/multisearch-shortcuts';
import HandleMultisearchNumber from './HandleMultisearchNumber';
import HandleMultisearchShortcut from './HandleMultisearchShortcut';
import { getNextUnsearchedSystemParams, PreppedSearchLinkParams, HandleSearchParams } from 'types/search';
import { CopyQueryToClipboard } from './';

export const getShortcut = (multisearchShortcuts: MultisearchShortcut[], shortcutCandidate: string) => {
    const shortcut = multisearchShortcuts.find(shortcut => shortcut.name === shortcutCandidate); return shortcut
}

export function getShortcutCandidate(query: string) {
    /**
     * Regular expression to find a candidate shortcut in a query string.
     * A candidate is identified by a single forward slash followed by non-whitespace characters.
     * The candidate must either:
     * - start the string (and have whitespace after),
     * - end the string (and have whitespace before),
     * - or be surrounded by whitespace.
     * This regex disqualifies any candidates immediately preceded by multiple forward slashes.
     */
    const regex = /(?:^|\s)\/(\S+)(?=\s|$)/g;
    const disqualifiedRegex = /\/{2,}\S+/; // Regex to check for multiple forward slashes before a string
    const disqualifiedMatches = query.match(disqualifiedRegex);
    const matches = Array.from(query.matchAll(regex));
    if (matches.length > 0 && disqualifiedMatches === null) {
        // Returns the first matched shortcut without the leading forward slash if no disqualified matches found
        return matches[0][1];
    }
    return null;
}

interface HandleShortcutSearchParams {
    currentQuery: string;
    shortcutCandidate: string;
    multisearchShortcuts: MultisearchShortcut[];
    systems: System[];
    cleanupSearch: (system: System, query: string) => void;
    preppedSearchLink: (params: PreppedSearchLinkParams) => string;
    getNextUnsearchedSystems: (params: getNextUnsearchedSystemParams) => System[];
}

export const handleShortcutSearch = ({
    currentQuery,
    shortcutCandidate,
    multisearchShortcuts,
    systems,
    cleanupSearch,
    preppedSearchLink,
    getNextUnsearchedSystems
}: HandleShortcutSearchParams) => {
        if (!isNaN(parseFloat(shortcutCandidate))) {
            const shortcutCandidateNumber = parseFloat(shortcutCandidate).toString();
            console.log('shortcutCandidateNumber: ', shortcutCandidateNumber);
            const numberOfSystemsToSearch = Number(shortcutCandidateNumber);
            const systemsToSearch: System[] = getNextUnsearchedSystems({ numberOfSystems: numberOfSystemsToSearch });
            
            HandleMultisearchNumber({
                currentQuery: currentQuery,
                systemsToSearch,
                shortcut: shortcutCandidate,
                cleanupSearch,
                preppedSearchLink
            });
            return;
        }
        const shortcut = getShortcut(multisearchShortcuts, shortcutCandidate);
        if (shortcut) {
            HandleMultisearchShortcut({
                currentQuery: currentQuery,
                shortcut,
                systems,
                cleanupSearch,
                preppedSearchLink
            });
            return;
        }
    };

interface HandleSkipLogicParams {
    skip: string;
    getNextUnsearchedSystem: (params: getNextUnsearchedSystemParams) => System | undefined;
    getLastSkippedSystem: () => System | undefined;
    updateSystemsSkipped: (systemId: string, skipped: boolean) => void;
    handleSearch: ({ system, urlQuery, skip }: { system?: System, urlQuery?: string, skip?: "skip" | "skipback" }) => void;
}

/**
 * Handles the logic for skipping search systems forward or backward based on user input.
 * 
 * When skipping forward ('skip'), it attempts to move two systems ahead in the search queue,
 * marking the initially next unsearched system as skipped. This is useful for quickly bypassing
 * systems without performing a search on them.
 * 
 * When skipping backward ('skipback'), it finds the last system that was skipped and reactivates it
 * for an immediate search, effectively undoing the skip action on that system. This allows users to revisit
 * systems they might have skipped previously.
 * 
 * @param {Object} params
 * @param {string} params.skip - either 'skip' OR 'skipback'
 * @param {Function} params.getNextUnsearchedSystem
 * @param {Function} params.getLastSkippedSystem
 * @param {Function} params.updateSystemsSkipped
 * @param {Function} params.handleSearch
 * @returns {boolean} - Returns true if it was a valid skip action, false otherwise.
 */
export const handleSkipLogic = ({
    skip,
    getNextUnsearchedSystem,
    getLastSkippedSystem,
    updateSystemsSkipped,
    handleSearch
}: HandleSkipLogicParams) => {
    if (skip === "skip") {
        const skipSteps = 2; // Define the number of steps to skip forward.
        // Updated to match the expected signature
        const systemSkipped = getNextUnsearchedSystem({ skipSteps: 1 }); // Attempt to get the next unsearched system with 1 step.
        if (systemSkipped) {
            // Updated to match the expected signature
            let system = getNextUnsearchedSystem({ skipSteps }); // Attempt to skip forward by the defined steps.
            if (!system) {
                return false; // If no system is found to skip to, return false.
            }
            updateSystemsSkipped(systemSkipped.id, true); // Mark the initially next system as skipped.
        }
        return true; // Return true to indicate the skip forward action was handled.
    } else if (skip === "skipback") {
        let system = getLastSkippedSystem(); // Attempt to get the last skipped system.
        if (!system) {
            return false; // If no previously skipped system is found, return false.
        }
        updateSystemsSkipped(system.id, false); // Reactivate the skipped system for searching.
        handleSearch({ system: system as System }); // Initiate a search on the reactivated system.
        return true;
    }
    return false; // If the skip parameter does not match expected values, return false.
};

export const prepareSearchUrlAndOpen = (
    system: System, 
    currentQuery: string, 
    preppedSearchLink: (params: PreppedSearchLinkParams) => string, 
    cleanupSearch: (system: System, currentQuery: string) => void
) => {
    const url = preppedSearchLink({ system, query: currentQuery });
    window.open(url, '_blank');
    cleanupSearch(system, currentQuery);
};


export default function HandleSearch ({
    system, 
    currentQuery, 
    getLastSkippedSystem, 
    updateSystemsSkipped, 
    handleSearch, 
    systemsDisabled, 
    systemsDeleted, 
    systemsCurrentOrder, 
    preppedSearchLink, 
    cleanupSearch 
}: HandleSearchParams) {
    if (systemsDisabled[system.id] || systemsDeleted[system.id]) {
        const enabledSystem = systemsCurrentOrder.find(s => !systemsDisabled[s.id] && !systemsDeleted[s.id]);
        if (enabledSystem !== undefined) {
            handleSearch({ system: enabledSystem, currentQuery, getLastSkippedSystem, updateSystemsSkipped, handleSearch, systemsDisabled, systemsDeleted, systemsCurrentOrder, preppedSearchLink, cleanupSearch });
        }
        return;
    }

    if (currentQuery !== '' && system.search_link && !system.search_link.includes('%s')) {
        CopyQueryToClipboard({query: currentQuery})
    }

    const url = preppedSearchLink({ system, query: currentQuery });
    window.open(url, '_blank');
    cleanupSearch(system, currentQuery);

}