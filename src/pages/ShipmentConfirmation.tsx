import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { useCourierStore } from '../store/useCourierStore';

export const ShipmentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { shipments, activeShipment, setActiveShipment } = useCourierStore();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const shipmentId = searchParams.get('id');
  const shipment =
    (shipmentId ? shipments.find((s) => s.id === shipmentId) : null) ||
    activeShipment ||
    shipments[0];

  if (!shipment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-tertiary mb-2">inventory_2</span>
        <h2 className="text-lg font-bold">No Shipment Found</h2>
        <button
          onClick={() => navigate('/courier')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold"
        >
          Return to Courier Home
        </button>
      </div>
    );
  }

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareReceiver = () => {
    const receiverUrl = `${window.location.origin}/courier/receiver/${shipment.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(receiverUrl);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-8 bg-surface min-h-full">
      <Header
        type="stack"
        title="Consignment Booked"
        onBack={() => navigate('/courier')}
      />

      <main className="flex-1 px-margin py-4 flex flex-col gap-4">
        {/* Success Card Header */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-5 text-center flex flex-col items-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 mb-3 animate-bounce">
            <span className="material-symbols-outlined text-[32px]">check</span>
          </div>

          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Pickup Confirmed
          </span>
          <h1 className="text-xl font-extrabold text-on-surface mt-1">
            Consignment Scheduled!
          </h1>
          <p className="text-xs text-tertiary mt-1">
            Skyppy dispatch vehicle assigned for doorstep pickup.
          </p>
        </div>

        {/* Tracking Code & Simulated Barcode / QR */}
        <div className="bg-surface-container-lowest border border-surface-container/80 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-3">
          <div className="w-full flex items-center justify-between pb-2 border-b border-surface-container">
            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">
              Tracking Number
            </span>
            <button
              type="button"
              onClick={handleCopyTracking}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="text-2xl font-mono font-extrabold tracking-wider text-on-surface">
            {shipment.trackingNumber}
          </div>

          {/* Barcode Graphic Simulation */}
          <div className="w-full bg-surface-container-low p-3 rounded-xl flex flex-col items-center gap-1.5 border border-surface-container">
            <div className="flex items-center justify-center gap-[3px] h-10 w-full px-4 overflow-hidden">
              {[4, 2, 6, 2, 4, 8, 2, 4, 6, 2, 4, 2, 8, 4, 2, 6, 4, 2, 8, 2, 4, 6, 2, 4].map((h, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 rounded-[1px]"
                  style={{
                    width: `${(i % 3) + 2}px`,
                    height: `${28 + (h % 3) * 4}px`
                  }}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-tertiary">
              *{shipment.trackingNumber}* • SKYPPY-CARGO
            </span>
          </div>

          {/* Security OTP Card */}
          <div className="w-full bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[20px]">pin</span>
              <div>
                <span className="text-xs font-bold text-amber-900 block">Delivery Security OTP</span>
                <span className="text-[10px] text-amber-700">Give this to the driver upon final parcel dropoff</span>
              </div>
            </div>
            <span className="font-mono text-lg font-extrabold text-amber-950 px-2.5 py-1 bg-amber-100 rounded-lg">
              {shipment.deliveryOtp}
            </span>
          </div>
        </div>

        {/* Consignment Specs */}
        <div className="bg-surface-container-low border border-surface-container/70 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Consignment Details
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary uppercase">
              {shipment.serviceName}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-surface-container/50">
              <span className="text-[10px] text-tertiary block">Category & Weight</span>
              <strong className="text-on-surface capitalize">
                {shipment.packageDetails.category} • {shipment.packageDetails.weightKg} kg
              </strong>
            </div>

            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-surface-container/50">
              <span className="text-[10px] text-tertiary block">Dimensions</span>
              <strong className="text-on-surface">
                {shipment.packageDetails.lengthCm}×{shipment.packageDetails.widthCm}×{shipment.packageDetails.heightCm} cm
              </strong>
            </div>

            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-surface-container/50 col-span-2">
              <span className="text-[10px] text-tertiary block">Corridor Route</span>
              <strong className="text-on-surface">
                {shipment.sender.city} → {shipment.receiver.city} (~{shipment.pricing.distanceKm} km)
              </strong>
            </div>
          </div>

          {/* Pickup Window */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
            <div className="flex items-center gap-1.5 text-tertiary">
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
              <span>Pickup Window:</span>
            </div>
            <strong className="text-on-surface">
              {shipment.pickupSchedule.date}, {shipment.pickupSchedule.slotLabel.split('(')[0]}
            </strong>
          </div>

          {/* Amount Paid */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-tertiary">Amount Paid (Incl. GST):</span>
            <strong className="text-primary text-base font-extrabold">
              ₹{shipment.pricing.totalEstimatedFare}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              setActiveShipment(shipment);
              navigate(`/courier/track/${shipment.id}`);
            }}
            className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-primary/25 transition-transform"
          >
            <span className="material-symbols-outlined text-[19px]">local_shipping</span>
            <span>Track Live Shipment</span>
          </button>

          <button
            type="button"
            onClick={handleShareReceiver}
            className="w-full h-11 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">share</span>
            <span>{shared ? 'Receiver Tracking Link Copied!' : 'Share Tracking Link with Receiver'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/courier')}
            className="w-full py-2.5 text-center text-xs text-tertiary font-bold hover:text-on-surface transition-colors"
          >
            Return to Courier Home
          </button>
        </div>
      </main>
    </div>
  );
};

