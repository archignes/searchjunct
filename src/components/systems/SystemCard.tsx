// SystemCard.tsx
import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/router';
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
import { OpenSourceLicense } from './SystemElements';
import { SystemFooterLinks } from './SystemFooterLinks';
import { DiscordLogoIcon, GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon, ExclamationTriangleIcon, InfoCircledIcon, Link2Icon, CopyIcon, DownloadIcon, CheckIcon } from '@radix-ui/react-icons';
import CIcon from '@coreui/icons-react';
import { cibWikipedia, cibYoutube, cibMatrix, cibReddit, cibMastodon, cibFacebook } from '@coreui/icons';

import { useAppContext } from '../../contexts/AppContext';
import { System } from "../../types/system";
import { DeleteSystemButton, DisableSystemButton } from './SystemsButtons';
import SetupCustomDefaultSystemInstructions from '../cards/SetupCustomDefaultSystemInstructions';
import { MicroPostsLinks, Discussions, ThesesLinks } from './DocumentInserts';
import { useSystemsContext } from '../../contexts/SystemsContext';
import { LandingPageScreenshots, SpecialFeatureImage } from './ImageInserts';




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




const SpecialFeatures: React.FC<SystemCardProps> = ({ system }) => {
  if (!system.specialFeatures) return null;
  return (
    <div id="special-features" className='ml-1 border-t pt-2'>
      <span className="text-sm font-bold">Special Features</span>
        <ul>{system.specialFeatures.map((feature, index) => (
        <li key={`${system.id}-${feature.type.replace(/ /g, '-')}`} className='text-sm mx-4'>
            <span className="font-bold">{feature.type}: </span>
          <a href={feature.url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100">{feature.title}</a>
            <br></br>
            {feature.description && <span>{feature.description}</span>}
            {feature.image && <SpecialFeatureImage image={feature.image} title={feature.title} />}
        </li>
      ))}
      </ul>
    </div>
  );
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
  systemPage?: boolean;
}

const SystemCard: React.FC<SystemCardProps> = ({ system, systemPage }) => {
  const router = useRouter();
  const { settingsCardActive } = useAppContext();
  const {allSystems} = useSystemsContext();
  console.log(system.citations)

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (<>
    <Card id={`system-card-${system.id}`} className="border-none shadow-none mt-0 p-2 pt-0 px-1 mx-1">
      <CardContent className="px-1 pb-2 grid grid-cols-1 gap-0">
          {system.tagline && (
            <div className="text-sm text-gray-600 text-center w-2/5 mx-auto italic my-2">
              "{system.tagline}"
            </div>
          )}
          <div className="flex flex-wrap items-center">
            <div className="flex flex-wrap break-words m-0 p-0 text-xs">
            <a href={`${origin}/?systems=${system.id}`} className="hover:bg-blue-100 rounded-md flex items-center justify-center flex break-words p-1">
                <code className="mr-1 break-all">{system.id}</code>
                <Link2Icon className="inline h-4 w-4" />
              </a>
              <PermalinkAlertDialog system={system} />
            </div>
          </div>
        {!systemPage && <div className="flex items-center flex-wrap break-words m-0 ml-1 p-0 text-xs">
          <span>page: </span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-blue-100 rounded-md flex items-center justify-center flex break-words p-1"
            onClick={() => router.push(`/${system.id}`)}
          >
            /{system.id}
          </Button>
        </div>}
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
        {system.namingNote && <div className="flex flex-row flex-grow gap-x-1 ml-1 justify-left items-center text-xs">
          Naming Note: {system.namingNote}
        </div>}
        {system.seeAlso && <div className="flex flex-row flex-grow gap-x-1 ml-1 justify-left items-center text-xs">
          See: {system.seeAlso.map((relatedSystemId, index, array) => {
          const relatedSystem = allSystems.find((sys) => sys.id === relatedSystemId);
          return relatedSystem ? (
            <React.Fragment key={relatedSystem.id}>
              <a href={`${origin}/?systems=${relatedSystem.id}`}
                 className="hover:bg-blue-100 rounded-md underline p-1 block">
                {relatedSystem.name}
              </a>
              {index < array.length - 1 && <span className="mx-1">|</span>}
            </React.Fragment>
          ) : null;
        })}
        </div>}
        <OpenSourceLicense system={system} />
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
        <MicroPostsLinks system={system} />
        <Discussions system={system} />
        {system.indices && <p className="text-xs m-1">Index: {system.indices.map((index, idx, array) => (
            <React.Fragment key={index.name}>
              {index.url ? (
                <a href={index.url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 rounded-md">{index.name}</a>
              ) : (
                <span>{index.name}</span>
              )}
              {idx < array.length - 1 && <span>, </span>}
            </React.Fragment>
          ))}</p>}
        {(system.manualSwitchRequired || system.mobileAppBreaksLinksWarning || system.accountRequired) && (
          <NoticeAlert system={system} />
        )}
        {!system.searchLink.includes('%s') && (
          <SearchLinkPatternAlert system={system} />
        )}
        {(system.androidChoiceScreenOptions || system.defaultInBrowser) && (
          <Alert id="android-choice-screen-options" className="mt-1">
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
        <LandingPageScreenshots system={system} />
      {!settingsCardActive && (
        <div className="flex flex-col space-x-1 text-xs sm:space-y-0 sm:space-x-2 w-2/5 my-2 items-end justify-end ml-auto">
          <DisableSystemButton system={system} />
          <DeleteSystemButton system={system} />
        </div>
      )}
      <CardDescription>
      </CardDescription>
        <SpecialFeatures system={system} />
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
                    <li key="chrome-extension" className="m-0 pt-0">
                    <a href={system.chromeExtension} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    Chrome Extension
                    </a>
                    </li>
                    )}
                    {
                    system.safariExtension && (
                    <li key="safari-extension" className="m-0 pt-0">
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
                    <li key="ios-app" className="m-0 pt-0">
                    <a href={system.iosApp} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    iOS App
                    </a>
                    </li>
                    )}
                    {system.androidApp && (
                    <li key="android-app" className="m-0 pt-0">
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
        {system.citations && <p className="text-xs text-left">{system.citations.map((citation, index) => <>
              <p key={index}>{citation.names} ({citation.year})
                  <a href={citation.title_url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">{citation.title}</a>
                  <span className="text-xs italic">{citation.publication}.</span>
                  <a href={citation.doi_url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">{citation.doi}</a>
                </p>
                <p className="text-xs mx-5 mt-2">Abstract: { citation.abstract }</p></>)}</p>}
              </CardContent>
              <CardFooter id="system-card-footer" data-testid="system-card-footer" className="pb-1">
                <div className="border-t pt-1 flex flex-col items-center w-full">
                <div className="flex flex-row flex-grow space-x-1 justify-center items-center">
                  <SystemFooterLinks system={system} />
                    </div>
                  </div>
                </CardFooter>
              </Card >
  </>);
};

export default SystemCard;