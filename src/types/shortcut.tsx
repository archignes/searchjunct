// types/shortcut.tsx

import { MultisearchActionObject } from '@/types';

export type completionArrays = {
    multisearch_completions: {name: string, type: 'multisearch_action_object_completion'}[];
    system_completions: {id: string, type: 'system_completion'}[];
}

export type ShortcutType = 'multisearch_number' | 'multisearch_object' | 'completion_shortcut' | 'unsupported';

export type ShortcutAction = MultisearchActionObject | number | completionArrays | 'unsupported'; 

export interface Shortcut { 
    type: ShortcutType;
    name: string;
    action: ShortcutAction;
    completed?: boolean;
    possibleCompletions?: string[];
}