// types/shortcut.tsx

import { MultisearchActionObject } from '@/src/types';

export interface Shortcut {
    type: 'multisearch_number' | 'multisearch_object';
    name: string;
    completed: boolean;
    action: MultisearchActionObject | number;
}