import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Billboard, useTexture } from '@react-three/drei';

/**
 * SeatFacesLayer
 * Renders a face card (photo + hologram panel + glow) for every seat matrix provided.
 * Optimized: loads each supplied image exactly once; reuses shared geometries & materials.
 */
function SeatFacesLayer({ matrices, seatHexColors = [], imageSources = [], randomize = true, seed = 1337 }) {
  const sources = imageSources.length ? imageSources : ['/images/leader.png'];
  const textures = useTexture(sources);
  const benchHeight = 1.2;
  const liftMargin = 0.05;
  const width = 0.95;
  const heightRatio = 1.4;
  const glowScale = 1.12;
  const glowOpacity = 0.25;
  const cornerRadius = 0.1;

  const { panelGeometry, planeGeometry, positions, imageIndexMap } = useMemo(() => {
    const cardH = width * heightRatio;
    // Rounded rectangle shape (single geometry reused)
    const shape = new THREE.Shape();
    const w = width; const h = cardH; const r = Math.min(cornerRadius, Math.min(w, h) * 0.25);
    const x0 = -w / 2; const y0 = -h / 2;
    shape.moveTo(x0 + r, y0);
    shape.lineTo(x0 + w - r, y0); shape.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
    shape.lineTo(x0 + w, y0 + h - r); shape.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
    shape.lineTo(x0 + r, y0 + h); shape.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
    shape.lineTo(x0, y0 + r); shape.quadraticCurveTo(x0, y0, x0 + r, y0);
    const panelGeom = new THREE.ShapeGeometry(shape, 20);
    const planeGeom = new THREE.PlaneGeometry(width, cardH);

    const basePos = new THREE.Vector3();
    // Deterministic pseudo-random generator for stable shuffles per load
    function lcg(a) { return () => (a = (a * 48271) % 0x7fffffff) / 0x7fffffff; }
    const rng = lcg(seed);
    const baseIndices = matrices.map((_, i) => i);
    const shuffled = randomize ? baseIndices.sort(() => rng() - 0.5) : baseIndices;
    // Map seat index -> image index (wrap through sources)
    const imgMap = new Array(matrices.length);
    shuffled.forEach((seatIdx, orderIdx) => { imgMap[seatIdx] = orderIdx % sources.length; });

    const all = matrices.map((m, idx) => {
      basePos.setFromMatrixPosition(m);
      const bottomY = basePos.y + benchHeight + liftMargin;
      return { index: idx, position: [basePos.x, bottomY + cardH / 2, basePos.z] };
    });
    return { panelGeometry: panelGeom, planeGeometry: planeGeom, positions: all, imageIndexMap: imgMap };
  }, [matrices, width, heightRatio, cornerRadius, randomize, seed, sources.length]);

  return (
    <group>
      {positions.map(({ index, position }) => {
        const tex = textures[imageIndexMap[index] % textures.length];
        const partyColor = seatHexColors[index] || '#ffffff';
        return (
          <group key={`face-${index}`} position={[position[0], position[1], position[2]]}>
            <Billboard follow>
              {/* Glow */}
              <mesh position={[0, 0, -0.014]} scale={[glowScale, glowScale, 1]} geometry={panelGeometry} renderOrder={10}>
                <meshBasicMaterial
                  color={partyColor}
                  transparent
                  opacity={glowOpacity}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  depthTest
                />
              </mesh>
              {/* Panel (polygonOffset to push slightly back to avoid z-fighting with photo) */}
              <mesh position={[0, 0, -0.007]} geometry={panelGeometry} renderOrder={11}>
                <meshBasicMaterial
                  color={partyColor}
                  transparent
                  opacity={0.15}
                  depthWrite={false}
                  polygonOffset
                  polygonOffsetFactor={1}
                  polygonOffsetUnits={1}
                />
              </mesh>
              {/* Photo (slightly forward) */}
              <mesh geometry={planeGeometry} position={[0,0,0.0005]} renderOrder={12}>
                <meshBasicMaterial
                  map={tex}
                  transparent
                  alphaTest={0.03}
                  depthWrite={false}
                />
              </mesh>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

export default SeatFacesLayer;
