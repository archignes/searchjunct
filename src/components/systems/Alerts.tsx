// Alerts.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"
import { ExclamationTriangleIcon, CopyIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

import { System } from "../../types/system";
import SetupCustomDefaultSystemInstructions from '../cards/SetupCustomDefaultSystemInstructions';

const alertClass = "mt-1 w-full mx-auto flex flex-col"

interface SystemCardProps {
  system: System;
  systemPage?: boolean;
}

export const NoticeAlert: React.FC<SystemCardProps> = ({ system }) => {
  return (
    <Alert className={alertClass}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Notice</AlertTitle>
      <AlertDescription className="flex flex-col">
        {system.accountRequired && <><span className="text-red-500">Account Required</span><br></br></>}
        {system.mobileAppBreaksLinksWarning && (<>
          <span className="text-red-500">Warning: Links may not work in mobile app</span><br></br></>)}
        {system.manualSwitchRequired && (<><span className="text-red-500">Web Search requires toggling a switch manually.</span><br></br></>)}
      </AlertDescription>
    </Alert>
  )
}

export const SearchLinkPatternAlert: React.FC<SystemCardProps> = ({ system }) => {
  const searchLinkPatternFormattedGithubIssueLink = 'https://github.com/archignes/searchjunct/issues/new' +
    [`?title=${ encodeURIComponent('Update searchLink for URL-driven search support for ' + system.name + ' (' + system.id + ')')}`,
    `&body=${encodeURIComponent('# Add Search Link Pattern\n\nThe searchLink pattern for ' + system.name + ' is: {}\n\n')}`,
    `${encodeURIComponent('# Guidance\n\nBe sure to include the `%s` placeholder for the query string.\n\n')}`,
    `${encodeURIComponent('Please provide links to documentation, if available.\n\n')}`,
    `${encodeURIComponent('Please indicate if the system requires query terms to be joined by `%20`, rather than `+` ')}`,
    `${encodeURIComponent('(this will be needed in the searchLink_joiner field for the system because Searchjunct uses the plus as a default for readability).\n\n')}`,
    `${encodeURIComponent('Thank you!')}`].join('');

return (
  <Alert className={alertClass}>
    <ExclamationTriangleIcon className="h-4 w-4" />
    <AlertTitle>Search Link Pattern Notice</AlertTitle>
    <AlertDescription>
      <span>URL-driven searches are <span className="text-red-500 font-bold">not</span> supported.
        If given permissions, Searchjunct will copy the query to your clipboard.</span>
      <p className="text-right">
        <a href={searchLinkPatternFormattedGithubIssueLink} target="_blank" rel="noopener noreferrer"
          className="text-xs mt-2 underline hover:bg-blue-100 p-1 rounded-md">Add Search Link Pattern</a></p>
    </AlertDescription>
  </Alert>
)
}




export const PermalinkAlertDialog: React.FC<SystemCardProps> = ({ system }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="m-0 mr-0 p-1 text-xs rounded-md hover:bg-blue-100 focus:outline-none flex items-center justify-center"
          onClick={() => { navigator.clipboard.writeText(`${ window.location.origin }/?systems=${ system.id }`); }}
        >
          <CopyIcon className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Copied system permalink to clipboard!</AlertDialogTitle>
          <AlertDialogDescription>
            You can use this link to return to this system card.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Dismiss</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const SearchLinkAlertDialog: React.FC<SystemCardProps> = React.memo(({ system }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleCopySearchLink = () => {
    if (system.searchLink && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(system.searchLink)
        .then(() => {
          console.log('Search link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy search link: ', err);
        });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="flex flex-row items-center text-xs justify-center p-0 m-0">
        <Button
          variant="ghost"
          size="sm"
          className="m-0 p-0 hover:bg-white font-normal flex-row items-center justify-center"
          onClick={handleCopySearchLink}
        >
          <div className="grid grid-cols-[auto_24px] hover:bg-blue-100 text-left p-1 items-center justify-center rounded-md underline">
            <span className="overflow-auto max-w-full">{system.searchLink}</span>
            <CopyIcon className="ml-1 h-4 w-4" />
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-90% mx-auto'>
        <AlertDialogHeader className='w-90% mx-auto'>
          <AlertDialogTitle>Copied search link to clipboard!</AlertDialogTitle>
          <AlertDialogDescription className='text-left w-90% mx-auto'>
            {system.searchLink.includes('%s') ? (
              <>
                <SetupCustomDefaultSystemInstructions system={system} />
              </>
            ) : (
              <p>Search link does not contain a <code>%s</code> placeholder so you cannot set this system as your default search engine or dynamically create search links.</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Dismiss</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});