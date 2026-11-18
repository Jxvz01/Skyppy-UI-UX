import React, { useState } from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const DriverSafetyModal: React.FC = () => {
  const {
    safetyModalOpen,
    setSafetyModalOpen,
    activeRequest,
    profile,
    triggerEmergencySimulation,
    reportSafetyIncident
  } = useDriverStore();

  const [activeTab, setActiveTab] = useState<'emergency' | 'share' | 'report'>('emergency');
  const [emergencyConfirmed, setEmergencyConfirmed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Incident report form state
  const [incidentType, setIncidentType] = useState('Passenger Behaviour');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!safetyModalOpen) return null;

  const handleCopyShareLink = () => {
    const text = `Skyppy Driver Live Tracking - Driver: ${profile.name} (${profile.activeVehicle.registrationNumber}) on active trip to ${activeRequest?.destination.title || 'Mysuru Railway Station'}. Demo link: https://skyppy.app/driver-view/track/live`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportSafetyIncident(incidentType, incidentDescription);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setSafetyModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">shield</span>
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Driver Safety Center
              </h3>
              <p className="text-[11px] text-slate-400">Emergency &amp; trip security support</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSafetyModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('emergency')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'emergency'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Emergency
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'share'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Share Trip
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'report'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Report Issue
          </button>
        </div>

        {/* TAB 1: EMERGENCY ACTION */}
        {activeTab === 'emergency' && (
          <div className="flex flex-col gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-200">
              <span className="font-bold block mb-1">PROTOTYPE DEMO SIMULATION</span>
              <p>
                In production, this triggers automated 112 police emergency dispatch and real-time audio telemetry to Skyppy 24/7 Security.
              </p>
            </div>

            {!emergencyConfirmed ? (
              <div className="flex flex-col gap-2 items-center text-center p-3">
                <span className="material-symbols-outlined text-[48px] text-rose-600 animate-bounce">
                  emergency
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Confirm Simulated Emergency
                </span>
                <p className="text-xs text-slate-500">
                  Tap below to broadcast a simulated emergency response test.
                </p>
                <button
                  type="button"
                  onClick={() => setEmergencyConfirmed(true)}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span>Trigger Emergency Protocol</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-900/40 border border-rose-300 dark:border-rose-700 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[36px] text-rose-700 dark:text-rose-300">
                  health_and_safety
                </span>
                <span className="text-sm font-extrabold text-rose-900 dark:text-rose-100">
                  [Simulated] Emergency Dispatch Broadcasted
                </span>
                <p className="text-xs text-rose-800 dark:text-rose-200">
                  Mock coordinates (VVCE Gokulam corridor) sent to emergency authorities and Skyppy Safety Team.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    triggerEmergencySimulation();
                    setEmergencyConfirmed(false);
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Dismiss Emergency Status
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SHARE TRIP */}
        {activeTab === 'share' && (
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Driver</span>
                <span className="font-bold text-slate-900 dark:text-white">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {profile.activeVehicle.model} ({profile.activeVehicle.registrationNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {activeRequest?.destination.title || 'Mysuru Railway Station'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Share Live Tracking Details'}</span>
            </button>
          </div>
        )}

        {/* TAB 3: REPORT INCIDENT */}
        {activeTab === 'report' && (
          <form onSubmit={handleReportSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Incident Category
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-primary"
              >
                <option value="Passenger Behaviour">Passenger Behaviour</option>
                <option value="Unsafe Pickup / Dropoff Location">Unsafe Pickup / Dropoff Location</option>
                <option value="Route or Road Obstruction">Route or Road Obstruction</option>
                <option value="Harassment or Dispute">Harassment or Dispute</option>
                <option value="Vehicle Mechanical Issue">Vehicle Mechanical Issue</option>
                <option value="Other">Other Safety Concern</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Details (Optional)
              </label>
              <textarea
                rows={3}
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                placeholder="Describe what occurred..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-primary"
              />
            </div>

            {reportSubmitted ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center">
                Report logged successfully!
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-md active:scale-98 transition-all"
              >
                Submit Incident Report
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
