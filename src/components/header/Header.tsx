"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DropDownMenu from '../main-menu/DropDownMenu';
import { Button } from '../ui/button';
import { System } from '@/types';
import { SystemComboBox } from './SystemComboBox';
import { useSystemsContext } from '@/contexts';

export const SearchjunctTitle: React.FC = () => {
  return (
    <span className="font-bold">Search<span className="text-gray-500">junct</span></span>
  )
}

const HeaderTitle: React.FC<{ pageTitleParts: string[] }> = ({ pageTitleParts }) => {
  const part1 = pageTitleParts[0]
  const part2 = pageTitleParts[1]
  return (
    <span className="text-2xl text-center font-bold block">
      {part1}
      <span className="text-gray-500">
        {part2}
      </span>
    </span>
  )
}

const Header: React.FC<{ pageTitleParts?: string[], system?: System }> = ({ pageTitleParts, system }) => {
  const {baseSystems} = useSystemsContext();
  return (
    <header className="grid grid-cols-12 pt-1 mb-1">
      {/* <MainMenuToggle className="col-span-1" /> */}
      <DropDownMenu className="col-span-1" />
      <a href="/" className={`col-span-10 text-4xl text-center ${pageTitleParts ? '' : 'mb-0'} block`}>
        <Image className="inline" src="/searchjunct.svg" alt="Searchjunct Logo" width={32} height={32} />
        <SearchjunctTitle /></a>
      {pageTitleParts && <HeaderTitle pageTitleParts={pageTitleParts} />}
      {system && 
        <div className="col-span-12 text-center my-2">
          <p><SystemComboBox systems={baseSystems} system={system} /></p>
        </div>
      }
    </header>

  );
};

export default Header;
