// TimelineBar.jsx
// ---------------------------------------------------------------------------
// Simple horizontal time seek bar for snapshots.
//  - Discrete steps for each timeline entry.
//  - Shows LIVE marker at last slot.
//  - On change: updates SeatStateContext currentIndex.
//  - Mobile-responsive with touch-friendly controls.
// ---------------------------------------------------------------------------
import React, { useEffect, useMemo, useState } from 'react';

// Helper: convert HH:MM (24h) to user-facing hour label
function toHourLabel(timeStr) {
  const [hour, minute] = timeStr.split(':');
  const hNum = parseInt(hour, 10);
  if (minute !== '00') return null; // only whole hours
  const ampm = hNum < 12 ? 'AM' : 'PM';
  const hour12 = ((hNum + 11) % 12) + 1;
  return `${hour12} ${ampm}`;
}

function TimelineBar({ timeline, currentIndex, onChange }) {
  const lastIndex = timeline.length - 1;
  const [containerWidth, setContainerWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Decide how many labels can fit: assume ~64px per label including spacing
  const capacity = Math.max(2, Math.floor((containerWidth - 40) / 64));

  const hourLabels = useMemo(() => {
    const hours = [];
    timeline.forEach((t, idx) => {
      const lbl = toHourLabel(t.time);
      if (lbl) hours.push({ idx, label: lbl });
    });
    if (hours.length + 1 <= capacity) return hours; // +1 for LIVE separate slot
    // Thin hours uniformly to fit capacity-1 (reserve one slot for LIVE)
    const target = capacity - 1;
    const k = Math.ceil(hours.length / target);
    const reduced = hours.filter((_, i) => i % k === 0);
    // Guarantee last hour present
    if (!reduced.some(e => e.idx === hours[hours.length - 1].idx)) reduced.push(hours[hours.length - 1]);
    reduced.sort((a, b) => a.idx - b.idx);
    return reduced;
  }, [timeline, capacity]);

  return (
    <div className="timeline-bar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 12, marginBottom: 6 }}>
        {hourLabels.map(h => {
          const active = h.idx === currentIndex;
          return (
            <div key={h.idx} style={{ color: active ? '#fff' : '#888', fontWeight: active ? 600 : 400, minWidth: 44, textAlign: 'center' }}>{h.label}</div>
          );
        })}
        {/* Persistent LIVE at right edge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 60, justifyContent: 'flex-end' }}>
          <span className="live-dot" />
          <span style={{ color: currentIndex === lastIndex ? '#ff2d2d' : '#ff6b6b', fontWeight: 700 }}>LIVE</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="range"
          min={0}
          max={lastIndex}
          step={1}
          value={currentIndex}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}

export default TimelineBar;
