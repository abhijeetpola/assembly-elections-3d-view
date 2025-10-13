import React, { useMemo } from 'react';
import * as THREE from 'three';

const BackstageWall = React.memo(function BackstageWall() {
  const width = 109;  // Full wall width
  const height = 20;
  const thickness = 0.3;
  const borderWidth = 2;  // 2m thick border
  const centerPanelThickness = 2;  // 2m thick protruding teal panel
  
  // Teal panel width: Row 1 span (Spoke 1 to Spoke 6 at radius 16m)
  // Row 1 radius = 16m, spanning 180° semicircle
  // Straight-line distance (chord) = 2 × radius = 32m
  const row1Radius = 16.0;
  const tealPanelWidth = 2 * row1Radius;  // 32m (matches Row 1 assembly width)
  
  // Color configuration (centralized for easy changes)
  const COLORS = {
    frame: {
      color: "#d4a76a",  // Golden/brown frame color
      roughness: 0.6,
      metalness: 0.2
    },
    center: {
      color: "#5a8a7a",  // Teal/green center panel
      roughness: 0.8,
      metalness: 0.1
    }
  };
  
  // Teal/green center panel (inner inverted U) - PROTRUDING 2m thick
  const centerPanelGeometry = useMemo(() => {
    const centerHeight = height - borderWidth;       // 18m (20 - 2, no border at bottom)
    return new THREE.BoxGeometry(tealPanelWidth, centerHeight, centerPanelThickness);
  }, [tealPanelWidth]);
  
  // Golden/brown border pieces
  const topBorderGeometry = useMemo(() => {
    return new THREE.BoxGeometry(width, borderWidth, thickness);  // Full width, 2m tall
  }, []);
  
  const sideBorderGeometry = useMemo(() => {
    const sideHeight = height - borderWidth;  // 18m tall (no border at bottom)
    return new THREE.BoxGeometry(borderWidth, sideHeight, thickness);  // 2m wide
  }, []);
  
  // Back panel (full wall, same color as frame)
  const backPanelGeometry = useMemo(() => {
    return new THREE.BoxGeometry(width, height, thickness);
  }, []);

  const wallZ = -16;  // 10m behind speaker chair (which is now at Z=-6)
  
  return (
    <group>
      {/* FRONT SIDE (facing speaker/assembly) */}
      
      {/* Center panel - Teal/Green (PROTRUDING 2m forward) */}
      <mesh 
        position={[0, 9, wallZ + centerPanelThickness / 2]}  // Y=9m, Z=-19m (protrudes 1m forward from wall)
        geometry={centerPanelGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={COLORS.center.color}
          roughness={COLORS.center.roughness}
          metalness={COLORS.center.metalness}
        />
      </mesh>
      
      {/* Top border - Golden/Brown */}
      <mesh 
        position={[0, 19, wallZ]}  // Y=19m (top, 1m from ceiling)
        geometry={topBorderGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={COLORS.frame.color}
          roughness={COLORS.frame.roughness}
          metalness={COLORS.frame.metalness}
        />
      </mesh>
      
      {/* Left border - Golden/Brown */}
      <mesh 
        position={[-53.5, 9, wallZ]}  // X=-53.5m (left edge, 1m from edge)
        geometry={sideBorderGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={COLORS.frame.color}
          roughness={COLORS.frame.roughness}
          metalness={COLORS.frame.metalness}
        />
      </mesh>
      
      {/* Right border - Golden/Brown */}
      <mesh 
        position={[53.5, 9, wallZ]}  // X=53.5m (right edge, 1m from edge)
        geometry={sideBorderGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={COLORS.frame.color}
          roughness={COLORS.frame.roughness}
          metalness={COLORS.frame.metalness}
        />
      </mesh>
      
      {/* BACK SIDE (behind wall, same color as frame) */}
      <mesh 
        position={[0, 10, wallZ - thickness]}  // Y=10m (center of full 20m wall), slightly behind front
        geometry={backPanelGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={COLORS.frame.color}
          roughness={COLORS.frame.roughness}
          metalness={COLORS.frame.metalness}
        />
      </mesh>
    </group>
  );
});

export default BackstageWall;

