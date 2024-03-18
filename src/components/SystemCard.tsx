// SystemList.tsx

import React from 'react';
import { System, SystemTitle } from './SystemsContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { DiscordLogoIcon, GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import CIcon from '@coreui/icons-react';
import { cibWikipedia } from '@coreui/icons';
import { DeleteSystemButton, DisableSystemButton } from './SystemsButtons';


interface SystemCardProps {
  system: System;
}

const SystemCard: React.FC<SystemCardProps> = ({ system }) => {

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>
            <SystemTitle system={system} />
          </CardTitle>
        </CardHeader>
        <CardDescription>
          <span>ID: {system.id}</span>
          <span>
            Search Link: <a href={system.search_link} target="_blank" rel="noopener noreferrer">
              <code className="text-xs underline">{system.search_link}</code>
            </a>
          </span>
          {system.account_required && <span className="text-red-500">Account Required</span>}
          {system.mobile_app_breaks_links_warning && <span className="text-red-500">Warning: Links may not work in mobile app</span>}
        </CardDescription>
        <div className="flex flex-row flex-grow space-x-1 mt-2 justify-center items-center">
          <DisableSystemButton system={system} />
          <DeleteSystemButton system={system} />
        </div>
      </CardContent>
      <CardFooter id="system-card-footer" data-testid="system-card-footer">
        <div className="flex flex-col items-center w-full">
        {system.about_link && <div className="flex flex-row flex-grow space-x-1 justify-center items-center">
          <a href={system.about_link} target="_blank" rel="noopener noreferrer" className="block">About</a>
        </div>}
        <div className="flex flex-row flex-grow space-x-1 justify-center items-center">
          {system.wikipedia_link && <a href={system.wikipedia_link} target="_blank" rel="noopener noreferrer" className="block"><CIcon icon={cibWikipedia} className="w-4 h-4" /></a>}
          {system.twitter_link && <a href={system.twitter_link} target="_blank" rel="noopener noreferrer" className="block"><TwitterLogoIcon /></a>}
          {system.github_link && <a href={system.github_link} target="_blank" rel="noopener noreferrer" className="block"><GitHubLogoIcon /></a>}
          {system.discord_link && <a href={system.discord_link} target="_blank" rel="noopener noreferrer" className="block"><DiscordLogoIcon/></a>}
          {system.linkedin_link && <a href={system.linkedin_link} target="_blank" rel="noopener noreferrer" className="block"><LinkedInLogoIcon/></a>}
        </div>
      </div>
      </CardFooter>
    </Card>
  );
};

export default SystemCard;
