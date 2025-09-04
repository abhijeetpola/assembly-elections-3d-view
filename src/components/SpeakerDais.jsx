import React from 'react';

const SpeakerDais = React.memo(function SpeakerDais() {
  return (
    // ========================================
    // MAIN CONTAINER: Speaker's Dais Assembly
    // ========================================
    // This group contains the entire Speaker's platform
    // Position: 10 units in front of the parliament seat (negative Z = forward)
    // Rotation: 180° to face the assembly (Math.PI = 180 degrees)
    <group 
      position={[0, 0, -10.0]} 
      rotation={[0, Math.PI, 0]} 
    >
      
      {/* ========================================
          SECTION 1: SPEAKER'S PODIUM (Foundation)
          ========================================
          This is the solid, imposing base that the Speaker stands behind.
          It serves as both a desk surface and a visual barrier. */}
      
      {/* Main Podium Block - Solid Foundation */}
      <mesh position={[0, 1.75, 0]}>
        {/* 
          Dimensions: 10.0 wide × 3.5 tall × 2.5 deep
          Position Y: 1.75 centers the 3.5 height block vertically
          This creates a solid podium from ground level up
        */}
        <boxGeometry args={[10.0, 3.5, 2.5]} />
        <meshStandardMaterial 
          color={0x8B5A2B} // Brown Wood Material (same as parliamentSeat)
          roughness={0.4}  // Semi-gloss finish
          metalness={0.1}  // Subtle sheen
        />
      </mesh>
      
      {/* Black Screen Device - On Top of Podium */}
      <mesh position={[0, 3.35, 0]}>
        {/* 
          Dimensions: 1.0 wide × 0.6 tall × 0.1 deep (thin screen)
          Position Y: 3.35 places it on top of the podium (1.75 + 3.5/2 + 0.6/2)
          This represents the Speaker's computer/monitor
        */}
        <boxGeometry args={[1.0, 0.6, 0.1]} />
        <meshStandardMaterial 
          color={0x111111} // Black Screen Material (same as parliamentSeat)
          roughness={0.2}  // Smooth, reflective surface
          metalness={0.0}  // Non-metallic
        />
      </mesh>
      
      {/* ========================================
          SECTION 2: SPEAKER'S CHAIR (Seating)
          ========================================
          This is the Speaker's throne-like chair positioned behind the podium.
          It's elevated and has a dramatically taller backrest for authority. */}
      
      {/* Chair Assembly Group - All chair parts together */}
      <group 
        position={[0, 2.1, 2.5]} // Lifted to ground legs on same plane as podium
        rotation={[0, Math.PI, 0]} // Chair faces the podium (180° rotation)
      >
        {/* 
          POSITIONING LOGIC:
          - X: 0 (centered behind podium)
          - Y: 2.1 (lifted to ground legs on same plane as podium base)
          - Z: 2.5 (comfortable distance behind podium)
          
          ROTATION LOGIC:
          - Chair naturally faces forward (toward negative Z)
          - We rotate 180° so it faces the podium (positive Z)
          - This ensures the Speaker faces their desk
        */}
        
        {/* ========================================
            CHAIR COMPONENT 1: SEAT CUSHION
            ========================================
            The horizontal surface the Speaker sits on */}
        <mesh position={[0, 0.2, 0]}>
          {/* 
            Dimensions: 1.0 wide × 0.2 tall × 1.0 deep
            Position Y: 0.2 raises the cushion above the leg level
            This creates a comfortable sitting height
          */}
          <boxGeometry args={[1.0, 0.2, 1.0]} />
          <meshStandardMaterial 
            color={0x008080} // Green Fabric Material (same as parliamentSeat)
            roughness={0.9}  // Matte, non-reflective fabric look
            metalness={0.0}  // Non-metallic
          />
        </mesh>
        
        {/* ========================================
            CHAIR COMPONENT 2: BACKREST
            ========================================
            The vertical support behind the Speaker - dramatically tall for authority */}
        <mesh position={[0, 2.7, -0.45]}>
          {/* 
            Dimensions: 1.5 wide × 5.4 tall × 0.1 deep
            Position Y: 2.7 centers the 5.4 height backrest above the seat
            Position Z: -0.45 places it at the back edge of the seat
            Height: 5.4 is 3x the original height for dramatic authority
            Width: 1.5 for more commanding presence
          */}
          <boxGeometry args={[1.5, 5.4, 0.1]} />
          <meshStandardMaterial 
            color={0x008080} // Green Fabric Material (same as seat cushion)
            roughness={0.9}  // Matte, non-reflective fabric look
            metalness={0.0}  // Non-metallic
          />
        </mesh>
        
        {/* ========================================
            CHAIR COMPONENT 3: PLINTH BASE + PEDESTAL (no legs)
            ======================================== */}
        {/* Plinth base */}
        <mesh position={[0, -0.6 - 0.14 / 2, 0]}>
          <boxGeometry args={[1.3, 0.14, 1.2]} />
          <meshStandardMaterial color={0x8B5A2B} roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Solid pedestal up to seat underside */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[1.1, 0.8, 1.0]} />
          <meshStandardMaterial color={0x8B5A2B} roughness={0.4} metalness={0.1} />
        </mesh>
        
        {/* ========================================
            CHAIR COMPONENT 4: ARMRESTS
            ========================================
            The horizontal supports on either side of the seat */}
        
        {/* Right Armrest */}
        <mesh position={[0.575, 0.5, 0]}>
          {/* 
            Dimensions: 0.15 wide × 0.4 tall × 0.8 deep
            Position X: 0.575 (extends beyond right edge of seat)
            Position Y: 0.5 (comfortable arm height above seat)
            Position Z: 0 (centered on seat)
          */}
          <boxGeometry args={[0.15, 0.4, 0.8]} />
          <meshStandardMaterial 
            color={0x8B5A2B} // Brown Wood Material (same as legs)
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* Left Armrest */}
        <mesh position={[-0.575, 0.5, 0]}>
          {/* 
            Dimensions: 0.15 wide × 0.4 tall × 0.8 deep
            Position X: -0.575 (extends beyond left edge of seat)
            Position Y: 0.5 (comfortable arm height above seat)
            Position Z: 0 (centered on seat)
          */}
          <boxGeometry args={[0.15, 0.4, 0.8]} />
          <meshStandardMaterial 
            color={0x8B5A2B}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* ========================================
            CHAIR COMPONENT 5: HEADREST TRIM
            ========================================
            The wooden trim piece on top of the tall backrest */}
        <mesh position={[0, 5.4, -0.45]}>
          {/* 
            Dimensions: 1.6 wide × 0.1 tall × 0.15 deep
            Position Y: 5.4 (at the very top of the 5.4 tall backrest)
            Position Z: -0.45 (aligned with backrest)
            Width: 1.6 (slightly wider than backrest for trim effect)
          */}
          <boxGeometry args={[1.6, 0.1, 0.15]} />
          <meshStandardMaterial 
            color={0x8B5A2B} // Brown Wood Material (same as armrests)
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
      </group>
      
    </group>
  );
});

export default SpeakerDais;
