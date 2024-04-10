// InfoCard.tsx

import React from 'react';

import {
  Card,
  CardContent,
  CardTitle,
} from '../ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"
import { ScrollArea } from "../ui/scroll-area"

import HotkeyCard from "../cards/Info/Hotkey"
import PrivacyCard from "../cards/Info/Privacy"
import SetupCard from "../cards/Info/Setup"
import AboutCard from "../cards/Info/About"


const InfoCard: React.FC = () => {
  
  return (
    <Card className='rounded-md bg-white shadow-none mx-auto'>
      <CardTitle className='text-left pl-2 py-1 mb-2'>Info</CardTitle>
      <CardContent className="p-0 flex justify-center items-center flex-col">
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