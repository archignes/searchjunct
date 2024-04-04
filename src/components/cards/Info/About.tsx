// Info_About.tsx

import React from 'react';

import {
  Card,
  CardContent,
} from '../../ui/card';
import { Share2Icon, GearIcon, QuestionMarkIcon, ReloadIcon, StarIcon, StarFilledIcon, ChevronDownIcon, ShuffleIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';



const AboutCard: React.FC = () => {
  return (
    <>
      <Card className='w-9/10 border-none shadow-none mx-auto'>
        <CardContent >
          <div className="space-y-4">
            <p>
              Searchjunct is a single-page application designed to facilitate multi-engine search selection and routing. This tool serves as a speculative or exploratory design prototype, providing a platform for wondering, particularly around user interaction with multiple search engines and finding & supporting better tools and practices.
            </p>
            <h3>Searchbar</h3>
            <p className="pl-4">
              Type a query into the searchbar. Then either click the Searchjunct search button, press Enter, or click a search system button in the systems list to initiate a search. The query will be sent to the selected or next search system and search results will open in a new tab. Once you have conducted a search with a system, its search button will change color. You can continue to click enter to conduct searches with the same query on the next available system on the list.
            </p>
            <h3>Toolbar</h3>
            <p className="pl-4">
              The toolbar includes special action buttons to:</p>
            <div className="pl-8 grid grid-cols-[1fr_8fr]">
              <ShuffleIcon className="inline mt-1 mr-1" /><span>Shuffle the order of the search system buttons.</span>
              <ChevronDownIcon className="inline mt-1 mr-1" /><span>Expand the search system cards to learn more about each one.</span>
              <StarIcon className="inline mt-1 mr-1" /><span>Return to your custom sort. It will be a filled star (<StarFilledIcon className="inline" />) if you are already in your custom sort, and it will be in gray if you do not have a custom sort defined.</span>
              <ReloadIcon className="inline mt-1 mr-1" /><span>Refresh the systems list (removing the .searched attribute from the systems).</span>
              <QuestionMarkIcon className="inline mt-1 mr-1" /><span>Open this Info modal.</span>
              <GearIcon className="inline mt-1 mr-1" /><span>Open the Settings modal.</span>
              <Share2Icon className="inline mt-1 mr-1" /><span>Open the Share model and copy the current URL.</span>
            </div>
            <p></p>
            <h3>Search System Buttons</h3>
            <p className="pl-4">
              The search systems buttons are presented randomly on load in the systems list. You can change settings to have the buttons custom sorted on page load. You can click the button to run a search. Use the drag handle (<DragHandleDots2Icon className="inline" />) to change the sort (moving the buttons up or down), this automatically creates a custom sort for you. You can click the downward-chevron (<ChevronDownIcon className="inline" />) to individually expand the buttons to reveal the system cards.</p>
            <h3>Search System Cards</h3>
            <p className="pl-4">
              The search system cards contain information about the search system, including the system ID within Searchjunct, the search link, notes about account requirements, and a link to the search system's Wikipedia, Twitter (X), GitHub, Discord, or LinkedIn pages (if known and relevant). The system card also has two buttons to Delete the system (which removes it from the search list——Note: you can restore in Settings) or Disable it (marking it in orange and removing it from the active search interactions)</p>
            <p className="pl-4">
              Note: The query for some systems will have to be manually pasted because they does not support search-by-URL. The query will be added to your clipboard when you click the search button.</p>
            <p>
              Team: Searchjunct is actively developed by Daniel Griffin. For inquiries, suggestions, or concerns, please email daniel.griffin@berkeley.edu, reach out on <a href="https://twitter.com/danielsgriffin" target="_blank" rel="noopener noreferrer">Twitter</a>, or start an issue on <a href="https://github.com/danielsgriffin/searchjunct" target="_blank" rel="noopener noreferrer">Github</a>.
            </p>
          </div>
        </CardContent>
      </Card>

    </>
  );
};

export default AboutCard;

