import { System } from 'types/system';
import HandleMultisearchNumber, { MultisearchNumberQuery } from './HandleMultisearchNumber';
import HandleMultisearchObject, { MultisearchObjectQuery } from './HandleMultisearchObject';
import { getNextUnsearchedSystemParams, PreppedSearchLinkParams, HandleSearchParams } from 'types/search';
import { CopyQueryToClipboard } from './';
import { Shortcut } from '@/src/types';
import { Query } from '@/src/types';

export type ShortcutQuery = Query & {
    shortcut: Shortcut
}

interface HandleShortcutSearchProps {
    queryObject: ShortcutQuery;
    systems: System[];
    cleanupSearch: (system: System, query: string) => void;
    preppedSearchLink: (params: PreppedSearchLinkParams) => string;
    getNextUnsearchedSystems: (params: getNextUnsearchedSystemParams) => System[];
}

export const handleShortcutSearch = ({
    queryObject,
    systems,
    cleanupSearch,
    preppedSearchLink,
    getNextUnsearchedSystems,
}: HandleShortcutSearchProps) => {
    console.log("queryObject.shortcut:", queryObject);
    if (queryObject.shortcut.type === 'multisearch_number' && typeof queryObject.shortcut.action === 'number') {
        const systemsToSearch: System[] = getNextUnsearchedSystems({ numberOfSystems: queryObject.shortcut.action });

        HandleMultisearchNumber({
            queryObject: queryObject as MultisearchNumberQuery,
            systemsToSearch,
            cleanupSearch,
            preppedSearchLink
        });
        return;
    } else if (queryObject.shortcut.type === 'multisearch_object') {
        HandleMultisearchObject({
            queryObject: queryObject as MultisearchObjectQuery,
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