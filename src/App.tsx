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

// Skyppy Courier & Logistics Pages
import { CourierHome } from './pages/CourierHome';
import { CreateShipment } from './pages/CreateShipment';
import { ShipmentConfirmation } from './pages/ShipmentConfirmation';
import { ShipmentTracking } from './pages/ShipmentTracking';
import { ReceiverPortal } from './pages/ReceiverPortal';
import { BusinessDashboard } from './pages/BusinessDashboard';

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
          {/* Passenger Rides Routes */}
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

          {/* Intercity Courier & Logistics Routes */}
          <Route path="/courier" element={<CourierHome />} />
          <Route path="/courier/send" element={<CreateShipment />} />
          <Route path="/courier/confirm" element={<ShipmentConfirmation />} />
          <Route path="/courier/track" element={<ShipmentTracking />} />
          <Route path="/courier/track/:id" element={<ShipmentTracking />} />
          <Route path="/courier/receiver/:id" element={<ReceiverPortal />} />
          <Route path="/courier/business" element={<BusinessDashboard />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<RidesHome />} />
        </Routes>
      </DeviceFrame>
    </BrowserRouter>
  );
};
export default App;
