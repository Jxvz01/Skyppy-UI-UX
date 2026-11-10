import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const RideOptions: React.FC = () => {
  const navigate = useNavigate();
  const {
    pickup,
    destination,
    vehicles,
    selectedVehicleId,
    selectVehicle,
    getFareBreakdown,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    createBooking,
    showToast,
    miles,
    openModal,
    language
  } = useAppStore();

  const t = translations[language] || translations.en;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI AutoPay (•••• 2590)');
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const currentFareObj = getFareBreakdown(selectedVehicleId, destination.distanceKm);
  const finalFare = currentFareObj.totalFare;
  const selectedVehicle = vehicles[selectedVehicleId] || vehicles.auto;

  const handleBookNow = () => {
    if (pickup.title.trim().toLowerCase() === destination.title.trim().toLowerCase()) {
      showToast('Pickup and Destination cannot be the same. Please edit your route.', 'error');
      return;
    }
    createBooking();
    navigate('/confirm');
  };

  const handleApplyCouponCode = (code: string) => {
    const success = applyCoupon(code);
    if (success) {
      setIsCouponModalOpen(false);
      setCouponInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-full">
      <Header type="stack" title={t.rideOptionsHeader} backTo="/location" />

      <main className="flex flex-col w-full pb-8">
        <div className="px-margin pt-2 flex flex-col gap-space-md">
          {/* Route & Trip Context Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                <span className="truncate max-w-[120px] font-semibold text-on-surface">{pickup.title}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                <span className="truncate max-w-[130px] font-semibold text-on-surface">{destination.title}</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                {t.bestPrice}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-on-surface">
                <div className="flex items-center gap-1 font-numeric-md text-numeric-md">
                  <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                  <span>{destination.durationMin || 12} min</span>
                </div>
                <span className="text-outline-variant font-body-sm text-body-sm">•</span>
                <div className="flex items-center gap-1 font-body-md text-body-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">route</span>
                  <span>{destination.distanceKm || 4.2} km</span>
                </div>
              </div>

              <button
                className="text-primary font-label-md text-label-md flex items-center gap-0.5 hover:underline cursor-pointer"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                type="button"
              >
                <span>Details</span>
                <span className={`material-symbols-outlined text-[16px] transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
            </div>

            {isDetailsOpen && (
              <div className="pt-2 mt-2 bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Pickup: {pickup.title}</span>
                  <button onClick={() => navigate('/search?mode=pickup')} className="text-primary font-bold text-xs hover:underline">Edit</button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Drop: {destination.title}</span>
                  <button onClick={() => navigate('/search?mode=destination')} className="text-primary font-bold text-xs hover:underline">Edit</button>
                </div>
              </div>
            )}
          </div>

          {/* Skyppy Miles Micro Banner */}
          <div
            onClick={() => navigate('/miles')}
            className="bg-primary/5 rounded-xl px-space-md py-2 flex items-center justify-between shadow-xs cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[15px] fill-1">stars</span>
              </div>
              <p className="font-label-md text-label-md text-on-surface">
                Earn <span className="font-bold text-primary">+{destination.distanceKm || 4.2} km</span> Skyppy Miles on this ride
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-primary">chevron_right</span>
          </div>

          {/* Vehicle Options Header */}
          <div className="flex items-center justify-between px-1">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">{t.availableRides}</h2>
            <button
              type="button"
              onClick={() => openModal('fareBreakdown', { vehicleId: selectedVehicleId })}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">receipt_long</span>
              <span>{t.fareBreakdown}</span>
            </button>
          </div>

          {/* Vehicle Selector Cards Stack (Official Fleet: Auto, Mini, Hatchback, Sedan, SUV) */}
          <div className="flex flex-col gap-space-sm">
            {(['auto', 'mini', 'hatchback', 'sedan', 'suv'] as const).map((key) => {
              const v = vehicles[key];
              const f = getFareBreakdown(key, destination.distanceKm);
              const isSelected = selectedVehicleId === key;

              return (
                <div
                  key={key}
                  onClick={() => selectVehicle(key)}
                  className={`relative rounded-2xl p-space-md cursor-pointer transition-all duration-150 transform active:scale-[0.99] ${
                    isSelected
                      ? 'bg-surface-container-low shadow-[0_0_0_2px_rgba(0,66,221,1)] shadow-md'
                      : 'bg-surface-container-lowest shadow-xs hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-md">
                      <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center p-1 relative overflow-hidden">
                        <img className="w-full h-full object-contain" src={v.image} alt={v.name} />
                        <span className="absolute -bottom-0.5 right-0.5 text-[9px] font-bold px-1 rounded bg-secondary-container text-on-secondary-container">
                          {v.badge}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-headline-md text-headline-md text-on-surface font-bold">{v.name}</span>
                          <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded font-semibold">
                            {v.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">person</span>
                          <span>{v.capacity}</span>
                          <span>•</span>
                          <span className="text-primary font-semibold">{v.etaMinutes} min away</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-md">
                      <div className="text-right">
                        <span className="font-numeric-xl text-numeric-xl text-on-surface font-bold">
                          ₹{f.totalFare}
                        </span>
                        <p className="font-label-sm text-label-sm text-on-surface-variant line-through">₹{f.originalFare}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('fareBreakdown', { vehicleId: key });
                          }}
                          className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-0.5 justify-end mt-0.5"
                        >
                          <span>Fare Details</span>
                          <span className="material-symbols-outlined text-[12px]">info</span>
                        </button>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skyppy SafeRide Protection Card */}
          <div className="bg-surface-container-low rounded-2xl p-space-md flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined text-[20px] fill-1">verified_user</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                Skyppy SafeRide Protection
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Verified drivers, continuous SOS monitoring &amp; live route telemetry
              </span>
            </div>
            <button
              type="button"
              onClick={() => openModal('safety')}
              className="text-outline-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">info</span>
            </button>
          </div>

          {/* Payment & Coupon Section */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
            {/* Primary Payment Method Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">{paymentMethod}</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-secondary font-medium">Auto-debit on drop-off</span>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentSheetOpen(true)}
                className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors font-semibold"
                type="button"
              >
                Change
              </button>
            </div>

            {/* Applied Promo Voucher Bar */}
            <div className="flex items-center justify-between pt-2 mt-1 bg-surface-container-low rounded-xl px-space-md py-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">local_offer</span>
                {appliedCoupon ? (
                  <span className="font-label-md text-label-md text-on-surface">
                    Coupon <span className="font-bold text-on-surface font-numeric-md">{appliedCoupon.code}</span> applied
                  </span>
                ) : (
                  <span className="font-label-md text-label-md text-on-surface-variant">No coupon applied</span>
                )}
              </div>
              {appliedCoupon ? (
                <div className="flex items-center gap-2">
                  <span className="font-numeric-md text-numeric-md text-secondary font-bold">-₹{appliedCoupon.discount}</span>
                  <button onClick={removeCoupon} className="text-xs text-error hover:underline font-semibold">Remove</button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="font-label-md text-label-md text-primary font-bold hover:underline"
                >
                  {t.applyCoupon}
                </button>
              )}
            </div>
          </div>

          {/* Booking Floating Action Wrapper */}
          <div className="sticky bottom-0 pt-2 pb-2 bg-gradient-to-t from-surface via-surface/90 to-transparent">
            <button
              onClick={handleBookNow}
              className="w-full h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-between px-6 transition-all duration-200 hover:brightness-105 active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-headline-md font-bold">Book {selectedVehicle.name}</span>
                <span className="text-on-primary/60 font-body-md text-body-md">•</span>
                <span className="font-numeric-xl text-numeric-xl">₹{finalFare}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-label-lg text-label-lg font-semibold">{t.confirmBooking}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </button>
            <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-2">
              Guaranteed fare lock • Free cancellation within 3 mins
            </p>
          </div>
        </div>
      </main>

      {/* PAYMENT METHOD SELECTOR SHEET */}
      {isPaymentSheetOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setIsPaymentSheetOpen(false)}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-3 max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <h3 className="font-headline font-bold text-lg text-on-surface">{t.selectPaymentMethod}</h3>
              <button
                type="button"
                onClick={() => setIsPaymentSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { title: 'UPI AutoPay (•••• 2590)', icon: 'account_balance', subtitle: 'Instant auto-debit on drop-off' },
                { title: 'HDFC Bank Visa (•••• 9104)', icon: 'credit_card', subtitle: 'Credit/Debit Card' },
                { title: 'Cash Paid to Driver', icon: 'payments', subtitle: 'Pay driver directly in cash' }
              ].map((pm) => (
                <div
                  key={pm.title}
                  onClick={() => {
                    setPaymentMethod(pm.title);
                    setIsPaymentSheetOpen(false);
                    showToast(`Payment method: ${pm.title}`);
                  }}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === pm.title ? 'bg-surface-container-low ring-1 ring-primary' : 'bg-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">{pm.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-label-lg font-bold text-sm text-on-surface">{pm.title}</h4>
                      <p className="text-xs text-on-surface-variant">{pm.subtitle}</p>
                    </div>
                  </div>
                  {paymentMethod === pm.title && (
                    <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COUPON CODE MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setIsCouponModalOpen(false)}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <h3 className="font-headline font-bold text-lg text-on-surface">Apply Coupon or Voucher</h3>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyCouponCode(couponInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Enter promo code (e.g. MILES15)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-body-lg text-sm border border-surface-container uppercase focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-5 h-11 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold shadow-md hover:bg-primary-container active:scale-95 transition-transform"
              >
                Apply
              </button>
            </form>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-outline">Available Offers</span>
              {miles.rewards.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleApplyCouponCode(r.code)}
                  className="p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">{r.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">{r.code}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-surface-container-high rounded text-primary">
                          {r.validDays}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">{r.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Tap to Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
