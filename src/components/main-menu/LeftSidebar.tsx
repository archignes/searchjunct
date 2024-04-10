// LeftSidebar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { GearIcon, SlashIcon, ExclamationTriangleIcon, QuestionMarkIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { useAppContext } from '@/contexts/AppContext';
import { MainMenuButton } from './Button';
import SettingsCard from './SettingsCard';
import InfoCard from './Info';
import ShortcutsCard from './Shortcuts';
import SortCard from './Sort';
import AlertsCard from './Alerts';

const LeftSidebar: React.FC<{ className?: string }> = ({ className }) => {
  const { isMainMenuExpanded } = useAppContext();

return (
<div className={`flex bg-gray-100 flex-col items-start ${className}`}>
    <MainMenuButton
      TargetTitle="Settings"
      TargetTooltip="Settings"
      TargetComponent={<SettingsCard />}
      TargetIcon={<GearIcon />} 
      ButtonIndex={0}
      />
    <MainMenuButton
      TargetTitle="Info"
      TargetTooltip="Info"
      TargetComponent={<InfoCard />}
      TargetIcon={<QuestionMarkIcon />}
      ButtonIndex={1}
    />
    <MainMenuButton
      TargetTitle="Shortcuts"
      TargetTooltip="Shortcuts"
      TargetComponent={<ShortcutsCard />}
      TargetIcon={<SlashIcon />}
      ButtonIndex={2}
    />
    <MainMenuButton
      TargetTitle="Sort"
      TargetTooltip="Sort"
      TargetComponent={<SortCard />}
      TargetIcon={<CaretSortIcon />}
      ButtonIndex={3}
    />
    <MainMenuButton
      TargetTitle="Alerts"
      TargetTooltip="Alerts"
      TargetComponent={<AlertsCard />}
      TargetIcon={<ExclamationTriangleIcon />}
      ButtonIndex={4}
    />

</div>

)
}

export default LeftSidebar;
