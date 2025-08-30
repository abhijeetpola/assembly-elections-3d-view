import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';
import StudioEnvironment from './components/StudioEnvironment';
import SpeakerDais from './components/SpeakerDais';
import AssemblyLayout from './components/AssemblyLayout';

// Camera Controller Component
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Updated layout configuration for 5-Spoke Radial Arc
    const LAYOUT_CONFIG = {
      START_RADIUS: 12.0,
      TOTAL_SPOKES: 5,
      ROW_SPACING: 2.5,
      TOTAL_ARC_ANGLE: (200 * Math.PI) / 180, // 200 degrees in radians
      ASSEMBLY_Z_OFFSET: 5.0 // Assembly moved forward from origin
    };
    
    // Calculate the total size of the assembly including the new positioning
    const assemblyRadius = LAYOUT_CONFIG.START_RADIUS + (4 * LAYOUT_CONFIG.ROW_SPACING); // 5 rows max
    const assemblyZ = LAYOUT_CONFIG.ASSEMBLY_Z_OFFSET;
    
    // Add a comfortable 20% margin
    const viewSize = Math.max(assemblyRadius, Math.abs(assemblyZ) + 10) * 1.2;
    
    // Get browser aspect ratio
    const aspectRatio = window.innerWidth / window.innerHeight;
    
    // Set up orthographic camera for perfect top-down view
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -viewSize * aspectRatio;
      camera.right = viewSize * aspectRatio;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.near = 0.1;
      camera.far = 1000;
      
      // Position camera to see both SpeakerDais and Assembly
      camera.position.set(0, 50, 0);
      camera.lookAt(0, 0, 0);
      
      // Update the projection matrix
      camera.updateProjectionMatrix();
    }
  }, [camera]);
  
  return null;
}

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="header-title">Bihar Legislative Assembly</h1>
        {/* Removed 3D icon button - no longer needed */}
      </header>
      
      <div className="canvas-container">
        {/* Render the 243-seat assembly directly on landing page */}
        <Canvas
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
          camera={new THREE.OrthographicCamera(-20, 20, 20, -20, 0.1, 1000)}
          onCreated={({ scene, gl }) => {
            // Set the deep black background
            scene.background = new THREE.Color(0x000000);

            // Enable shadows
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          {/* Camera Controller for proper framing */}
          <CameraController />
          
          {/* Professional Studio Environment */}
          <StudioEnvironment />

          {/* Speaker's Dais - Positioned at the back */}
          <SpeakerDais />

                    {/* Full 243-Seat Assembly Layout */}
          <AssemblyLayout />

          {/* Orbit Controls for inspection - Adjusted for larger scene */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={100}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
