import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface MilesOrbitProps {
  balanceKm: number;
  monthlyKm?: number;
  currentTier?: string;
  nextMilestoneKm?: number;
  variant?: 'hero' | 'compact' | 'celebration';
  onEarnSimulate?: (amount: number) => void;
  onRedeemSimulate?: (amount: number) => void;
  className?: string;
}

interface OrbitNode {
  id: string;
  angle: number; // in degrees
  distanceKm: number;
  label: string;
  date: string;
  color: string;
  radius: number;
}

const INITIAL_NODES: OrbitNode[] = [
  { id: 'node-1', angle: 25, distanceKm: 5.4, label: 'VVCE → Railway Station', date: 'Today', color: '#d4ee66', radius: 6 },
  { id: 'node-2', angle: 105, distanceKm: 4.2, label: 'Gokulam → JSS Hospital', date: 'Yesterday', color: '#0042dd', radius: 5 },
  { id: 'node-3', angle: 180, distanceKm: 6.8, label: 'Palace Amba Vilas Tour', date: '14 Nov', color: '#d4ee66', radius: 7 },
  { id: 'node-4', angle: 260, distanceKm: 3.1, label: 'KRS Road Quick Auto', date: '12 Nov', color: '#315ef8', radius: 5 },
  { id: 'node-5', angle: 320, distanceKm: 8.5, label: 'Hebbal Electronic City', date: '10 Nov', color: '#c0de43', radius: 6.5 }
];

