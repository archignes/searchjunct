import React from 'react'; 
import '../src/styles/globals.css';
import { StorageProvider,
    AppProvider,
    SystemsProvider,
    QueryProvider,
    SearchProvider,
    SystemExpansionProvider,
    SystemToggleProvider,
    SystemSearchProvider,
    SortProvider
} from '../src/contexts/';
import { AppProps } from 'next/app';
import { StrictMode } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StrictMode>
            <StorageProvider>
                <AppProvider>
                    <SystemsProvider>
                        <SortProvider>
                            <SystemSearchProvider>
                                <SystemToggleProvider>
                                    <SystemExpansionProvider>
                                        <QueryProvider>
                                            <SearchProvider>
                                                <Component {...pageProps} />
                                            </SearchProvider>
                                        </QueryProvider>
                                    </SystemExpansionProvider>
                                </SystemToggleProvider>
                            </SystemSearchProvider>
                        </SortProvider>
                    </SystemsProvider>
                </AppProvider>
            </StorageProvider>
        </StrictMode>
    );
}

export default MyApp;