import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

interface ShareLiveTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLiveTripModal: React.FC<ShareLiveTripModalProps> = ({ isOpen, onClose }) => {
  const {
    activeBooking,
    liveTripShare,
    startTripShare,
    stopTripShare,
    toggleShareContact,
    addTrustedContact,
    updateShareSettings,
    showToast
  } = useAppStore();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Friend');

  if (!isOpen) return null;

  const booking = activeBooking || {
    bookingId: 'SKY784392',
    driver: { name: 'Ramesh K.', plate: 'KA-09 AB 4217' },
    pickup: { title: 'VVCE Gokulam' },
    destination: { title: 'JSS Medical College' }
  };

  const handleStartSharing = () => {
    const selectedIds = liveTripShare.contacts.filter((c) => c.selected).map((c) => c.id);
    if (selectedIds.length === 0) {
      showToast('Please select at least one contact to share with', 'error');
      return;
    }
    const url = startTripShare(selectedIds);
    navigator.clipboard?.writeText(url);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/share-trip?token=${liveTripShare.shareToken || 'SAFE-' + booking.bookingId}&id=${booking.bookingId}`;
    navigator.clipboard?.writeText(url);
    showToast('Secure tracking link copied to clipboard!', 'success');
  };

  const handleShareNative = async () => {
    const url = `${window.location.origin}/share-trip?token=${liveTripShare.shareToken || 'SAFE-' + booking.bookingId}&id=${booking.bookingId}`;
    const text = `I'm riding with Skyppy in Mysuru. Track my ongoing trip live on the map: Driver ${booking.driver?.name || 'Ramesh K.'} (${booking.driver?.plate || 'KA-09 AB 4217'}). Link: ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Skyppy Live Trip Tracking',
          text,
          url
        });
        showToast('Trip shared successfully!');
      } catch {
        // User cancelled or fallback
      }
    } else {
      navigator.clipboard?.writeText(text);
      showToast('Share message copied to clipboard!', 'success');
    }
  };

  const handleAddNewContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      showToast('Please enter contact name and phone number', 'error');
      return;
    }
    addTrustedContact(newContactName.trim(), newContactPhone.trim(), newContactRelation);
    setNewContactName('');
    setNewContactPhone('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              liveTripShare.isSharing ? 'bg-emerald-500/15 text-emerald-600' : 'bg-primary/10 text-primary'
            }`}>
              <span className="material-symbols-outlined text-[22px]">
                {liveTripShare.isSharing ? 'share_location' : 'security'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-lg text-on-surface">Share Live Trip</h3>
                {liveTripShare.isSharing && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant">Live passenger safety tracking</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Real-time Status Card */}
        {liveTripShare.isSharing ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">radar</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-emerald-900">Live GPS Location Broadcasting</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                Your selected contacts can see your vehicle road progress, driver details, and ETA. Location is updated continuously.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-on-surface">Private &amp; Secure Tracking</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                Only people with the private link can view your active ride. Sharing automatically expires when your ride finishes, and you can stop it at any time.
              </p>
            </div>
          </div>
        )}

        {/* Trusted Contacts Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-outline">
              Select Trusted Contacts ({liveTripShare.contacts.filter((c) => c.selected).length} selected)
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">
                {isAddingNew ? 'remove' : 'add'}
              </span>
              <span>{isAddingNew ? 'Cancel' : 'Add Contact'}</span>
            </button>
          </div>

          {/* New contact inline form */}
          {isAddingNew && (
            <form onSubmit={handleAddNewContact} className="p-3 rounded-2xl bg-surface-container flex flex-col gap-2.5 border border-primary/20">
              <span className="text-[11px] font-bold text-primary uppercase">Add New Trusted Safety Contact</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <input
                  type="tel"
                  placeholder="+91 Mobile Number"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="h-8 px-2 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline/20"
                >
                  <option value="Sister">Sister</option>
                  <option value="Parent">Parent</option>
                  <option value="Partner">Partner</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                </select>
                <button
                  type="submit"
                  className="h-8 px-3 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container"
                >
                  Save Contact
                </button>
              </div>
            </form>
          )}

          {/* List of contacts */}
          <div className="flex flex-col gap-1.5">
            {liveTripShare.contacts.map((contact) => (
              <label
                key={contact.id}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                  contact.selected
                    ? 'bg-primary/5 border-primary/40 text-on-surface'
                    : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    contact.selected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[17px]">person</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate text-on-surface">{contact.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">
                        {contact.relation}
                      </span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant font-mono">{contact.phone}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={contact.selected}
                  onChange={() => toggleShareContact(contact.id)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Granular Sharing Permissions */}
        <div className="flex flex-col gap-2 pt-1 border-t border-surface-container-low">
          <span className="text-xs font-bold uppercase tracking-wider text-outline">Information Shared</span>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs text-on-surface cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">navigation</span>
                <span>Live Vehicle Road Position &amp; Route</span>
              </span>
              <input
                type="checkbox"
                checked={liveTripShare.includeLiveLocation}
                onChange={(e) => updateShareSettings({ includeLiveLocation: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs text-on-surface cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
                <span>Driver &amp; Vehicle License Plate</span>
              </span>
              <input
                type="checkbox"
                checked={liveTripShare.includeDriverDetails}
                onChange={(e) => updateShareSettings({ includeDriverDetails: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs text-on-surface cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">timer</span>
                <span>Real-Time Estimated Arrival (ETA)</span>
              </span>
              <input
                type="checkbox"
                checked={liveTripShare.includeEta}
                onChange={(e) => updateShareSettings({ includeEta: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
            </label>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-low">
          {liveTripShare.isSharing ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-11 rounded-xl bg-surface-container text-on-surface font-label-md text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[17px]">content_copy</span>
                  <span>Copy Link</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareNative}
                  className="h-11 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-[17px]">share</span>
                  <span>Send via App</span>
                </button>
              </div>

              <button
                type="button"
                onClick={stopTripShare}
                className="w-full h-11 rounded-xl bg-error/10 hover:bg-error/20 text-error font-label-md text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-error/20"
              >
                <span className="material-symbols-outlined text-[17px]">stop_circle</span>
                <span>Stop Sharing Live Trip</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleStartSharing}
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">share_location</span>
              <span>Start Sharing Live Trip</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
