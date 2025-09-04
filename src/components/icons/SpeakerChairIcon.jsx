import React from 'react';

// Solid block chair (Option 1): filled back + seat with subtle outline and arms. Active state lightens fill + thicker outline.
const SpeakerChairIcon = ({ active, color }) => {
  const baseColor = color || '#d6b86a'; // brass tone
  const activeFill = '#e2c87a';
  const fill = active ? activeFill : baseColor;
  const stroke = 'rgba(255,255,255,0.92)';
  const strokeWidth = active ? 1.9 : 1.4;
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      {/* Backrest */}
      <rect x="7" y="3" width="10" height="11" rx="3" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      {/* Seat */}
      <rect x="8.5" y="13" width="7" height="5" rx="1.2" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      {/* Arms (minimal lines) */}
      <path d="M7 12.2v4.4M17 12.2v4.4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Legs */}
      <path d="M9.5 18v2.4M14.5 18v2.4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
};

export default SpeakerChairIcon;
