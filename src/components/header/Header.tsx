import React from 'react';
import MainMenuToggle from './Toggle';
import Image from 'next/image';
import ShareDropdownMenu from './ShareMenu';

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

const Header: React.FC<{ pageTitleParts?: string[] }> = ({ pageTitleParts }) => {
  return (
    <header className="bg-gray-100 grid grid-cols-12 mb-1">
      <MainMenuToggle className="col-span-1" />
      <a href="/" className={`col-span-10 text-4xl text-center ${pageTitleParts ? '' : 'mb-0'} block`}>
        <Image className="inline" src="/searchjunct.svg" alt="Searchjunct Logo" width={32} height={32} />
        <SearchjunctTitle /></a>
      {pageTitleParts && <HeaderTitle pageTitleParts={pageTitleParts} />}
    </header>
  );
};

export default Header;
