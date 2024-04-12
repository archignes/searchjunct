// types/shortcut.tsx

import { MultisearchActionObject } from '@/types';

export interface Shortcut {
    type: 'multisearch_number' | 'multisearch_object' | 'systems_shortcut';
    name: string;
    action: MultisearchActionObject | number | string[];
    completed?: boolean;
    possibleCompletions?: string[];
}