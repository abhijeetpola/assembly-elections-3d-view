import React, { useMemo } from 'react';
import * as THREE from 'three';
import { mergeBufferGeometries } from 'three-stdlib';
import { PERIMETER_RADIUS } from '../config/camera';

const Floor = React.memo(function Floor() {
  const floorGeometry = useMemo(() => {
    // PART 1: Semicircular assembly area
    const semicircleRadius = PERIMETER_RADIUS;  // Use shared constant (dynamic chamber size)
    const segments = 64;
    
    const semicircleShape = new THREE.Shape();
    semicircleShape.moveTo(-semicircleRadius, 0);
    semicircleShape.absarc(0, 0, semicircleRadius, Math.PI, 0, true);
    semicircleShape.lineTo(-semicircleRadius, 0);
    
    const semicircleGeom = new THREE.ShapeGeometry(semicircleShape, segments);
    
    // PART 2: Rectangular speaker/backstage area
    const rectWidth = semicircleRadius * 2;  // Match semicircle diameter = 109m
    const rectDepth = 16.5;   // End at backstage wall position (Z=-16m) + 0.5m margin
    
    const rectangleShape = new THREE.Shape();
    rectangleShape.moveTo(-rectWidth / 2, 0);           // Bottom-left at Z=0
    rectangleShape.lineTo(rectWidth / 2, 0);            // Bottom-right at Z=0
    rectangleShape.lineTo(rectWidth / 2, -rectDepth);   // Top-right at Z=-35
    rectangleShape.lineTo(-rectWidth / 2, -rectDepth);  // Top-left at Z=-35
    rectangleShape.lineTo(-rectWidth / 2, 0);           // Close shape
    
    const rectangleGeom = new THREE.ShapeGeometry(rectangleShape, 16);
    
    // MERGE into one seamless floor
    const combinedGeom = mergeBufferGeometries([semicircleGeom, rectangleGeom], false);
    
    // Rotate to lie flat on XZ plane
    combinedGeom.rotateX(-Math.PI / 2);
    
    // Rotate 180° so flat edge faces speaker
    combinedGeom.rotateY(Math.PI);
    
    return combinedGeom;
  }, []);

  return (
    <mesh position={[0, 0, 0]} receiveShadow geometry={floorGeometry}>
      <meshStandardMaterial 
        color={0x8B7355}  // Brown carpet
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
});

export default Floor;

