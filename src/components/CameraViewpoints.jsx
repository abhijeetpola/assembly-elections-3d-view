import React, { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Camera viewpoint positions (logged from exploration)
const VIEWPOINTS = {
  gallery_top: {
    position: new THREE.Vector3(-0.58, 49.90, 92.97),
    lookAt: new THREE.Vector3(-0.42, 0.53, 1.18),
    name: 'gallery_top'
  },
  speaker_right_high: {
    position: new THREE.Vector3(-84.10, 69.25, -8.31),
    lookAt: new THREE.Vector3(-2.73, 0.98, 10.51),
    name: 'speaker_right_high'
  },
  speaker_right_low: {
    position: new THREE.Vector3(-55.89, 16.08, -8.95),
    lookAt: new THREE.Vector3(-3.51, -0.74, 11.50),
    name: 'speaker_right_low'
  },
  speaker_left_high: {
    position: new THREE.Vector3(84.10, 69.25, -8.31),
    lookAt: new THREE.Vector3(2.73, 0.98, 10.51),
    name: 'speaker_left_high'
  },
  speaker_left_low: {
    position: new THREE.Vector3(55.89, 16.08, -8.95),
    lookAt: new THREE.Vector3(3.51, -0.74, 11.50),
    name: 'speaker_left_low'
  }
};

// Camera icon component (simple circle)
const CameraIcon = ({ position, onClick, visible, isAnimating, isCurrentView }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && hovered && !isAnimating) {
      meshRef.current.scale.setScalar(1.1);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1.0);
    }
  });

  if (!visible) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (!isAnimating) onClick();
      }}
      onPointerOver={() => !isAnimating && setHovered(true)}
      onPointerOut={() => setHovered(false)}
      rotation={[0, 0, 0]}
      style={{ cursor: isAnimating ? 'default' : 'pointer' }}
    >
      <circleGeometry args={[0.5, 32]} />
      <meshBasicMaterial 
        color={isAnimating ? "#888888" : (hovered ? "#ffffff" : "#cccccc")}
        side={THREE.DoubleSide}
        transparent
        opacity={isAnimating ? 0.3 : 0.8}
      />
    </mesh>
  );
};

const CameraViewpoints = ({ cameraControls }) => {
  const { camera } = useThree();
  const [currentView, setCurrentView] = useState('gallery_top'); // Start at gallery view
  const [isAnimating, setIsAnimating] = useState(false);
  const hasInitialized = useRef(false);
  const targetPosition = useRef(null);

  // Initialize camera position on mount
  useEffect(() => {
    if (cameraControls && !hasInitialized.current) {
      const startView = VIEWPOINTS.gallery_top;
      cameraControls.setLookAt(
        startView.position.x, startView.position.y, startView.position.z,
        startView.lookAt.x, startView.lookAt.y, startView.lookAt.z,
        false
      );
      hasInitialized.current = true;
    }
  }, [cameraControls]);

  // Check if camera has reached target position
  useFrame(() => {
    if (isAnimating && targetPosition.current) {
      const currentPos = camera.position;
      const target = targetPosition.current;
      
      // Calculate distance to target
      const distance = currentPos.distanceTo(target);
      
      // If very close to target (within 0.5m), animation is complete
      if (distance < 0.5) {
        setIsAnimating(false);
        targetPosition.current = null;
      }
    }
  });

  const switchToView = (viewName) => {
    if (isAnimating || currentView === viewName || !cameraControls) return;
    
    const targetView = VIEWPOINTS[viewName];
    
    setIsAnimating(true);
    targetPosition.current = targetView.position.clone();
    
    // Use camera-controls' built-in smooth animation
    cameraControls.setLookAt(
      targetView.position.x,
      targetView.position.y,
      targetView.position.z,
      targetView.lookAt.x,
      targetView.lookAt.y,
      targetView.lookAt.z,
      true
    );
    
    // Update current view immediately so opposite icon becomes visible
    setCurrentView(viewName);
  };

  return (
    <group>
      {/* Render camera icons for all viewpoints except current */}
      {Object.entries(VIEWPOINTS).map(([key, viewpoint]) => (
        <CameraIcon
          key={key}
          position={viewpoint.position}
          onClick={() => switchToView(key)}
          visible={currentView !== key}
          isAnimating={isAnimating}
          isCurrentView={currentView === key}
        />
      ))}
    </group>
  );
};

export default CameraViewpoints;


