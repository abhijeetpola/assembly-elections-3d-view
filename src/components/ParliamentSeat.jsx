import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function ParliamentSeat() {
  const groupRef = useRef();

  // Add subtle rotation animation for inspection
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Task 1: Desk Unit - Complete Isolation */}
      <group position={[0, 0, 0]}>
        {/* 1. The Desktop */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.1, 1.2]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 2. The Side Panels/Legs - Left */}
        <mesh position={[-1.2, -0.55, 0]}>
          <boxGeometry args={[0.1, 1.0, 1.0]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 2. The Side Panels/Legs - Right */}
        <mesh position={[1.2, -0.55, 0]}>
          <boxGeometry args={[0.1, 1.0, 1.0]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 3. The Black Screen */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.1]} />
          <meshStandardMaterial 
            color={0x111111}
            roughness={0.2}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Task 2: Chair Unit - Complete Isolation (With 4 Legs) */}
      <group 
        position={[0, -0.3, 1.5]} 
        rotation={[0, Math.PI, 0]} // Rotate 180 degrees to face the desk
      >
        {/* 1. The Seat Cushion */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 0.2, 1.0]} />
          <meshStandardMaterial 
            color={0x008080}
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
        
        {/* 2. The Backrest */}
        <mesh position={[0, 0.7, -0.45]}>
          <boxGeometry args={[1.0, 1.2, 0.1]} />
          <meshStandardMaterial 
            color={0x008080}
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
        
        {/* 3. The Four Legs - Front Left */}
        <mesh position={[-0.45, -0.5, 0.45]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 3. The Four Legs - Front Right */}
        <mesh position={[0.45, -0.5, 0.45]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 3. The Four Legs - Back Left */}
        <mesh position={[-0.45, -0.5, -0.45]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 3. The Four Legs - Back Right */}
        <mesh position={[0.45, -0.5, -0.45]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 4. The Armrests - Right */}
        <mesh position={[0.575, 0.3, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.8]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 4. The Armrests - Left */}
        <mesh position={[-0.575, 0.3, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.8]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* 5. The Headrest/Top Trim */}
        <mesh position={[0, 1.35, -0.45]}>
          <boxGeometry args={[1.1, 0.1, 0.15]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

export default ParliamentSeat;
