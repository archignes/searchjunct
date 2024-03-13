import React from 'react'; 
import '../src/styles/globals.css';
import { StorageProvider } from '../src/components/StorageContext';
import { SystemProvider } from '../src/components/SystemsContext';
import { SearchProvider } from '../src/components/SearchContext';
import { AppProps } from 'next/app';
import { StrictMode } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StrictMode>
            <StorageProvider>
                <SystemProvider>
                    <SearchProvider>
                        <Component {...pageProps} />
                    </SearchProvider>
                </SystemProvider>       
            </StorageProvider>
        </StrictMode>
    );
}

export default MyApp;