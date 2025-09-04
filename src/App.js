import React, { useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import EnhancedCameraControls from './components/EnhancedCameraControls';
import './App.css';
import StudioEnvironment from './components/StudioEnvironment';
import SpeakerDais from './components/SpeakerDais';
import AssemblyLayout from './components/AssemblyLayout';
import ResultsLegend from './components/ResultsLegend';
import SpeakerChairIcon from './components/icons/SpeakerChairIcon';
import TimelineBar from './components/TimelineBar'; // Time seek bar
import timeline from './data/electionTimeline.json';
import { ALLIANCES, UNDECLARED_COLOR, lighterShade } from './config/alliances';
import { SEAT_BLOCKS, TOTAL_SEATS } from './config/seatBlocks';

// Removed old orthographic CameraController; using EnhancedCameraControls + perspective camera instead.

function App() {
  const [currentIndex, setCurrentIndex] = useState(timeline.length - 1); // LIVE by default

  const seatMap = useMemo(() => SEAT_BLOCKS, []);

  const seatHexColors = useMemo(() => {
    const snap = timeline[currentIndex];
    const seatCount = TOTAL_SEATS;
    const seatColorHex = new Array(seatCount).fill(UNDECLARED_COLOR);
    const counts = {};
    for (const a of snap.alliances) counts[a.id] = a;
    for (const { id, color } of ALLIANCES) {
      const block = seatMap[id] || [];
      const data = counts[id];
      if (!data) continue;
      const { wins, leads } = data;
      const leadShade = lighterShade(color, 0.65);
      for (let i = 0; i < block.length; i += 1) {
        const seatIdx = block[i];
        if (i < wins) seatColorHex[seatIdx] = color;
        else if (i < wins + leads) seatColorHex[seatIdx] = leadShade;
      }
    }
    return seatColorHex;
  }, [currentIndex, seatMap]);

  // Store seat matrices for camera focus (populated via callback from layout later if needed)
  const [seatMatrices, setSeatMatrices] = useState([]);
  const [sphere, setSphere] = useState(null);
  const [camControls, setCamControls] = useState(null);
  const [activePreset, setActivePreset] = useState(null);

  const computeSphere = (mats) => {
    if (!mats || !mats.length) return null;
    const tmp = new THREE.Vector3();
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    mats.forEach(m => {
      tmp.setFromMatrixPosition(m);
      min.min(tmp); max.max(tmp);
    });
    const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5);
    // radius = max distance from center
    let r = 0; mats.forEach(m => { tmp.setFromMatrixPosition(m); r = Math.max(r, tmp.distanceTo(center)); });
    return { center, radius: r };
  };

  const applyPreset = (preset) => {
    if (!camControls || !sphere) return;
    const { center, radius } = sphere;
    const aspect = window.innerWidth / window.innerHeight;
    const fov = THREE.MathUtils.degToRad(26);
    const horizFov = 2 * Math.atan(Math.tan(fov / 2) * aspect);
    const limitingFov = Math.min(fov, horizFov); // ensure fits within both axes
    const margin = 1.10; // requested margin
    const requiredDist = (radius * margin) / Math.sin(limitingFov / 2);

    if (preset === 'gallery') {
      const elevAngle = THREE.MathUtils.degToRad(55);
      const y = Math.sin(elevAngle) * requiredDist;
      const z = Math.cos(elevAngle) * requiredDist;
      camControls.setLookAt(center.x, center.y + y, center.z + z, center.x, center.y + 6, center.z, true);
      setActivePreset('gallery');
      return;
    }

    if (preset === 'speaker') {
      // Dais world position (from SpeakerDais placement assumptions)
      const daisPos = new THREE.Vector3(0, 0, -10);
      // Forward vector from dais toward assembly center (flattened to XZ plane)
      const forward = new THREE.Vector3().subVectors(center, daisPos);
      forward.y = 0;
      if (forward.lengthSq() < 1e-5) forward.set(0, 0, 1); else forward.normalize();
      // Desired downward pitch ~30°: raise eye height to achieve that angle relative to target point
      const targetY = center.y + 1.2;
      const angle = THREE.MathUtils.degToRad(30);
      const eyeHeight = targetY + requiredDist * Math.tan(angle); // ensures ~30° look-down
      const initialForwardOffset = 1.6; // small push out from dais toward seats
      const eye = new THREE.Vector3().copy(daisPos).add(new THREE.Vector3(0, eyeHeight, 0)).add(new THREE.Vector3().copy(forward).multiplyScalar(initialForwardOffset));
      // Ensure we are far enough back so that whole layout fits inside frustum
      const centerDir = new THREE.Vector3().subVectors(center, eye);
      const projDist = centerDir.dot(forward);
      if (projDist < requiredDist) {
        // Move backward along -forward to satisfy required distance
        eye.addScaledVector(forward, -(requiredDist - projDist));
      }
      camControls.setLookAt(eye.x, eye.y, eye.z, center.x, targetY, center.z, true);
      setActivePreset('speaker');
    }
  };

  // Auto-apply gallery preset on first availability (default view)
  useEffect(() => {
    if (camControls && sphere && activePreset == null) {
      applyPreset('gallery');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camControls, sphere, activePreset]);

  return (
    <div className="app-container">
      <header className="app-header">
  <h1 className="header-title" style={{whiteSpace:'nowrap'}}>Bihar Elections'25</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className={`cam-icon-btn ${activePreset === 'speaker' ? 'active' : ''}`} title="Speaker POV" onClick={() => applyPreset('speaker')}><SpeakerChairIcon active={activePreset === 'speaker'} /></button>
          <button type="button" className={`cam-icon-btn ${activePreset === 'gallery' ? 'active' : ''}`} title="Gallery View" onClick={() => applyPreset('gallery')}>🏛</button>
        </div>
      </header>
      
      <div className="canvas-container" style={{ position: 'relative' }}>
  {/* Colors recomputed each time slider changes; passed to AssemblyLayout */}
            <Canvas
            // Increase device pixel ratio for sharper zoom (caps at 2 for perf)
            dpr={[1, 2]}
            shadows
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance'
            }}
            camera={{ fov: 26, near: 0.02, far: 2000, position: [0,70,120] }}
            onCreated={({ scene, gl }) => {
              scene.background = new THREE.Color(0x000000);
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
              // Ensure pixel ratio matches Canvas prop in some browsers
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }}
          >
            {/* Enhanced camera controls (dolly to cursor, focus) */}
            <EnhancedCameraControls getSeatWorldMatrix={() => ({ matrices: seatMatrices })} onReady={(cc) => setCamControls(cc)} />
            {/* Professional Studio Environment */}
            <StudioEnvironment />
            {/* Speaker's Dais */}
            <SpeakerDais />
            {/* Seat / benches assembly (takes computed per-seat colors for wins/leads) */}
            {/* Vertical offset wrapper to nudge assembly upward visually */}
            <group position={[0,5,0]}>
              <AssemblyLayout seatHexColors={seatHexColors} onSeatMatricesReady={(mats) => { setSeatMatrices(mats); const sp = computeSphere(mats); setSphere(sp); }} />
            </group>
          </Canvas>
          {/* Timeline UI overlay (HTML) */}
          <TimelineBar timeline={timeline} currentIndex={currentIndex} onChange={setCurrentIndex} />
          <ResultsLegend currentIndex={currentIndex} timeline={timeline} />
      </div>

    </div>
  );
}

export default App;
