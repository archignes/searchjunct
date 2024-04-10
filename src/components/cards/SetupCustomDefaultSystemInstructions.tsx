// InfoCard.tsx

import React from 'react';

import { useSearchContext } from '../../contexts/SearchContext';
import { System } from "../../types/system";

interface SetupCustomDefaultSystemInstructionsProps {
  system: System;
}


const SetupCustomDefaultSystemInstructions: React.FC<SetupCustomDefaultSystemInstructionsProps> = ({ system }: { system: System }) => {
  const { getPreppedSearchLink } = useSearchContext();

  
  const searchJunctSearchLink = getPreppedSearchLink({ system, query: "What is Searchjunct.com?" });

  return (
    <div className='w-90% mx-auto'>
      <p>The search link contains a <code>%s</code> placeholder.</p>
      <p>You can use this link to add this system as a default or custom search engine in your browser or to dynamically create search links.</p>
      <ul className="list-disc pl-5">
        <li><a className="underline hover:bg-blue-100 p-1 rounded-md" href="https://support.brave.com/hc/en-us/articles/360017479752-How-do-I-set-my-default-search-engine" target="_blank" rel="noopener noreferrer">Brave</a></li>
        <li><a className="underline hover:bg-blue-100 p-1 rounded-md" href="https://support.google.com/chrome/answer/95426" target="_blank" rel="noopener noreferrer">Chrome</a></li>
        <li><a className="underline hover:bg-blue-100 p-1 rounded-md" href="https://support.microsoft.com/en-us/microsoft-edge/change-your-default-search-engine-in-microsoft-edge-cccaf51c-a4df-a43e-8036-d4d2c527a791" target="_blank" rel="noopener noreferrer">Edge</a></li>
        <li><a className="underline hover:bg-blue-100 p-1 rounded-md" href="https://support.mozilla.org/en-US/kb/change-your-default-search-settings-firefox" target="_blank" rel="noopener noreferrer">Firefox</a></li>
        <li><a className="underline hover:bg-blue-100 p-1 rounded-md" href="https://help.opera.com/en/latest/search/" target="_blank" rel="noopener noreferrer">Opera</a></li>
      </ul>
      <br></br>
      <p>Here is an example search where the query fills in for the <code>%s</code> placeholder:</p>
      <p className="text-center"><a className="text-xs hover:bg-blue-100 p-1 rounded-md" href={searchJunctSearchLink} target="_blank" rel="noopener noreferrer">{searchJunctSearchLink}</a></p>
      <p className="pt-1">You can create links like that with a scripting language or you can copy and share such links from this system via the address bar.</p>
    </div>
  );
};

export default SetupCustomDefaultSystemInstructions;