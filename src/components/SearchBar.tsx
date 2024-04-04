// SearchBar.tsx
//
// This component represents the search bar in the application. It
// includes a form with a textarea for entering the search query and
// a submit button. It utilizes various contexts to handle search
// functionality and state management.

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

import {
  useSearchContext,
  useQueryContext
} from '../contexts/';

const SearchBar = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { submitSearch } = useSearchContext();
  const { queryObject, processTextInputForQueryObject } = useQueryContext();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleKeySkipbackHotkey = (e: KeyboardEvent) => {
      // Check if the focus is not on an input or textarea
      if (document.activeElement && (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        if (e.altKey && e.shiftKey) {
          submitSearch({ skip: "skipback" });
          console.log("Hotkey: Alt/Option+Shift pressed.");
        }
      }
    };

    // Attach the event listener to the window object
      window.addEventListener('keydown', handleKeySkipbackHotkey);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeySkipbackHotkey);
    };
  }, [submitSearch]);

  const hasFocusedRef = useRef(false);

  useEffect(() => {
    if (!hasFocusedRef.current && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
      hasFocusedRef.current = true;
    }
  }, []);

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitSearch({});
  };

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
              value={queryObject.raw_string}
              onChange={(e) => processTextInputForQueryObject(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !(e.altKey)) {
                  e.preventDefault();
                  console.log("normal enter detected...")
                  formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); // Directly trigger form submission
                } else if (e.key === 'Enter' && e.altKey && !e.shiftKey) {
                  e.preventDefault();
                  // Logic to skip the next active search engine and execute a search on the subsequent one
                  console.log("Hotkey: Alt/Option+Enter pressed.");
                  submitSearch({ skip: "skip" });
                } }}
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