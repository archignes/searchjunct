// SystemCard.tsx
import React, { useState, useEffect } from 'react';
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

import { OpenSourceLicense } from './Elements';
import { SystemFooterLinks } from './FooterLinks';
import { GitHubLogoIcon, InfoCircledIcon, Link2Icon, DownloadIcon } from '@radix-ui/react-icons';

import { useAppContext } from '../../contexts/AppContext';
import { System } from "../../types/system";
import { DeleteSystemButton, DisableSystemButton } from './Buttons';
import { MicroPostsLinks, Discussions, ThesesLinks } from './Documents';
import { useSystemsContext } from '../../contexts/SystemsContext';
import { PageScreenshots, SpecialFeatureImage } from './Images';

import { PermalinkAlertDialog, SearchLinkAlertDialog, SearchLinkPatternAlert, NoticeAlert } from './Alerts';






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


interface SystemCardProps {
  system: System;
  systemPage?: boolean;
}

const SystemCard: React.FC<SystemCardProps> = ({ system, systemPage }) => {
  const router = useRouter();
  const { settingsCardActive } = useAppContext();
  const {allSystems} = useSystemsContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

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
        <PageScreenshots system={system} />
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