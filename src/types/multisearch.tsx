// types/multisearch.tsx

export interface MultisearchActionObject {
    name: string;
    description?: string;
    systems: {
        always: string[];
        randomly: string[];
    };
    count_from_randomly: number;
}

