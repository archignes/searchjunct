import { System } from "types/system";
import MultisearchShortcut from "types/multisearch-shortcuts";

export interface PreppedSearchLinkParams {
    system: System;
    query: string;
}

export interface getNextUnsearchedSystemParams {
    skipSteps?: number
    numberOfSystems?: number
    updatedSystemsSearched?: Record<string, boolean>,
}

export type SearchContextType = {
    submitSearch: ({ system, urlQuery, skip }: { system?: System, urlQuery?: string, skip?: "skip" | "skipback" }) => void,
    query: string,
    setQuery: (query: string) => void,
    getNextUnsearchedSystem: ({ updatedSystemsSearched, skipSteps }: getNextUnsearchedSystemParams) => System | undefined,
    getNextUnsearchedSystems: ({ updatedSystemsSearched, skipSteps }: getNextUnsearchedSystemParams) => System[],
    preppedSearchLink: ({ system, query }: { system: System, query: string }) => string
};

export interface HandleSearchShortcutCandidateParams {
    currentQuery: string;
    shortcutCandidate: string;
    systems: System[];
    multisearchShortcuts: MultisearchShortcut[];
    getNextUnsearchedSystem: (updatedSystemsSearched?: Record<string, boolean>, skipSteps?: number) => System | undefined;
    cleanupSearch: (system: System, query: string) => void;
    preppedSearchLink: ({ system, query }: { system: System, query: string }) => string
}

export interface HandleSearchParams {
    system: System,
    currentQuery: string,
    getLastSkippedSystem: () => System | undefined,
    updateSystemsSkipped: (systemId: string, skipped: boolean) => void,
    handleSearch: (params: HandleSearchParams) => void,
    systemsDisabled: Record<string, boolean>,
    systemsDeleted: Record<string, boolean>,
    systemsCurrentOrder: System[],
    preppedSearchLink: ({ system, query }: { system: System, query: string }) => string
    cleanupSearch: (system: System, currentQuery: string) => void,
}
