// EnhancedCameraControls.jsx
// ---------------------------------------------------------------------------
// Provides smooth, user-friendly camera navigation using camera-controls:
//  - Dolly to cursor (scroll zoom centers where you point)
//  - Smooth inertial panning/orbit (damping)
//  - Seat focus on double-click (raycasts meshes tagged as focusable)
//  - ESC to reset framing
//  - Programmatic API can be extended later (expose ref)
// ---------------------------------------------------------------------------
import { useEffect, useRef, useCallback } from 'react';
import CameraControls from 'camera-controls';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

CameraControls.install({ THREE });

// CONFIG
// Constrained orbit ranges (hybrid approach)
// ~26° to ~66° polar keeps depth while avoiding extreme top-down or shallow flips
const POLAR_MIN = 0.45;            // radians (~25.8°)
const POLAR_MAX = 1.15;            // radians (~65.9°)
// Azimuth limited to front hemisphere +/- ~105° to prevent swinging fully behind
const AZIMUTH_MIN = -1.83;         // ~ -105°
const AZIMUTH_MAX = 1.83;          // ~ +105°

// Enhanced close-inspection behavior constants
const MIN_DISTANCE = 0.5;          // absolute clamp (hard) how close camera center can get to target
const SOFT_FLOOR = 0.6;            // threshold to begin protective lateral offset to avoid clipping face cards
const SIDE_OFFSET = 0.12;          // meters to nudge sideways at soft floor for better parallax (world-space)
const CLOSE_TOGGLE_DISTANCE = 5;   // below this distance we disable dollyToCursor to prevent jitter / drift
const FOCUS_DISTANCE = 6;          // distance used when focusing a seat (double-click / refocus)

