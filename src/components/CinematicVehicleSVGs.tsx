import React from 'react';

interface VehicleSVGProps {
  className?: string;
  size?: number;
}

/**
 * High-fidelity, custom SVG illustration of a modern Mysuru Electric Auto Rickshaw (Bajaj RE EV).
 * Authentic styling with yellow curved roof, metallic emerald cowl, dual LED headlamps,
 * windshield wiper, and alloy wheels.
 */
export const AutoRickshawSVG: React.FC<VehicleSVGProps> = ({ className = '', size = 200 }) => {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 240 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Canopy Gradient */}
        <linearGradient id="auto-roof" x1="40" y1="20" x2="200" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FACC15" />
          <stop offset="0.5" stopColor="#EAB308" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>

        {/* Body Emerald Green Gradient */}
        <linearGradient id="auto-body" x1="30" y1="60" x2="210" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#15803D" />
          <stop offset="0.6" stopColor="#166534" />
          <stop offset="1" stopColor="#14532D" />
        </linearGradient>

        {/* Windshield Glass Gradient */}
        <linearGradient id="auto-glass" x1="140" y1="36" x2="190" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BAE6FD" stopOpacity="0.85" />
          <stop offset="1" stopColor="#38BDF8" stopOpacity="0.45" />
        </linearGradient>

        {/* Wheel Gradient */}
        <radialGradient id="auto-wheel" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#4B5563" />
          <stop offset="0.6" stopColor="#1F2937" />
          <stop offset="1" stopColor="#111827" />
        </radialGradient>

        {/* Ground Drop Shadow */}
        <radialGradient id="auto-shadow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#000000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="120" cy="144" rx="95" ry="9" fill="url(#auto-shadow)" />

      {/* Main Chassis / Underbody */}
      <path d="M42 108 L195 108 L204 116 L35 116 Z" fill="#0F172A" />

      {/* Lower Body Panel (Mysuru Transit Green) */}
      <path
        d="M36 84 C36 78 40 74 46 74 L130 74 L142 88 L196 88 C202 88 206 92 206 98 L206 112 C206 115 204 117 201 117 L39 117 C37 117 36 115 36 112 Z"
        fill="url(#auto-body)"
      />

      {/* Accent Band (Signal Lime Accent) */}
      <path d="M38 90 L204 90 L204 94 L38 94 Z" fill="#D1EC64" />

      {/* Passenger Cabin Opening (Dark Interior) */}
      <path d="M52 48 L124 48 L124 100 L52 100 Z" fill="#1E293B" />
      {/* Passenger Seat Cushion */}
      <path d="M58 84 C58 80 62 76 68 76 L92 76 C96 76 98 80 98 84 L98 98 L58 98 Z" fill="#334155" />
      {/* Passenger Safety Grab Rail */}
      <path d="M122 52 L122 96" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Front Windshield Frame and A-Pillar */}
      <path d="M136 34 L180 34 C184 34 187 36 189 40 L202 74 L138 74 Z" fill="url(#auto-glass)" />
      <path d="M188 38 L201 72" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />

      {/* Windshield Wiper */}
      <line x1="168" y1="72" x2="182" y2="48" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

      {/* Iconic Curved Canopy Roof (Mysuru Yellow) */}
      <path
        d="M40 38 C40 28 48 20 60 20 L166 20 C182 20 196 26 200 36 L206 48 L36 48 Z"
        fill="url(#auto-roof)"
      />
      {/* Roof Highlight Sheen */}
      <path d="M60 23 L164 23 C175 23 186 27 190 32 L54 32 C48 32 44 28 60 23 Z" fill="#FEF08A" opacity="0.6" />

      {/* Roof Rear Pillar & Front Cowl Connector */}
      <line x1="42" y1="46" x2="42" y2="76" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
      <line x1="134" y1="46" x2="134" y2="76" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

      {/* Front Nose & Headlight Cowl */}
      <path
        d="M194 74 L210 74 C216 74 220 78 221 84 L221 98 C221 104 216 108 210 108 L194 108 Z"
        fill="url(#auto-body)"
      />

      {/* Dual Headlamp (Glowing Xenon White/Gold) */}
      <ellipse cx="218" cy="88" rx="4" ry="6" fill="#FEF08A" />
      <ellipse cx="218" cy="88" rx="2" ry="3" fill="#FFFFFF" />
      {/* Amber Indicator */}
      <circle cx="216" cy="100" r="3" fill="#F59E0B" />

      {/* Rear Wheel (Dual suspension) */}
      <g>
        <circle cx="72" cy="122" r="22" fill="url(#auto-wheel)" />
        <circle cx="72" cy="122" r="14" fill="#374151" stroke="#4B5563" strokeWidth="2" />
        <circle cx="72" cy="122" r="6" fill="#D1D5DB" />
        {/* Spokes */}
        <line x1="72" y1="108" x2="72" y2="136" stroke="#9CA3AF" strokeWidth="1.5" />
        <line x1="58" y1="122" x2="86" y2="122" stroke="#9CA3AF" strokeWidth="1.5" />
      </g>

      {/* Front Wheel (Single steering fork) */}
      <g>
        {/* Front Fork */}
        <line x1="184" y1="106" x2="192" y2="124" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <circle cx="194" cy="124" r="20" fill="url(#auto-wheel)" />
        <circle cx="194" cy="124" r="12" fill="#374151" stroke="#4B5563" strokeWidth="2" />
        <circle cx="194" cy="124" r="5" fill="#D1D5DB" />
        <line x1="194" y1="112" x2="194" y2="136" stroke="#9CA3AF" strokeWidth="1.5" />
        <line x1="182" y1="124" x2="206" y2="124" stroke="#9CA3AF" strokeWidth="1.5" />
      </g>

      {/* Electric EV Badge */}
      <rect x="156" y="98" width="22" height="9" rx="2" fill="#0042DD" />
      <text x="160" y="105" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">EV</text>
    </svg>
  );
};

