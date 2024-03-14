// SystemList.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

const InfoCard: React.FC = () => {

  return (
    <>
      <Card className='w-9/10 sm:w-2/3 sm:mx-auto md:w-3/7 lg:w-2/5 xl:w-1/4" rounded-md mx-auto'>
      <CardContent className='pb-0'>
        <CardHeader>
          <CardTitle className="text-2xl">Info</CardTitle>
        </CardHeader>
      </CardContent>
        <Card className='w-9/10" border-none shadow-none mx-auto'>
          <CardContent >
            <CardHeader className='pt-0 mt-0'>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardDescription>
            </CardDescription>
            <div className="space-y-4">
              <p>
                SearchJunct is a single-page application designed to facilitate multi-engine search selection and routing. This tool serves as a speculative or exploratory design prototype, providing a platform for wondering, particularly around user interaction with multiple search engines and finding & supporting better tools and practices.
              </p>
              <p>
                Usage: Type a query into the search-bar. Then either hover over or click the SearchJunct search button, press Enter, or click a search system button to initiate a search. The query will be sent to the selected or next search system and search results will open in a new tab.
              </p>
              <p>
                The action container includes special action buttons to: Reshuffle the order of the search system buttons.
              </p>
              <p>Note: The query for some systems will have to be manually pasted because they does not support search-by-URL.</p>
              <p>
                Team: SearchJunct is actively developed by Daniel Griffin. You can email him with any questions, suggestions, or concerns or start an issue on Github.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className='w-9/10" border-none shadow-none mx-auto'>
          <CardContent >
            <CardHeader className='pt-0 mt-0'>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardDescription>
            </CardDescription>
            <div className="space-y-4">
              <p>
                SearchJunct runs locally on your browser and only sends queries to the selected search engines when a search is initiated. It also saves your search history to an IndexedDB setup in your browser for your convenience. Please note that currently, history can only be deleted individually unless you are familiar with JavaScript or access the Developer Tools to do it yourself. This application is under active development, and future updates will include options to block certain search systems and to search and delete history in bulk.
              </p>
              <p>Data Collection: SearchJunct only collects data locally in your browser. This data is stored in an IndexedDB database called "SearchJunctDB".</p>
              <p>Data Usage: The collected data is used locally to enhance your user experience, such as remembering your search history. In the future, we may introduce an option to share anonymous usage data to help us improve SearchJunct.</p>
              <p>Data Sharing: Your data is stored locally on your device and is not shared with any third parties outside of actions you take. When you initiate a search, your query is sent to the selected search engine, but no other information is shared.</p>
              <p>Cookies: SearchJunct currently does not use cookies. However, in the future, we may use cookies to remember your preferences and provide a more personalized experience.</p>
              <p>User Control: You have full control over your data. You can view, delete, or export your search history at any time. Please note that currently, history can only be deleted individually unless you are familiar with JavaScript or access the Developer Tools to do it yourself. Currently, export also requires such technical familiarity (please contact us for support).</p>
              <p>Policy Updates: We will notify you of any significant changes to this privacy policy. Please check this section regularly for updates.</p>
            </div>
          </CardContent>
        </Card>
        <Card className='w-9/10" border-none shadow-none mx-auto'>
          <CardContent >
            <CardHeader className='pt-0 mt-0'>
              <CardTitle>Shortcut Help</CardTitle>
            </CardHeader>
            <CardDescription>
            </CardDescription>

              <div className="space-y-4">
              <p>
                You can use Tab and Enter to jump to the next special-action-button and search-system-button and interact with it. Using this tool may require switching often between tabs (as the links open in new tabs by default). You can switch between tabs with Cmd+Option and left/right arrows. Or you can use Cmd+Shift+A.
              </p>
              <p>
                Note: The tabs for SearchJunct will be labeled by the query, with square bracket notation: [search query]. As this is rare you can likely simply type an opening bracket ([) to find all the SearchJunct tabs.
              </p>
              </div>
          </CardContent>
        </Card>
    </Card>

    </>
  );
};

export default InfoCard;