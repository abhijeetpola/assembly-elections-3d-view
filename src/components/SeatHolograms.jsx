// SeatHolograms.jsx
// ---------------------------------------------------------------------------
// PURPOSE:
//   Renders a lightweight "presence" hologram (head + upper torso) for every
//   seat. This is a neutral placeholder so later we can recolor / animate per
//   live election result state (party, lead, gain, etc.).
// DESIGN CHOICES (documented for non-engineering readers):
//   1. Uses a single instanced mesh (very efficient) – one draw call for all 243.
//   2. Geometry = merged cylinder (torso) + sphere (head) sized to look like a
//      seated person whose head is just above desk level.
//   3. We reuse the existing seat transform matrices (fabricMatrices) from the
//      layout; these already contain correct position + facing direction.
//   4. No animation yet (per your selection). Breathing / pulse can be added
//      later by modifying opacity or scale each frame.
//   5. Material: additive, semi‑transparent cyan for a subtle hologram look.
//      - MeshBasicMaterial ignores lighting so color stays readable.
//      - depthWrite = false prevents sorting artifacts over seats.
//   6. Geometry local positioning: torso base starts at Y=0.45 relative to the
//      chair origin (seat cushion top ≈0.4). Head center at ≈1.57; crown ≈1.79.
//      This keeps the head clearly above the desk while torso remains plausible.
// ---------------------------------------------------------------------------

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// (Old per-instance color variant removed; using grouped-color instanced meshes.)
// seatHexColors: array length = seat count, hex strings '#RRGGBB'
// leaderSeatIndex: the leader's seat is rendered separately (pillar), so we skip it here
function SeatHolograms({ matrices, seatHexColors, leaderSeatIndex, excludeSeatIndices = [] }) {
  const excludeSet = useMemo(() => new Set(excludeSeatIndices), [excludeSeatIndices]);
  // Geometry shared by all color groups
  const hologramGeometry = useMemo(() => {
    const parts = [];
    const Y_OFFSET = 1.1;
    const torso = new THREE.CylinderGeometry(0.32, 0.38, 0.9, 12, 1, true);
    torso.translate(0, Y_OFFSET + 0.45 + 0.9 / 2, 0);
    parts.push(torso);
    const head = new THREE.SphereGeometry(0.28, 14, 10);
    head.translate(0, Y_OFFSET + 0.45 + 0.9 + 0.28, 0);
    parts.push(head);
    return mergeGeometries(parts, false);
  }, []);

  // Build groups: color hex -> indices array
  const groups = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < matrices.length; i += 1) {
      if (leaderSeatIndex != null && i === leaderSeatIndex) continue; // skip leader seat so it's not duplicated
      if (excludeSet.has(i)) continue; // skip explicitly excluded seats (e.g., replaced with face card)
      const hex = (seatHexColors && seatHexColors[i]) || '#777777';
      if (!map.has(hex)) map.set(hex, []);
      map.get(hex).push(i);
    }
    return Array.from(map.entries()); // [hex, indices[]]
  }, [matrices, seatHexColors, leaderSeatIndex, excludeSet]);

  if (!matrices.length) return null;

  return (
    <group>
  {groups.map(([hex, idxs]) => (
        <instancedMesh
          key={hex}
          args={[hologramGeometry, new THREE.MeshBasicMaterial({ color: hex }), idxs.length]}
          ref={(ref) => {
            if (!ref) return;
            const tmp = new THREE.Object3D();
            for (let i = 0; i < idxs.length; i += 1) {
              const m = matrices[idxs[i]];
              tmp.position.setFromMatrixPosition(m);
              tmp.quaternion.setFromRotationMatrix(m);
              tmp.scale.set(1, 1, 1);
              tmp.updateMatrix();
              ref.setMatrixAt(i, tmp.matrix);
            }
            ref.instanceMatrix.needsUpdate = true;
          }}
        />
      ))}
    </group>
  );
}

export default SeatHolograms;
