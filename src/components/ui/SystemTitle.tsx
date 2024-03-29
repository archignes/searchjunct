// SystemTitle.tsx

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { System } from '../../types/system';


export const SpecialCardTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <span className="text-xl ml-4 mb-1 font-bold block text-gray-500">{title}</span>
  )
}

export const SystemTitle: React.FC<{ system: System, className?: string, mini_mode?: boolean }> = ({ system, className, mini_mode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className={`flex items-center m-0 p-0} ${className}`}>
      {hasMounted ? (
        <>
          <Image src={`/favicons/${system.id}.ico`}
            alt={`${system.name} favicon`} width={15} height={15} quality={75}
            className={`bg-white group-hover:bg-blue-100 rounded-md p-1 w-5 h-5 ${mini_mode ? 'mr-0' : 'mr-2'}`} />
          <span className={`${mini_mode ? 'pr-2' : ''}`}>{system.name}</span>
          {system.special_note && !mini_mode && <span className="ml-2 bg-green-200 rounded-md px-1">{system.special_note}</span>}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
