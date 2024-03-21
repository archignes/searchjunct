import React from 'react';


export const SearchjunctTitle: React.FC = () => {
  return (
    <span className="font-bold">Search<span className="text-gray-500">junct</span></span>
  )
}

const Header: React.FC = () => {
  return (
    <header>
      <a href="/" className="text-4xl text-center mb-3 mt-2 block"><SearchjunctTitle /></a>
    </header>
  );
};

export default Header;
