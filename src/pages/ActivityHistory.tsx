import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { useCourierStore } from '../store/useCourierStore';
import { RideHistoryItem } from '../types';
import { translations } from '../utils/i18n';

export const ActivityHistory: React.FC = () => {
  const navigate = useNavigate();
  const { rideHistory, activeBooking, openModal, rebookRide, cancelScheduledRide, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;
  const { shipments, setActiveShipment } = useCourierStore();

  const [serviceType, setServiceType] = useState<'rides' | 'courier'>('rides');
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'scheduled' | 'cancelled'>('all');
  const [courierTab, setCourierTab] = useState<'all' | 'active' | 'delivered'>('all');

  const filtered = rideHistory.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  const completedRides = rideHistory.filter((r) => r.status === 'completed');
  const scheduledRides = rideHistory.filter((r) => r.status === 'scheduled');
  const cancelledRides = rideHistory.filter((r) => r.status === 'cancelled');

  const totalKm = completedRides.reduce((acc, r) => acc + (r.distanceKm || 0), 0);
  const totalSpent = completedRides.reduce((acc, r) => acc + (r.fare || 0), 0);

  const handleRebook = (item: RideHistoryItem) => {
    rebookRide(item);
    navigate('/options');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-6 bg-surface min-h-full">
      <Header type="tab" />

      <main className="flex flex-col w-full">
        {/* Page Title Section */}
        <div className="flex items-center justify-between px-margin pt-space-xs pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              {language === 'kn' ? t.activityTitle : 'Trip Ledger & History'}
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {language === 'kn' ? t.activityTitle : 'Your Activity'}
            </h1>
          </div>
          <button
            aria-label="Download statement"
            onClick={() => showToast('Exporting monthly transit summary as PDF...', 'success')}
            className="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-transform"
            type="button"
            title="Download Statement"
          >
            <span className="material-symbols-outlined text-[22px]">download</span>
          </button>
        </div>

        {/* Service Type Switcher Pill */}
        <div className="px-margin pb-3">
          <div className="bg-surface-container-low p-1 rounded-2xl flex items-center border border-surface-container shadow-xs">
            <button
              type="button"
              onClick={() => setServiceType('rides')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 font-label-md text-xs transition-all ${
                serviceType === 'rides'
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'text-tertiary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">local_taxi</span>
              <span>{t.ridesTab} ({rideHistory.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setServiceType('courier')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 font-label-md text-xs transition-all ${
                serviceType === 'courier'
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'text-tertiary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>{t.consignmentsTab} ({shipments.length})</span>
            </button>
          </div>
        </div>

        {serviceType === 'courier' ? (
          /* COURIER SHIPMENTS TAB */
          <div className="flex flex-col gap-3">
            {/* Courier Filter Tabs */}
            <div className="px-margin">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: `All (${shipments.length})` },
                  {
                    id: 'active',
                    label: `In Transit (${
                      shipments.filter((s) => s.status !== 'delivered' && s.status !== 'cancelled').length
                    })`
                  },
                  {
                    id: 'delivered',
                    label: `Delivered (${shipments.filter((s) => s.status === 'delivered').length})`
                  }
                ].map((tab) => {
                  const isSelected = courierTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCourierTab(tab.id as any)}
                      className={`px-3.5 py-1.5 rounded-full font-label-md text-xs shrink-0 shadow-sm active:scale-95 transition-all ${
                        isSelected
                          ? 'bg-on-surface text-surface-container-lowest font-bold'
                          : 'bg-surface-container-lowest text-on-surface-variant font-medium hover:bg-surface-container-low'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Courier Shipments List */}
            <div className="px-margin flex flex-col gap-3 pb-6">
              {shipments
                .filter((s) => {
                  if (courierTab === 'all') return true;
                  if (courierTab === 'active') return s.status !== 'delivered' && s.status !== 'cancelled';
                  if (courierTab === 'delivered') return s.status === 'delivered';
                  return true;
                })
                .map((shipment) => (
                  <div
                    key={shipment.id}
                    className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container/60 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-mono font-bold text-xs text-on-surface">
                              {shipment.trackingNumber}
                            </h3>
                            <span
                              className={`px-1.5 py-0.5 rounded font-label-sm text-[10px] font-bold ${
                                shipment.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-primary'
                              }`}
                            >
                              {shipment.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                            {shipment.sender.city} → {shipment.receiver.city} • {shipment.packageDetails.description}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-on-surface">
                        ₹{shipment.pricing.totalEstimatedFare}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
                      <span className="text-tertiary">
                        Receiver: <strong>{shipment.receiver.name}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveShipment(shipment);
                          navigate(`/courier/track/${shipment.id}`);
                        }}
                        className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                      >
                        <span>Track Consignment</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ))}

              <button
                type="button"
                onClick={() => navigate('/courier/send')}
                className="w-full py-3 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-primary font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all mt-1"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Send Another Intercity Parcel</span>
              </button>
            </div>
          </div>
        ) : (
          /* PASSENGER RIDES TAB (EXACT EXISTING FLOW) */
          <>
            {/* Active Ongoing Ride Banner */}
        {activeBooking && (
          <div className="px-margin mb-3">
            <div
              onClick={() => navigate('/tracking')}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-container to-[#1a42be] p-4 text-on-primary shadow-lg cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-secondary-fixed shrink-0">
                    <span className="material-symbols-outlined text-[28px] animate-pulse">electric_rickshaw</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
                        Active Ride
                      </span>
                      <span className="font-label-sm text-on-primary-container text-[11px]">
                        Arriving in {activeBooking.etaMinutes || 4} min
                      </span>
                    </div>
                    <h3 className="font-label-lg text-label-lg font-bold text-on-primary mt-0.5">
                      {activeBooking.pickup.title} → {activeBooking.destination.title}
                    </h3>
                    <p className="font-body-sm text-[12px] text-on-primary-container">
                      Driver: {activeBooking.driver.name} • {activeBooking.driver.plate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full text-on-primary text-[12px] font-semibold">
                  <span>Track</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Segmented Tabs with Dynamic Counts */}
        <div className="px-margin mb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: `All (${rideHistory.length})` },
              { id: 'completed', label: `Completed (${completedRides.length})` },
              { id: 'scheduled', label: `Scheduled (${scheduledRides.length})` },
              { id: 'cancelled', label: `Cancelled (${cancelledRides.length})` }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-xs shrink-0 shadow-sm active:scale-95 transition-all ${
                    isSelected
                      ? 'bg-on-surface text-surface-container-lowest font-bold'
                      : 'bg-surface-container-lowest text-on-surface-variant font-medium hover:bg-surface-container-low'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Monthly Transit Stats Bento Mini */}
        <div className="px-margin mb-4">
          <div className="bg-surface-container-low rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">
                  Transit Ledger
                </span>
                <p className="font-label-md text-label-md font-bold text-on-surface">
                  {completedRides.length} Trips • {totalKm.toFixed(1)} km Travelled
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-numeric-md text-numeric-md font-bold text-on-surface">₹{totalSpent}</span>
              <span className="block font-label-sm text-[10px] text-secondary font-semibold">100% Eco-Credited</span>
            </div>
          </div>
        </div>

        {/* Activity List & Empty State */}
        <div className="px-margin flex flex-col gap-3 pb-6">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-2xl shadow-xs flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[40px] text-tertiary">history_toggle_off</span>
              <h3 className="font-headline font-bold text-on-surface text-base">No {activeTab} rides found</h3>
              <p className="text-xs text-on-surface-variant max-w-xs">
                Your past trips, upcoming schedules, and receipts will appear here automatically.
              </p>
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="mt-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs font-bold shadow-md hover:bg-primary-container active:scale-95 transition-transform"
              >
                Book a Ride Now
              </button>
            </div>
          ) : (
            filtered.map((item) => {
              const isCompleted = item.status === 'completed';
              const isScheduled = item.status === 'scheduled';
              const isCancelled = item.status === 'cancelled';

              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3 ${
                    isScheduled ? 'border border-secondary/30 ring-1 ring-secondary/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isCancelled
                            ? 'bg-error-container text-error'
                            : isScheduled
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[24px]">{item.vehicleIcon || 'directions_car'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-label-lg text-label-lg font-bold text-on-surface">{item.vehicle}</h3>
                          <span
                            className={`px-1.5 py-0.5 rounded font-label-sm text-[10px] ${
                              isCancelled
                                ? 'bg-error-container text-on-error-container font-bold'
                                : isScheduled
                                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                                : 'bg-surface-container text-tertiary'
                            }`}
                          >
                            {isCancelled ? 'Cancelled' : isScheduled ? 'Scheduled' : item.date}
                          </span>
                        </div>
                        <p className="font-body-sm text-[13px] text-on-surface-variant font-medium">
                          {item.origin} → {item.destination}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-numeric-md text-numeric-md font-bold text-on-surface">₹{item.fare}</span>
                      <span className="block font-label-sm text-[10px] text-secondary font-semibold">
                        {item.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Trip Meta Pill */}
                  {isCompleted && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-surface-container-low text-[12px] text-tertiary">
                      <div className="flex items-center gap-2">
                        <span>{item.distanceKm} km • {item.durationMin} mins</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="text-primary font-semibold">+{item.milesEarned} Skyppy Miles</span>
                      </div>
                      {item.rating && (
                        <div className="flex items-center gap-1 text-secondary font-bold">
                          <span className="material-symbols-outlined text-[14px] fill-1">star</span>
                          <span>{item.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isScheduled && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-label-sm text-[11px] text-tertiary">Advance reservation confirmed</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => cancelScheduledRide(item.id)}
                          className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold active:scale-95 transition-transform"
                        >
                          Cancel Schedule
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons for Completed Trips */}
                  {isCompleted && (
                    <div className="flex items-center justify-between pt-0.5 border-t border-surface-container-low">
                      <button
                        onClick={() => openModal('receipt', item)}
                        className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt</span>
                        <span>{t.viewReceipt}</span>
                      </button>
                      <button
                        onClick={() => handleRebook(item)}
                        className="h-8 px-3.5 rounded-full bg-primary text-on-primary font-label-sm text-[11px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform cursor-pointer"
                        type="button"
                      >
                        <span>{t.rebookRide}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        </>
        )}
      </main>
    </div>
  );
};
