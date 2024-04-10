// LeftSidebar.tsx

import React from 'react';
import { PlusIcon, GearIcon, SlashIcon, ExclamationTriangleIcon, QuestionMarkIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { MainMenuButton } from './Button';
import SettingsCard from './SettingsCard';
import InfoCard from './Info';
import ShortcutsCard from './Shortcuts';
import SortCard from './Sort';
import AlertsCard from './Alerts';
import AddCard from './Add';

const LeftSidebar: React.FC<{ className?: string }> = ({ className }) => {

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
        TargetTitle="Add"
        TargetTooltip="Add"
        TargetComponent={<AddCard />}
        TargetIcon={<PlusIcon />}
        ButtonIndex={3}
      />
      <MainMenuButton
        TargetTitle="Sort"
        TargetTooltip="Sort"
        TargetComponent={<SortCard />}
        TargetIcon={<CaretSortIcon />}
        ButtonIndex={4}
      />
      <MainMenuButton
        TargetTitle="Alerts"
        TargetTooltip="Alerts"
        TargetComponent={<AlertsCard />}
        TargetIcon={<ExclamationTriangleIcon />}
        ButtonIndex={5}
      />

  </div>

)
}

export default LeftSidebar;
