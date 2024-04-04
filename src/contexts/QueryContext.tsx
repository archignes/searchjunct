// contexts/QueryContext.tsx
//
// This file defines a context for managing the query state across the
// application. It provides a `QueryProvider` component that wraps its
// children and supplies the query state and related functions.

import React, { createContext, useEffect, useRef, useContext, ReactNode, useState } from 'react';
import { useAddressContext, useShortcutContext, useStorageContext } from './';
import { Query } from '@/src/types';

interface QueryContextType {
    queryObject: Query;
    setQueryObjectIntoURL: () => void;
    processTextInputForQueryObject: (text: string) => void;
    markShortcutAsCompletedInQueryObject: () => void;
}

const QueryContext = createContext<QueryContextType>({
    queryObject: { raw_string: '', query: '', shortcut: null, in_address_bar: false, from_address_bar: false },
    setQueryObjectIntoURL: () => { },
    processTextInputForQueryObject: () => { },
    markShortcutAsCompletedInQueryObject: () => { },
});

const trimTrailingSlashAndUpdateFlag = (
    queryString: string, 
    updateFlagSearchInitiated: (value: boolean) => void
): string => {
    // Single trailing forward slashes are used to override
    // `initiateSearchImmediately` through updating `flagSearchInitiated` to true.
    if (queryString.endsWith("/") && !queryString.endsWith("//")) {
        // Update the search initiated block flag if a single trailing slash is found
        updateFlagSearchInitiated(true);
        return queryString.slice(0, -1); 
    } else {
        return queryString;
    }
};

export const useQueryContext = () => useContext(QueryContext);

export const QueryProvider = ({ children }: { children: ReactNode }) => {
    const { updateURLQueryParams, urlShortcut, urlQuery } = useAddressContext();
    const { getShortcutFromQuery } = useShortcutContext(); 
    const {updateFlagSearchInitiated} = useStorageContext();



    const [queryObject, setQueryObject] = useState<Query>({
        raw_string: '',
        query: '',
        shortcut: null,
        in_address_bar: false,
        from_address_bar: false,
    });
    
    // Ref to track the first run of the useEffect
    const hasRunInitialQueryConstructionRef = useRef(false);

    useEffect(() => {
        if (!hasRunInitialQueryConstructionRef.current) {
            let initialRawQuery = urlQuery;
            let initialQuery = urlQuery;
            const initialShortcut = getShortcutFromQuery(urlQuery) || 
                                    urlShortcut ? getShortcutFromQuery(`/${urlShortcut}`) : null;
            
            if (initialRawQuery || initialShortcut) {
                if (initialRawQuery) {
                    initialRawQuery = trimTrailingSlashAndUpdateFlag(
                        initialRawQuery, 
                        updateFlagSearchInitiated
                    );
                }
                if (initialShortcut) {
                    initialQuery = initialRawQuery.replace(`/${initialShortcut.name}`, '').trim();
                }

                if (initialRawQuery && initialShortcut) {
                    initialRawQuery = `${initialRawQuery} /${initialShortcut.name}`;
                }
                
                setQueryObject({
                    raw_string: initialRawQuery,
                    query: initialQuery,
                    shortcut: initialShortcut,
                    in_address_bar: true,
                    from_address_bar: true,
                });
            }
            hasRunInitialQueryConstructionRef.current = true;
        }
        }, [urlQuery, urlShortcut, getShortcutFromQuery, updateFlagSearchInitiated]);
    
    const warnAboutBackslash = (rawString: string) => {
        if (rawString.includes('\\')) {
            alert('Did you mean to use a backslash? Searchjunct search shortcuts use a forward slash.');
        }
    };

    useEffect(() => {
        warnAboutBackslash(queryObject.raw_string);
    }, [queryObject]);



    const processTextInputForQueryObject = (text: string) => {
        let query = text;
        const shortcut = getShortcutFromQuery(text);
        if (shortcut) {
            query = text.replace(`/${shortcut.name}`, '').trim();
            if (query === queryObject.query && shortcut.name && queryObject.shortcut && queryObject.shortcut.completed && shortcut.name === queryObject.shortcut.name) {
                return;
            }
        }
        
        console.log("here", query, queryObject.query, shortcut, queryObject.shortcut);
        if (query !== queryObject.query || shortcut !== queryObject.shortcut) {
            setQueryObject(q => ({ ...q, raw_string: text, query, shortcut, from_address_bar: false }));
            if (shortcut) {
                updateURLQueryParams([{ urlParam: 'shortcut', value: shortcut.name }]);
                setQueryObject(q => ({ ...q, in_address_bar: true }));
            }
        }
    };

    const setQueryObjectIntoURL = () => {
        if (!queryObject.shortcut) {
            updateURLQueryParams([{ urlParam: 'q', value: queryObject.query }]);
            return;
        }
        updateURLQueryParams([
            { urlParam: 'q', value: queryObject.query },
            { urlParam: 'shortcut', value: queryObject.shortcut.name }
        ]);
        setQueryObject({...queryObject, in_address_bar: true});
    }

    const markShortcutAsCompletedInQueryObject = () => {
        if (!queryObject.shortcut) return;
        const shortcut = queryObject.shortcut;
        setQueryObject(q => ({
            ...q,
            shortcut: {
                completed: true,
                type: shortcut.type,
                name: shortcut.name,
                action: shortcut.action
            }
        }));
    }

    return (
        <QueryContext.Provider value={{ queryObject, setQueryObjectIntoURL, processTextInputForQueryObject, markShortcutAsCompletedInQueryObject }}>
            {children}
        </QueryContext.Provider>
    );
};