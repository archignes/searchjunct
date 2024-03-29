// SettingsCard.tsx

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn-ui/card';
import { ScrollArea } from "../../shadcn-ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shadcn-ui/tabs';
import MainSettingsCard from './Main';

const SettingsCard: React.FC = () => {


  return (
      <Card id="settings-modal" 
      className='w-9/10 sm:w-2/3 sm:mx-auto md:w-3/7 lg:w-2/5 xl:w-1/4" rounded-md mx-auto'>
        <CardContent>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        </CardContent>
          <Tabs defaultValue="main" className="px-1 w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="main">Main</TabsTrigger>
              </TabsList>
            <ScrollArea style={{ height: `calc(100vh - 260px)` }} className="p-4">
              <TabsContent value="main">
                <MainSettingsCard />
              </TabsContent>
            </ScrollArea >
              </Tabs>
      </Card>
      
  );
};

export default SettingsCard;