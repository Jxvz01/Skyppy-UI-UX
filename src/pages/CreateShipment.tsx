import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { useCourierStore, calculateCourierPricing, getCityDistance } from '../store/useCourierStore';
import {
  PackageCategory,
  PackagingType,
  ServiceSpeed,
  PackageDetails,
  AddressEntity,
  PickupSchedule
} from '../types/courier';

export const CreateShipment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { savedSenders, savedReceivers, createShipment, setActiveShipment } = useCourierStore();

  // Step state: 1: Package, 2: Pickup/Sender, 3: Receiver, 4: Review & Speed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Package state
  const [category, setCategory] = useState<PackageCategory>('documents');
  const [description, setDescription] = useState('Business Contract & Tax Documentation');
  const [weightKg, setWeightKg] = useState<number>(1.2);
  const [lengthCm, setLengthCm] = useState<number>(30);
  const [widthCm, setWidthCm] = useState<number>(20);
  const [heightCm, setHeightCm] = useState<number>(5);
  const [isFragile, setIsFragile] = useState<boolean>(false);
  const [isHighValue, setIsHighValue] = useState<boolean>(false);
  const [declaredValueInr, setDeclaredValueInr] = useState<number>(5000);
  const [packagingType, setPackagingType] = useState<PackagingType>('standard_box');
  const [showRestrictedModal, setShowRestrictedModal] = useState<boolean>(false);

  // Sender / Pickup state
  const defaultSender = savedSenders[0] || {
    name: 'Jeevan H.',
    phone: '+91 98450 12345',
    addressLine: 'Plot 42, Gokulam 3rd Stage, Near VVCE',
    city: 'Mysuru',
    pincode: '570002',
    instructions: 'Gate 2 pickup, call on arrival'
  };
  const [senderName, setSenderName] = useState(defaultSender.name);
  const [senderPhone, setSenderPhone] = useState(defaultSender.phone);
  const [senderAddress, setSenderAddress] = useState(defaultSender.addressLine);
  const [senderCity, setSenderCity] = useState(defaultSender.city);
  const [senderPincode, setSenderPincode] = useState(defaultSender.pincode);
  const [senderInstructions, setSenderInstructions] = useState(defaultSender.instructions || '');

  // Schedule state
  const [pickupDate, setPickupDate] = useState('Today, Nov 10');
  const [pickupSlot, setPickupSlot] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');

  // Receiver state
  const prefillReceiverName = searchParams.get('receiverName');
  const foundReceiver = prefillReceiverName
    ? savedReceivers.find((r) => r.name.toLowerCase().includes(prefillReceiverName.toLowerCase()))
    : null;
  const initialReceiver = foundReceiver || savedReceivers[0] || {
    name: 'Ananya Sharma',
    phone: '+91 98860 98765',
    addressLine: 'Tower 4, 12th Floor, Brigade Gateway, Malleshwaram',
    city: 'Bengaluru',
    pincode: '560055',
    instructions: 'Leave at security reception if unavailable'
  };

  const [receiverName, setReceiverName] = useState(initialReceiver.name);
  const [receiverPhone, setReceiverPhone] = useState(initialReceiver.phone);
  const [receiverAddress, setReceiverAddress] = useState(initialReceiver.addressLine);
  const [receiverCity, setReceiverCity] = useState(initialReceiver.city);
  const [receiverPincode, setReceiverPincode] = useState(initialReceiver.pincode);
  const [receiverInstructions, setReceiverInstructions] = useState(initialReceiver.instructions || '');

  // Service Speed
  const initialSpeed = (searchParams.get('speed') as ServiceSpeed) || 'express_cargo';
  const [serviceSpeed, setServiceSpeed] = useState<ServiceSpeed>(initialSpeed);

  // Calculations
  const volumetricWeightKg = Number(((lengthCm * widthCm * heightCm) / 5000).toFixed(2));
  const chargeableWeightKg = Math.max(weightKg, volumetricWeightKg, 0.5);

  const packageObj: PackageDetails = {
    category,
    description,
    weightKg,
    lengthCm,
    widthCm,
    heightCm,
    isFragile,
    isHighValue,
    declaredValueInr: isHighValue ? declaredValueInr : undefined,
    packagingType
  };

  const pricing = calculateCourierPricing(packageObj, senderCity, receiverCity, serviceSpeed);
  const distanceKm = getCityDistance(senderCity, receiverCity);

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      window.scrollTo(0, 0);
    } else {
      handleSubmitBooking();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
      window.scrollTo(0, 0);
    } else {
      navigate('/courier');
    }
  };

  const handleSubmitBooking = () => {
    const senderObj: AddressEntity = {
      name: senderName,
      phone: senderPhone,
      addressLine: senderAddress,
      city: senderCity,
      pincode: senderPincode,
      instructions: senderInstructions
    };

    const receiverObj: AddressEntity = {
      name: receiverName,
      phone: receiverPhone,
      addressLine: receiverAddress,
      city: receiverCity,
      pincode: receiverPincode,
      instructions: receiverInstructions
    };

    const scheduleObj: PickupSchedule = {
      date: pickupDate,
      timeSlot: pickupSlot,
      slotLabel:
        pickupSlot === 'morning'
          ? 'Morning (08:00 AM – 12:00 PM)'
          : pickupSlot === 'afternoon'
          ? 'Afternoon (12:00 PM – 04:00 PM)'
          : 'Evening (04:00 PM – 08:00 PM)'
    };

    const newShipment = createShipment({
      packageDetails: packageObj,
      sender: senderObj,
      receiver: receiverObj,
      pickupSchedule: scheduleObj,
      serviceSpeed
    });

    setActiveShipment(newShipment);
    navigate(`/courier/confirm?id=${newShipment.id}`);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-10 bg-surface min-h-full">
      <Header
        type="stack"
        title="Send Parcel"
        onBack={handleBack}
      />

      {/* 4-Step Progress Indicator */}
      <div className="bg-surface-container-low px-margin py-3 border-b border-surface-container/60">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Package' },
            { num: 2, label: 'Pickup' },
            { num: 3, label: 'Receiver' },
            { num: 4, label: 'Speed & Price' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div
                onClick={() => s.num < step && setStep(s.num as any)}
                className={`flex flex-col items-center gap-1 cursor-pointer select-none ${
                  step === s.num
                    ? 'text-primary font-bold'
                    : step > s.num
                    ? 'text-secondary font-semibold'
                    : 'text-tertiary'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-primary text-white shadow-xs'
                      : step > s.num
                      ? 'bg-secondary text-white'
                      : 'bg-surface-container-high text-tertiary'
                  }`}
                >
                  {step > s.num ? (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  ) : (
                    s.num
                  )}
                </div>
                <span className="text-[10px] leading-tight text-center">{s.label}</span>
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-1.5 transition-colors ${
                    step > idx + 1 ? 'bg-secondary' : 'bg-surface-container-high'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main className="flex-1 px-margin py-4 flex flex-col gap-4">
        {/* ==================== STEP 1: PACKAGE DETAILS ==================== */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface">What are you sending?</h2>
              <p className="text-xs text-tertiary">Select category and provide item dimensions</p>
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'documents', label: 'Documents', icon: 'description' },
                  { key: 'electronics', label: 'Electronics', icon: 'devices' },
                  { key: 'apparel', label: 'Apparel', icon: 'apparel' },
                  { key: 'household', label: 'Household', icon: 'home' },
                  { key: 'samples', label: 'Samples', icon: 'science' },
                  { key: 'other', label: 'Other', icon: 'inventory_2' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key as PackageCategory)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      category === cat.key
                        ? 'bg-primary-container/10 border-primary text-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest border-surface-container text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    <span className="text-xs">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Item Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Legal documents, laptop with charger, clothing"
                className="bg-surface-container-lowest border border-surface-container rounded-xl px-3.5 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Weight in kg */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Actual Weight (kg)
                </label>
                <span className="text-xs font-bold text-primary">{weightKg} kg</span>
              </div>
              <div className="flex items-center gap-2">
                {[0.5, 1.0, 2.0, 5.0, 10.0].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeightKg(w)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      weightKg === w
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface-container-lowest border-surface-container text-on-surface'
                    }`}
                  >
                    {w}kg
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(0.1, parseFloat(e.target.value) || 0.5))}
                className="mt-1 bg-surface-container-lowest border border-surface-container rounded-xl px-3.5 py-2 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            {/* Dimensions (L x W x H in cm) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Dimensions (cm) & Volumetric Weight
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-tertiary font-semibold block mb-0.5">Length (cm)</span>
                  <input
                    type="number"
                    min="1"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(Math.max(1, parseInt(e.target.value) || 10))}
                    className="w-full bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-tertiary font-semibold block mb-0.5">Width (cm)</span>
                  <input
                    type="number"
                    min="1"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Math.max(1, parseInt(e.target.value) || 10))}
                    className="w-full bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-tertiary font-semibold block mb-0.5">Height (cm)</span>
                  <input
                    type="number"
                    min="1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(1, parseInt(e.target.value) || 10))}
                    className="w-full bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Volumetric Weight Banner */}
              <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container/60 flex items-center justify-between text-xs mt-1">
                <div>
                  <span className="text-tertiary">Volumetric Weight: </span>
                  <strong className="text-on-surface">{volumetricWeightKg} kg</strong>
                  <span className="text-[10px] text-outline block">Formula: (L×W×H)/5000</span>
                </div>
                <div className="text-right">
                  <span className="text-tertiary">Chargeable Weight: </span>
                  <strong className="text-primary font-bold">{chargeableWeightKg} kg</strong>
                </div>
              </div>
            </div>

            {/* Packaging Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Packaging Material
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'standard_box', label: 'Standard Box', icon: 'package' },
                  { key: 'padded_envelope', label: 'Padded Envelope', icon: 'mail' },
                  { key: 'bubble_wrap_box', label: 'Bubble Wrap Box', icon: 'layers' },
                  { key: 'wooden_crate', label: 'Crate / Heavy Pallet', icon: 'inventory' }
                ].map((pkg) => (
                  <button
                    key={pkg.key}
                    type="button"
                    onClick={() => setPackagingType(pkg.key as PackagingType)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      packagingType === pkg.key
                        ? 'bg-primary/5 border-primary text-primary font-bold'
                        : 'bg-surface-container-lowest border-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{pkg.icon}</span>
                    <span className="text-xs">{pkg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Declarations: Fragile & High Value */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Special Declarations
              </label>

              <label className="flex items-center justify-between bg-surface-container-lowest border border-surface-container rounded-xl p-3 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-500 text-[20px]">warning</span>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Fragile Item</span>
                    <span className="text-[11px] text-tertiary">Requires cushioned handling (+₹85)</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary"
                />
              </label>

              <div className="bg-surface-container-lowest border border-surface-container rounded-xl p-3 flex flex-col gap-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
                    <div>
                      <span className="text-xs font-bold text-on-surface block">High-Value Item</span>
                      <span className="text-[11px] text-tertiary">Cargo insurance coverage (+1.5% declared value)</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isHighValue}
                    onChange={(e) => setIsHighValue(e.target.checked)}
                    className="w-5 h-5 rounded text-primary focus:ring-primary"
                  />
                </label>

                {isHighValue && (
                  <div className="pt-2 border-t border-surface-container flex items-center justify-between gap-3">
                    <span className="text-xs text-on-surface font-semibold">Declared Value:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">₹</span>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={declaredValueInr}
                        onChange={(e) => setDeclaredValueInr(parseInt(e.target.value) || 1000)}
                        className="w-28 bg-surface-container-low border border-surface-container rounded-lg px-2 py-1 text-sm font-bold text-on-surface outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Restricted Items Notice */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">info</span>
              <div className="flex-1 text-xs text-amber-900">
                <span>By booking, you declare that this parcel complies with transport regulations. </span>
                <button
                  type="button"
                  onClick={() => setShowRestrictedModal(true)}
                  className="font-bold underline text-amber-950 ml-1 cursor-pointer"
                >
                  View Restricted Items List
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: PICKUP / SENDER DETAILS ==================== */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Pickup & Sender Details</h2>
              <p className="text-xs text-tertiary">Where should our courier pick up the consignment?</p>
            </div>

            {/* Saved Senders Quick Pick */}
            {savedSenders.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-tertiary uppercase tracking-wider">
                  Saved Sender Addresses
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {savedSenders.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSenderName(s.name);
                        setSenderPhone(s.phone);
                        setSenderAddress(s.addressLine);
                        setSenderCity(s.city);
                        setSenderPincode(s.pincode);
                        setSenderInstructions(s.instructions || '');
                      }}
                      className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left shrink-0 transition-colors"
                    >
                      <span className="text-xs font-bold text-on-surface block">{s.name}</span>
                      <span className="text-[10px] text-tertiary">{s.city} • {s.pincode}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sender Name & Phone */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Sender Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Pickup Address */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Pickup Street Address</label>
              <textarea
                rows={2}
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="Building, street, landmark"
                className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary resize-none"
              />
            </div>

            {/* City & PIN */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Origin City</label>
                <select
                  value={senderCity}
                  onChange={(e) => setSenderCity(e.target.value)}
                  className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="Mysuru">Mysuru</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mangaluru">Mangaluru</option>
                  <option value="Hassan">Hassan</option>
                  <option value="Mandya">Mandya</option>
                  <option value="Hubballi">Hubballi</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">PIN Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={senderPincode}
                  onChange={(e) => setSenderPincode(e.target.value)}
                  className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Pickup Instructions (Optional)</label>
              <input
                type="text"
                value={senderInstructions}
                onChange={(e) => setSenderInstructions(e.target.value)}
                placeholder="e.g. Ring bell at Gate 2, ask for security desk"
                className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            {/* Pickup Date & Slot */}
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Pickup Schedule</label>
              <div className="flex gap-2">
                {['Today, Nov 10', 'Tomorrow, Nov 11', 'Nov 12, 2026'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPickupDate(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      pickupDate === d
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface-container-lowest border-surface-container text-on-surface'
                    }`}
                  >
                    {d.split(',')[0]}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { key: 'morning', label: 'Morning', hours: '08:00–12:00' },
                  { key: 'afternoon', label: 'Afternoon', hours: '12:00–16:00' },
                  { key: 'evening', label: 'Evening', hours: '16:00–20:00' }
                ].map((slot) => (
                  <button
                    key={slot.key}
                    type="button"
                    onClick={() => setPickupSlot(slot.key as any)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      pickupSlot === slot.key
                        ? 'bg-primary/10 border-primary text-primary font-bold'
                        : 'bg-surface-container-lowest border-surface-container text-on-surface'
                    }`}
                  >
                    <span className="text-xs block font-bold">{slot.label}</span>
                    <span className="text-[10px] text-tertiary">{slot.hours}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: RECEIVER DETAILS ==================== */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Receiver & Destination</h2>
              <p className="text-xs text-tertiary">Who is receiving this package and where?</p>
            </div>

            {/* Saved Receivers Quick Pick */}
            {savedReceivers.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-tertiary uppercase tracking-wider">
                  Saved Receivers
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {savedReceivers.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setReceiverName(r.name);
                        setReceiverPhone(r.phone);
                        setReceiverAddress(r.addressLine);
                        setReceiverCity(r.city);
                        setReceiverPincode(r.pincode);
                        setReceiverInstructions(r.instructions || '');
                      }}
                      className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left shrink-0 transition-colors"
                    >
                      <span className="text-xs font-bold text-on-surface block">{r.name}</span>
                      <span className="text-[10px] text-tertiary">{r.city} • {r.pincode}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Receiver Name & Phone */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Receiver Name</label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Destination Address */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Delivery Address</label>
              <textarea
                rows={2}
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Office suite, apartment, street name"
                className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Destination City & PIN */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Destination City</label>
                <select
                  value={receiverCity}
                  onChange={(e) => setReceiverCity(e.target.value)}
                  className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Mangaluru">Mangaluru</option>
                  <option value="Hassan">Hassan</option>
                  <option value="Mandya">Mandya</option>
                  <option value="Hubballi">Hubballi</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">PIN Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={receiverPincode}
                  onChange={(e) => setReceiverPincode(e.target.value)}
                  className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Delivery Instructions (Optional)</label>
              <input
                type="text"
                value={receiverInstructions}
                onChange={(e) => setReceiverInstructions(e.target.value)}
                placeholder="e.g. Call before coming up, require gate pass"
                className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            {/* Route Summary Pill */}
            <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">route</span>
                <span className="font-semibold text-on-surface">
                  {senderCity} → {receiverCity}
                </span>
              </div>
              <span className="text-tertiary font-bold">~{distanceKm} km Intercity Corridor</span>
            </div>
          </div>
        )}

        {/* ==================== STEP 4: SERVICE SPEED & PRICING REVIEW ==================== */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Choose Speed & Review</h2>
              <p className="text-xs text-tertiary">Select delivery speed and inspect transparent freight pricing</p>
            </div>

            {/* Service Speeds */}
            <div className="flex flex-col gap-2.5">
              {[
                {
                  key: 'same_day_prime',
                  name: 'Same-Day Prime Intercity',
                  time: 'Delivered in 6–10 hours',
                  desc: 'Express dedicated corridor transit across Mysuru–Bengaluru',
                  badge: 'Fastest'
                },
                {
                  key: 'express_cargo',
                  name: 'Express Intercity Cargo',
                  time: 'Next Day Morning (12–24 hrs)',
                  desc: 'Guaranteed overnight linehaul transit between commercial hubs',
                  badge: 'Most Popular'
                },
                {
                  key: 'standard_surface',
                  name: 'Standard Surface Cargo',
                  time: '24–48 hours transit',
                  desc: 'Cost-effective consolidation cargo for non-urgent shipments',
                  badge: 'Economical'
                }
              ].map((tier) => {
                const tierPricing = calculateCourierPricing(
                  packageObj,
                  senderCity,
                  receiverCity,
                  tier.key as ServiceSpeed
                );

                const isSelected = serviceSpeed === tier.key;

                return (
                  <div
                    key={tier.key}
                    onClick={() => setServiceSpeed(tier.key as ServiceSpeed)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-primary ring-2 ring-primary/20 shadow-sm'
                        : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="serviceSpeed"
                          checked={isSelected}
                          onChange={() => setServiceSpeed(tier.key as ServiceSpeed)}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-on-surface">{tier.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                              {tier.badge}
                            </span>
                          </div>
                          <span className="text-xs text-primary font-semibold block">{tier.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-on-surface">
                          ₹{tierPricing.totalEstimatedFare}
                        </span>
                        <span className="text-[10px] text-tertiary block">All-incl.</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-tertiary mt-2 pl-6">{tier.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Itemized Price Breakdown Table */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container/70 flex flex-col gap-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <span className="font-bold text-xs uppercase tracking-wider text-on-surface">
                  Fare Calculation Breakdown
                </span>
                <span className="text-[10px] font-bold text-secondary uppercase">
                  {chargeableWeightKg} kg • {distanceKm} km
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface">
                <span className="text-tertiary">Base Freight ({pricing.chargeableWeightKg} kg @ ~{pricing.distanceKm} km):</span>
                <span>₹{pricing.baseFreightFare}</span>
              </div>

              {pricing.fragileHandlingFee > 0 && (
                <div className="flex items-center justify-between text-xs text-on-surface">
                  <span className="text-tertiary">Fragile Cushion Handling:</span>
                  <span>+₹{pricing.fragileHandlingFee}</span>
                </div>
              )}

              {pricing.highValueInsuranceFee > 0 && (
                <div className="flex items-center justify-between text-xs text-on-surface">
                  <span className="text-tertiary">Cargo Insurance Coverage:</span>
                  <span>+₹{pricing.highValueInsuranceFee}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-on-surface">
                <span className="text-tertiary">Fuel & Intercity Surcharge:</span>
                <span>+₹{pricing.fuelSurcharge}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface">
                <span className="text-tertiary">GST (18% Logistics):</span>
                <span>+₹{pricing.gstInr}</span>
              </div>

              <div className="pt-2 border-t border-surface-container flex items-center justify-between font-bold text-sm text-on-surface">
                <span>Total Estimated Fare:</span>
                <span className="text-primary text-base">₹{pricing.totalEstimatedFare}</span>
              </div>
            </div>

            {/* Prototype Pricing Disclaimer */}
            <div className="bg-blue-50 border border-blue-200/70 rounded-xl p-3 text-center">
              <span className="text-[11px] text-blue-900 font-medium">
                Prototype pricing is computed using simulated intercity corridor distance metrics. Actual billing will generate an automated GST e-way tax receipt.
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 p-margin bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container shadow-lg flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="w-12 h-12 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface shrink-0 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
        >
          {step < 4 ? (
            <>
              <span>Continue</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          ) : (
            <>
              <span>Confirm & Schedule Pickup (₹{pricing.totalEstimatedFare})</span>
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </>
          )}
        </button>
      </div>

      {/* Restricted Items Modal */}
      {showRestrictedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-error font-bold">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
                <span>Prohibited & Restricted Items</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRestrictedModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-tertiary leading-relaxed">
              In accordance with Indian courier logistics and road transport regulations, the following items cannot be shipped via Skyppy Courier:
            </p>

            <ul className="text-xs text-on-surface flex flex-col gap-1.5 list-disc pl-4">
              <li>Flammable liquids, gases, corrosive chemicals or fireworks.</li>
              <li>Currency notes, uncrossed cheques, bullion or loose precious gems.</li>
              <li>Lithium-ion batteries over 100Wh without industrial clearance.</li>
              <li>Perishable foods without cold chain packaging.</li>
              <li>Contraband or illegal narcotics.</li>
            </ul>

            <button
              type="button"
              onClick={() => setShowRestrictedModal(false)}
              className="mt-2 py-2.5 rounded-xl bg-primary text-white font-bold text-xs"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
