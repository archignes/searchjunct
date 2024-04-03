// contexts/AddressContext.tsx
//
// This file defines a context for managing the URL state and related
// parameters such as query, shortcut, and systems. It provides an
// `AddressProvider` component that wraps its children and supplies
// the URL state and functions to update it.

import React, { useContext, createContext, useCallback, useState, ReactNode, useEffect, useRef } from 'react';

interface AddressProviderProps {
    children: ReactNode;
}

interface AddressContextType {
    url: string;
    setURL: (url: string) => void;
    urlQuery: string;
    setURLQuery: (urlQuery: string) => void;
    urlShortcut: string;
    setURLShortcut: (urlShortcut: string) => void;
    urlSystems: string;
    setURLSystems: (urlSystems: string) => void;
    updateURLQueryParams: (params: { urlParam: string; value: string }[]) => void;
    baseURL: string;
    setBaseURL: (baseURL: string) => void;
}

const defaultAddressContext: AddressContextType = {
    url: '',
    setURL: () => { },
    urlQuery: '',
    setURLQuery: () => { },
    urlShortcut: '',
    setURLShortcut: () => { },
    urlSystems: '',
    setURLSystems: () => { },
    updateURLQueryParams: () => { },
    baseURL: '',
    setBaseURL: () => { },
};

const AddressContext = createContext<AddressContextType>(defaultAddressContext);

export const useAddressContext = () => useContext(AddressContext);

export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
    const [url, setURL] = useState<string>(typeof window !== "undefined" ? window.location.href : '');
    
    const [urlQuery, setURLQuery] = useState<string>('');
    const [urlShortcut, setURLShortcut] = useState<string>('');
    const [urlSystems, setURLSystems] = useState<string>('');
    const [baseURL, setBaseURL] = useState<string>(url.split('?')[0]);

    const hasRunInitialURLPullRef = useRef(false);
    if (!hasRunInitialURLPullRef.current && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        setURLQuery(urlParams.get('q') || '');
        setURLShortcut(urlParams.get('shortcut') || '');
        setURLSystems(urlParams.get('systems') || '');       
        hasRunInitialURLPullRef.current = true;
    }     

    const updateURLQueryParams = (params: { urlParam: string; value: string }[]) => {
        if (!url || !url.trim()) {
            console.error("Invalid URL state. Cannot update URL query parameters.");
            return; // Optionally, set a default URL here
        }
        const newURL: URL = new URL(url);
        params.forEach(({ urlParam, value }) => {
            if (value === "") {
                newURL.searchParams.delete(urlParam); // Remove the parameter if the value is empty
            } else {
                newURL.searchParams.set(urlParam, value);
                switch (urlParam) {
                    case 'q':
                        setURLQuery(value);
                        break;
                    case 'shortcut':
                        setURLShortcut(value);
                        break;
                    case 'systems':
                        setURLSystems(value);
                        break;
                    default:
                        console.warn(`Unknown URL parameter: ${urlParam}`);
                }
            }
        });
        setURL(newURL.toString());
    };

    const updateURL = useCallback(() => {
        if (typeof window !== "undefined") {
            window.history.pushState({}, '', url);
        }
    }, [url]);

    useEffect(() => {
        updateURL();    
    }, [url, updateURL]);

    return (
        <AddressContext.Provider value={{
            url,
            setURL,
            urlQuery,
            setURLQuery,
            urlShortcut,
            setURLShortcut,
            urlSystems,
            setURLSystems,
            updateURLQueryParams,
            baseURL,
            setBaseURL
        }}>
            {children}
        </AddressContext.Provider>
    );
};