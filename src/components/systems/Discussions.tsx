// systems/Discussion.tsx

import React from 'react';
import { System } from "@/types";
import { platform_icons } from './utilities';

export default function Discussion({ system }: { system: System }) {
  if (!system.discussions) return null;

  return (
    <div id="discussion" className='ml-1'>
      <span className="text-xs">Discussions:</span>
      <ul className='list-outside'>{system.discussions.map((discussion, index) => (
        <li key={index} className='space-x-1 text-xs mx-4 list-["-_"]'>
          {discussion.author && `${discussion.author} `}
          {discussion.author && discussion.platform && `on `}
          {discussion.platform && <strong>{discussion.platform}</strong>}
          {discussion.platform && platform_icons[discussion.platform] ? (
            <img src={platform_icons[discussion.platform]} alt={`${discussion.platform} icon`} className="inline h-4 w-4 mx-1" />
          ) : null}
          
          <a href={discussion.url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100">
            {discussion.title}
          </a> ({discussion.date.split('-')[0]})
        </li>
      ))}
      </ul>
    </div>
  )
}