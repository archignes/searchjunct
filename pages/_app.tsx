import React from 'react'; 
import '../src/styles/globals.css';
import { StorageProvider } from '../src/components/StorageContext';
import { AppProvider } from '../src/components/AppContext';
import { SystemProvider } from '../src/components/SystemsContext';
import { SearchProvider } from '../src/components/SearchContext';
import { AppProps } from 'next/app';
import { StrictMode } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StrictMode>
            <StorageProvider>
                <AppProvider>
                    <SystemProvider>
                        <SearchProvider>
                            <Component {...pageProps} />
                        </SearchProvider>
                    </SystemProvider>   
                </AppProvider>    
            </StorageProvider>
        </StrictMode>
    );
}

export default MyApp;