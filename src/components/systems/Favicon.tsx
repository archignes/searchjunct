// SystemFavicon.tsx

import React from 'react'; 
import Image from 'next/image';
import { System } from '../../types/system';

export const SystemFavicon: React.FC<{ system: System, focus_mode?: boolean, mini_mode?: boolean, className?: string }> = ({ system, focus_mode, mini_mode, className }) => {  

  if (system.favicon?.startsWith('http')) {
    return (
      <img src={system.favicon}
      alt={`${system.name} favicon`} width={15} height={15}
        className={`rounded-md p-1 ${focus_mode ? 'flex-shrink-0 w-8 h-8 mr-2' : mini_mode ? 'bg-white w-4 h-4 mx-1' : 'flex-shrink-0 w-7 h-7 mr-2'} ${className}`} />
    )
  } else {
    return (
      <Image
        src={`/favicons/${system.id}.ico`}
        alt={`${system.name} favicon`}
        sizes="(max-width: 15px)"
        width={50}
        loading="lazy"
        height={50}
        quality={focus_mode ? 100 : 75}
        className={`rounded-md ${focus_mode ? 'flex-shrink-0 w-8 h-8 mr-2' : mini_mode ? 'bg-white w-4 h-4 mx-1' : 'flex-shrink-0 w-7 h-7 mr-2'} ${system.addFaviconBackground === 'black' ? 'bg-black' : ''} ${className}`} />
    )} 
  }