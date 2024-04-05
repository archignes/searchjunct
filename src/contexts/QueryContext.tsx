// contexts/QueryContext.tsx
//
// This file defines a context for managing the query state across the
// application. It provides a `QueryProvider` component that wraps its
// children and supplies the query state and related functions.

import React, { createContext, useEffect, useRef, useContext, ReactNode, useState, useCallback } from 'react';
import { useAddressContext, useShortcutContext, useStorageContext } from './';
import { Query } from '@/types';

interface QueryContextType {
    queryObject: Query;
    setQueryObjectIntoURL: () => void;
    processTextInputForQueryObject: (text: string) => void;
}

const QueryContext = createContext<QueryContextType>({
    queryObject: { raw_string: '', query: '', shortcut: null, in_address_bar: false, from_address_bar: false },
    setQueryObjectIntoURL: () => { },
    processTextInputForQueryObject: () => { },
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

    const setQueryObjectIntoURL = useCallback(() => {
        if (!queryObject.shortcut) {
            updateURLQueryParams([{ urlParam: 'q', value: queryObject.query }]);
            return;
        }
        updateURLQueryParams([
            { urlParam: 'q', value: queryObject.query },
            { urlParam: 'shortcut', value: queryObject.shortcut.name }
        ]);
        setQueryObject({ ...queryObject, in_address_bar: true });
    }, [queryObject, updateURLQueryParams]);


    useEffect(() => {
        if (!hasRunInitialQueryConstructionRef.current) {
            let initialRawQuery = urlQuery;
            let initialQuery = urlQuery;
            // Attempt to get a shortcut from the URL query
            let initialShortcut = getShortcutFromQuery(urlQuery);
            // If no shortcut is found in the URL query and a URL shortcut exists,
            // try to get a shortcut using the URL shortcut
            if (!initialShortcut && urlShortcut) {
                initialShortcut = getShortcutFromQuery(`/${urlShortcut}`);
            }
            if (initialRawQuery || initialShortcut) {
                if (initialRawQuery) {
                    // update if trailing slash /empty shortcut to block immediate searches
                    initialRawQuery = trimTrailingSlashAndUpdateFlag(
                        initialRawQuery, 
                        updateFlagSearchInitiated
                    );
                }
                if (initialShortcut) {
                    initialQuery = initialRawQuery.replace(`/${initialShortcut.name}`, '').trim();
                }

                if (initialRawQuery && initialShortcut) {
                    initialRawQuery = `${initialQuery} /${initialShortcut.name}`;
                    updateURLQueryParams([
                        { urlParam: 'q', value: queryObject.query },
                        { urlParam: 'shortcut', value: initialShortcut.name }
                    ]);
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
    }, [urlQuery, urlShortcut, queryObject, updateURLQueryParams, getShortcutFromQuery, updateFlagSearchInitiated]);
    
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
            if (query === queryObject.query && shortcut.name && queryObject.shortcut && queryObject.shortcut.name && shortcut.name === queryObject.shortcut.name) {
                return;
            }
        }
        
        if (query !== queryObject.query || shortcut !== queryObject.shortcut) {
            setQueryObject(q => ({ ...q, raw_string: text, query, shortcut, from_address_bar: false }));
            if (shortcut) {
                updateURLQueryParams([{ urlParam: 'shortcut', value: shortcut.name }]);
                setQueryObject(q => ({ ...q, in_address_bar: true }));
            }
        }
    };


    return (
        <QueryContext.Provider value={{ queryObject, setQueryObjectIntoURL, processTextInputForQueryObject }}>
            {children}
        </QueryContext.Provider>
    );
};