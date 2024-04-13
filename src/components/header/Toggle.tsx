// MainMenu.tsx
import React from 'react';
import { Button } from '@/src/components/ui/button';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useAppContext } from '@/contexts/AppContext';

export const MainMenuToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { isMainMenuExpanded, setIsMainMenuExpanded } = useAppContext();

  const toggleMenu = () => {
    setIsMainMenuExpanded(!isMainMenuExpanded);
  };

  return (
    <Button variant="ghost" onClick={toggleMenu}
      className={`p-0 h-7 mt-2 px-1 mr-auto flex items-center
          justify-center hover:bg-blue-100 ${isMainMenuExpanded ? 'bg-gray-200' : ''} transition-all duration-300
          ${className}`}>
        <HamburgerMenuIcon className="w-4 h-4 flex-shrink-0" />
    </Button>
  )
}
export default MainMenuToggle;

