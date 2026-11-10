import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourierStore } from '../store/useCourierStore';
import { SkyppyLogo } from '../components/SkyppyLogo';

export const ReceiverPortal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shipments, getShipmentById, verifyDeliveryOtp } = useCourierStore();

  const shipment = (id ? getShipmentById(id) : null) || shipments[0];

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  if (!shipment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-surface min-h-screen">
        <span className="material-symbols-outlined text-4xl text-tertiary mb-2">package_2</span>
        <h2 className="text-lg font-bold text-on-surface">Consignment Not Found</h2>
        <p className="text-xs text-tertiary mt-1">Please check your tracking link.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold"
        >
          Go to Skyppy Home
        </button>
      </div>
    );
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === shipment.deliveryOtp) {
      verifyDeliveryOtp(shipment.id, otpInput.trim());
      setOtpSuccess(true);
      setOtpError('');
    } else {
      setOtpError(`Invalid OTP. Please enter the correct 4-digit code (${shipment.deliveryOtp})`);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-8 bg-surface min-h-screen">
      {/* Receiver Top Brand Header */}
      <header className="sticky top-0 left-0 right-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-surface-container px-margin h-16 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <SkyppyLogo size="sm" subtitle="Recipient Portal" />
        </div>
        <span className="text-[11px] font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-full">
          Secure Recipient View
        </span>
      </header>

      <main className="flex-1 px-margin py-4 flex flex-col gap-4">
        {/* Recipient Welcome Card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs text-blue-200 font-semibold block uppercase tracking-wider">
              Incoming Consignment
            </span>
            <h1 className="text-xl font-extrabold mt-1">
              Hello, {shipment.receiver.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              {shipment.packageDetails.description} from {shipment.sender.name} ({shipment.sender.city})
            </p>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-200 uppercase tracking-wider block">Estimated Delivery</span>
                <strong className="text-sm font-bold text-secondary-fixed">
                  {shipment.status === 'delivered' ? 'Delivered' : `${shipment.estimatedDeliveryDate} ${shipment.estimatedDeliveryWindow}`}
                </strong>
              </div>
              <span className="font-mono text-xs text-blue-200 bg-white/10 px-2.5 py-1 rounded-lg">
                {shipment.trackingNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Security OTP Verification Card */}
        {shipment.status !== 'delivered' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">key</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-950">Your Delivery Verification PIN</h3>
                <span className="text-[11px] text-amber-800">Share this code with the driver to accept delivery</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 py-2">
              {shipment.deliveryOtp.split('').map((digit, i) => (
                <div
                  key={i}
                  className="w-12 h-14 rounded-xl bg-surface-container-lowest border-2 border-amber-300 font-mono font-extrabold text-2xl text-amber-950 flex items-center justify-center shadow-xs"
                >
                  {digit}
                </div>
              ))}
            </div>

            {/* Direct Accept Action for simulation */}
            <form onSubmit={handleVerifyOtp} className="pt-2 border-t border-amber-200/80 flex flex-col gap-2">
              <span className="text-[11px] text-amber-900 font-medium text-center">
                Accepting delivery now? Enter your PIN to sign off:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="flex-1 bg-surface-container-lowest border border-amber-300 rounded-xl px-3 py-2 text-sm text-center font-mono tracking-widest outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 active:scale-95 shadow-xs"
                >
                  Confirm Receipt
                </button>
              </div>
              {otpError && <span className="text-xs text-red-500 font-medium">{otpError}</span>}
            </form>
          </div>
        ) : (
          /* Proof of Delivery (POD) Certificate Card */
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[24px]">verified</span>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">Proof of Delivery (POD)</h3>
                  <span className="text-[10px] text-emerald-700">Digital consignee sign-off verified</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full">
                DELIVERED
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-800">Consignee:</span>
                <strong className="text-emerald-950">{shipment.proofOfDelivery?.recipientName || shipment.receiver.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800">Delivered At:</span>
                <strong className="text-emerald-950">{shipment.proofOfDelivery?.deliveredAt || 'Just now'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800">Handled By:</span>
                <strong className="text-emerald-950">{shipment.proofOfDelivery?.deliveryAgentName || 'Express Courier Unit'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800">Verification Method:</span>
                <strong className="text-emerald-950">One-Time Security OTP (Verified)</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200 flex gap-2">
              <button
                type="button"
                onClick={() => alert('POD Receipt saved to downloads.')}
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download POD</span>
              </button>
            </div>
          </div>
        )}

        {/* Delivery Address Card */}
        <div className="bg-surface-container-low border border-surface-container/70 rounded-2xl p-4 flex flex-col gap-2 text-xs">
          <span className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
            Delivery Address
          </span>
          <span className="font-bold text-sm text-on-surface">{shipment.receiver.addressLine}</span>
          <span className="text-tertiary">{shipment.receiver.city}, PIN: {shipment.receiver.pincode}</span>
          {shipment.receiver.instructions && (
            <p className="text-[11px] text-outline mt-1 p-2 bg-surface-container-lowest rounded-lg border border-surface-container">
              📝 Instructions: {shipment.receiver.instructions}
            </p>
          )}
        </div>

        {/* Need Help / Reschedule Delivery */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowIssueModal(true)}
            className="w-full py-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">support_agent</span>
            <span>Delivery Help or Reschedule</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-2.5 text-center text-xs text-primary font-bold hover:underline"
          >
            Explore Skyppy Rides & Logistics
          </button>
        </div>
      </main>

      {/* Help / Reschedule Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-on-surface">Delivery Assistance</h3>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {issueSubmitted ? (
              <div className="p-4 text-center">
                <span className="material-symbols-outlined text-3xl text-emerald-600 mb-1">task_alt</span>
                <p className="text-xs font-bold text-on-surface">Request Logged</p>
                <p className="text-[11px] text-tertiary mt-1">Our dispatch hub has noted your instructions.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIssueSubmitted(false);
                    setShowIssueModal(false);
                  }}
                  className="mt-3 px-4 py-1.5 bg-primary text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-xs">
                <p className="text-tertiary">What do you need assistance with?</p>
                {[
                  'Reschedule to tomorrow morning',
                  'Leave with building security',
                  'Need driver contact number',
                  'Address landmark clarification'
                ].map((reason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIssueSubmitted(true)}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-left font-semibold text-on-surface transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

