import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const ModalsContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeModal,
    modalData,
    closeModal,
    notifications,
    markNotificationsAsRead,
    showToast,
    toastMessage,
    toastType,
    userProfile,
    updateUserProfile,
    preferences,
    updatePreferences,
    savedPlaces,
    addSavedPlace,
    deleteSavedPlace,
    scheduleRide,
    completeCurrentRide,
    activeBooking,
    selectedVehicleId,
    vehicles,
    destination,
    setDestination,
    rebookRide,
    getFareBreakdown
  } = useAppStore();

  // Profile Edit State
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileEmail, setProfileEmail] = useState(userProfile.email);
  const [profilePhone, setProfilePhone] = useState(userProfile.phone);
  const [profileEmergencyName, setProfileEmergencyName] = useState(userProfile.emergencyContactName);
  const [profileEmergencyPhone, setProfileEmergencyPhone] = useState(userProfile.emergencyContactPhone);

  useEffect(() => {
    if (activeModal === 'editProfile') {
      setProfileName(userProfile.name);
      setProfileEmail(userProfile.email);
      setProfilePhone(userProfile.phone);
      setProfileEmergencyName(userProfile.emergencyContactName);
      setProfileEmergencyPhone(userProfile.emergencyContactPhone);
    }
  }, [activeModal, userProfile]);

  // New Saved Place State
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceTitle, setNewPlaceTitle] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlaceIcon, setNewPlaceIcon] = useState('place');

  // Chat message state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    {
      sender: 'driver',
      text: 'Namaskara sir, I have accepted your ride. Reaching pickup point in 3 minutes.',
      time: '09:42 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Schedule ride state
  const [scheduleDate, setScheduleDate] = useState('Tomorrow');
  const [scheduleTime, setScheduleTime] = useState('08:30 AM');

  // Trip Completion / Rating State
  const [tripRating, setTripRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  // Payment Add UPI state
  const [newUpiId, setNewUpiId] = useState('');
  const [isAddingUpi, setIsAddingUpi] = useState(false);

  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text, time: now }]);
    if (!textToSend) setChatInput('');

    // Simulated driver response
    setTimeout(() => {
      const replies = [
        'Sure sir! Turning onto your street now.',
        'Understood sir, parking near the gate.',
        'Yes sir, I see you. Turning on hazards.'
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => [
        ...prev,
        { sender: 'driver', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      showToast('Name and phone number cannot be empty', 'error');
      return;
    }
    updateUserProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      emergencyContactName: profileEmergencyName,
      emergencyContactPhone: profileEmergencyPhone
    });
    closeModal();
  };

  const handleAddSavedPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceTitle.trim() || !newPlaceAddress.trim()) {
      showToast('Title and address are required', 'error');
      return;
    }
    addSavedPlace({
      id: 'sp-' + Date.now(),
      title: newPlaceTitle,
      address: newPlaceAddress,
      icon: newPlaceIcon,
      distanceKm: 4.0
    });
    setNewPlaceTitle('');
    setNewPlaceAddress('');
    setIsAddingPlace(false);
  };

  const handleConfirmSchedule = () => {
    scheduleRide(scheduleDate, scheduleTime);
    closeModal();
    navigate('/activity');
  };

  const handleFinishRating = () => {
    completeCurrentRide(tripRating, '', selectedTip || 0);
    closeModal();
    showToast(`Trip rated ${tripRating} stars! Thank you for riding with Skyppy.`, 'success');
    navigate('/activity');
  };

  return (
    <>
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-24 left-4 right-4 z-[110] pointer-events-none flex justify-center transition-all animate-bounce">
          <div className="bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-sm border border-slate-700/50 backdrop-blur-md">
            <span
              className={`material-symbols-outlined text-[20px] shrink-0 ${
                toastType === 'error'
                  ? 'text-error'
                  : toastType === 'success'
                  ? 'text-secondary-fixed'
                  : 'text-primary-container'
              }`}
            >
              {toastType === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="font-body-md text-sm font-medium leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DRAWER */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">notifications_active</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Mysuru Live Alerts</h3>
                  <p className="text-xs text-on-surface-variant">Real-time transit updates & rewards</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    closeModal();
                    if (n.linkRoute) navigate(n.linkRoute);
                  }}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition-colors cursor-pointer ${
                    n.unread ? 'bg-surface-container-low hover:bg-surface-container' : 'bg-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center ${n.color} shrink-0 mt-0.5`}>
                    <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-headline font-bold text-sm text-on-surface truncate">{n.title}</h4>
                      <span className="text-[11px] text-on-surface-variant shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={markNotificationsAsRead}
              className="w-full py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-semibold hover:bg-surface-container-high transition-colors text-center"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {activeModal === 'editProfile' && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <form
            onSubmit={handleSaveProfile}
            className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">person</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Edit Profile</h3>
                  <p className="text-xs text-on-surface-variant">Update contact & emergency information</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-tertiary mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-body-lg text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-tertiary mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-body-lg text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-tertiary mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-body-lg text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="pt-2 border-t border-surface-container-low">
                <span className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                  Emergency Contact (SOS)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-tertiary mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={profileEmergencyName}
                      onChange={(e) => setProfileEmergencyName(e.target.value)}
                      placeholder="e.g. Sister, Parent"
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-tertiary mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      value={profileEmergencyPhone}
                      onChange={(e) => setProfileEmergencyPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-lg font-semibold active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-md hover:bg-primary-container active:scale-95 transition-transform"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SAVED PLACES MANAGER MODAL */}
      {activeModal === 'savedPlaces' && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[88vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">bookmark</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Saved Places</h3>
                  <p className="text-xs text-on-surface-variant">Quick booking shortcuts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* List of Saved Places */}
            <div className="flex flex-col gap-2.5">
              {savedPlaces.map((sp) => (
                <div
                  key={sp.id || sp.title}
                  className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors"
                >
                  <div
                    onClick={() => {
                      setDestination({
                        title: sp.title,
                        address: sp.address,
                        distanceKm: sp.distanceKm || 4.0,
                        durationMin: Math.round((sp.distanceKm || 4.0) * 2.8)
                      });
                      closeModal();
                      navigate('/location');
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{sp.icon || 'place'}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline font-bold text-sm text-on-surface truncate">{sp.title}</h4>
                      <p className="text-xs text-on-surface-variant truncate">{sp.address}</p>
                    </div>
                  </div>
                  {sp.id && (
                    <button
                      type="button"
                      onClick={() => deleteSavedPlace(sp.id!)}
                      className="w-8 h-8 rounded-full text-error hover:bg-error-container/20 flex items-center justify-center shrink-0 ml-2"
                      title="Delete place"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Place Form */}
            {isAddingPlace ? (
              <form onSubmit={handleAddSavedPlace} className="p-3.5 rounded-2xl bg-surface-container flex flex-col gap-3">
                <span className="text-xs font-bold uppercase text-primary">Add New Pinned Spot</span>
                <input
                  type="text"
                  placeholder="Label (e.g. Gym, Library, Cafe)"
                  value={newPlaceTitle}
                  onChange={(e) => setNewPlaceTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="Address in Mysuru"
                  value={newPlaceAddress}
                  onChange={(e) => setNewPlaceAddress(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingPlace(false)}
                    className="flex-1 py-2 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-primary text-xs font-bold text-on-primary shadow-sm"
                  >
                    Save Spot
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingPlace(true)}
                className="w-full py-3 rounded-xl border border-dashed border-primary text-primary font-label-md text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
                <span>Add Another Saved Spot</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* RIDE PREFERENCES MODAL */}
      {activeModal === 'preferences' && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">tune</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Ride Preferences</h3>
                  <p className="text-xs text-on-surface-variant">Default settings applied to every ride</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* AC Preference */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
                <div>
                  <h4 className="font-label-lg font-bold text-sm text-on-surface">AC On by Default</h4>
                  <p className="text-xs text-on-surface-variant">Cab drivers turn on AC before arrival</p>
                </div>
                <button
                  type="button"
                  onClick={() => updatePreferences({ acDefault: !preferences.acDefault })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    preferences.acDefault ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      preferences.acDefault ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Quiet Ride */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
                <div>
                  <h4 className="font-label-lg font-bold text-sm text-on-surface">Quiet Ride Preferred</h4>
                  <p className="text-xs text-on-surface-variant">Let the driver know you prefer minimal conversation</p>
                </div>
                <button
                  type="button"
                  onClick={() => updatePreferences({ quietRide: !preferences.quietRide })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    preferences.quietRide ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      preferences.quietRide ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Deduct Skyppy Cash */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
                <div>
                  <h4 className="font-label-lg font-bold text-sm text-on-surface">Auto-Deduct Skyppy Cash</h4>
                  <p className="text-xs text-on-surface-variant">Automatically apply wallet balance to reduce fare</p>
                </div>
                <button
                  type="button"
                  onClick={() => updatePreferences({ autoDeductCash: !preferences.autoDeductCash })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    preferences.autoDeductCash ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      preferences.autoDeductCash ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Tip Percentage */}
              <div className="p-3 rounded-2xl bg-surface-container-low flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-label-lg font-bold text-sm text-on-surface">Default Driver Tip</h4>
                  <span className="text-xs font-bold text-secondary">
                    {preferences.autoTipPercent > 0 ? `${preferences.autoTipPercent}%` : 'No Tip'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => updatePreferences({ autoTipPercent: pct })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        preferences.autoTipPercent === pct
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {pct === 0 ? 'None' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT METHODS MODAL */}
      {activeModal === 'paymentMethods' && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">credit_card</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Payment Options</h3>
                  <p className="text-xs text-on-surface-variant">Manage cards, UPI & wallet</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Skyppy Cash */}
              <div className="p-3.5 rounded-2xl bg-primary-container text-on-primary flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm">Skyppy Cash Balance</h4>
                    <p className="text-xs text-on-primary-container">Auto-deducted on confirmed rides</p>
                  </div>
                </div>
                <span className="font-numeric-xl font-extrabold text-lg text-secondary-fixed">₹150.00</span>
              </div>

              {/* UPI AutoPay */}
              <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between border border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-label-lg font-bold text-sm text-on-surface">UPI AutoPay</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-secondary-container text-on-secondary-container rounded-full">
                        DEFAULT
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">jeevan@oksbi (•••• 2590)</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-[20px] fill-1">check_circle</span>
              </div>

              {/* Credit/Debit Card */}
              <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">payment</span>
                  </div>
                  <div>
                    <h4 className="font-label-lg font-bold text-sm text-on-surface">HDFC Bank Visa Card</h4>
                    <p className="text-xs text-on-surface-variant">•••• •••• •••• 9104</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Switched default payment to HDFC Card', 'success')}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Set Default
                </button>
              </div>
            </div>

            {/* Add UPI Form */}
            {isAddingUpi ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newUpiId.trim()) return;
                  showToast(`UPI ID ${newUpiId} linked successfully!`, 'success');
                  setIsAddingUpi(false);
                  setNewUpiId('');
                }}
                className="p-3.5 rounded-2xl bg-surface-container flex flex-col gap-2.5"
              >
                <label className="text-xs font-bold uppercase text-primary">Enter UPI ID (VPA)</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={newUpiId}
                  onChange={(e) => setNewUpiId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUpi(false)}
                    className="flex-1 py-2 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-xs font-bold text-on-primary">
                    Verify & Link
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingUpi(true)}
                className="w-full py-3 rounded-xl border border-dashed border-primary text-primary font-label-md text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add_card</span>
                <span>Link Another UPI ID</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* HELP & SUPPORT MODAL */}
      {activeModal === 'helpSupport' && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[88vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">support_agent</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Mysuru Transit Support</h3>
                  <p className="text-xs text-on-surface-variant">24/7 passenger assistance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Helpline Card */}
            <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-secondary tracking-wider">Toll-Free Helpline</span>
                <h4 className="font-numeric-xl font-bold text-on-surface text-base">1800-425-SKYP (7597)</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Available in Kannada & English</p>
              </div>
              <a
                href="tel:18004257597"
                onClick={() => showToast('Simulating call to Mysuru Transit Helpline')}
                className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
              </a>
            </div>

            {/* FAQs */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase text-tertiary">Frequently Asked Questions</span>
              <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface flex flex-col gap-1">
                <span className="font-bold">How does Skyppy Miles distance tracking work?</span>
                <span className="text-on-surface-variant">Every completed kilometre on Auto or Cab rides is 100% credited to your lifetime ledger and unlocks milestones.</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface flex flex-col gap-1">
                <span className="font-bold">What is the cancellation policy?</span>
                <span className="text-on-surface-variant">Cancellations within 3 minutes of booking or before driver dispatch are 100% free of charge.</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface flex flex-col gap-1">
                <span className="font-bold">Lost an item in a ride?</span>
                <span className="text-on-surface-variant">Click below to file a lost item report directly with the assigned vehicle driver.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                closeModal();
                showToast('Lost item ticket created. Support team will contact you in 15 mins.', 'success');
              }}
              className="w-full py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-semibold hover:bg-surface-container-high transition-colors text-center"
            >
              Report Lost Property
            </button>
          </div>
        </div>
      )}

      {/* TRIP COMPLETED / RATING MODAL */}
      {activeModal === 'tripCompleted' && (() => {
        const completedDriver = activeBooking?.driver?.name || 'Driver';
        const completedDistance = activeBooking?.destination?.distanceKm || destination.distanceKm || 4.2;

        return (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
            <div className="absolute inset-0" onClick={closeModal}></div>
            <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto max-w-lg mx-auto">
              {/* Header / Celebration */}
              <div className="flex flex-col items-center text-center pt-2">
                <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg mb-2">
                  <span className="material-symbols-outlined text-[32px] fill-1 font-bold">verified</span>
                </div>
                <h3 className="font-headline font-extrabold text-xl text-on-surface">You Have Arrived!</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Thank you for commuting with Skyppy Mysuru</p>
              </div>

              {/* Miles Credited Banner */}
              <div className="p-3 rounded-2xl bg-secondary-container/30 border border-secondary-container flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[24px]">military_tech</span>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Skyppy Miles Credited</span>
                    <span className="text-[11px] text-on-surface-variant">+{completedDistance} km added to your lifetime ledger</span>
                  </div>
                </div>
                <span className="font-numeric-md font-bold text-secondary text-sm">+{completedDistance} KM</span>
              </div>

              {/* Star Rating Interaction */}
              <div className="flex flex-col items-center gap-2 py-1">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Rate Driver {completedDriver}
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTripRating(star)}
                      className="p-1 active:scale-125 transition-transform"
                    >
                      <span
                        className={`material-symbols-outlined text-[32px] ${
                          star <= tripRating ? 'text-secondary fill-1' : 'text-surface-container-high'
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Tip */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-on-surface-variant text-center">Add an optional tip</span>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSelectedTip(selectedTip === amount ? null : amount)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedTip === amount
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish & Exit */}
              <button
                type="button"
                onClick={handleFinishRating}
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-headline-md font-bold shadow-lg hover:bg-primary-container active:scale-[0.98] transition-transform"
              >
                Done & View Activity
              </button>
            </div>
          </div>
        );
      })()}

      {/* SCHEDULE RIDE MODAL */}
      {activeModal === 'schedule' && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[88vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Schedule a Ride</h3>
                  <p className="text-xs text-on-surface-variant">Reserve verified cab up to 7 days in advance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Date Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-outline">Select Day</label>
              <div className="grid grid-cols-3 gap-2">
                {['Today', 'Tomorrow', 'Day After'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setScheduleDate(d)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      scheduleDate === d
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-outline">Pickup Time Window</label>
              <div className="grid grid-cols-4 gap-2">
                {['08:30 AM', '10:00 AM', '02:30 PM', '06:00 PM'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setScheduleTime(t)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      scheduleTime === t
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">verified</span>
              <span>Free cancellation up to 15 minutes before scheduled pickup time.</span>
            </div>

            <button
              type="button"
              onClick={handleConfirmSchedule}
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-headline-md font-bold shadow-md hover:bg-primary-container active:scale-95 transition-transform"
            >
              Confirm Scheduled Ride
            </button>
          </div>
        </div>
      )}

      {/* 24/7 SAFETY TOOLKIT MODAL */}
      {activeModal === 'safety' && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[88vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-[22px]">security</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">24/7 Safety Toolkit</h3>
                  <p className="text-xs text-on-surface-variant">Mysuru Police & Transit SOS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* SOS Button */}
            <button
              type="button"
              onClick={() => {
                showToast('EMERGENCY SOS: Contacting Mysuru City Police Control Room (112)...', 'error');
                closeModal();
              }}
              className="w-full h-14 rounded-2xl bg-error text-on-error font-headline font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-error/30 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[24px]">e911_emergency</span>
              <span>EMERGENCY SOS (112 POLICE)</span>
            </button>

            {/* Safety Options */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  showToast(`Live ride location shared with ${userProfile.emergencyContactName}!`, 'success');
                  closeModal();
                }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">share_location</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">
                    Share with Emergency Contact
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    {userProfile.emergencyContactName} ({userProfile.emergencyContactPhone})
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast('Trip audio recording active for passenger safety');
                  closeModal();
                }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">Record Trip Audio</h4>
                  <p className="text-xs text-on-surface-variant">Encrypted recording stored locally for safety audit</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRIVER CHAT MODAL */}
      {activeModal === 'chat' && (() => {
        const chatDriverName = activeBooking?.driver?.name || 'Ramesh K.';
        const chatVehicleName = activeBooking?.vehicleName || 'Auto';

        return (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
            <div className="absolute inset-0" onClick={closeModal}></div>
            <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-4 z-10 flex flex-col gap-3 max-h-[90vh] max-w-lg mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-2 border-surface-container-low">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-on-surface">{chatDriverName} ({chatVehicleName} Driver)</h3>
                    <span className="text-[11px] text-secondary font-semibold">Online • Approaching</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Quick replies */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['I am at the gate', 'Turning on hazards', 'Please wait 2 mins'].map((msg) => (
                  <button
                    key={msg}
                    type="button"
                    onClick={() => handleSendChat(msg)}
                    className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs hover:bg-surface-container-high shrink-0 font-medium active:scale-95"
                  >
                    {msg}
                  </button>
                ))}
              </div>

              {/* Messages body */}
              <div className="h-56 overflow-y-auto flex flex-col gap-2 p-1">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-primary text-on-primary self-end rounded-br-xs'
                        : 'bg-surface-container text-on-surface self-start rounded-bl-xs'
                    }`}
                  >
                    <span>{m.text}</span>
                    <span className={`text-[10px] mt-0.5 ${m.sender === 'user' ? 'text-primary-fixed/80' : 'text-on-surface-variant'}`}>
                      {m.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex items-center gap-2 pt-1 border-t border-surface-container-low">
                <input
                  type="text"
                  placeholder={`Message driver ${chatDriverName.split(' ')[0]}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChat();
                  }}
                  className="flex-1 h-10 px-3.5 rounded-full bg-surface-container text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => handleSendChat()}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RECEIPT / INVOICE MODAL */}
      {activeModal === 'receipt' && modalData && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[88vh] overflow-y-auto max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-on-surface">{modalData.bookingId}</h3>
                  <p className="text-xs text-on-surface-variant">{modalData.date}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Vehicle &amp; Driver</span>
                <span className="font-semibold text-on-surface">{modalData.driver} ({modalData.vehicle})</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Pickup Location</span>
                <span className="font-semibold text-on-surface">{modalData.origin}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Drop Destination</span>
                <span className="font-semibold text-on-surface">{modalData.destination}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Distance Traveled</span>
                <span className="font-semibold text-on-surface">{modalData.distanceKm} km</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Payment Mode</span>
                <span className="font-semibold text-secondary">{modalData.paymentMethod}</span>
              </div>
              <div className="h-px bg-surface-container my-1"></div>
              <div className="flex justify-between text-base text-on-surface font-bold">
                <span>Total Fare Paid</span>
                <span className="text-primary font-numeric-xl">₹{modalData.fare}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => showToast('PDF tax invoice downloaded!')}
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-lg flex items-center justify-center gap-2 active:scale-95 transition-transform font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  rebookRide(modalData);
                  closeModal();
                  navigate('/options');
                }}
                className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-label-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">repeat</span>
                <span>Book Again</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FARE BREAKDOWN MODAL */}
      {activeModal === 'fareBreakdown' && (() => {
        const targetVehicleId = modalData?.vehicleId || selectedVehicleId;
        const v = vehicles[targetVehicleId] || vehicles.auto;
        const breakdown = getFareBreakdown(targetVehicleId, destination.distanceKm);

        return (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
            <div className="absolute inset-0" onClick={closeModal}></div>
            <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">receipt</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-on-surface">Transparent Fare Breakdown</h3>
                    <p className="text-xs text-on-surface-variant">Mysuru Corridor Guaranteed Pricing</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center p-1">
                    <img className="w-full h-full object-contain" src={v.image} alt={v.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">{v.name} ({v.category})</h4>
                    <p className="text-xs text-on-surface-variant">{breakdown.distanceKm} km estimated route</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">
                  No Surge
                </span>
              </div>

              <div className="flex flex-col gap-3 text-sm py-1">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Base Fare (Flag Down)</span>
                  <span className="font-semibold text-on-surface font-numeric-md">₹{breakdown.baseFare}</span>
                </div>

                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Distance Fare ({breakdown.distanceKm} km × ₹{breakdown.ratePerKm}/km)</span>
                  <span className="font-semibold text-on-surface font-numeric-md">₹{breakdown.distanceFare}</span>
                </div>

                <div className="flex justify-between items-center text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span>Platform &amp; Safety Access Fee</span>
                    <span className="text-[10px] text-secondary font-bold bg-secondary-container px-1.5 py-0.2 rounded">WAIVED</span>
                  </div>
                  <span className="font-semibold text-secondary line-through">₹15</span>
                </div>

                {breakdown.discount > 0 && (
                  <div className="flex justify-between items-center text-secondary font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">local_offer</span>
                      <span>Promo Coupon Discount</span>
                    </div>
                    <span className="font-bold font-numeric-md">-₹{breakdown.discount}</span>
                  </div>
                )}

                <div className="h-px bg-surface-container my-1"></div>

                <div className="flex justify-between items-center text-base font-bold text-on-surface">
                  <div className="flex flex-col">
                    <span>Total Guaranteed Fare</span>
                    <span className="text-[11px] font-normal text-on-surface-variant">Taxes &amp; tolls included</span>
                  </div>
                  <span className="font-numeric-xl text-primary text-xl">₹{breakdown.totalFare}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">verified_user</span>
                <span>
                  <strong>Skyppy Fare Guarantee:</strong> Fares are locked upon booking. No midnight surge or sudden driver extortion.
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-bold shadow-md active:scale-95 transition-transform"
              >
                Got It
              </button>
            </div>
          </div>
        );
      })()}
    </>
  );
};
