// Elements.tsx

import React from 'react';
import { System } from '../../types/system';
import { Button } from '../ui/button';
import { CheckIcon } from '@radix-ui/react-icons';


export const SystemCitations: React.FC<{ system: System }> = React.memo(({ system }) => {
  return (
    <div className="text-xs text-left">{system.citations?.map((citation, index) => (
      <React.Fragment key={`citation-${index}`}>
        <p>{citation.names} ({citation.year})
          <a href={citation.title_url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">{citation.title}</a>
          <span className="text-xs italic">{citation.publication}.</span>
          <a href={citation.doi_url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">{citation.doi}</a>
        </p>
        <p className="text-xs mx-5 mt-2">Abstract: {citation.abstract}</p>
      </React.Fragment>
    ))}</div>
  )
});

export const OpenSourceLicense: React.FC<{ system: System }> = React.memo(({ system }) => {
  if (!system.openSourceLicense) {
    return null;
  }
  return (
      <div className="flex flex-wrap items-center">
        <span className="text-xs ml-1">Open Source?<CheckIcon className="h-5 w-5 pb-1 m-0 inline align-middle" /></span>
        <a href={system.githubLink} className="mx-auto sm:mx-0">
          <Button
            className="m-0 max-h-6 underline ml-1 pl-0 pb-1 hover:bg-blue-100 rounded-me font-normal justify-start text-left"
            variant="ghost"
            size="sm"
          >
            {system.openSourceLicense}
          </Button>
        </a>
      </div>
    )
  })