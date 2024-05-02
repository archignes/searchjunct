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
import Header from '../src/components/header/Header';
import { FeedbackAction } from '../src/components/FeedbackAction';
import Footer from '../src/components/Footer';
import ViewMultisearchSheet from '../src/components/search/multisearch/MultisearchManagementSheet';

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
                                                <Header {...pageProps} />
                                                <Component {...pageProps} />
                                                <Footer />
                                                <FeedbackAction />
                                                <ViewMultisearchSheet />
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