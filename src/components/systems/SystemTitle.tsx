// SystemTitle.tsx

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { System } from '../../types/system';

export const SpecialCardTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <span className="text-xl ml-4 mb-1 font-bold block text-gray-500">{title}</span>
  )
}

export const FaviconImage: React.FC<{ system: System, focus_mode?: boolean, mini_mode?: boolean }> = ({ system, focus_mode, mini_mode }) => {
  
  if (system.favicon?.startsWith('http')) {
    return (
      <img src={system.favicon}
      alt={`${system.name} favicon`} width={15} height={15}
        className={`rounded-md p-1 ${focus_mode ? 'flex-shrink-0 w-8 h-8 mr-2' : mini_mode ? 'bg-white w-4 h-4 mx-1' : 'flex-shrink-0 w-6 h-6 mr-2'}`} />
    )
  } else {
    return (
      <Image src={`/favicons/${system.id}.ico`}
      alt={`${system.name} favicon`} width={15} height={15} quality={focus_mode ? 100 : 75}
        className={`rounded-md p-1 ${focus_mode ? 'flex-shrink-0 w-8 h-8 mr-2' : mini_mode ? 'bg-white w-4 h-4 mx-1' : 'flex-shrink-0 w-6 h-6 mr-2'}`} />
    )} 
  }


export const SystemTitle: React.FC<{ system: System,
    className?: string,
    mini_mode?: boolean,
    focus_mode?: boolean,
    favicon_included?: boolean }> = ({ system, className, mini_mode, focus_mode, favicon_included }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div id={`system-title-${system.id}`} className={`flex items-center m-0 p-0} ${className}`}>
      {hasMounted ? (
        <>
          {favicon_included && <FaviconImage system={system} mini_mode={mini_mode} focus_mode={focus_mode}/>}
          <span className={`${mini_mode ? 'pr-2 py-1' : ''}`}>
                  {system.name.includes(' - ') ? system.name.replace(/-/g, '') : system.name}
                  </span>
          {system.specialNote && !mini_mode && <span className="ml-2 bg-green-200 rounded-md px-1">
            {system.specialNote}
            </span>}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
