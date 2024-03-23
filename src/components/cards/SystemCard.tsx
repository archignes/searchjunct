// SystemCard.tsx

import React from 'react';

import { Button } from '../shadcn-ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '../shadcn-ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../shadcn-ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../shadcn-ui/alert-dialog"

import { DiscordLogoIcon, GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon, ExclamationTriangleIcon, InfoCircledIcon, Link2Icon, CopyIcon, DownloadIcon, CheckIcon } from '@radix-ui/react-icons';
import CIcon from '@coreui/icons-react';
import { cibWikipedia } from '@coreui/icons';

import { useAppContext } from '../contexts/AppContext';
import { System } from "../../types/systems"; 
import { DeleteSystemButton, DisableSystemButton } from '../ui/SystemsButtons';
import SetupCustomDefaultSystemInstructions from './SetupCustomDefaultSystemInstructions';

interface SystemCardProps {
  system: System;
}

const SystemCard: React.FC<SystemCardProps> = ({ system }) => {
  const { settingsCardActive } = useAppContext();
  


  return (
    <Card className="border-none mt-0 p-2 pt-0 none px-1 mx-1 shadow-none">
      <CardContent className="px-0 pb-3">
        <CardHeader className="p-0 flex flex-col m-0 space-y-0 justify-start text-left">
          <AlertDialog >
            <AlertDialogTrigger asChild>
              <Button
                className="m-0 max-h-6 mt-1 hover:bg-white font-normal justify-start text-left"
                variant="ghost"
                size="sm"
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/?systems=${system.id}`);}}
              >
                <span className="hover:bg-blue-100 p-1 rounded-md">System ID: {system.id}<Link2Icon className="inline ml-1 h-4 w-4" /></span></Button>
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm"
                className="m-0 max-h-6 mt-0 hover:bg-white font-normal justify-start text-left"
              >
                <code className="hover:bg-blue-100 p-1 rounded-md underline">{system.search_link} <CopyIcon className="inline ml-1 h-4 w-4" /></code>
                
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Copied search link to clipboard!</AlertDialogTitle>
                <AlertDialogDescription>
                  {system.search_link.includes('%s') ? (
                    <>
                    <SetupCustomDefaultSystemInstructions system={system} />
                    </>
                    ) : (<p>Search link does not contain a <code>%s</code> placeholder so you cannot set this system as your default search engine or dynamically create search links.</p>)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Dismiss</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {(system.open_source_license && system.github_link) && (
            <div className="flex items-center ml-4">
              <span className="text-xs">Open Source?<CheckIcon className="h-5 w-5 pb-1 m-0 inline align-middle" /></span>
              <a href={system.github_link} className="">
                <Button
                  className="m-0 max-h-6 underline ml-0 pl-0 pb-1 hover:bg-blue-100 rounded-me font-normal justify-start text-left"
                  variant="ghost"
                  size="sm"
                >
                  {system.open_source_license}
                </Button>
              </a>
            </div>
          )}
          {(system.charity_search_engine) && (
            <div className="flex items-center ml-4">
              <span className="text-xs bg-green-300 p-1 rounded-md mb-1">charity search engine</span>
            </div>
          )}
          {(!system.search_link.includes('%s') || system.manual_switch_required || system.mobile_app_breaks_links_warning || system.account_required) && (
            <Alert className="mt-1">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>
                {system.account_required && <><span className="text-red-500">Account Required</span><br></br></>}
                {system.mobile_app_breaks_links_warning && (<>
                  <span className="text-red-500">Warning: Links may not work in mobile app</span><br></br></>)}
                {system.manual_switch_required && (<><span className="text-red-500">Web Search requires toggling a switch manually.</span><br></br></>)}
                {!system.search_link.includes('%s') && (<>
                  <span className="text-red-500">URL-driven searches are not supported.</span><span className="ml-1">Searchjunct will copy the query to your clipboard.</span><br></br></>)}
              </AlertDescription>
            </Alert>
                )}
                {system.android_choice_screen_options && (
                  <Alert>
                    <InfoCircledIcon className="h-4 w-4" />
                    <AlertTitle>Did you know?</AlertTitle>
              <AlertDescription>
                <div className="hover:bg-blue-100 rounded-md p-1">
                <span >This system is included in the <a className="underline" href="https://www.android.com/choicescreen-winners/" target="_blank" rel="noopener noreferrer">Android Choice Screen Options for September 2023 - August 2024</a>.</span>
                </div>
                    </AlertDescription>
                  </Alert>
                )}
        </CardHeader>
        <CardDescription>
          
        </CardDescription>
        {!settingsCardActive && (
          <div className="flex flex-row flex-grow space-x-1 my-2 justify-center items-center">
            <DisableSystemButton system={system} />
            <DeleteSystemButton system={system} />
          </div>
        )}
        {(system.android_app || system.ios_app || system.chrome_extension || system.safari_extension) && (
          <>
            <Alert>
              <DownloadIcon className="h-4 w-4" />
              <AlertTitle>Download & Install</AlertTitle>
              <AlertDescription>
                <div className="flex flex-col space-y-2">
                  {(system.chrome_extension || system.safari_extension) && (
                    <>
                      <span className="text-xs">Browser: </span>
                      <ul className="pl-3 text-xs">
                        {
                          system.chrome_extension && (
                            <>
                              <li className="m-0 pt-0">
                                <a href={system.chrome_extension} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                                  Chrome Extension
                                </a>
                              </li>
                            </>
                          )}
                        {
                          system.safari_extension && (
                            <>
                              <li className="m-0 pt-0">
                                <a href={system.safari_extension} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                                  Safari Extension
                                </a>
                              </li>
                            </>
                          )}
                      </ul>
                    </>
                  )}
                  {(system.android_app || system.ios_app) && (<>
                    <span className="text-xs">Mobile:</span>
                    <ul className="pl-3 text-xs">
                      {system.ios_app && (<>
                        <li className="m-0 pt-0">
                          <a href={system.ios_app} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                            iOS App
                          </a>
                        </li>
                      </>
                      )}
                      {system.android_app && (<>
                        <li className="m-0 pt-0">
                          <a href={system.android_app} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                            Android App
                          </a>
                        </li>
                      </>)}
                    </ul>
                  </>)}
                </div>
              </AlertDescription>
            </Alert>
            <div className="mt-1"></div>
          </>
        )}

      </CardContent>
      <CardFooter id="system-card-footer" data-testid="system-card-footer" className="pb-1">
        <div className="border-t pt-1 flex flex-col items-center w-full">
        {system.about_link && <div className="flex flex-row flex-grow space-x-1 justify-center items-center">
          <a href={system.about_link} target="_blank" rel="noopener noreferrer" className="block">About</a>
        </div>}
        <div className="flex flex-row flex-grow space-x-1 justify-center items-center">
          {system.wikipedia_link && <a href={system.wikipedia_link} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibWikipedia} className="w-4 h-4" /></a>}
            {system.twitter_link && <a href={system.twitter_link} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><TwitterLogoIcon /></a>}
            {system.github_link && <a href={system.github_link} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><GitHubLogoIcon /></a>}
            {system.discord_link && <a href={system.discord_link} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><DiscordLogoIcon/></a>}
            {system.linkedin_link && <a href={system.linkedin_link} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><LinkedInLogoIcon/></a>}
            {system.product_hunt_link && <a href={system.product_hunt_link} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block">
              <svg height="18px" id="Layer_1" version="1.1" viewBox="0 0 56.7 56.7" width="18px" xmlns="http://www.w3.org/2000/svg"><g><g><path d="M28.35,3.5943c-13.6721,0-24.7556,11.0835-24.7556,24.7556c0,13.6722,11.0835,24.7557,24.7556,24.7557    c13.6722,0,24.7556-11.0835,24.7556-24.7557C53.1056,14.6778,42.0222,3.5943,28.35,3.5943z M31.6508,33.3011L31.6508,33.3011    l-7.0141,0.0001v7.4266h-4.9511V15.9721l11.9653,0.0001v-0.0001c4.7853,0,8.6644,3.8793,8.6644,8.6645    C40.3152,29.4219,36.4361,33.3011,31.6508,33.3011z" /></g><g><path d="M31.6508,20.9233L31.6508,20.9233l-7.0141,0.0001V28.35h7.0141v-0.0001c2.0508,0,3.7132-1.6625,3.7132-3.7133    C35.364,22.5858,33.7016,20.9233,31.6508,20.9233z" /></g></g>
              </svg></a>}
        </div>
      </div>
      </CardFooter>
    </Card>
  );
};

export default SystemCard;
