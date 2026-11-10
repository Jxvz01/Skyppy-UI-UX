import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useCourierStore } from '../store/useCourierStore';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';
import { Shipment, ShipmentStatus } from '../types/courier';

export const CourierHome: React.FC = () => {
  const navigate = useNavigate();
  const { shipments, savedSenders, savedReceivers, isBusinessMode, toggleBusinessMode, setActiveServiceTab, setActiveShipment } = useCourierStore();
  const { language, userProfile } = useAppStore();
  const t = translations[language] || translations.en;

  const [trackInput, setTrackInput] = useState('');
  const [trackError, setTrackError] = useState('');

  const activeShipments = shipments.filter(
    (s) => s.status !== 'delivered' && s.status !== 'cancelled'
  );
  const recentShipments = shipments.slice(0, 4);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackInput.trim().toUpperCase();
    if (!query) {
      setTrackError('Please enter a tracking number');
      return;
    }

    const found = shipments.find(
      (s) => s.trackingNumber.toUpperCase() === query || s.id.toUpperCase() === query
    );

    if (found) {
      setActiveShipment(found);
      navigate(`/courier/track/${found.id}`);
    } else {
      setTrackError(`No shipment found matching "${query}". Try ${shipments[0]?.trackingNumber || 'SKP-EXP-849204'}`);
    }
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Delivered</span>;
      case 'in_transit':
      case 'arrived_destination_hub':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-primary animate-pulse">In Transit</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 font-semibold">Out for Delivery</span>;
      case 'delayed':
      case 'delivery_attempted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">Delayed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-200 text-neutral-600">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700">Pickup Scheduled</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-20 bg-surface min-h-full">
      <Header type="tab" />

      {/* Primary Service Switcher: Rides vs Courier Logistics */}
      <div className="px-margin pt-2 pb-1 bg-surface">
        <div className="bg-surface-container-low p-1 rounded-2xl flex items-center shadow-xs border border-surface-container">
          <button
            type="button"
            onClick={() => {
              setActiveServiceTab('rides');
              navigate('/');
            }}
            className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 font-label-md text-tertiary hover:text-on-surface transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">local_taxi</span>
            <span className="font-semibold">Skyppy Rides</span>
          </button>
          <button
            type="button"
            className="flex-1 py-2 rounded-xl bg-primary-container text-on-primary flex items-center justify-center gap-2 font-label-md font-bold shadow-xs transition-all cursor-default"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Skyppy Courier</span>
            <span className="px-1.5 py-0.2 rounded-md bg-secondary-fixed text-on-secondary-fixed text-[10px] font-extrabold uppercase">
              Intercity
            </span>
          </button>
        </div>
      </div>

      <main className="flex flex-col w-full">
        {/* Deep Slate Indigo Cargo Canopy */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0c192c] via-[#10243e] to-[#162f53] text-inverse-on-surface px-margin pt-4 pb-6 shadow-md rounded-b-[28px]">
          {/* Ambient Logistics Glow */}
          <div className="absolute -top-12 -right-10 w-52 h-52 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 -left-10 w-44 h-44 rounded-full bg-secondary-fixed/15 blur-2xl pointer-events-none"></div>

          {/* Express Cargo Truck Vector Silhouette */}
          <svg
            className="absolute bottom-2 right-1 w-48 h-24 opacity-15 pointer-events-none text-inverse-on-surface"
            fill="none"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="10" y="30" width="115" height="50" rx="4" fill="currentColor" />
            <path d="M125 45 L155 45 L170 65 L170 80 L125 80 Z" fill="currentColor" />
            <circle cx="45" cy="82" r="12" fill="#0c192c" stroke="currentColor" strokeWidth="4" />
            <circle cx="145" cy="82" r="12" fill="#0c192c" stroke="currentColor" strokeWidth="4" />
            <line x1="20" y1="42" x2="60" y2="42" stroke="#d1ec64" strokeWidth="3" />
            <line x1="20" y1="52" x2="80" y2="52" stroke="#d1ec64" strokeWidth="3" />
          </svg>

          {/* Top Status & Mode Toggle */}
          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md text-secondary-fixed font-bold tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Express Corridor Active
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping"></span>
            </div>
            
            <button
              type="button"
              onClick={() => {
                toggleBusinessMode();
                navigate('/courier/business');
              }}
              className="flex items-center gap-1.5 bg-surface-container-highest/30 hover:bg-surface-container-highest/50 backdrop-blur-md px-3 py-1 rounded-full text-inverse-on-surface transition-colors cursor-pointer text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">store</span>
              <span>{isBusinessMode ? 'Business Mode' : 'Switch to Business'}</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>

          {/* Hero Greeting & Headline */}
          <div className="relative z-10 mb-4">
            <span className="font-body-sm text-body-sm text-outline-variant block mb-0.5">
              Door-to-door Intercity Logistics
            </span>
            <h1 className="text-2xl font-extrabold text-inverse-on-surface tracking-tight leading-tight">
              Fast, Guaranteed Freight <br />
              <span className="text-secondary-fixed">Across Karnataka</span>
            </h1>
          </div>

          {/* Hero Action: Send a Parcel Card */}
          <div className="relative z-10">
            <button
              type="button"
              onClick={() => navigate('/courier/send')}
              className="w-full py-3.5 px-4 rounded-2xl bg-primary text-white flex items-center justify-between shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] text-white">send_and_archive</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-base leading-tight">Send an Intercity Parcel</span>
                  <span className="text-xs text-blue-100 font-medium">Doorstep pickup & live expressway tracking</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <span className="material-symbols-outlined text-[18px] text-white">arrow_forward</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Tracking Search Bar */}
        <div className="px-margin -mt-3 relative z-20">
          <form
            onSubmit={handleTrackSubmit}
            className="bg-surface-container-lowest rounded-2xl p-3 shadow-[0_8px_24px_rgba(16,28,43,0.08)] border border-surface-container/60 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0">search_check</span>
              <input
                type="text"
                value={trackInput}
                onChange={(e) => {
                  setTrackInput(e.target.value);
                  setTrackError('');
                }}
                placeholder="Track shipment: e.g. SKP-EXP-849204"
                className="w-full bg-transparent font-body-md text-sm text-on-surface placeholder:text-outline outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-primary text-white font-label-md text-xs font-bold shrink-0 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Track
              </button>
            </div>
            {trackError && (
              <span className="text-xs text-red-500 font-medium px-1">{trackError}</span>
            )}
          </form>
        </div>

        {/* Active Scheduled Pickup Banner (if any) */}
        {activeShipments.length > 0 && (
          <div className="px-margin pt-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                  <span className="font-label-md text-xs font-bold text-primary uppercase tracking-wider">
                    Active Consignment
                  </span>
                </div>
                {getStatusBadge(activeShipments[0].status)}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-base">
                    {activeShipments[0].trackingNumber}
                  </span>
                  <span className="text-xs text-tertiary">
                    {activeShipments[0].sender.city} → {activeShipments[0].receiver.city} • {activeShipments[0].packageDetails.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveShipment(activeShipments[0]);
                    navigate(`/courier/track/${activeShipments[0].id}`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-primary text-white font-label-md text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                >
                  <span>Track</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              <div className="mt-3 pt-2.5 border-t border-blue-100 flex items-center justify-between text-xs text-neutral-600">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                  ETA: <strong className="text-neutral-900">{activeShipments[0].estimatedDeliveryDate}</strong>
                </span>
                <span className="text-primary font-semibold">
                  OTP: {activeShipments[0].deliveryOtp}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Logistics Service Highlights Grid */}
        <div className="px-margin pt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface">
              Logistics Services
            </h2>
            <span className="text-xs text-secondary font-bold">Intercity Corridors</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div
              onClick={() => navigate('/courier/send?speed=same_day_prime')}
              className="bg-surface-container-low hover:bg-surface-container p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-colors border border-surface-container/60 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
              </div>
              <span className="font-bold text-xs text-on-surface leading-tight">Same-Day Prime</span>
              <span className="text-[10px] text-tertiary mt-0.5">6-10 hrs transit</span>
            </div>

            <div
              onClick={() => navigate('/courier/send?speed=express_cargo')}
              className="bg-surface-container-low hover:bg-surface-container p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-colors border border-surface-container/60 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              </div>
              <span className="font-bold text-xs text-on-surface leading-tight">Express Cargo</span>
              <span className="text-[10px] text-tertiary mt-0.5">Next morning</span>
            </div>

            <div
              onClick={() => navigate('/courier/send?speed=standard_surface')}
              className="bg-surface-container-low hover:bg-surface-container p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-colors border border-surface-container/60 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <span className="font-bold text-xs text-on-surface leading-tight">Surface Cargo</span>
              <span className="text-[10px] text-tertiary mt-0.5">Economical 48h</span>
            </div>
          </div>
        </div>

        {/* Recent Shipments List */}
        <div className="px-margin pt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface">
              Recent Shipments
            </h2>
            <button
              type="button"
              onClick={() => navigate('/activity')}
              className="text-xs text-primary font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                onClick={() => {
                  setActiveShipment(shipment);
                  navigate(`/courier/track/${shipment.id}`);
                }}
                className="bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container/70 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[20px]">package_2</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface truncate">
                        {shipment.trackingNumber}
                      </span>
                      {getStatusBadge(shipment.status)}
                    </div>
                    <span className="text-xs text-tertiary truncate">
                      {shipment.sender.city} → {shipment.receiver.city} • ₹{shipment.pricing.totalEstimatedFare}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center text-outline">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Addresses / Frequent Contacts */}
        <div className="px-margin pt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface">
              Frequent Contacts
            </h2>
            <span className="text-xs text-tertiary">Quick Send</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {savedReceivers.slice(0, 2).map((recv, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/courier/send?receiverName=${encodeURIComponent(recv.name)}`)}
                className="bg-surface-container-low hover:bg-surface-container p-3 rounded-2xl flex flex-col justify-between border border-surface-container/60 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-secondary font-bold text-xs mb-1">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    <span className="truncate">{recv.name.split(' ')[0]}</span>
                  </div>
                  <span className="text-xs font-semibold text-on-surface line-clamp-1">{recv.city}</span>
                  <span className="text-[11px] text-tertiary line-clamp-1">{recv.addressLine}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-surface-container flex items-center gap-1 text-[11px] font-bold text-primary">
                  <span>Send Parcel</span>
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prototype Pricing Disclaimer Pill */}
        <div className="px-margin pt-6">
          <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container text-center">
            <p className="text-[11px] text-tertiary leading-relaxed">
              <strong>Skyppy Intercity Logistics Prototype:</strong> Freight rates and speed estimates are calculated using intercity distance models for Mysuru, Bengaluru, Mangaluru and regional Karnataka corridors.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
