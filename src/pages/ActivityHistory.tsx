import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { useCourierStore } from '../store/useCourierStore';
import { RideHistoryItem } from '../types';
import { translations } from '../utils/i18n';
import { Button, Card, Badge, SegmentedControl } from '../components/common';

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
  const totalMilesEarned = completedRides.reduce((acc, r) => acc + (r.milesEarned || 0), 0);

  const handleRebook = (item: RideHistoryItem) => {
    rebookRide(item);
    navigate('/options');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-8 bg-[#f8fafc] min-h-full">
      <Header type="tab" />

      <main className="flex flex-col w-full pb-8">
        {/* Page Title Section */}
        <div className="flex items-center justify-between px-margin pt-3 pb-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
              {language === 'kn' ? t.activityTitle : 'Trip Ledger & History'}
            </span>
            <h1 className="text-xl font-bold text-brand-navy tracking-tight mt-0.5">
              {language === 'kn' ? t.activityTitle : 'Your Activity'}
            </h1>
          </div>
          <button
            aria-label="Download statement"
            onClick={() => showToast('Exporting monthly transit summary as PDF...', 'success')}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs active:scale-95 transition-transform"
            type="button"
            title="Download Statement"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>

        {/* Primary Service Segmented Switcher (Rides vs Courier) */}
        <div className="px-margin pb-3">
          <SegmentedControl
            size="md"
            value={serviceType}
            onChange={(val) => setServiceType(val as 'rides' | 'courier')}
            options={[
              {
                id: 'rides',
                label: `${t.ridesTab} (${rideHistory.length})`,
                icon: <span className="material-symbols-outlined text-[16px]">local_taxi</span>
              },
              {
                id: 'courier',
                label: `${t.consignmentsTab} (${shipments.length})`,
                icon: <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              }
            ]}
          />
        </div>

        {serviceType === 'courier' ? (
          /* ================= COURIER SHIPMENTS TAB ================= */
          <div className="flex flex-col gap-3">
            {/* Courier Filter Tabs */}
            <div className="px-margin">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                        isSelected
                          ? 'bg-brand-navy text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Courier Shipments List */}
            <div className="px-margin flex flex-col gap-2.5 pb-6">
              {shipments
                .filter((s) => {
                  if (courierTab === 'all') return true;
                  if (courierTab === 'active') return s.status !== 'delivered' && s.status !== 'cancelled';
                  if (courierTab === 'delivered') return s.status === 'delivered';
                  return true;
                })
                .map((shipment) => (
                  <Card key={shipment.id} variant="default" padding="sm" className="flex flex-col gap-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-mono font-bold text-xs text-slate-900 truncate">
                              {shipment.trackingNumber}
                            </h3>
                            <Badge
                              variant={shipment.status === 'delivered' ? 'success' : 'primary'}
                              size="sm"
                            >
                              {shipment.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                            {shipment.sender.city} → {shipment.receiver.city} • {shipment.packageDetails.description}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-slate-900 shrink-0">
                        ₹{shipment.pricing.totalEstimatedFare}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 truncate">
                        Receiver: <strong className="text-slate-800">{shipment.receiver.name}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveShipment(shipment);
                          navigate(`/courier/track/${shipment.id}`);
                        }}
                        className="px-3 py-1 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                      >
                        <span>Track</span>
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </button>
                    </div>
                  </Card>
                ))}

              <Button
                variant="outline"
                size="md"
                fullWidth
                leftIcon={<span className="material-symbols-outlined text-[18px]">add_circle</span>}
                onClick={() => navigate('/courier/send')}
                className="mt-1"
              >
                Send Another Intercity Parcel
              </Button>
            </div>
          </div>
        ) : (
          /* ================= PASSENGER RIDES TAB ================= */
          <>
            {/* Active Ongoing Ride Banner (If In-Transit) */}
            {activeBooking && (
              <div className="px-margin mb-3">
                <div
                  onClick={() => navigate('/tracking')}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary to-blue-800 p-3.5 text-white shadow-elevated cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lime-300 shrink-0">
                        <span className="material-symbols-outlined text-[24px] animate-pulse">electric_rickshaw</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-lime-300 text-slate-950 px-2 py-0.2 rounded-full">
                            Active Ride
                          </span>
                          <span className="text-white/80 text-[11px]">
                            Arriving in {activeBooking.etaMinutes || 4} min
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-0.5 truncate">
                          {activeBooking.pickup.title} → {activeBooking.destination.title}
                        </h3>
                        <p className="text-[11px] text-white/70 truncate">
                          Driver: {activeBooking.driver.name} • {activeBooking.driver.plate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold shrink-0">
                      <span>Track</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Pills with Counts */}
            <div className="px-margin mb-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                        isSelected
                          ? 'bg-brand-navy text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monthly Transit Stats Card */}
            <div className="px-margin mb-3">
              <div className="bg-white rounded-2xl p-3.5 flex items-center justify-between border border-slate-100 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block leading-tight">
                      Transit Summary
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {completedRides.length} Trips • {totalKm.toFixed(1)} km Travelled
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block">₹{totalSpent}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+{totalMilesEarned} Miles</span>
                </div>
              </div>
            </div>

            {/* Activity List & Empty State */}
            <div className="px-margin flex flex-col gap-2.5 pb-6">
              {filtered.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl shadow-xs flex flex-col items-center justify-center gap-2 border border-slate-100">
                  <span className="material-symbols-outlined text-[36px] text-slate-300">history_toggle_off</span>
                  <h3 className="font-bold text-slate-900 text-sm">No {activeTab} rides found</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Your past trips, upcoming schedules, and receipts will appear here automatically.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/search')}
                    className="mt-2"
                  >
                    Book a Ride Now
                  </Button>
                </div>
              ) : (
                filtered.map((item) => {
                  const isCompleted = item.status === 'completed';
                  const isScheduled = item.status === 'scheduled';
                  const isCancelled = item.status === 'cancelled';

                  return (
                    <Card
                      key={item.id}
                      variant="default"
                      padding="sm"
                      className={`flex flex-col gap-2.5 ${
                        isScheduled ? 'border-amber-200 ring-1 ring-amber-100' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isCancelled
                                ? 'bg-red-50 text-red-600'
                                : isScheduled
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-slate-100 text-brand-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[22px]">
                              {item.vehicleIcon || 'directions_car'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-sm text-slate-900 truncate">{item.vehicle}</h3>
                              <Badge
                                variant={
                                  isCancelled ? 'error' : isScheduled ? 'warning' : 'neutral'
                                }
                                size="sm"
                              >
                                {isCancelled ? 'Cancelled' : isScheduled ? 'Scheduled' : item.date}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                              {item.origin} → {item.destination}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <span className="text-sm font-bold text-slate-900 block">₹{item.fare}</span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Trip Meta Pill */}
                      {isCompleted && (
                        <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                          <div className="flex items-center gap-2">
                            <span>{item.distanceKm} km • {item.durationMin} mins</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-brand-primary font-bold">+{item.milesEarned} Miles</span>
                          </div>
                          {item.rating && (
                            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                              <span className="material-symbols-outlined text-[13px]">star</span>
                              <span>{item.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {isScheduled && (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-500">Advance reservation confirmed</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => cancelScheduledRide(item.id)}
                          >
                            Cancel Schedule
                          </Button>
                        </div>
                      )}

                      {/* Action Buttons for Completed Trips */}
                      {isCompleted && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <button
                            onClick={() => openModal('receipt', item)}
                            className="text-xs text-brand-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[15px]">receipt</span>
                            <span>{t.viewReceipt}</span>
                          </button>
                          <Button
                            variant="primary"
                            size="sm"
                            rightIcon={<span className="material-symbols-outlined text-[14px]">arrow_forward</span>}
                            onClick={() => handleRebook(item)}
                          >
                            {t.rebookRide}
                          </Button>
                        </div>
                      )}
                    </Card>
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