/**
 * High-fidelity, custom SVG illustration of a modern Aerodynamic Compact Hatchback (Skyppy Mini).
 * Styled in Cerulean Blue metallic finish, tinted glass, alloy rims, and dynamic character lines.
 */
export const HatchbackVehicleSVG: React.FC<VehicleSVGProps> = ({ className = '', size = 200 }) => {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 240 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Cerulean Blue Metallic Coat */}
        <linearGradient id="hatch-body" x1="20" y1="35" x2="220" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="0.3" stopColor="#1D4ED8" />
          <stop offset="0.7" stopColor="#1E40AF" />
          <stop offset="1" stopColor="#172554" />
        </linearGradient>

        {/* Tinted Aerodynamic Glass */}
        <linearGradient id="hatch-glass" x1="70" y1="40" x2="175" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1E293B" stopOpacity="0.75" />
        </linearGradient>

        {/* Alloy Wheels */}
        <radialGradient id="hatch-tire" cx="50%" cy="50%" r="50%">
          <stop stopColor="#475569" />
          <stop offset="0.65" stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </radialGradient>

        <radialGradient id="hatch-shadow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#000000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="120" cy="144" rx="100" ry="9" fill="url(#hatch-shadow)" />

      {/* Main Car Body Profile */}
      <path
        d="M24 100 C24 92 28 84 36 82 L58 78 L88 44 C94 37 103 34 112 34 L158 34 C168 34 176 38 181 46 L204 78 L222 84 C228 86 232 92 232 98 L232 116 C232 118 230 120 228 120 L24 120 C22 120 20 118 20 116 L20 106 Z"
        fill="url(#hatch-body)"
      />

      {/* Sleek Aerodynamic Roofline Curve */}
      <path
        d="M84 46 L112 36 L156 36 C164 36 170 39 174 46 L196 74 L84 74 Z"
        fill="url(#hatch-glass)"
      />

      {/* Window Pillar (B-Pillar in Matte Black) */}
      <rect x="136" y="36" width="6" height="38" fill="#020617" />

      {/* Glass Light Reflection Sheen */}
      <path d="M102 40 L126 40 L118 70 L94 70 Z" fill="#FFFFFF" opacity="0.18" />

      {/* Dynamic Waist Character Line */}
      <path d="M30 88 Q 120 86 226 90" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

      {/* Door Handle Accents */}
      <rect x="110" y="82" width="12" height="3.5" rx="1.5" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="0.8" />
      <rect x="156" y="82" width="12" height="3.5" rx="1.5" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="0.8" />

      {/* Aerodynamic Side Mirror */}
      <path d="M168 70 C168 66 174 65 178 68 L176 73 L168 73 Z" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1" />

      {/* LED Headlamp Cluster (Crisp Angled Projector) */}
      <path d="M214 84 L228 86 C230 87 231 89 231 92 L220 94 L212 88 Z" fill="#E0F2FE" />
      <polygon points="218,87 228,88 226,92 216,90" fill="#38BDF8" />

      {/* Rear Taillight Cluster */}
      <path d="M22 84 L32 82 L34 94 L24 96 Z" fill="#DC2626" />
      <polygon points="24,86 30,85 30,90 24,91" fill="#EF4444" />

      {/* Front Wheel Arch & Sport Alloy Wheel */}
      <g>
        <circle cx="180" cy="122" r="22" fill="url(#hatch-tire)" />
        <circle cx="180" cy="122" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
        <circle cx="180" cy="122" r="5" fill="#CBD5E1" />
        {/* 5-Spoke Sport Rims */}
        <line x1="180" y1="108" x2="180" y2="136" stroke="#94A3B8" strokeWidth="2" />
        <line x1="166" y1="122" x2="194" y2="122" stroke="#94A3B8" strokeWidth="2" />
        <line x1="170" y1="112" x2="190" y2="132" stroke="#94A3B8" strokeWidth="2" />
        <line x1="170" y1="132" x2="190" y2="112" stroke="#94A3B8" strokeWidth="2" />
      </g>

      {/* Rear Wheel Arch & Sport Alloy Wheel */}
      <g>
        <circle cx="64" cy="122" r="22" fill="url(#hatch-tire)" />
        <circle cx="64" cy="122" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
        <circle cx="64" cy="122" r="5" fill="#CBD5E1" />
        <line x1="64" y1="108" x2="64" y2="136" stroke="#94A3B8" strokeWidth="2" />
        <line x1="50" y1="122" x2="78" y2="122" stroke="#94A3B8" strokeWidth="2" />
        <line x1="54" y1="112" x2="74" y2="132" stroke="#94A3B8" strokeWidth="2" />
        <line x1="54" y1="132" x2="74" y2="112" stroke="#94A3B8" strokeWidth="2" />
      </g>
    </svg>
  );
};

