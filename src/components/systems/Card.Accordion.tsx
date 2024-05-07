// Card.Accordion.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from '../ui/card';
import { OpenSourceLicense } from './Elements';
import { SystemFooterLinks } from './FooterLinks';
import { GitHubLogoIcon, Link2Icon } from '@radix-ui/react-icons';
import { useAppContext } from '../../contexts/AppContext';
import { System } from "../../types/system";
import { DeleteSystemButton, DisableSystemButton } from './Buttons';
import { useSystemsContext } from '../../contexts/SystemsContext';
import { PermalinkAlertDialog, SearchLinkAlertDialog, SearchLinkPatternAlert, NoticeAlert } from './Alerts';

interface SystemCardProps {
  system: System;
}

const SystemAccordionCard: React.FC<SystemCardProps> = ({ system }) => {
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
          <div className="flex flex-wrap items-center">
            <div className="flex flex-wrap break-words m-0 p-0 text-xs">
            <a href={`${origin}/?systems=${system.id}`} className="hover:bg-blue-100 rounded-md flex items-center justify-center flex break-words p-1">
                <code className="mr-1 break-all">{system.id}</code>
                <Link2Icon className="inline h-4 w-4" />
              </a>
              <PermalinkAlertDialog system={system} />
            </div>
          </div>
        <div className="flex items-center flex-wrap break-words m-0 ml-1 p-0 text-xs">
          <span>page: </span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-blue-100 rounded-md flex items-center justify-center flex break-words p-1"
            onClick={() => router.push(`/${system.id}`)}
          >
            /{system.id}
          </Button>
        </div>
        <div className="flex flex-wrap break-words m-0 p-0 text-xs">
            <SearchLinkAlertDialog system={system} />
          </div>
        {system.searchLinkNote && (
          <div className="w-90 flex border rounded-md m-1 p-1 flex-wrap items-center">
            <p className="text-xs">Note: {system.searchLinkNote}</p>
          </div>
        )}
        {system.seeAlso && <div className="flex flex-row flex-grow gap-x-1 ml-1 justify-left items-center text-xs">
          See: {system.seeAlso.map((relatedSystemId, index, array) => {
          const relatedSystem = allSystems.find((sys) => sys.id === relatedSystemId);
          return relatedSystem ? (
            <React.Fragment key={index}>
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
        {(system.manualSwitchRequired || system.mobileAppBreaksLinksWarning || system.accountRequired) && (
          <NoticeAlert system={system} />
        )}
        {!system.searchLink.includes('%s') && (
          <SearchLinkPatternAlert system={system} />
        )}
      {!settingsCardActive && (
        <div className="flex flex-col space-x-1 text-xs sm:space-y-0 sm:space-x-2 w-2/5 my-2 items-end justify-end ml-auto">
          <DisableSystemButton system={system} />
          <DeleteSystemButton system={system} />
        </div>
      )}
      <CardDescription>
      </CardDescription>
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

export default SystemAccordionCard;