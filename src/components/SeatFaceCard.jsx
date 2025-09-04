// SeatFaceCard.jsx
// ---------------------------------------------------------------------------
// Renders a single upright photo card (billboard) for a seat, using the seat's
// existing transform matrix (from chair fabric instancing) so position &
// orientation match the chair exactly. The card auto-faces the camera via
// <Billboard/> provided by drei, but we still use the seat's world position.
// Visual treatment:
//   - 3:4 aspect plane (e.g., width 0.7, height 0.933)
//   - Background: party color @ 35% alpha behind transparent photo zones.
//   - Image fills width; any vertical leftover above head effectively shows
//     tinted party color (handled by pre-process or CSS-like cover fit).
// For now we keep it simple: just render the texture; later we can add
// gradient overlays, label strip, glow, hover interactions.
// ---------------------------------------------------------------------------
import React, { useMemo } from 'react';
import { Billboard, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Props:
 *  matrix: THREE.Matrix4 (seat transform)
 *  imageSrc: path to face image (public/ relative)
 *  partyColor: hex string for tint / border
 *  seatIndex: number (for debug / label optional)
 */
function SeatFaceCard({
  matrix,
  imageSrc,
  partyColor = '#ffffff',
  seatIndex,
  width = 1.0,
  heightRatio = 1.45, // portrait feel
  benchHeight = 1.2,
  liftMargin = 0.05,
  glow = true,
  cornerRadius = 0.12,
  glowScale = 1.12, // slightly larger halo
  glowOpacity = 0.28, // modest brightness
}) {
  const tex = useTexture(imageSrc);

  const { position, cardW, cardH, panelGeometry } = useMemo(() => {
    const pos = new THREE.Vector3();
    pos.setFromMatrixPosition(matrix); // seat base (row elevation only)
    const cardWCalc = width;
    const cardHCalc = width * heightRatio;
    // Align bottom to bench top + margin
    const bottomY = pos.y + benchHeight + liftMargin;
    pos.y = bottomY + cardHCalc / 2; // center position

    // Rounded rectangle shape for background / glow
    const shape = new THREE.Shape();
    const w = cardWCalc;
    const h = cardHCalc;
    const r = Math.min(cornerRadius, Math.min(w, h) * 0.25);
    const x0 = -w / 2;
    const y0 = -h / 2;
    // Draw rounded rect path
    shape.moveTo(x0 + r, y0);
    shape.lineTo(x0 + w - r, y0);
    shape.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
    shape.lineTo(x0 + w, y0 + h - r);
    shape.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
    shape.lineTo(x0 + r, y0 + h);
    shape.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
    shape.lineTo(x0, y0 + r);
    shape.quadraticCurveTo(x0, y0, x0 + r, y0);
    const geom = new THREE.ShapeGeometry(shape, 24);

    return { position: pos, cardW: cardWCalc, cardH: cardHCalc, panelGeometry: geom };
  }, [matrix, width, heightRatio, benchHeight, liftMargin, cornerRadius]);

  return (
    <group position={position}>
      <Billboard follow>
        {/* Glow layer (additive) */}
        {glow && (
          <mesh position={[0, 0, -0.012]} scale={[glowScale, glowScale, 1]} geometry={panelGeometry}>
            <meshBasicMaterial
              color={partyColor}
              transparent
              opacity={glowOpacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
        {/* Translucent party panel */}
        <mesh position={[0, 0, -0.006]} geometry={panelGeometry}>
          <meshBasicMaterial color={partyColor} transparent opacity={0.18} />
        </mesh>
        {/* Photo silhouette plane (assumes PNG with alpha) */}
        <mesh>
          <planeGeometry args={[cardW, cardH]} />
          <meshBasicMaterial map={tex} transparent />
        </mesh>
        {/* Optional future: gradient overlay / label strip */}
      </Billboard>
    </group>
  );
}

export default SeatFaceCard;
