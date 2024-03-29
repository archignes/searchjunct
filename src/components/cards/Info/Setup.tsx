// Info_SetupInstructions.tsx

import React from 'react';

import { CopyIcon } from '@radix-ui/react-icons';
import {
  Card,
  CardContent
} from '../../shadcn-ui/card';
import { Button } from '../../shadcn-ui/button';
import SetupCustomDefaultSystemInstructions from "../SetupCustomDefaultSystemInstructions"

const SetupInstructionsCard: React.FC = () => {
  
  const mockedSearchjunctSystem = {
    search_link: "https://searchjunct.com/?q=%s",
    id: "searchjunct",
    name: "Searchjunct"
  };
  const [buttonText, setButtonText] = React.useState('Copy');
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockedSearchjunctSystem.search_link);
    setButtonText('Copied');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset isCopied after 2 seconds
  };

  return (
    <>
      <Card className='w-9/10" border-none shadow-none mx-auto'>
        <CardContent >
          <div className="text-xl pb-2 font-bold">Setup Searchjunct as Your Default Search Engine</div>
          
          <Button variant="ghost" size="sm" className={`hover:bg-blue-100 p-1 rounded-md}`} onClick={handleCopy}>
            <code>{mockedSearchjunctSystem.search_link}</code>
            <CopyIcon className="inline mx-1 h-4 w-4" /><span className={`${isCopied ? "font-bold transition-all duration-200 ease-out" : ""}`}>{buttonText}</span></Button>

          <SetupCustomDefaultSystemInstructions system={mockedSearchjunctSystem}/>
        </CardContent>
      </Card>
    </>
  );
};

export default SetupInstructionsCard;