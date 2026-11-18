import React from 'react';
import { useDriverStore } from '../../store/useDriverStore';
import { DriverStatus, NetworkStatus, DriverVehicleType } from '../../types/driver';

export const DemoControlsModal: React.FC = () => {
  const {
    demoModalOpen,
    setDemoModalOpen,
    driverStatus,
    setDriverStatus,
    networkStatus,
    setNetworkStatus,
    simulateIncomingRequest,
    arriveAtPickup,
    startTrip,
    completeTrip,
    resetDemoState,
    profile,
    selectVehicle
  } = useDriverStore();

  if (!demoModalOpen) return null;

  const statusSteps: { label: string; status: DriverStatus }[] = [
    { label: 'Offline', status: 'OFFLINE' },
    { label: 'Online (Idle)', status: 'ONLINE' },
    { label: 'Incoming Request', status: 'REQUEST_RECEIVED' },
    { label: 'Nav to Pickup', status: 'NAVIGATING_TO_PICKUP' },
    { label: 'Arrived at Pickup', status: 'ARRIVED_AT_PICKUP' },
    { label: 'OTP Verification', status: 'OTP_VERIFICATION' },
    { label: 'Trip Started', status: 'TRIP_STARTED' },
    { label: 'Nav to Dropoff', status: 'NAVIGATING_TO_DESTINATION' },
    { label: 'Trip Completed', status: 'TRIP_COMPLETED' }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-surface sm:rounded-3xl rounded-t-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <div>
              <h3 className="text-base font-bold text-on-surface">Competition Demo Controls</h3>
              <p className="text-[11px] text-on-surface-variant font-medium">Quick state simulator for judges & testing</p>
            </div>
          </div>
          <button
            onClick={() => setDemoModalOpen(false)}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Quick Trigger Incoming Request */}
          <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Fast Action</span>
              <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">One-Click</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-3">
              Trigger a realistic simulated ride request from VVCE Campus to Mysuru Railway Station with a 25s acceptance timer.
            </p>
            <button
              onClick={() => {
                simulateIncomingRequest();
                setDemoModalOpen(false);
              }}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
              Simulate Incoming Ride Request
            </button>
          </div>

          {/* Jump to State */}
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
              Driver Lifecycle State Machine
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusSteps.map((step) => {
                const isActive = driverStatus === step.status;
                return (
                  <button
                    key={step.status}
                    onClick={() => {
                      if (step.status === 'REQUEST_RECEIVED') {
                        simulateIncomingRequest();
                      } else {
                        setDriverStatus(step.status);
                      }
                      setDemoModalOpen(false);
                    }}
                    className={`px-3 py-2 text-xs font-medium rounded-xl text-left transition-all border ${
                      isActive
                        ? 'bg-primary text-on-primary border-primary font-bold shadow-sm'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{step.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white ml-1 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Network Resilience Simulation */}
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
              Simulate Network Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ONLINE', 'POOR_NETWORK', 'OFFLINE'] as NetworkStatus[]).map((net) => {
                const isCurrent = networkStatus === net;
                return (
                  <button
                    key={net}
                    onClick={() => setNetworkStatus(net)}
                    className={`py-2 px-2 text-xs font-medium rounded-xl text-center transition-all border ${
                      isCurrent
                        ? net === 'ONLINE'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : net === 'POOR_NETWORK'
                          ? 'bg-amber-600 text-white border-amber-600 font-bold'
                          : 'bg-rose-600 text-white border-rose-600 font-bold'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/30'
                    }`}
                  >
                    {net === 'ONLINE' ? '🟢 Normal' : net === 'POOR_NETWORK' ? '🟡 2G/Poor' : '🔴 Offline'}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              Simulates intermittent mobile reception in transit. Non-blocking state allows offline actions to queue.
            </p>
          </div>

          {/* Switch Vehicle Profile */}
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
              Active Vehicle Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {profile.availableVehicles.map((v) => {
                const isSelected = profile.activeVehicle.category === v.category;
                return (
                  <button
                    key={v.category}
                    onClick={() => selectVehicle(v.category as DriverVehicleType)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary font-bold'
                        : 'bg-surface-container border-outline-variant/20 text-on-surface'
                    }`}
                  >
                    <div className="font-semibold capitalize">{v.category}</div>
                    <div className="text-[10px] text-on-surface-variant truncate">{v.model}</div>
                    <div className="text-[9px] font-mono text-on-surface-variant/80">{v.registrationNumber}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset State */}
          <div className="pt-2 border-t border-outline-variant/20">
            <button
              onClick={() => {
                if (window.confirm('Reset driver demo to initial default state?')) {
                  resetDemoState();
                  setDemoModalOpen(false);
                }
              }}
              className="w-full py-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset Driver Demo State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
