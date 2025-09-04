import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

// LeaderPillar: unified hologram pillar + front face panel + color strip
export default function LeaderPillar({ matrix, faceSrc = '/images/leader-face.png', partyColor = '#2ECC40' }) {
  const texture = useLoader(THREE.TextureLoader, faceSrc);
  if ('colorSpace' in texture) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8; // crisper when zoomed
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.NearestFilter; // sharper (pixel crisp) when magnified

  const { position, quaternion } = useMemo(() => {
    const p = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    matrix.decompose(p, q, s);
    return { position: p, quaternion: q };
  }, [matrix]);

  // Raised pillar & panel so photo no longer intersects / gets occluded by bench tops (bench top ~1.2)
  const pillarGeom = useMemo(() => new THREE.CylinderGeometry(0.48, 0.48, 1.4, 24, 1, true), []);
  const pillarMat = useMemo(() => {
    const c = new THREE.Color(partyColor);
    // More transparent so face panel never appears "inside" glow
    return new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(0.75), transparent: true, opacity: 0.18 });
  }, [partyColor]);

  // Removed full 360 glow shell (caused face to look submerged). Could add rear arc later if desired.

  // Depth tuning: disable depthWrite + slight polygon offset so panel stays visually on top, while still testing depth for other objects behind
  const facePanelMat = useMemo(() => new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false, side: THREE.FrontSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }), [texture]);

  const stripMat = useMemo(() => new THREE.MeshBasicMaterial({ color: partyColor, toneMapped: false }), [partyColor]);

  return (
    <group position={position} quaternion={quaternion}>
      {/* Pillar core (raised base y=1.35 instead of 1.1) */}
      <mesh geometry={pillarGeom} material={pillarMat} position={[0, 1.35, 0]} />
      {/* Face panel (raised so bottom clears bench top; mild tilt) */}
  <group position={[0, 1.95, 0.7]} rotation={[-0.02, 0, 0]}> {/* pushed further forward (z=0.7) so never intersects pillar */}
        <mesh renderOrder={10}>
          <planeGeometry args={[0.95, 1.2]} />
          <primitive object={facePanelMat} attach="material" />
        </mesh>
        {/* Party color strip top-right corner */}
        <mesh position={[0.45, 0.55, 0.002]} renderOrder={11}> <planeGeometry args={[0.12, 0.35]} /> <primitive object={stripMat} attach="material" /> </mesh>
      </group>
      {/* Seat base ring accent */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.01,0]}> <ringGeometry args={[0.5,0.6,40]} /> <meshBasicMaterial color={partyColor} transparent opacity={0.7} /> </mesh>
      {/* Top disk for top-view clarity (raised accordingly) */}
      <mesh position={[0, 2.05, 0]} rotation={[Math.PI/2,0,0]}> <circleGeometry args={[0.48, 32]} /> <meshBasicMaterial color={partyColor} transparent opacity={0.55} /> </mesh>
    </group>
  );
}
