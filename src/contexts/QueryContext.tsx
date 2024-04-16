// contexts/QueryContext.tsx
//
// This file defines a context for managing the query state across the
// application. It provides a `QueryProvider` component that wraps its
// children and supplies the query state and related functions.

import React, { createContext, useEffect, useRef, useContext, ReactNode, useState, useCallback } from 'react';
import { useAddressContext, useShortcutContext, useStorageContext, useSystemsContext } from './';
import { Query } from '@/types';

interface QueryContextType {
    queryObject: Query;
    setQueryObjectIntoURL: () => void;
    processTextInputForQueryObject: (text: string) => void;
}

const QueryContext = createContext<QueryContextType>({
    queryObject: { rawString: '', query: '', shortcut: null, in_address_bar: false, from_address_bar: false },
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
    const { systemShortcutCandidates, resetSystemShortcutCandidates} = useSystemsContext();


    const [queryObject, setQueryObject] = useState<Query>({
        rawString: '',
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
        if (['completion_shortcut', 'unsupported'].includes(queryObject.shortcut.type)) {
            console.log('setting query object into url');
            updateURLQueryParams([
                { urlParam: 'q', value: queryObject.query },
            ]);
        } else {
        updateURLQueryParams([
            { urlParam: 'q', value: queryObject.query },
            { urlParam: 'shortcut', value: queryObject.shortcut.name }
            ]);
        }
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
                    rawString: initialRawQuery,
                    query: initialQuery,
                    shortcut: initialShortcut,
                    in_address_bar: true,
                    from_address_bar: true,
                });
            }
            hasRunInitialQueryConstructionRef.current = true;
        }
    }, [urlQuery, urlShortcut, queryObject, updateURLQueryParams, getShortcutFromQuery, updateFlagSearchInitiated]);
    

    const processTextInputForQueryObject = (text: string) => {
        let query = text;
        const shortcut = getShortcutFromQuery(text);
        if (shortcut) {
            query = text.replace(`/${shortcut.name}`, '').trim();
        }

        if (query !== queryObject.query || shortcut !== queryObject.shortcut) {
            setQueryObject(q => ({ ...q, rawString: text, query, shortcut, from_address_bar: false }));
            if (shortcut) {
                if (['completion_shortcut', 'unsupported'].includes(shortcut.type)) {
                } else {
                    updateURLQueryParams([{ urlParam: 'shortcut', value: shortcut.name }]);
                }
                setQueryObject(q => ({ ...q, in_address_bar: true }));
            }
        }
    };



    useEffect(() => {
        if (!queryObject.shortcut && Object.keys(systemShortcutCandidates).length > 0) {
            resetSystemShortcutCandidates();
        }
    }, [queryObject.shortcut, resetSystemShortcutCandidates, systemShortcutCandidates]);


    return (
        <QueryContext.Provider value={{ queryObject, setQueryObjectIntoURL, processTextInputForQueryObject }}>
            {children}
        </QueryContext.Provider>
    );
};