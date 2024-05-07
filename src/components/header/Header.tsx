"use client"

import React, { Suspense } from 'react';
import Image from 'next/image';
import { System } from '@/types';
import { SystemComboBox } from './SystemComboBox';
import { useSystemsContext } from '@/contexts';

export const SearchjunctTitle: React.FC = React.memo(() => {
  return (
    <span className="font-bold">Search<span className="text-gray-500">junct</span></span>
  )
});

const DropDownMenu = React.lazy(() => import('../main-menu/DropDownMenu'));


const Header: React.FC<{ system?: System }> = ({ system }) => {
  const {baseSystems} = useSystemsContext();
  return (
    <header className="grid grid-cols-12 pt-1 mb-1">
      <div className="col-span-1">
        <Suspense>
          <DropDownMenu />
        </Suspense>
      </div>
      <div className="col-span-10 flex justify-center">
        <a href="/" className="text-4xl text-center block">
          <Image className="inline" src="/searchjunct-32x32.svg" alt="Searchjunct Logo" width={32} height={32} />
          <SearchjunctTitle />
        </a>
      </div>
      {system && <div className="col-span-12 text-center my-2">
          <p><SystemComboBox systems={baseSystems} system={system} /></p>
        </div>
      }
    </header>

  );
};

export default Header;
