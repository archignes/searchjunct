// InfoCard.tsx

import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../shadcn-ui/card';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../shadcn-ui/tabs"
import { ScrollArea } from "../../shadcn-ui/scroll-area"

import HotkeyCard from "./Hotkey"
import PrivacyCard from "./Privacy"
import SetupCard from "./Setup"
import AboutCard from "./About"


const InfoCard: React.FC = () => {
  
  return (
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="about">About</TabsTrigger>
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="privacy">Privacy</TabsTrigger>
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="setup">Setup</TabsTrigger>
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="hotkeys">Hotkeys</TabsTrigger>
          </TabsList>
          <ScrollArea style={{ height: `calc(100vh - 260px)` }} className="p-4">
          <TabsContent value="about">
            <AboutCard/>
          </TabsContent>
          <TabsContent value="privacy">
            <PrivacyCard/>
          </TabsContent>
            <TabsContent value="setup">
              <SetupCard/>
            </TabsContent>
            <TabsContent value="hotkeys">
              <HotkeyCard/>
        </TabsContent>
          </ScrollArea>
        </Tabs>
        
    </Card>
  );
};

export default InfoCard;