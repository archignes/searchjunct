// SystemTitle.tsx

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { System } from '../../types/systems';

export const SystemTitle: React.FC<{ system: System, className?: string }> = ({ system, className }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className={`flex items-center m-0 p-0 ${className}`}>
      {hasMounted ? (
        <>
          <Image src={`/favicons/${system.id}.ico`}
            alt={`${system.name} favicon`} width={15} height={15} quality={75}
            className="bg-white group-hover:bg-blue-100 rounded-md p-1 w-5 h-5 mr-2" />
          {system.name}
          {system.special_note && <span className="ml-2 bg-green-200 rounded-md px-1">{system.special_note}</span>}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
