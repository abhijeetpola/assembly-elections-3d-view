import React from 'react';

function StudioEnvironment() {
  return (
    <>
      {/* 1. Clean Foundation - Deep Black Background */}
      {/* Note: Background is set in the Canvas component, not here */}
      
      {/* 2. Professional Studio Lighting */}
      
      {/* A. The "Fill" Light (Ambient Light) */}
      <ambientLight 
        color={0x404040} 
        intensity={1.0} 
      />
      
      {/* B. The "Key" Light (Main Directional Light) */}
      <directionalLight
        color={0xffffff}
        intensity={1.5}
        position={[5, 10, 5]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      
      {/* C. The "Rim" Light (Secondary Directional Light) */}
      <directionalLight
        color={0xffffff}
        intensity={0.75}
        position={[-5, 10, -5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
    </>
  );
}

export default StudioEnvironment;


