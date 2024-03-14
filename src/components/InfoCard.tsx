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
                Type a query into the search bar. Then either click the SearchJunct search button, press Enter, or click a search system button in the systems list to initiate a search. The query will be sent to the selected or next search system and search results will open in a new tab. Once you have conducted a search with a system, its search button will change color.
              </p>
              <p>
                The toolbar includes special action buttons to:
                - Shuffle the order of the search system buttons.
                - Sort the systems alphabetically, or with a custom sort.
                - Refresh the systems list (removing the .searched attribute from the systems).
                - Open this Info modal.
                - Open the Settings modal.
              </p>
              <p>Note: The query for some systems will have to be manually pasted because they does not support search-by-URL. The query will be added to your clipboard when you click the search button.</p>
              <p>
                Team: SearchJunct is actively developed by Daniel Griffin. You can email him at daniel.griffin@berkeley.edu or reach him on [Twitter](https://twitter.com/danielsgriffin) with any questions, suggestions, or concerns or start an issue on [Github](https://github.com/danielsgriffin/searchjunct).
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
                SearchJunct runs locally on your browser and only sends queries to the selected search engines when a search is initiated. This application is under active development.
              </p>
              <p>
                Data Collection: SearchJunct only collects data locally in your browser. Data is saved to your browser's session storage and local storage. You can inspect this through your browser's developer tools or in the code. The code that handles storage can be found in the [StorageContext.tsx](https://github.com/danielsgriffin/searchjunct/blob/main/src/components/StorageContext.tsx) file in the open source code.</p>                
              <p>
                Data Usage: The collected data is used locally to enhance your user experience, enabling custom sorting of the search systems, and disabling or deleting systems.</p>
              <p>
                Data Sharing: Your data is stored locally on your device and is not shared with any third parties outside of actions you take. When you initiate a search, your query is sent to the selected search engine, but no other information is shared.</p>
              <p>
                Cookies: SearchJunct currently does not use cookies.</p>
              <p>
                User Control: You have full control over your data. You can view, delete, or export your search history at any time through the website.</p>
              <p>
                Policy Updates: We will notify you here of any significant changes to this privacy policy. Please check this section regularly for updates.</p>
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
                You can use Tab and Enter to jump to the next toolbar buttons and search system buttons and interact with them. Using this tool may require switching often between tabs (as the links open in new tabs by default). You can switch between tabs with Cmd+Option and left/right arrows. Or you can use Cmd+Shift+A and your up/down arrows.
              </p>
              </div>
          </CardContent>
        </Card>
    </Card>

    </>
  );
};

export default InfoCard;