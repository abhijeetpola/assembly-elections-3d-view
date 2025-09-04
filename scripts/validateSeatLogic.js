#!/usr/bin/env node
// Quick validation for seat coloring logic edge cases.
// Use CommonJS versions to avoid ESM syntax errors under Node when not transpiled
const { SEAT_BLOCKS, TOTAL_SEATS } = require('../src/config/seatBlocks.cjs');
const timeline = require('../src/data/electionTimeline.json');
const { ALLIANCES, UNDECLARED_COLOR, lighterShade } = require('../src/config/alliances.cjs');

function buildSnapshotColors(snap) {
  const seatColorHex = new Array(TOTAL_SEATS).fill(UNDECLARED_COLOR);
  const counts = {}; snap.alliances.forEach(a => counts[a.id] = a);
  for (const { id, color } of ALLIANCES) {
    const block = SEAT_BLOCKS[id] || [];
    const data = counts[id];
    if (!data) continue;
    const wins = data.wins; const leads = data.leads;
    const leadShade = lighterShade(color, 0.65);
    for (let i = 0; i < block.length; i++) {
      const seatIdx = block[i];
      if (i < wins) seatColorHex[seatIdx] = color;
      else if (i < wins + leads) seatColorHex[seatIdx] = leadShade;
    }
    if (wins + leads > block.length) {
      console.warn(`[WARN] ${id} wins+leads (${wins + leads}) exceed block size ${block.length}`);
    }
  }
  return seatColorHex;
}

timeline.forEach((snap, idx) => {
  const colors = buildSnapshotColors(snap);
  const declared = colors.filter(c => c !== UNDECLARED_COLOR).length;
  console.log(`Snapshot ${idx} ${snap.time}: declared ${declared}/${TOTAL_SEATS}`);
});
