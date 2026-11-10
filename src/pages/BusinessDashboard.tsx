import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useCourierStore } from '../store/useCourierStore';
import { ShipmentStatus } from '../types/courier';

export const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { shipments, getBusinessMetrics, toggleBusinessMode, setActiveShipment } = useCourierStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [manifestExported, setManifestExported] = useState(false);

  const metrics = getBusinessMetrics();

  const filteredShipments = shipments.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.trackingNumber.toLowerCase().includes(q) ||
      s.receiver.name.toLowerCase().includes(q) ||
      s.receiver.city.toLowerCase().includes(q) ||
      s.sender.city.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'transit') {
      return s.status === 'in_transit' || s.status === 'arrived_destination_hub' || s.status === 'out_for_delivery';
    }
    if (filterStatus === 'delivered') return s.status === 'delivered';
    if (filterStatus === 'exceptions') {
      return s.status === 'delayed' || s.status === 'delivery_attempted' || s.status === 'pickup_failed';
    }
    return true;
  });

  const handleExportManifest = () => {
    setManifestExported(true);
    setTimeout(() => setManifestExported(false), 3000);
  };

  const handleRepeatShipment = (shipment: any) => {
    navigate(
      `/courier/send?receiverName=${encodeURIComponent(shipment.receiver.name)}&speed=${shipment.serviceSpeed}`
    );
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-10 bg-surface min-h-full">
      <Header
        type="stack"
        title="Business Logistics"
        onBack={() => navigate('/courier')}
      />

      <main className="flex-1 px-margin py-4 flex flex-col gap-4">
        {/* Business Mode Canopy Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-secondary-fixed flex items-center justify-center shrink-0 border border-secondary-fixed/30">
              <span className="material-symbols-outlined text-[22px]">store</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm">Skyppy Enterprise Logistics</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-secondary-fixed text-on-secondary-fixed uppercase">
                  Active
                </span>
              </div>
              <span className="text-[11px] text-blue-200">Volume commercial shipping & GST manifests</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              toggleBusinessMode(false);
              navigate('/courier');
            }}
            className="text-[11px] text-blue-200 hover:text-white underline font-semibold cursor-pointer shrink-0 ml-2"
          >
            Personal Mode
          </button>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-surface-container-low border border-surface-container/70 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-tertiary">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Consignments</span>
              <span className="material-symbols-outlined text-[18px] text-primary">local_shipping</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-on-surface">{metrics.totalShipments}</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                98.4% On-time delivery
              </span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-surface-container/70 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-tertiary">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active In Transit</span>
              <span className="material-symbols-outlined text-[18px] text-amber-600">sync</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-on-surface">{metrics.activeInTransit}</span>
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
                {metrics.activeInTransit} intercity linehauls
              </span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-surface-container/70 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-tertiary">
              <span className="text-[11px] font-bold uppercase tracking-wider">Delivered</span>
              <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-on-surface">{metrics.deliveredThisMonth}</span>
              <span className="text-[10px] text-tertiary block mt-0.5">Verified with digital OTP</span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-surface-container/70 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-tertiary">
              <span className="text-[11px] font-bold uppercase tracking-wider">Logistics Spend</span>
              <span className="material-symbols-outlined text-[18px] text-secondary">payments</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-on-surface">₹{metrics.totalSpentInr}</span>
              <span className="text-[10px] text-tertiary block mt-0.5">18% GST input deductible</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Dispatch CTA */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/courier/send')}
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>Book New Consignment</span>
          </button>

          <button
            type="button"
            onClick={handleExportManifest}
            className="py-3 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            title="Export Manifest CSV / PDF"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">download</span>
            <span>{manifestExported ? 'Manifest Exported!' : 'Export'}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-tertiary">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, receiver name or city..."
              className="w-full bg-surface-container-lowest border border-surface-container rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'transit', label: 'In Transit' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'exceptions', label: 'Exceptions' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === tab.key
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-low text-tertiary hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Consignments List */}
        <div className="flex flex-col gap-2.5">
          {filteredShipments.length === 0 ? (
            <div className="bg-surface-container-low rounded-2xl p-6 text-center text-tertiary text-xs">
              No consignments matching filters.
            </div>
          ) : (
            filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="bg-surface-container-lowest border border-surface-container rounded-2xl p-3.5 shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-surface-container/60">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-on-surface">
                      {shipment.trackingNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-tertiary uppercase">
                      {shipment.serviceName.split(' ')[0]}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      shipment.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-primary'
                    }`}
                  >
                    {shipment.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-on-surface block">{shipment.receiver.name}</span>
                    <span className="text-tertiary text-[11px]">
                      {shipment.sender.city} → {shipment.receiver.city} • {shipment.packageDetails.weightKg} kg
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="text-sm font-extrabold text-on-surface">
                      ₹{shipment.pricing.totalEstimatedFare}
                    </strong>
                    <span className="text-[10px] text-tertiary block">
                      {shipment.status === 'delivered' ? 'Paid & Closed' : 'In Progress'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-container flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleRepeatShipment(shipment)}
                    className="flex-1 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-[11px] flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px] text-primary">replay</span>
                    <span>Repeat Consignment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveShipment(shipment);
                      navigate(`/courier/track/${shipment.id}`);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-primary text-white font-bold text-[11px] flex items-center gap-1 active:scale-95"
                  >
                    <span>Track</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
