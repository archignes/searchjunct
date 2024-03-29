import React from 'react';


export const SearchjunctTitle: React.FC = () => {
  return (
    <span className="font-bold">Search<span className="text-gray-500">junct</span></span>
  )
}

const HeaderTitle: React.FC<{ pageTitleParts: string[] }> = ({ pageTitleParts }) => {
  const part1 = pageTitleParts[0]
  const part2 = pageTitleParts[1]
  return (
    <span className="text-2xl text-center mb-3 font-bold block">{part1}<span className="text-gray-500">{part2}</span></span>
  )
}



const Header: React.FC<{ pageTitleParts?: string[] }> = ({ pageTitleParts }) => {
  return (
    <header>
      <a href="/" className={`text-4xl text-center ${pageTitleParts ? '' : 'mb-3'} mt-2 block`}><SearchjunctTitle /></a>
      {pageTitleParts && <HeaderTitle pageTitleParts={pageTitleParts} />}
    </header>
  );
};

export default Header;
