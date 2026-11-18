import React from 'react';
import { DriverAppShell } from '../../components/driver/DriverAppShell';
import { useDriverStore } from '../../store/useDriverStore';
import { DriverHome } from './DriverHome';
import { DriverActivity } from './DriverActivity';
import { DriverEarnings } from './DriverEarnings';
import { DriverProfile } from './DriverProfile';

export const DriverView: React.FC = () => {
  const { activeTab } = useDriverStore();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <DriverHome />;
      case 'activity':
        return <DriverActivity />;
      case 'earnings':
        return <DriverEarnings />;
      case 'profile':
        return <DriverProfile />;
      default:
        return <DriverHome />;
    }
  };

  return <DriverAppShell>{renderActiveTab()}</DriverAppShell>;
};

export default DriverView;
