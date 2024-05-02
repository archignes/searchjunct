// SystemTitle.tsx

import React from 'react'; 
import Image from 'next/image';
import { System } from '../../types/system';
import { SystemFavicon } from './Favicon';

export const SpecialCardTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <span className="text-xl ml-4 mb-1 font-bold block text-gray-500">{title}</span>
  )
}

export const SystemTitle: React.FC<{ system: System,
    className?: string,
    mini_mode?: boolean,
    focus_mode?: boolean,
    favicon_included?: boolean }> = ({ system, className, mini_mode, focus_mode, favicon_included }) => {
  return (
    <div id={`system-title-${system.id}`} className={`flex items-center m-0 p-0 ${className}`}>
        {favicon_included && <SystemFavicon system={system} mini_mode={mini_mode} focus_mode={focus_mode}/>}
        <span className={`${mini_mode ? 'pr-2 py-1' : ''}`}>{system.name.replace(' - ', ' ')}</span>
        {system.specialNote && !mini_mode && <span className="ml-2 bg-green-200 rounded-md px-1">
          {system.specialNote}
          </span>}
    </div>
  );
};
