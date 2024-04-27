import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { useSearchContext, useQueryContext, useSystemsContext } from '../contexts/';
import { Query, System } from '../types';

const SearchBar: React.FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { submitSearch } = useSearchContext();
  const { activeSystem } = useSystemsContext();
  const { queryObject, processTextInputForQueryObject } = useQueryContext();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleKeySkipbackHotkey = (e: KeyboardEvent) => {
      if (document.activeElement && (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        if (e.altKey && e.shiftKey) {
          submitSearch({ skip: "skipback" });
          console.log("Hotkey: Alt/Option+Shift pressed.");
        }
      }
    };

    window.addEventListener('keydown', handleKeySkipbackHotkey);
    return () => window.removeEventListener('keydown', handleKeySkipbackHotkey);
  }, [submitSearch]);

  const hasFocusedRef = useRef(false);
  useEffect(() => {
    if (textareaRef.current && !hasFocusedRef.current) {
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
      <div className="w-full justify-center items-center flex flex-wrap space-x-2">
        <form ref={formRef} className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center search-bar no-link" role="search" aria-label="Website Search" id="search-form" onSubmit={onSearchSubmit}>
          <div className="flex-1 w-full sm:w-auto">
            <Textarea ref={textareaRef} id="search-input" className={`text-base w-full`} rows={1} placeholder="Type your query here..." value={queryObject.rawString} onChange={(e) => processTextInputForQueryObject(e.target.value)} onKeyDown={(e) => handleKeyDown(e, formRef, submitSearch)} />
          </div>
          <div className="w-3/4 sm:w-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button id="search-button" variant="outline" className="w-full md:w-auto p-1 hover:bg-blue-100" type="submit" aria-label="Submit Search">
                    <Image src="/searchjunct.svg" alt="Searchjunct Logo" width={30} height={30} />
                    <span className="sm:hidden font-semi-bold text-gray-700">Submit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-base">{tooltipContent(queryObject.shortcut, activeSystem?.name)}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;

function handleKeyDown(e: React.KeyboardEvent, formRef: React.RefObject<HTMLFormElement>, submitSearch: Function) {
  if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); // Directly trigger form submission
  } else if (e.key === 'Enter' && e.altKey && !e.shiftKey) {
    e.preventDefault();
    console.log("Hotkey: Alt/Option+Enter pressed.");
    submitSearch({ skip: "skip" });
  }
}

function tooltipContent(shortcut: Query['shortcut'], systemName: System['name'] | undefined) {
  if (shortcut) {
    return shortcut.type === "multisearch_number" ? `Search the next ${shortcut.name} systems` : `Search /${shortcut.name}`;
  } else {
    return `Search ${systemName}`;
  }
}