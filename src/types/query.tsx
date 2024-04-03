// types/query.tsx

import { Shortcut } from './shortcut';

export interface Query {
    raw_string: string;
    query: string;
    shortcut: Shortcut | null;
    in_address_bar: boolean;
    from_address_bar: boolean;
}