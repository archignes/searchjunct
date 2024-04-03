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
    SortProvider,
    AddressProvider,
    ShortcutProvider
} from '../src/contexts/';
import { AppProps } from 'next/app';
import { StrictMode } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StrictMode>
            <AddressProvider>
            <StorageProvider>
                <AppProvider>
                    <SystemsProvider>
                        <SortProvider>
                            <SystemSearchProvider>
                                <SystemToggleProvider>
                                    <SystemExpansionProvider>
                                        <ShortcutProvider>
                                        <QueryProvider>
                                            <SearchProvider>
                                                <Component {...pageProps} />
                                            </SearchProvider>
                                        </QueryProvider>
                                            </ShortcutProvider>
                                    </SystemExpansionProvider>
                                </SystemToggleProvider>
                            </SystemSearchProvider>
                        </SortProvider>
                    </SystemsProvider>
                </AppProvider>
            </StorageProvider>
            </AddressProvider>
        </StrictMode>
    );
}

export default MyApp;