export const MilesOrbit: React.FC<MilesOrbitProps> = ({
  balanceKm,
  monthlyKm = 42.6,
  currentTier = 'Tier 2 Voyager',
  nextMilestoneKm = 300,
  variant = 'hero',
  onEarnSimulate,
  onRedeemSimulate,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayBalance, setDisplayBalance] = useState(balanceKm);
  const [nodes, setNodes] = useState<OrbitNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<OrbitNode | null>(null);
  const [isEarning, setIsEarning] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Smooth numerical count-up effect
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayBalance(balanceKm);
      return;
    }

    const startVal = displayBalance;
    const endVal = balanceKm;
    if (startVal === endVal) return;

    const duration = 1200;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Number((startVal + (endVal - startVal) * ease).toFixed(1));
      setDisplayBalance(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayBalance(endVal);
      }
    };

    requestAnimationFrame(step);
  }, [balanceKm, shouldReduceMotion]);

  // Ambient orbital rotation
  useEffect(() => {
    if (shouldReduceMotion) return;

    let animFrame: number;
    let lastTime = performance.now();

    const rotate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      // 0.4 rpm = ~2.4 degrees per second
      setRotationAngle((prev) => (prev + (delta * 0.0024)) % 360);
      animFrame = requestAnimationFrame(rotate);
    };

    animFrame = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animFrame);
  }, [shouldReduceMotion]);

  // Simulate earning Miles (+24 km)
  const handleEarnMiles = () => {
    if (isEarning) return;
    setIsEarning(true);
    setFeedbackMessage('+24.0 KM JOURNEY JOINED ORBIT');

    const newNode: OrbitNode = {
      id: `node-${Date.now()}`,
      angle: (rotationAngle + 45) % 360,
      distanceKm: 24.0,
      label: 'Mysuru City Express Corridor',
      date: 'Just now',
      color: '#d4ee66',
      radius: 8
    };

    setTimeout(() => {
      setNodes((prev) => [newNode, ...prev.slice(0, 7)]);
      if (onEarnSimulate) {
        onEarnSimulate(24.0);
      }
    }, 400);

    setTimeout(() => {
      setIsEarning(false);
    }, 2200);

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3800);
  };

  // Simulate redeeming a voucher
  const handleRedeemMiles = () => {
    if (isRedeeming || nodes.length === 0) return;
    setIsRedeeming(true);
    setFeedbackMessage('-15.0 KM REDEEMED FOR ₹50 VOUCHER');

    setTimeout(() => {
      setNodes((prev) => prev.slice(1));
      if (onRedeemSimulate) {
        onRedeemSimulate(15.0);
      }
    }, 400);

    setTimeout(() => {
      setIsRedeeming(false);
    }, 2000);

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3800);
  };

  // Geometry Constants
  const isCompact = variant === 'compact';
  const size = isCompact ? 180 : 320;
  const center = size / 2;
  const radiusX = isCompact ? 68 : 124;
  const radiusY = isCompact ? 52 : 96;

  const progressPercent = Math.min(100, Math.round((displayBalance / nextMilestoneKm) * 100));

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* ================= SVG THE MILES ORBIT CANVAS ================= */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow halo behind central core */}
        <div
          className={`absolute rounded-full pointer-events-none transition-all duration-700 ${
            isEarning
              ? 'bg-gradient-to-r from-[#d4ee66]/40 via-[#0042dd]/30 to-[#d4ee66]/40 scale-125 blur-3xl'
              : 'bg-gradient-to-r from-[#0042dd]/20 via-[#d4ee66]/15 to-transparent blur-2xl'
          }`}
          style={{
            width: size * 0.75,
            height: size * 0.75,
            left: size * 0.125,
            top: size * 0.125
          }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label="Skyppy Miles Orbit System"
          className="overflow-visible"
        >
          <defs>
            {/* Signature Lime to Blue Trajectory Gradient */}
            <linearGradient id="milesTrajectoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4ee66" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#0042dd" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#315ef8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d4ee66" stopOpacity="0.1" />
            </linearGradient>

            {/* Glowing Core Radial Gradient */}
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#101c2b" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#0a121d" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#0042dd" stopOpacity="0.3" />
            </radialGradient>

            {/* Glow Filter */}
            <filter id="orbitGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ================= 1. SECONDARY BACKGROUND GUIDELINE ================= */}
          <ellipse
            cx={center}
            cy={center}
            rx={radiusX + 14}
            ry={radiusY + 10}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 6"
            className="text-white/10 dark:text-white/10"
          />

          {/* ================= 2. PRIMARY SIGNATURE ORBITAL TRAJECTORY ================= */}
          <motion.ellipse
            cx={center}
            cy={center}
            rx={radiusX}
            ry={radiusY}
            fill="none"
            stroke="url(#milesTrajectoryGrad)"
            strokeWidth={isCompact ? 2.5 : 3.5}
            strokeDasharray={isCompact ? '6 4' : '8 6'}
            filter="url(#orbitGlow)"
            animate={{
              rotate: shouldReduceMotion ? 0 : 360
            }}
            transition={{
              rotate: {
                repeat: Infinity,
                duration: 65,
                ease: 'linear'
              }
            }}
            style={{ originX: '50%', originY: '50%' }}
          />

          {/* Dynamic Shockwave Ripple on Earn */}
          {isEarning && (
            <motion.ellipse
              cx={center}
              cy={center}
              rx={radiusX}
              ry={radiusY}
              fill="none"
              stroke="#d4ee66"
              strokeWidth="4"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.35, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{ originX: '50%', originY: '50%' }}
            />
          )}

          {/* ================= 3. TRAVELING PHOTON ON TRAJECTORY ================= */}
          {!shouldReduceMotion && (
            <motion.g
              animate={{
                rotate: 360
              }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: 'linear'
              }}
              style={{ originX: `${center}px`, originY: `${center}px` }}
            >
              <ellipse
                cx={center + radiusX}
                cy={center}
                rx={5}
                ry={5}
                fill="#d4ee66"
                filter="url(#orbitGlow)"
              />
              <ellipse
                cx={center + radiusX}
                cy={center}
                rx={2.5}
                ry={2.5}
                fill="#ffffff"
              />
            </motion.g>
          )}

          {/* ================= 4. MOVING JOURNEY ORBIT NODES ================= */}
          {nodes.map((node, idx) => {
            // Calculate orbital position from current angle + continuous rotation
            const currentAngleRad = ((node.angle + rotationAngle) * Math.PI) / 180;
            const nodeX = center + radiusX * Math.cos(currentAngleRad);
            const nodeY = center + radiusY * Math.sin(currentAngleRad);
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                role="button"
                aria-label={`Journey: ${node.label} (+${node.distanceKm} km)`}
                tabIndex={0}
                className="cursor-pointer group"
                onClick={() => setSelectedNode(isSelected ? null : node)}
              >
                {/* Node halo ring on hover/selected */}
                <circle
                  cx={nodeX}
                  cy={nodeY}
                  r={node.radius + (isSelected ? 7 : 3)}
                  fill={node.color}
                  fillOpacity={isSelected ? 0.35 : 0.15}
                  className="transition-all duration-300"
                />

                {/* Node Core */}
                <circle
                  cx={nodeX}
                  cy={nodeY}
                  r={node.radius}
                  fill={node.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  filter="url(#orbitGlow)"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Inner white specular reflection */}
                <circle
                  cx={nodeX - node.radius * 0.3}
                  cy={nodeY - node.radius * 0.3}
                  r={node.radius * 0.35}
                  fill="#ffffff"
                  fillOpacity="0.9"
                />
              </g>
            );
          })}
        </svg>

        {/* ================= 5. CENTRAL MILES CORE EMBLEM ================= */}
        <div
          className={`absolute rounded-full flex flex-col items-center justify-center shadow-2xl border transition-all duration-300 pointer-events-none ${
            isEarning
              ? 'ring-4 ring-[#d4ee66] border-[#d4ee66] bg-[#0c1624]'
              : 'border-white/15 bg-[#0e1726]/95 backdrop-blur-md'
          }`}
          style={{
            width: isCompact ? 108 : 172,
            height: isCompact ? 108 : 172,
            left: center - (isCompact ? 54 : 86),
            top: center - (isCompact ? 54 : 86)
          }}
        >
          {/* Subtle Monogram Brand Accent */}
          <div className="flex items-center gap-1 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ee66] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d4ee66]">
              Skyppy Miles
            </span>
          </div>

          {/* Animated Rolling Distance Value */}
          <div className="flex items-baseline gap-1">
            <span
              className={`font-black font-mono tracking-tight text-white transition-all ${
                isCompact ? 'text-2xl' : 'text-4xl'
              }`}
            >
              {displayBalance.toFixed(1)}
            </span>
            <span className="text-[11px] font-bold text-[#d4ee66] uppercase">KM</span>
          </div>

          {/* Monthly Subtext in Hero variant */}
          {!isCompact && (
            <p className="text-[10px] text-slate-400 font-medium mt-1">
              {monthlyKm} km this month
            </p>
          )}

          {/* Tier indicator pill */}
          <div className="mt-1.5 px-2 py-0.5 rounded-full bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider border border-white/10">
            {currentTier}
          </div>
        </div>
      </div>

      {/* ================= 6. INTERACTIVE FEEDBACK BANNER ================= */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-3 px-3.5 py-1.5 rounded-full bg-[#d4ee66] text-black font-extrabold text-xs tracking-wide shadow-lg flex items-center gap-2 border border-white/40"
          >
            <span className="material-symbols-outlined text-[16px]">military_tech</span>
            <span>{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 7. SELECTED JOURNEY NODE TOOLTIP ================= */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 6 }}
            className="mt-3 bg-surface-container-highest dark:bg-slate-800 text-on-surface p-3 rounded-2xl shadow-xl border border-outline-variant/30 flex items-center justify-between gap-4 max-w-xs w-full"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-900 font-bold"
                style={{ backgroundColor: selectedNode.color }}
              >
                <span className="material-symbols-outlined text-[18px]">route</span>
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-on-surface truncate">{selectedNode.label}</h5>
                <span className="text-[10px] text-on-surface-variant">{selectedNode.date}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-extrabold text-primary dark:text-[#d4ee66] block">
                +{selectedNode.distanceKm} km
              </span>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-[10px] text-on-surface-variant hover:text-on-surface underline font-medium"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 8. HERO SIMULATION CONTROLS FOR TESTING ================= */}
      {!isCompact && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleEarnMiles}
            disabled={isEarning}
            className="px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-[#d4ee66] font-bold text-xs flex items-center gap-1.5 transition-all border border-primary/20 active:scale-95 disabled:opacity-50"
            title="Simulate completed journey joining the orbit"
          >
            <span className="material-symbols-outlined text-[15px]">add_circle</span>
            <span>Simulate Ride Earn (+24 km)</span>
          </button>

          <button
            type="button"
            onClick={handleRedeemMiles}
            disabled={isRedeeming || nodes.length === 0}
            className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-all border border-outline-variant/30 active:scale-95 disabled:opacity-50"
            title="Simulate voucher redemption leaving the orbit"
          >
            <span className="material-symbols-outlined text-[15px]">redeem</span>
            <span>Redeem Test Voucher</span>
          </button>
        </div>
      )}
    </div>
  );
};
