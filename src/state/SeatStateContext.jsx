// SeatStateContext.jsx
// ---------------------------------------------------------------------------
// Provides seat coloring state based on the current timeline snapshot.
// POC ASSUMPTIONS (documented for PM):
//  - We pre-block seat indices into alliance zones (static mapping below).
//  - Within each alliance block, first *wins* seats get solid color, next *leads*
//    seats get a lighter version of the same color. Remaining seats neutral gray.
//  - Timeline index drives updates; no animation yet.
//  - Seat indices are zero-based internally (0..242). Existing instanced meshes
//    align with this ordering from AssemblyLayout push order.
// ---------------------------------------------------------------------------

import React, { createContext, useContext, useMemo, useState } from 'react';
import { ALLIANCES, UNDECLARED_COLOR, lighterShade } from '../config/alliances';
import timeline from '../data/electionTimeline.json';

// Alliance blocks (seat index lists) derived from generation order in AssemblyLayout.
// ORDER in layout: S1(50) -> S2(50) -> C-R(22) -> C-L(21) -> S5(50) -> S6(50) = 243
// Assumption for sides:
//   INDIA Bloc: S1, S2, Central Left
//   NDA: Central Right, S5, S6
//   OTHERS: (currently empty; can carve a portion later)
// If future refinement needed, adjust arrays here.
const india = [
  // S1 0-49
  ...Array.from({ length: 50 }, (_, i) => i),
  // S2 50-99
  ...Array.from({ length: 50 }, (_, i) => 50 + i),
  // Central Left (after C-R) indices 122-142 (21 seats)
  ...Array.from({ length: 21 }, (_, i) => 122 + i)
];

const nda = [
  // Central Right 100-121 (22 seats)
  ...Array.from({ length: 22 }, (_, i) => 100 + i),
  // S5 143-192 (50 seats)
  ...Array.from({ length: 50 }, (_, i) => 143 + i),
  // S6 193-242 (50 seats)
  ...Array.from({ length: 50 }, (_, i) => 193 + i)
];

const others = [
  // Currently no explicit block reserved – placeholder for future allocation.
];

const ALLIANCE_SEAT_MAP = {
  INDIA: india,
  NDA: nda,
  OTHERS: others
};

// Context
const SeatStateContext = createContext(null);

export function SeatStateProvider({ children }) {
  // currentIndex: which timeline snapshot is active (0..timeline.length-1)
  const [currentIndex, setCurrentIndex] = useState(timeline.length - 1); // default to last (simulate LIVE)

  // Build color array once per snapshot change
  const { colors, snapshot } = useMemo(() => {
    const snap = timeline[currentIndex];
    // Prepare RGBA color array (Float32Array for 243 seats * 3 channels if using vertexColors)
    const seatCount = 243;
    // Build alliance counts
    const counts = {};
    for (const a of snap.alliances) counts[a.id] = { leads: a.leads, wins: a.wins };

    // Helper: fill a block
    const seatColorHex = new Array(seatCount).fill(UNDECLARED_COLOR);

    for (const { id, color } of ALLIANCES) {
      const block = ALLIANCE_SEAT_MAP[id] || [];
      const data = counts[id];
      if (!data) continue;
      const { wins, leads } = data;
      const leadShade = lighterShade(color, 0.45); // lighter for leads
      for (let i = 0; i < block.length; i += 1) {
        const seatIndex = block[i];
        if (i < wins) seatColorHex[seatIndex] = color; // solid for confirmed win
        else if (i < wins + leads) seatColorHex[seatIndex] = leadShade; // lighter for lead
        // else remains UNDECLARED_COLOR
      }
    }

    // Convert hex to float RGB array
    const colorsFloat = new Float32Array(seatCount * 3);
    for (let i = 0; i < seatCount; i += 1) {
      const h = seatColorHex[i].replace('#', '');
      const r = parseInt(h.substring(0, 2), 16) / 255;
      const g = parseInt(h.substring(2, 4), 16) / 255;
      const b = parseInt(h.substring(4, 6), 16) / 255;
      const base = i * 3;
      colorsFloat[base] = r; colorsFloat[base + 1] = g; colorsFloat[base + 2] = b;
    }
    return { colors: colorsFloat, snapshot: snap };
  }, [currentIndex]);

  return (
    <SeatStateContext.Provider value={{ currentIndex, setCurrentIndex, timeline, colors, snapshot }}>
      {children}
    </SeatStateContext.Provider>
  );
}

export function useSeatState() {
  return useContext(SeatStateContext);
}
