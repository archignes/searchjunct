import { Query } from "@/types";
import { System, MultisearchActionObject } from "@/types";

export interface PreppedSearchLinkParams {
    system: System;
    query: string;
}

export interface getNextUnsearchedSystemParams {
    skipSteps?: number
    numberOfSystems?: number
    updatedSystemsSearched?: Record<string, boolean>,
}

export interface SubmitSearchParams {
    system?: System;
    query?: string;
}


export interface HandleSearchShortcutCandidateParams {
    currentQuery: string;
    shortcutCandidate: string;
    systems: System[];
    multisearchActionObjects: MultisearchActionObject[];
    getNextUnsearchedSystem: (updatedSystemsSearched?: Record<string, boolean>, skipSteps?: number) => System | undefined;
    cleanupSearch: (system: System, query: string) => void;
    getPreppedSearchLink: ({ system, query }: { system: System, query: string }) => string
}

export interface HandleSearchProps {
    system: System,
    queryObject: Query,
    getLastSkippedSystem: () => System | undefined,
    updateSystemsSkipped: (systemId: string, skipped: boolean) => void,
    handleSearch: (params: HandleSearchProps) => void,
    systemsDisabled: Record<string, boolean>,
    systemsDeleted: Record<string, boolean>,
    systemsCurrentOrder: System[],
    getPreppedSearchLink: ({ system, query }: { system: System, query: string }) => string
    cleanupSearch: (system: System, currentQuery: string) => void,
}
