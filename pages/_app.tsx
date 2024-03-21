import React from 'react'; 
import '../src/styles/globals.css';
import { StorageProvider } from '../src/components/contexts/StorageContext';
import { AppProvider } from '../src/components/contexts/AppContext';
import { SystemProvider } from '../src/components/contexts/SystemsContext';
import { SearchProvider } from '../src/components/contexts/SearchContext';
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