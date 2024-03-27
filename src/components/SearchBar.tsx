import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Textarea } from './shadcn-ui/textarea';
import { Button } from './shadcn-ui/button';

import { useSearch } from './contexts/SearchContext';
import { useStorage } from './contexts/StorageContext';
import { useSystemsContext } from './contexts/SystemsContext';


const SearchBar = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { handleSearch, query, setQuery } = useSearch();
  const { systemsCurrentOrder } = useSystemsContext();
  const router = useRouter();
  const { systemsSearched, initiateSearchImmediately, searchInitiatedBlock, updateSearchInitiatedBlock } = useStorage();
  const initiateSearchImmediatelyRef = useRef(initiateSearchImmediately);
  initiateSearchImmediatelyRef.current = initiateSearchImmediately;

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const searchQuery = router.query.q;
    if (searchQuery && typeof searchQuery === 'string' && !query) {
      console.log('searchQuery via URL: ', searchQuery);
      setQuery(searchQuery);

      // Use sessionStorage to check if a search has been initiated in the current session
      const searchInitiatedBlocInSession = searchInitiatedBlock
      if (initiateSearchImmediatelyRef.current && !searchInitiatedBlocInSession) {
        const firstUnsearchedSystem = systemsCurrentOrder.find(system => !systemsSearched[system.id]);
        if (firstUnsearchedSystem) {
          handleSearch(firstUnsearchedSystem, searchQuery);
          updateSearchInitiatedBlock(true);
        }
      }
    }
  }, [query, router.query.q, setQuery, systemsCurrentOrder, handleSearch, systemsSearched, textareaRef, searchInitiatedBlock, updateSearchInitiatedBlock]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Move the cursor to the end of the text
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  const onSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  }, [handleSearch]);

  

  return (
    <div id="search-bar" className="flex justify-center items-center space-x-2">
      <div className="w-full mx-1 justify-center items-center flex flex-wrap space-x-2">
        <form ref={formRef}
          className="flex
    flex-col sm:flex-row // This makes items stack vertically by default, and horizontally on small screens and up
    gap-2 // Adds a gap between items
    w-full
    items-center
    justify-center
    search-bar
    no-link"
          role="search"
          aria-label="Website Search"
          id="search-form"
          onSubmit={onSearchSubmit}>
          <div className="flex-1 w-full sm:w-auto">
            <Textarea
              ref={textareaRef}
              id="search-input"
              className="text-base w-full"
              rows={1}
              placeholder="Type your query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !(e.altKey)) {
                  e.preventDefault();
                  console.log("normal enter detected...")
                  formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); // Directly trigger form submission
                } else if (e.key === 'Enter' && e.altKey && ! e.shiftKey) {
                  e.preventDefault();
                  // Logic to skip the next active search engine and execute a search on the subsequent one
                  // This is a placeholder for the actual logic you need to implement based on how your search engines are managed
                  console.log("Hotkey: Alt/Option+Enter pressed.");
                  handleSearch(undefined, undefined, "skip");
                } else if (e.altKey && e.shiftKey) {
                  handleSearch(undefined, undefined, "skipback");
                  console.log("Hotkey: Alt/Option+Shift pressed.");
                }
              }}
            ></Textarea>
          </div>
          <div className="w-3/4 sm:w-auto">
            <Button id="search-button" variant="outline"
              className="w-full md:w-auto p-1 hover:bg-blue-100" type="submit" aria-label="Submit Search">
              <Image
                id="magnifying-glass-logo-search"
                src="/searchjunct.svg"
                alt="Searchjunct Logo"
                width={30}
                height={30}
              />
              <span className="sm:hidden font-semi-bold text-gray-700">Submit</span>
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};


export default SearchBar;

