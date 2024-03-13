// pages/index.tsx
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image'
import { Textarea } from '../src/components/ui/textarea'
import { Button } from '../src/components/ui/button'

import { useSearch } from '../src/components/SearchContext';
import { useStorage } from '../src/components/StorageContext';
import { useSystemsContext } from '../src/components/SystemsContext';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import Toolbar from "../src/components/Toolbar";
import SystemList from "../src/components/SystemsList";


const title = "Searchjunct"
const description = "Search."
const url = process.env.NEXT_PUBLIC_DOMAIN;
const image = `${url}/screenshots/home.png`;

const HomePage = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { handleSearch, query, setQuery } = useSearch();
  const { systemsCurrentOrder } = useSystemsContext();
  const router = useRouter();
  const { systemsSearched, initiateSearchImmediately, searchInitiatedBlock, updateSearchInitiatedBlock } = useStorage();
  const initiateSearchImmediatelyRef = useRef(initiateSearchImmediately);
  initiateSearchImmediatelyRef.current = initiateSearchImmediately;

  useEffect(() => {
    const searchQuery = router.query.q;  
    if (searchQuery && typeof searchQuery === 'string') {
      console.log('searchQuery via URL: ', searchQuery);
      setQuery(searchQuery);
     
      // Use sessionStorage to check if a search has been initiated in the current session
      const searchInitiatedBlocInSession = searchInitiatedBlock
      console.log("searchInitiatedBlocInSession: ", searchInitiatedBlocInSession);
      console.log("initiateSearchImmediatelyRef.current: ", initiateSearchImmediatelyRef.current);
      if (initiateSearchImmediatelyRef.current && !searchInitiatedBlocInSession) {
        const firstUnsearchedSystem = systemsCurrentOrder.find(system => !systemsSearched[system.id]);
        if (firstUnsearchedSystem) {
          handleSearch(firstUnsearchedSystem, searchQuery);
          updateSearchInitiatedBlock(true);
        }
      }
    }
  }, [router.query.q, setQuery, systemsCurrentOrder, handleSearch, systemsSearched, textareaRef, searchInitiatedBlock, updateSearchInitiatedBlock]);
  
  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Move the cursor to the end of the text
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/searchjunct.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* <!-- HTML Meta Tags --> */}
        <meta name="description" content={description} />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />
      <div className="mx-1 w-9/10 sm:w-2/3 sm:mx-auto md:w-3/7 lg:w-2/5 xl:w-1/4">
      <div className="flex justify-center items-center space-x-2">
        <div className="search-box-container w-full mx-1 justify-center items-center flex flex-wrap space-x-2">
            <form className="flex space-x-2 w-full items-center input-group justify-center search-bar no-link"
            role="search"
            aria-label="Website Search"
            id="search-form"
              onSubmit={onSearchSubmit}>
              <Textarea
                ref={textareaRef} // Step 4: Attach the ref to the Textarea component
                id="autoresizing-textarea"
                className="mx-auto"
                rows={1}
                placeholder="Type your query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // Prevent the default action to avoid inserting a new line
                    onSearchSubmit(e); // Programmatically submit the form
                  }
                }}
              ></Textarea>
            <Button variant="outline" className="p-1" type="submit" aria-label="Submit Search">
                <Image
                  id="magnifying-glass-logo-search"
                  src="/searchjunct.svg"
                  alt="Searchjunct Logo"
                  width={30}
                  height={30}
                />
            </Button>
          </form>
        </div>
      </div>
      <Toolbar />
      <SystemList />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;