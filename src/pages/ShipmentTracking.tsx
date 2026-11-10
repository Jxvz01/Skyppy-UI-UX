import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { OpenStreetMap } from '../components/OpenStreetMap';
import { useCourierStore } from '../store/useCourierStore';
import { ShipmentStatus } from '../types/courier';

export const ShipmentTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shipments, getShipmentById, updateShipmentStatus, verifyDeliveryOtp } = useCourierStore();

  const shipment = (id ? getShipmentById(id) : null) || shipments[0];

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [showSimControls, setShowSimControls] = useState(false);

  if (!shipment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-tertiary mb-2">search_off</span>
        <h2 className="text-lg font-bold">Shipment Not Found</h2>
        <button
          onClick={() => navigate('/courier')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold"
        >
          Return to Courier Home
        </button>
      </div>
    );
  }

  // Calculate coordinates for intercity corridor map
  const originLat = shipment.sender.city.toLowerCase() === 'mysuru' ? 12.3168 : 12.9716;
  const originLng = shipment.sender.city.toLowerCase() === 'mysuru' ? 76.6436 : 77.5946;
  const destLat = shipment.receiver.city.toLowerCase() === 'bengaluru' ? 12.9716 : 12.3168;
  const destLng = shipment.receiver.city.toLowerCase() === 'bengaluru' ? 77.5946 : 76.6436;

  // Midpoint or current vehicle location
  const currentLat = shipment.currentLocation?.lat || (originLat + destLat) / 2;
  const currentLng = shipment.currentLocation?.lng || (originLng + destLng) / 2;

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === shipment.deliveryOtp) {
      verifyDeliveryOtp(shipment.id, otpInput.trim());
      setOtpSuccess(true);
      setOtpError('');
    } else {
      setOtpError(`Incorrect OTP. Use "${shipment.deliveryOtp}" for this shipment.`);
    }
  };

  const handleAdvanceStatus = () => {
    const sequence: ShipmentStatus[] = [
      'booking_confirmed',
      'pickup_scheduled',
      'parcel_picked_up',
      'in_transit',
      'arrived_destination_hub',
      'out_for_delivery',
      'delivered'
    ];
    const currentIndex = sequence.indexOf(shipment.status);
    if (currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      updateShipmentStatus(shipment.id, nextStatus);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-10 bg-surface min-h-full">
      <Header
        type="stack"
        title="Live Shipment Tracking"
        onBack={() => navigate('/courier')}
      />

      <main className="flex-1 flex flex-col gap-3">
        {/* Top Info Banner */}
        <div className="px-margin pt-3">
          <div className="bg-surface-container-low border border-surface-container/70 rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-on-surface">
                  {shipment.trackingNumber}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                  {shipment.serviceName.split(' ')[0]}
                </span>
              </div>
              <span className="text-xs text-tertiary">
                {shipment.sender.city} → {shipment.receiver.city} • {shipment.packageDetails.weightKg} kg
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowSimControls(!showSimControls)}
              className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary flex items-center gap-1 active:scale-95"
              title="Toggle QA State Simulator"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Simulate</span>
            </button>
          </div>
        </div>

        {/* Simulation Controls Panel (Accordion) */}
        {showSimControls && (
          <div className="mx-margin bg-blue-50 border border-blue-200/90 rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">science</span>
                QA Logistics State Simulator
              </span>
              <span className="text-[10px] text-blue-700">Click to change state</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={handleAdvanceStatus}
                className="py-1.5 px-2 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-1 active:scale-95"
              >
                <span>Advance Next Stage</span>
                <span className="material-symbols-outlined text-[14px]">skip_next</span>
              </button>

              <button
                type="button"
                onClick={() => updateShipmentStatus(shipment.id, 'out_for_delivery')}
                className="py-1.5 px-2 bg-amber-500 text-white rounded-lg font-bold flex items-center justify-center gap-1 active:scale-95"
              >
                <span>Out for Delivery</span>
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              </button>

              <button
                type="button"
                onClick={() => updateShipmentStatus(shipment.id, 'delayed', 'Heavy traffic on Bangalore-Mysore Expressway')}
                className="py-1.5 px-2 bg-orange-600 text-white rounded-lg font-bold flex items-center justify-center gap-1 active:scale-95"
              >
                <span>Simulate Delay</span>
                <span className="material-symbols-outlined text-[14px]">warning</span>
              </button>

              <button
                type="button"
                onClick={() => updateShipmentStatus(shipment.id, 'delivered')}
                className="py-1.5 px-2 bg-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-1 active:scale-95"
              >
                <span>Simulate Delivered</span>
                <span className="material-symbols-outlined text-[14px]">done_all</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Corridor Map */}
        <div className="px-margin">
          <div className="h-56 rounded-2xl overflow-hidden border border-surface-container shadow-xs relative">
            <OpenStreetMap
              stepIndex={shipment.status === 'delivered' ? 4 : shipment.status === 'out_for_delivery' ? 3 : 2}
              speed={shipment.status === 'delivered' ? 0 : 58}
              driverName={shipment.proofOfDelivery?.deliveryAgentName || 'Express Logistics Pilot'}
              vehicleCategory="auto"
              isTrafficOn={true}
              className="w-full h-full"
            />

            {/* Floating Live Status Overlay */}
            <div className="absolute top-3 left-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-2.5 shadow-sm border border-surface-container/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${shipment.status === 'delivered' ? 'bg-green-500' : 'bg-primary animate-ping'}`} />
                <span className="text-xs font-bold text-on-surface">
                  {shipment.currentLocation?.label || `${shipment.sender.city} Hub`}
                </span>
              </div>
              <span className="text-[10px] font-bold text-secondary uppercase">
                {shipment.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Security OTP Card (if in transit / out for delivery) */}
        {shipment.status !== 'delivered' && (
          <div className="px-margin">
            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  Delivery Security OTP
                </span>
                <span className="text-[11px] text-amber-700">
                  Share this 4-digit code only upon parcel receipt
                </span>
              </div>
              <div className="font-mono text-xl font-extrabold text-amber-950 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                {shipment.deliveryOtp}
              </div>
            </div>
          </div>
        )}

        {/* Proof of Delivery (POD) Card (if delivered) */}
        {shipment.status === 'delivered' && shipment.proofOfDelivery && (
          <div className="px-margin">
            <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Proof of Delivery (POD)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                  OTP VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-emerald-700 block">Handed Over To</span>
                  <strong className="text-emerald-950">{shipment.proofOfDelivery.recipientName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block">Delivery Time</span>
                  <strong className="text-emerald-950">{shipment.proofOfDelivery.deliveredAt}</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-emerald-100 text-[11px] text-emerald-800">
                  <span>Delivered by: </span>
                  <strong>{shipment.proofOfDelivery.deliveryAgentName}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8-Stage Interactive Logistics Timeline */}
        <div className="px-margin pt-2">
          <div className="bg-surface-container-lowest border border-surface-container/70 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                Consignment Milestones
              </h3>
              <span className="text-xs text-tertiary">
                ETA: <strong>{shipment.estimatedDeliveryDate}</strong>
              </span>
            </div>

            <div className="flex flex-col gap-0 relative pl-4 mt-2">
              {shipment.checkpoints.map((cp, idx) => {
                const isLast = idx === shipment.checkpoints.length - 1;
                return (
                  <div key={idx} className="flex gap-3 pb-4 relative">
                    {/* Connecting line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[7px] top-4 bottom-0 w-0.5 ${
                          cp.isCompleted ? 'bg-primary' : 'bg-surface-container-high'
                        }`}
                      />
                    )}

                    {/* Checkpoint Dot */}
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        cp.isCompleted
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface-container border-2 border-surface-container-high'
                      }`}
                    >
                      {cp.isCompleted && (
                        <span className="material-symbols-outlined text-[10px]">check</span>
                      )}
                    </div>

                    {/* Checkpoint Details */}
                    <div className="flex-1 -mt-0.5">
                      <div className="flex items-baseline justify-between">
                        <span
                          className={`text-xs ${
                            cp.isCompleted ? 'font-bold text-on-surface' : 'text-tertiary'
                          }`}
                        >
                          {cp.title}
                        </span>
                        <span className="text-[10px] text-tertiary">{cp.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-outline mt-0.5">{cp.description}</p>
                      {cp.location && (
                        <span className="text-[10px] text-secondary font-medium block mt-0.5">
                          📍 {cp.location}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery OTP Direct Simulation (Receiver Test) */}
        {shipment.status !== 'delivered' && (
          <div className="px-margin">
            <form
              onSubmit={handleVerifyOtp}
              className="bg-surface-container-low border border-surface-container rounded-2xl p-4 flex flex-col gap-2.5"
            >
              <span className="text-xs font-bold text-on-surface">
                Verify Delivery with OTP (Simulation Test)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder={`Enter 4-digit OTP (${shipment.deliveryOtp})`}
                  className="flex-1 bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary font-mono tracking-widest text-center"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 active:scale-95"
                >
                  Verify & Deliver
                </button>
              </div>
              {otpError && <span className="text-xs text-red-500 font-medium">{otpError}</span>}
              {otpSuccess && <span className="text-xs text-emerald-600 font-bold">Consignment marked as delivered!</span>}
            </form>
          </div>
        )}

        {/* Public Receiver Link Card */}
        <div className="px-margin pt-1 pb-4">
          <div className="bg-surface-container-low border border-surface-container rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">person_pin_circle</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Receiver Public View</span>
                <span className="text-[10px] text-tertiary">Shareable recipient portal</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/courier/receiver/${shipment.id}`)}
              className="px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              <span>Open Portal</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