export default function EnhancedCameraControls({ getSeatWorldMatrix, onReady }) {
  const { camera, gl, scene, size } = useThree();
  const controlsRef = useRef(null);
  const pointer = useRef(new THREE.Vector2());
  const focusRingRef = useRef(null);
  const focusedSeat = useRef(null);

  // Create a subtle focus ring (circle) that we can move to focused seat
  // onReady excluded from deps: we only want to call once on mount for stable camera controls.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const ringGeom = new THREE.RingGeometry(0.45, 0.5, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffff66, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(ringGeom, ringMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    focusRingRef.current = mesh;
    return () => {
      scene.remove(mesh);
      ringGeom.dispose();
      ringMat.dispose();
    };
  }, [scene]);

  // Initial perspective camera positioning & framing
  useEffect(() => {
    // Set camera to perspective values if not already
    if (camera.type !== 'PerspectiveCamera') {
      // (In Canvas we will instantiate perspective explicitly)
    }
    camera.position.set(0, 70, 78); // elevated & back a bit for opening shot
  camera.near = 0.02; // allow very close zoom without clipping (reduced for tighter hologram approach)
    camera.far = 2000;
    camera.updateProjectionMatrix();

    const cc = new CameraControls(camera, gl.domElement);
  cc.dollyToCursor = true;
  cc.smoothTime = 0.08; // crisper stop
  cc.draggingDampingFactor = 0.18;
  cc.infinityDolly = false;
  cc.minDistance = MIN_DISTANCE;  // allow much closer inspection of seats
    cc.maxDistance = 240; // how far you can pull out
    cc.polarAngleMin = POLAR_MIN;
    cc.polarAngleMax = POLAR_MAX;
    cc.azimuthAngleMin = AZIMUTH_MIN;
    cc.azimuthAngleMax = AZIMUTH_MAX;
  cc.verticalDragToForward = false; // disable forward lurch
    cc.saveState();
    controlsRef.current = cc;

  // Initial framing = Gallery 45° preset
  cc.setLookAt(0, 55, 95, 0, 6, 0, false);

  if (onReady) onReady(cc);

    return () => cc.dispose();
  }, [camera, gl]);

  // Per-frame update
  const softAppliedRef = useRef(false);

  useFrame((_, delta) => {
    const cc = controlsRef.current;
    if (cc) {
      // Dynamic dolly-to-cursor toggle for stability when extremely close
      const dist = cc.distance;
      const shouldDolly = dist > CLOSE_TOGGLE_DISTANCE;
      if (cc.dollyToCursor !== shouldDolly) {
        cc.dollyToCursor = shouldDolly;
      }

      // Soft floor protective lateral nudge (only once per entry below threshold)
      if (dist < SOFT_FLOOR) {
        if (!softAppliedRef.current) {
          const target = new THREE.Vector3();
          if (cc.getTarget) cc.getTarget(target); else target.copy(cc._target || new THREE.Vector3()); // fallback
          const camPos = camera.position.clone();
          const dir = camPos.clone().sub(target).normalize();
          const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
          camPos.addScaledVector(right, SIDE_OFFSET);
          if (camPos.y < 0.5) camPos.y = 0.5; // keep above floor plane
          // Maintain look at target without animation (prevents perceptible snap loop)
          cc.setLookAt(camPos.x, camPos.y, camPos.z, target.x, target.y, target.z, false);
          softAppliedRef.current = true;
        }
      } else if (softAppliedRef.current) {
        // Reset flag once user pulls back out
        softAppliedRef.current = false;
      }

      cc.update(delta);
    }

    // Pulse focus ring (independent of controls existence)
    const ring = focusRingRef.current;
    if (ring && ring.visible) {
      const t = performance.now() * 0.002;
      const base = 0.5;
      const scale = base + Math.sin(t) * 0.04;
      ring.scale.setScalar(scale / base);
      ring.material.opacity = 0.55 + (Math.sin(t * 2) * 0.25 + 0.25);
    }
  });

  // Utility: raycast seats plane for potential future cursor mapping.
  const updatePointer = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, [gl]);

  // Double-click seat focus logic (simple heuristic: use closest seat matrix from supplied getter)
  const handleDblClick = useCallback((e) => {
    updatePointer(e);
    if (!getSeatWorldMatrix) return;

    // Sample all seat matrices and pick nearest projected screen distance to pointer.
    const candidate = getSeatWorldMatrix(); // expected to return { matrices: Matrix4[] }
    if (!candidate || !candidate.matrices) return;

    const proj = new THREE.Vector3();
    let bestIdx = -1;
    let bestDist = Infinity;
    candidate.matrices.forEach((m, idx) => {
      proj.setFromMatrixPosition(m).project(camera);
      const dx = proj.x - pointer.current.x;
      const dy = proj.y - pointer.current.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist) { bestDist = d2; bestIdx = idx; }
    });
    if (bestIdx === -1) return;

    const seatPos = new THREE.Vector3().setFromMatrixPosition(candidate.matrices[bestIdx]);
    const cc = controlsRef.current;
    if (!cc) return;

  const camDir = new THREE.Vector3(0, 0.4, 1).normalize();
    // Desired camera offset relative to seat (higher y fraction for a top perspective)
  const distance = FOCUS_DISTANCE; // closer baseline viewing distance for sharper engagement
    const target = seatPos.clone().add(new THREE.Vector3(0, 1.2, 0));
    const camPos = target.clone().add(camDir.clone().multiplyScalar(distance));

    cc.setLookAt(camPos.x, camPos.y, camPos.z, target.x, target.y, target.z, true);
    focusedSeat.current = bestIdx;
    if (focusRingRef.current) {
      focusRingRef.current.position.set(seatPos.x, 0.05, seatPos.z);
      focusRingRef.current.visible = true;
    }
  }, [camera, getSeatWorldMatrix, updatePointer]);

  // Key handling for reset (Esc)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && controlsRef.current) {
        // Reset to gallery preset rather than original raw state
        controlsRef.current.setLookAt(0, 55, 95, 0, 6, 0, true);
        if (focusRingRef.current) focusRingRef.current.visible = false;
        focusedSeat.current = null;
      }
      if (e.key === 'f' && controlsRef.current && focusedSeat.current != null && getSeatWorldMatrix) {
        // Re-focus currently selected seat if user drifted away
        const candidate = getSeatWorldMatrix();
        const m = candidate.matrices[focusedSeat.current];
        if (!m) return;
        const seatPos = new THREE.Vector3().setFromMatrixPosition(m);
        const target = seatPos.clone().add(new THREE.Vector3(0, 1.2, 0));
        const camDir = new THREE.Vector3(0, 0.4, 1).normalize();
  const distance = FOCUS_DISTANCE;
        const camPos = target.clone().add(camDir.clone().multiplyScalar(distance));
        controlsRef.current.setLookAt(camPos.x, camPos.y, camPos.z, target.x, target.y, target.z, true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [getSeatWorldMatrix]);

  useEffect(() => {
    const dom = gl.domElement;
    dom.addEventListener('dblclick', handleDblClick);
    return () => dom.removeEventListener('dblclick', handleDblClick);
  }, [handleDblClick, gl]);

  // Resize: update camera aspect & projection once Canvas size changes.
  useEffect(() => {
    if (camera.type === 'PerspectiveCamera') {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  return null;
}
