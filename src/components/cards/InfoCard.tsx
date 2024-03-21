// InfoCard.tsx

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "../shadcn-ui/alert"
import { Button } from "../shadcn-ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../shadcn-ui/card';
import { ChevronDownIcon, DragHandleDots2Icon, ExclamationTriangleIcon, GitHubLogoIcon, QuestionMarkIcon, ReloadIcon, StarIcon, GearIcon, ShuffleIcon, StarFilledIcon, TwitterLogoIcon, Share2Icon } from '@radix-ui/react-icons';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../shadcn-ui/tabs"
import { useStorage } from "../contexts/StorageContext"
import { ScrollArea } from "../shadcn-ui/scroll-area"

const InfoCard: React.FC = () => {
  const { setShowIntroModal } = useStorage();
  
  return (
    <>
      <Card className='w-9/10 sm:w-2/3 sm:mx-auto md:w-3/7 lg:w-2/5 xl:w-1/4" rounded-md mx-auto'>
      <CardContent className='pb-0'>
        <CardHeader className="pt-0">
            <div className="flex text-xs text-gray-500 justify-center pt-1">
              <a href="https://github.com/danielsgriffin/searchjunct" target="_blank" rel="noopener noreferrer" className="flex items-center mr-4 hover:bg-blue-100 p-1 hover:rounded-md">
                <GitHubLogoIcon className="h-4 w-4 inline mr-1" />Github
              </a>
              <a href="https://twitter.com/danielsgriffin" target="_blank" rel="noopener noreferrer" className="flex items-center hover:bg-blue-100 p-1 hover:rounded-md">
                <TwitterLogoIcon className="h-4 w-4 inline mr-1" />Twitter
              </a>
            </div>
          
          <CardTitle className="text-2xl">Info</CardTitle>
          </CardHeader>
          
      </CardContent>
      {/* <div id="show-intro-modal-again" className="flex justify-center">
          <Button variant="outline" className="m-2 hover:bg-blue-100" onClick={() => setShowIntroModal(true)}>Click here to see the intro modal again.</Button>
          </div> */}
          
        <Tabs defaultValue="about" className="px-1 w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="about">About</TabsTrigger>
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="privacy">Privacy</TabsTrigger>
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="hotkeys">Hotkeys</TabsTrigger>
          </TabsList>
          <ScrollArea style={{ height: `calc(100vh - 260px)` }} className="p-4">
          <TabsContent value="about">
        <Card className='w-9/10" border-none shadow-none mx-auto'>
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
                    <ReloadIcon className="inline mt-1 mr-1"/><span>Refresh the systems list (removing the .searched attribute from the systems).</span>
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
          </TabsContent>
          <TabsContent value="privacy">
        <Card className='w-9/10" border-none shadow-none mx-auto'>
          <CardContent >
            <div className="space-y-4">
              <Alert>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Under Active Development!</AlertTitle>
                <AlertDescription>
                  This application is under active development and the guidance provided here is subject to change.
                </AlertDescription>
              </Alert>
              <p>
                Searchjunct runs locally on your browser and sends queries to the selected search engines when a search is initiated.
              </p>
              <p><strong>Note:</strong> If you use URL-based queries, Searchjunct does not currently have a system or process to automatically delete the URLs visited.</p>
              <p>Data Collection: Searchjunct collects data locally in your browser. Data is saved to your browser's session storage and local storage. You can inspect this through your browser's developer tools or in the code. The code that handles storage can be found in the <a href="https://github.com/danielsgriffin/searchjunct/blob/main/src/components/StorageContext.tsx" target="_blank" rel="noopener noreferrer">StorageContext.tsx</a> file in the open source code.</p>                
              <h3>Data Usage</h3>
              <p className="pl-4">
                The collected data is used locally to enhance your user experience, enabling custom sorting of the search systems, and disabling or deleting systems.</p>
              <h3>Data Sharing</h3>
              <p className="pl-4">

                Your data is stored locally on your device and is not shared with any third parties outside of actions you take. When you initiate a search, your query is sent to the selected search engine, but no other information is shared.</p>
              <h3>Cookies</h3>
              <p className="pl-4">

                Searchjunct currently does not use cookies.</p>
              <h3>User Control</h3>
              <p className="pl-4">

                You have full control over your data (outside of URL-based visits). You can view, delete, or export your search history at any time through the website or through your browser's developer tools.</p>
              <h3>Policy Updates</h3>
              <p className="pl-4">
                We will notify you here of any significant changes to this privacy policy. Please check this section regularly for updates.</p>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
          <TabsContent value="hotkeys">
        <Card className='w-9/10" border-none shadow-none mx-auto'>
          <CardContent >
              <div className="space-y-4">
              <p>
                You can use Tab and Enter to jump to the next toolbar buttons and search system buttons and interact with them. Using this tool may require switching often between tabs (as the links open in new tabs by default). You can switch between tabs with Cmd+Option and left/right arrows. Or you can use Cmd+Shift+A and your up/down arrows.
              </p>
              </div>
          </CardContent>
        </Card>
        </TabsContent>
          </ScrollArea>
        </Tabs>
        
    </Card>

    </>
  );
};

export default InfoCard;