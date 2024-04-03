// types/shortcut.tsx

import { MultisearchActionObject } from '@/src/types';

export interface Shortcut {
    type: string;
    name: string;
    action: MultisearchActionObject | number;
}