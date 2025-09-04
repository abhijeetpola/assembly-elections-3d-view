import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

// Reverted simple version: capsule torso + face plane + accent ring
function LeaderBust({ matrix, torsoColor = '#888888', faceSrc = '/images/leader-face.png' }) {
  // (Former debug console removed for production cleanliness)
  const texture = useLoader(THREE.TextureLoader, faceSrc);
  texture.anisotropy = 4;
  if ('colorSpace' in texture) texture.colorSpace = THREE.SRGBColorSpace;

  const { position, quaternion } = useMemo(() => {
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scl = new THREE.Vector3();
    matrix.decompose(pos, quat, scl);
    return { position: pos, quaternion: quat };
  }, [matrix]);

  const torsoGeom = useMemo(() => new THREE.CapsuleGeometry(0.45, 0.6, 6, 12), []);
  const torsoMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: torsoColor,
    roughness: 0.6,
    metalness: 0.05,
    emissive: new THREE.Color(torsoColor).multiplyScalar(0.15)
  }), [torsoColor]);

  return (
    <group position={position} quaternion={quaternion}>
      <mesh geometry={torsoGeom} material={torsoMaterial} position={[0, 1.25, 0]} />
      <mesh position={[0, 1.95, 0]}>
        <planeGeometry args={[0.95, 1.15]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}> 
        <ringGeometry args={[0.55, 0.63, 32]} />
        <meshBasicMaterial color={torsoColor} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export default LeaderBust;
