// types/multi-search-customs.tsx

export default interface MultisearchShortcut {
    name: string;
    description?: string;
    systems: {
        always: string[];
        randomly: string[];
    };
    count_from_randomly: number;
}

