import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DeviceFrame } from './components/DeviceFrame';

import { RidesHome } from './pages/RidesHome';
import { DestinationSearch } from './pages/DestinationSearch';
import { LocationSelection } from './pages/LocationSelection';
import { RideOptions } from './pages/RideOptions';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { LiveRideTracking } from './pages/LiveRideTracking';
import { SkyppyMiles } from './pages/SkyppyMiles';
import { ActivityHistory } from './pages/ActivityHistory';
import { Profile } from './pages/Profile';
import { ThemeSettings } from './pages/ThemeSettings';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <DeviceFrame>
        <Routes>
          <Route path="/" element={<RidesHome />} />
          <Route path="/search" element={<DestinationSearch />} />
          <Route path="/location" element={<LocationSelection />} />
          <Route path="/options" element={<RideOptions />} />
          <Route path="/confirm" element={<BookingConfirmation />} />
          <Route path="/tracking" element={<LiveRideTracking />} />
          <Route path="/miles" element={<SkyppyMiles />} />
          <Route path="/activity" element={<ActivityHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/theme" element={<ThemeSettings />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<RidesHome />} />
        </Routes>
      </DeviceFrame>
    </BrowserRouter>
  );
};
export default App;

