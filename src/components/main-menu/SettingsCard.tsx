// SettingsCard.tsx

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

import SortCard from './Sort';
import ShortcutsCard from './Shortcuts';
import SystemsSettings from './Systems';
import SearchSettings from './Search';
import SystemItemDraggable from '../systems/DraggableItem';

import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';

export const SettingsItemBox: React.FC<{children: React.ReactNode, label: string}> = ({ children, label }) => {
  return (
    <div className='w-[90%] my-2 mx-auto flex flex-col px-1 space-y-1 border rounded-md shadow-sm'>
      <Label htmlFor="default-custom-mode" className="text-left w-2/3 text-xs text-gray-700">
        {label}
      </Label>

      {children}
      <hr className='w-full bg-gray-200' />
    </div>
  );
};


const SettingsCard: React.FC = () => {
  


  return (
    <Card className='rounded-tl-none rounded-tr-md rounded-br-md rounded-bl-md bg-white shadow-none mx-auto'>
      <div className="w-[320px] sm:w-full">
      <CardTitle className='text-left pl-2 py-1 mb-2'>Settings</CardTitle>
        <CardContent className="p-0 flex items-left flex-col">
          <Tabs defaultValue="search" className="px-0 w-full">
            <TabsList className="grid mx-2 grid-cols-4">
              <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="search">
                Search
              </TabsTrigger>
              <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="systems">Systems</TabsTrigger>
              <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="shortcuts">Shortcuts</TabsTrigger>
              <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="sort">Sort</TabsTrigger>
            </TabsList>
            <ScrollArea style={{ height: `calc(100vh - 260px)` }} className="p-0">
              <TabsContent value="search" className='p-0 m-0'>
               <SearchSettings />
              </TabsContent>
              <TabsContent value="systems" className='p-0 m-0'>
                <SystemsSettings />
              </TabsContent>
              <TabsContent value="shortcuts" className='p-0 m-0'>
                <ShortcutsCard />
              </TabsContent>
              <TabsContent value="sort" className='p-0 m-0'>
                <SortCard />
              </TabsContent>
            </ScrollArea>
            </Tabs>
        </CardContent>
    </div>
    </Card>
    
  );
};

export default SettingsCard;

