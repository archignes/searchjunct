import React from 'react';
import { Button } from '@/src/components/ui/button';
import { ChatBubbleIcon, EnvelopeClosedIcon, ExitIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer"


export const FeedbackAction: React.FC = () => {

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-4 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90">
          <ChatBubbleIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-none flex flex-row p-2">
        <DrawerHeader className="flex flex-col">
          <DrawerTitle>Feedback</DrawerTitle>
          <DrawerDescription>Provide feedback.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-1 mt-1">
          <Button variant="outline" className="hover:bg-blue-100" onClick={() => {
            window.open(
              'https://twitter.com/intent/tweet?text=Hey @archignes, I just used Searchjunct.com and...', '_blank');
          }}>
            <EnvelopeClosedIcon className="w-4 h-4 mr-1" />Tweet @archignes</Button>
          <Button variant="outline" className="hover:bg-blue-100" onClick={() => { window.open(
            'mailto:daniel@archignes.com?subject=Feedback on Searchjunct.com', '_blank'); }}>
            <EnvelopeClosedIcon className="w-4 h-4 mr-1" />Email Daniel</Button>
          <Button variant="outline" className="hover:bg-blue-100" onClick={() => { window.open('https://github.com/archignes/searchjunct/issues/new', '_blank'); }}>
            <GitHubLogoIcon className="w-4 h-4 mr-1"/>New GitHub issue</Button>
          <Button variant="outline" className="hover:bg-blue-100" onClick={() => { window.open('https://github.com/archignes/searchjunct/issues', '_blank'); }}>
            <GitHubLogoIcon className="w-4 h-4 mr-1"/>See open GitHub issues</Button>
        </div>
        <DrawerFooter>
          <DrawerClose>
            <ExitIcon/>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};