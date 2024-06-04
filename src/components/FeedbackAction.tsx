import React, { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { ChatBubbleIcon, EnvelopeClosedIcon, ExitIcon, GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }


  const projectName = process.env.NEXT_PUBLIC_DOMAIN?.split('/')[2].split('.')[0];

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
          <a href={`https://twitter.com/intent/tweet?text=Hey @archignes, I just used ${projectName} and...`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="hover:bg-blue-100" onClick={() => {
              window.open(
                `https://twitter.com/intent/tweet?text=Hey @archignes, I just used ${projectName} and...`, '_blank');
            }}>
              <TwitterLogoIcon className="w-4 h-4 mr-1" />Tweet @archignes
            </Button>
          </a>
          <a href={`mailto:daniel@archignes.com?subject=Feedback on ${projectName}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="hover:bg-blue-100">
              <EnvelopeClosedIcon className="w-4 h-4 mr-1" />Email Daniel
            </Button>
          </a>
          <a href={`https://github.com/archignes/${projectName}/issues/new`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="hover:bg-blue-100">
              <GitHubLogoIcon className="w-4 h-4 mr-1" />New GitHub issue
            </Button>
          </a>
          <a href={`https://github.com/archignes/${projectName}/issues`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="hover:bg-blue-100">
              <GitHubLogoIcon className="w-4 h-4 mr-1" />See open GitHub issues
            </Button>
          </a>
        </div>
        <DrawerFooter>
          <DrawerClose>
            <ExitIcon />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};