/**
 * High-fidelity, custom SVG illustration of an Executive Premium Sedan (Skyppy Sedan).
 * Styled with elongated wheelbase, deep Obsidian Navy metallic sheen, executive chrome trim,
 * and dual-tone Diamond-Cut wheels.
 */
export const SedanVehicleSVG: React.FC<VehicleSVGProps> = ({ className = '', size = 200 }) => {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 240 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Executive Metallic Coat (Midnight Obsidian to Deep Sapphire) */}
        <linearGradient id="sedan-body" x1="10" y1="30" x2="230" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#312E81" />
          <stop offset="0.3" stopColor="#1E1B4B" />
          <stop offset="0.7" stopColor="#0F172A" />
          <stop offset="1" stopColor="#020617" />
        </linearGradient>

        {/* Executive Tinted Greenhouse Glass */}
        <linearGradient id="sedan-glass" x1="60" y1="40" x2="175" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#090D16" stopOpacity="0.95" />
          <stop offset="1" stopColor="#1E293B" stopOpacity="0.8" />
        </linearGradient>

        <radialGradient id="sedan-shadow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#000000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="120" cy="144" rx="106" ry="9" fill="url(#sedan-shadow)" />

      {/* Elongated Executive Sedan Body */}
      <path
        d="M16 98 C16 90 20 84 28 82 L52 80 L76 48 C82 40 92 36 102 36 L154 36 C165 36 174 41 180 50 L204 78 L228 84 C234 86 238 91 238 97 L238 116 C238 118 236 120 234 120 L16 120 Z"
        fill="url(#sedan-body)"
      />

      {/* Chrome Window Daylight Opening (DLO) Trim */}
      <path
        d="M74 50 L100 38 L152 38 C162 38 170 42 176 50 L198 74 L74 74 Z"
        stroke="#E2E8F0"
        strokeWidth="1.5"
        fill="url(#sedan-glass)"
      />

      {/* Dual B-Pillars (Executive Tint) */}
      <rect x="124" y="38" width="5" height="36" fill="#090D16" />

      {/* Chrome Beltline & Upper Character Crease */}
      <path d="M22 84 Q 120 80 234 84" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M26 94 Q 120 92 230 96" stroke="#4338CA" strokeWidth="1.5" opacity="0.6" />

      {/* Flush Executive Door Handles */}
      <rect x="100" y="80" width="12" height="3" rx="1" fill="#E2E8F0" />
      <rect x="146" y="80" width="12" height="3" rx="1" fill="#E2E8F0" />

      {/* Sleek Aerodynamic Side Mirror with Signal Turn Repeater */}
      <path d="M172 68 C172 64 178 63 182 66 L180 72 L172 72 Z" fill="#1E1B4B" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="174" y1="70" x2="178" y2="70" stroke="#F59E0B" strokeWidth="1" />

      {/* Laser LED Matrix Headlamp */}
      <path d="M220 84 L234 86 C236 87 237 89 237 92 L228 94 L218 88 Z" fill="#F8FAFC" />
      <polygon points="224,86 235,87 232,92 222,90" fill="#818CF8" />

      {/* Executive Full-Width LED Lightbar Tail */}
      <path d="M16 84 L26 82 L28 94 L18 96 Z" fill="#DC2626" />
      <line x1="18" y1="88" x2="28" y2="88" stroke="#FDA4AF" strokeWidth="1.5" />

      {/* Rear Diamond-Cut Alloy Wheel */}
      <g>
        <circle cx="58" cy="122" r="22" fill="#090D16" />
        <circle cx="58" cy="122" r="15" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="58" cy="122" r="5" fill="#E2E8F0" />
        {/* Diamond Cut Multi-spoke Rim */}
        <line x1="58" y1="107" x2="58" y2="137" stroke="#E2E8F0" strokeWidth="1.5" />
        <line x1="43" y1="122" x2="73" y2="122" stroke="#E2E8F0" strokeWidth="1.5" />
        <line x1="47" y1="111" x2="69" y2="133" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="47" y1="133" x2="69" y2="111" stroke="#CBD5E1" strokeWidth="1.2" />
      </g>

      {/* Front Diamond-Cut Alloy Wheel */}
      <g>
        <circle cx="188" cy="122" r="22" fill="#090D16" />
        <circle cx="188" cy="122" r="15" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="188" cy="122" r="5" fill="#E2E8F0" />
        <line x1="188" y1="107" x2="188" y2="137" stroke="#E2E8F0" strokeWidth="1.5" />
        <line x1="173" y1="122" x2="203" y2="122" stroke="#E2E8F0" strokeWidth="1.5" />
        <line x1="177" y1="111" x2="199" y2="133" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="177" y1="133" x2="199" y2="111" stroke="#CBD5E1" strokeWidth="1.2" />
      </g>
    </svg>
  );
};

