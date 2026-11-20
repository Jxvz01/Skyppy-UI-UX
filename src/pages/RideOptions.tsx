import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';
import { Button, Badge, Card } from '../components/common';

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
    <div className="flex-1 flex flex-col relative w-full bg-[#f8fafc] min-h-full">
      <Header type="stack" title={t.rideOptionsHeader} subtitle="Select vehicle class" backTo="/location" />

      <main className="flex flex-col w-full pb-28">
        <div className="px-margin pt-3 flex flex-col gap-3">
          {/* Route & Trip Context Card */}
          <Card variant="default" padding="sm" className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
                <span className="truncate max-w-[110px] font-semibold text-slate-900">{pickup.title}</span>
                <span className="material-symbols-outlined text-[13px] text-slate-400">arrow_forward</span>
                <span className="truncate max-w-[120px] font-semibold text-slate-900">{destination.title}</span>
              </div>
              <Badge variant="primary" size="sm">
                {t.bestPrice}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-brand-primary">schedule</span>
                  <span>{destination.durationMin || 12} min</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 text-slate-500 font-normal">
                  <span className="material-symbols-outlined text-[15px]">route</span>
                  <span>{destination.distanceKm || 4.2} km</span>
                </div>
              </div>

              <button
                className="text-brand-primary text-xs font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                type="button"
              >
                <span>Details</span>
                <span className={`material-symbols-outlined text-[15px] transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
            </div>

            {isDetailsOpen && (
              <div className="pt-2 mt-1 bg-slate-50 rounded-xl p-2.5 flex flex-col gap-1.5 text-slate-600 text-xs border border-slate-100">
                <div className="flex justify-between items-center">
                  <span>Pickup: {pickup.title}</span>
                  <button onClick={() => navigate('/search?mode=pickup')} className="text-brand-primary font-bold hover:underline">Edit</button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Drop: {destination.title}</span>
                  <button onClick={() => navigate('/search?mode=destination')} className="text-brand-primary font-bold hover:underline">Edit</button>
                </div>
              </div>
            )}
          </Card>

          {/* Skyppy Miles Micro Banner */}
          <div
            onClick={() => navigate('/miles')}
            className="bg-blue-50/70 border border-blue-100/80 rounded-xl px-3 py-2 flex items-center justify-between shadow-xs cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <span className="material-symbols-outlined text-[14px]">stars</span>
              </div>
              <p className="text-xs text-slate-700">
                Earn <span className="font-bold text-brand-primary">+{destination.distanceKm || 4.2} km</span> Skyppy Miles on this ride
              </p>
            </div>
            <span className="material-symbols-outlined text-[16px] text-brand-primary">chevron_right</span>
          </div>

          {/* Vehicle Options Header */}
          <div className="flex items-center justify-between px-1 pt-1">
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider">{t.availableRides}</h2>
            <button
              type="button"
              onClick={() => openModal('fareBreakdown', { vehicleId: selectedVehicleId })}
              className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">receipt_long</span>
              <span>{t.fareBreakdown}</span>
            </button>
          </div>

          {/* Vehicle Selector Cards Stack */}
          <div className="flex flex-col gap-2">
            {(['auto', 'mini', 'hatchback', 'sedan', 'suv'] as const).map((key) => {
              const v = vehicles[key];
              const f = getFareBreakdown(key, destination.distanceKm);
              const isSelected = selectedVehicleId === key;

              return (
                <div
                  key={key}
                  onClick={() => selectVehicle(key)}
                  className={`relative rounded-2xl p-3 cursor-pointer transition-all duration-150 transform active:scale-[0.99] border ${
                    isSelected
                      ? 'bg-blue-50/40 border-brand-primary shadow-xs ring-1 ring-brand-primary/20'
                      : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center p-1 relative overflow-hidden border border-slate-100 shrink-0">
                        <img className="w-full h-full object-contain" src={v.image} alt={v.name} />
                        {v.badge && (
                          <span className="absolute -bottom-0.5 right-0.5 text-[8px] font-bold px-1 rounded bg-lime-300 text-slate-900">
                            {v.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900 truncate">{v.name}</span>
                          <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                            {v.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">person</span>
                          <span>{v.capacity}</span>
                          <span>•</span>
                          <span className="text-brand-primary font-semibold">{v.etaMinutes} min away</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-bold text-slate-900 block">
                          ₹{f.totalFare}
                        </span>
                        <p className="text-[10px] text-slate-400 line-through">₹{f.originalFare}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('fareBreakdown', { vehicleId: key });
                          }}
                          className="text-[10px] text-brand-primary hover:underline font-semibold flex items-center gap-0.5 justify-end mt-0.5"
                        >
                          <span>Fare Details</span>
                          <span className="material-symbols-outlined text-[11px]">info</span>
                        </button>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'bg-brand-primary text-white' : 'bg-slate-100 text-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SafeRide Protection Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-bold text-xs text-slate-900">
                Skyppy SafeRide Protection
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                Verified drivers, SOS monitoring & live GPS telemetry
              </span>
            </div>
            <button
              type="button"
              onClick={() => openModal('safety')}
              className="text-slate-400 hover:text-brand-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">info</span>
            </button>
          </div>

          {/* Payment & Coupon Section */}
          <Card variant="default" padding="sm" className="flex flex-col gap-2">
            {/* Primary Payment Method Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-brand-primary">
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">{paymentMethod}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Auto-debit on drop-off</span>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentSheetOpen(true)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-brand-primary text-xs font-bold transition-colors"
                type="button"
              >
                Change
              </button>
            </div>

            {/* Applied Promo Voucher Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[16px]">local_offer</span>
                {appliedCoupon ? (
                  <span className="text-xs text-slate-700 font-medium">
                    Coupon <span className="font-bold text-slate-900">{appliedCoupon.code}</span> applied
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">No coupon applied</span>
                )}
              </div>
              {appliedCoupon ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 font-bold">-₹{appliedCoupon.discount}</span>
                  <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline font-semibold">Remove</button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="text-xs text-brand-primary font-bold hover:underline"
                >
                  {t.applyCoupon}
                </button>
              )}
            </div>
          </Card>

          {/* Booking Floating Action Wrapper */}
          <div className="sticky bottom-0 pt-2 pb-2 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/95 to-transparent">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleBookNow}
              className="h-14 shadow-elevated justify-between px-5"
            >
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold text-sm sm:text-base">Book {selectedVehicle.name}</span>
                <span className="text-white/60">•</span>
                <span className="font-bold text-base sm:text-lg">₹{finalFare}</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <span className="font-semibold text-xs sm:text-sm">{t.confirmBooking}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </Button>
            <p className="text-center text-[11px] text-slate-400 mt-1.5">
              Guaranteed fare lock • Free cancellation within 3 mins
            </p>
          </div>
        </div>
      </main>

      {/* PAYMENT METHOD SELECTOR SHEET */}
      {isPaymentSheetOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setIsPaymentSheetOpen(false)} />
          <div className="relative w-full bg-white rounded-t-3xl shadow-sheet p-5 z-10 flex flex-col gap-3 max-w-lg mx-auto border-t border-slate-100">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-bold text-base text-slate-900">{t.selectPaymentMethod}</h3>
              <button
                type="button"
                onClick={() => setIsPaymentSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
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
                    showToast(`Payment method: ${pm.title}`, 'info');
                  }}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-colors border ${
                    paymentMethod === pm.title ? 'bg-blue-50/50 border-brand-primary' : 'bg-white hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-brand-primary">
                      <span className="material-symbols-outlined text-[18px]">{pm.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{pm.title}</h4>
                      <p className="text-[11px] text-slate-500">{pm.subtitle}</p>
                    </div>
                  </div>
                  {paymentMethod === pm.title && (
                    <span className="material-symbols-outlined text-brand-primary text-[18px]">check</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COUPON CODE MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setIsCouponModalOpen(false)} />
          <div className="relative w-full bg-white rounded-t-3xl shadow-sheet p-5 z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto max-w-lg mx-auto border-t border-slate-100">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Apply Coupon or Voucher</h3>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
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
                className="flex-1 h-11 px-3.5 rounded-xl bg-slate-100 text-slate-900 text-xs font-semibold border border-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <Button type="submit" variant="primary" size="md">
                Apply
              </Button>
            </form>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Available Offers</span>
              {miles.rewards.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleApplyCouponCode(r.code)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{r.code}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-white rounded text-brand-primary border border-slate-200">
                          {r.validDays}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{r.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-primary hover:underline">
                    Use
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
