// types/shortcut.tsx

import { MultisearchActionObject } from '@/types';

export interface Shortcut {
    type: 'multisearch_number' | 'multisearch_object';
    name: string;
    action: MultisearchActionObject | number;
}