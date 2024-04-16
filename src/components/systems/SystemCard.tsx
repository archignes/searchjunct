// SystemCard.tsx
import React from 'react';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from '../ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"
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

import { DiscordLogoIcon, GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon, ExclamationTriangleIcon, InfoCircledIcon, Link2Icon, CopyIcon, DownloadIcon, CheckIcon } from '@radix-ui/react-icons';
import CIcon from '@coreui/icons-react';
import { cibWikipedia, cibYoutube, cibMatrix, cibReddit, cibMastodon, cibFacebook } from '@coreui/icons';

import { useAppContext } from '../../contexts/AppContext';
import { System } from "../../types/system";
import { DeleteSystemButton, DisableSystemButton } from './SystemsButtons';
import SetupCustomDefaultSystemInstructions from '../cards/SetupCustomDefaultSystemInstructions';
import Discussions from './Discussions';

type PlatformIcons = {
  [key: string]: string;
};

const platform_icons: PlatformIcons = {
  "Hacker News": "https://news.ycombinator.com/favicon.ico"
};



const alertClass = "mt-1 w-full mx-auto flex flex-col"

const NoticeAlert: React.FC<SystemCardProps> = ({ system }) => {
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

const SearchLinkPatternAlert: React.FC<SystemCardProps> = ({ system }) => {
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

const ThesesLinks: React.FC<SystemCardProps> = ({ system }) => {
  if (!system.thesesLinks) return null;
  return (
    <div id="theses-links" className='ml-1'>
      <span className="text-xs">Theses:</span>
      <ul className='list-outside'>{system.thesesLinks.map((thesis, index) => (
        <li key={index} className='text-xs mx-4 list-["-_"]'>
          {thesis.author} <a href={thesis.url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100">
                {thesis.title}
            </a> ({thesis.date.split('-')[0]})
        </li>
      ))}
      </ul>
    </div>
  )
}




const PermalinkAlertDialog: React.FC<SystemCardProps> = ({ system }) => {
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

const SearchLinkAlertDialog: React.FC<SystemCardProps> = ({ system }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="flex flex-row items-center text-xs justify-center p-0 m-0">
        <Button variant="ghost" size="sm"
          className="m-0 p-0 hover:bg-white font-normal flex-row items-center justify-center"
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
            ) : (<p>Search link does not contain a <code>%s</code> placeholder so you cannot set this system as your default search engine or dynamically create search links.</p>)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Dismiss</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface SystemCardProps {
  system: System;
}

const SystemCard: React.FC<SystemCardProps> = ({ system }) => {
  const { settingsCardActive } = useAppContext();

  return (<>
    <Card className="border-none shadow-none mt-0 p-2 pt-0 px-1 mx-1">
      <CardContent className="px-1 pb-2 grid grid-cols-1 gap-0">
          {system.tagline && (
            <div className="text-sm text-gray-600 text-center w-2/5 mx-auto italic my-2">
              {system.tagline}
            </div>
          )}
          <div className="flex flex-wrap items-center">
            <div className="flex flex-wrap break-words m-0 p-0 text-xs">
            <a href={`${window.location.origin}/?systems=${system.id}`} className="hover:bg-blue-100 rounded-md flex items-center justify-center flex break-words p-1">
                <code className="mr-1 break-all">{system.id}</code>
                <Link2Icon className="inline h-4 w-4" />
              </a>
              <PermalinkAlertDialog system={system} />
            </div>
          </div>
        <div className="flex flex-wrap break-words m-0 p-0 text-xs">
            <SearchLinkAlertDialog system={system} />
          </div>
        {system.searchLinkNote && (
          <div className="w-90 flex border rounded-md m-1 p-1 flex-wrap items-center">
            <p className="text-xs">Note: {system.searchLinkNote}</p>
          </div>
        )}
        {system.aboutLink && <div className="flex flex-row flex-grow gap-x-1 justify-left items-center ml-1 text-xs">
          About:<a href={system.aboutLink.url} target="_blank" rel="noopener noreferrer" className="hover:bg-blue-100 underline p-1 block">{system.aboutLink.title}</a>
        </div>}
        {system.pronunciation && <div className="flex flex-row flex-grow gap-x-1 ml-1 justify-left items-center text-xs">
          Pronunciation:<a href={system.pronunciation.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-blue-100 underline p-1">{system.pronunciation.string}</a>
        </div>}
        {(system.openSourceLicense && system.githubLink) && (
          <div className="flex flex-wrap items-center">
            <span className="text-xs ml-1">Open Source?<CheckIcon className="h-5 w-5 pb-1 m-0 inline align-middle" /></span>
            <a href={system.githubLink} className="mx-auto sm:mx-0">
              <Button
                className="m-0 max-h-6 underline ml-0 pl-0 pb-1 hover:bg-blue-100 rounded-me font-normal justify-start text-left"
                variant="ghost"
                size="sm"
              >
                {system.openSourceLicense}
              </Button>
            </a>
          </div>
        )}
        {(system.githubSponsorLink) && (
          <div className="flex flex-wrap justify-center items-center">
            <Button
              className="m-0 max-h-6 ml-0 pl-0 hover:bg-blue-100 rounded-me font-normal justify-start text-left"
              variant="outline"
              size="sm"
            >
              <a href={system.githubSponsorLink} target="_blank" rel="noopener noreferrer" className="">
                <GitHubLogoIcon className="inline ml-2" /> Become a sponsor to {system.name}
            </a>
          </Button>
          </div>
        )}
        {(system.charitySearchEngine) && (
          <div className="flex flex-wrap items-center ml-4">
            <span className="text-xs bg-green-300 p-1 rounded-md mb-1">charity search engine</span>
          </div>
        )}
        
        <ThesesLinks system={system} />
        <Discussions system={system} />
        {(system.manualSwitchRequired || system.mobileAppBreaksLinksWarning || system.accountRequired) && (
          <NoticeAlert system={system} />
        )}
        {!system.searchLink.includes('%s') && (
          <SearchLinkPatternAlert system={system} />
        )}
        {(system.androidChoiceScreenOptions || system.defaultInBrowser) && (
          <Alert className="mt-1">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Did you know?</AlertTitle>
            <AlertDescription>
              <div className="hover:bg-blue-100 rounded-md p-1">
                {system.androidChoiceScreenOptions && (<><span >This system is included in the <a className="underline" href="https://www.android.com/choicescreen-winners/" target="_blank" rel="noopener noreferrer">Android Choice Screen Options for September 2023 - August 2024</a>.</span></>)}
                {system.defaultInBrowser && <p className="mt-1">This system is included in the default search engine options for the following web browsers: {system.defaultInBrowser.join(', ')}.</p>}
              </div>
            </AlertDescription>
          </Alert>
        )}
      {!settingsCardActive && (
        <div className="flex flex-col space-x-1 text-xs sm:space-y-0 sm:space-x-2 w-2/5 my-2 items-end justify-end ml-auto">
          <DisableSystemButton system={system} />
          <DeleteSystemButton system={system} />
        </div>
      )}
      <CardDescription>
      </CardDescription>
      {(system.androidApp || system.iosApp || system.chromeExtension || system.safariExtension) && (
      <>
          <Alert>
            <DownloadIcon className="h-4 w-4" />
            <AlertTitle>Download & Install</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col space-y-2">
                {(system.chromeExtension || system.safariExtension) && (
                <>
                    <span className="text-xs">Browser: </span>
                    <ul className="pl-3 text-xs">
                    {system.chromeExtension && (
                    <li className="m-0 pt-0">
                    <a href={system.chromeExtension} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    Chrome Extension
                    </a>
                    </li>
                    )}
                    {
                    system.safariExtension && (
                    <li className="m-0 pt-0">
                    <a href={system.safariExtension} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    Safari Extension
                    </a>
                    </li>
                    )}
                    </ul>
                    </>
                    )}
                    {(system.androidApp || system.iosApp) && (<>
                    <span className="text-xs">Mobile:</span>
                    <ul className="pl-3 text-xs">
                    {system.iosApp && (
                    <li className="m-0 pt-0">
                    <a href={system.iosApp} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    iOS App
                    </a>
                    </li>
                    )}
                    {system.androidApp && (
                    <li className="m-0 pt-0">
                    <a href={system.androidApp} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    Android App
                    </a>
                    </li>
                    )}
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
                <div className="flex flex-row flex-grow space-x-1 justify-center items-center">
                  {system.wikipediaLink && <a href={system.wikipediaLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibWikipedia} className="w-4 h-4" /></a>}
                    {system.twitterLink && <a href={system.twitterLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><TwitterLogoIcon /></a>}
                    {system.githubLink && <a href={system.githubLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><GitHubLogoIcon /></a>}
                    {system.instagramLink && <a href={system.instagramLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><InstagramLogoIcon /></a>}                   
                    {system.matrixLink && <a href={system.matrixLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibMatrix} className="w-4 h-4" /></a>}
                    {system.discordLink && <a href={system.discordLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><DiscordLogoIcon/></a>}
                    {system.hackerNewsLink && (
                      <a href={system.hackerNewsLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded-md block">
                        <img src={platform_icons["Hacker News"]} alt="Hacker News Icon" className="w-4 h-4" style={{filter: "grayscale(1) contrast(100) brightness(1)"}} />
                      </a>
                    )}
                    {system.mastodonLink && <a href={system.mastodonLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibMastodon} className="w-4 h-4" /></a>}
                    {system.facebookLink && <a href={system.facebookLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibFacebook} className="w-4 h-4" /></a>}
                    {system.redditLink && <a href={system.redditLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibReddit} className="w-4 h-4" /></a>}
                    {system.linkedinLink && <a href={system.linkedinLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><LinkedInLogoIcon/></a>}
                    {system.youtubeLink && <a href={system.youtubeLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibYoutube} className='w-4 h-4'/></a>}
            {system.productHuntLink && <a href={system.productHuntLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block">
                      <svg height="18px" id="Layer_1" version="1.1" viewBox="0 0 56.7 56.7" width="18px" xmlns="http://www.w3.org/2000/svg"><g><g><path d="M28.35,3.5943c-13.6721,0-24.7556,11.0835-24.7556,24.7556c0,13.6722,11.0835,24.7557,24.7556,24.7557    c13.6722,0,24.7556-11.0835,24.7556-24.7557C53.1056,14.6778,42.0222,3.5943,28.35,3.5943z M31.6508,33.3011L31.6508,33.3011    l-7.0141,0.0001v7.4266h-4.9511V15.9721l11.9653,0.0001v-0.0001c4.7853,0,8.6644,3.8793,8.6644,8.6645    C40.3152,29.4219,36.4361,33.3011,31.6508,33.3011z" /></g><g><path d="M31.6508,20.9233L31.6508,20.9233l-7.0141,0.0001V28.35h7.0141v-0.0001c2.0508,0,3.7132-1.6625,3.7132-3.7133    C35.364,22.5858,33.7016,20.9233,31.6508,20.9233z" /></g></g>
                      </svg></a>}
                    </div>
                  </div>
                </CardFooter>
              </Card >
  </>);
};

export default SystemCard;