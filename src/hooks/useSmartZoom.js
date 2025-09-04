import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

// Component (must live inside <Canvas>) enabling smart cursor-centered zoom for OrthographicCamera.
// SmartZoom v2: higher max zoom + exponential scaling for consistent feel
export default function SmartZoom({ controlsRef, minZoom = 0.25, maxZoom = 25, zoomSpeed = 0.002 }) {
  const { camera, gl } = useThree();

  useEffect(() => {
    if (!camera.isOrthographicCamera) return; // only implement for ortho
    const dom = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const tmpBefore = new THREE.Vector3();
    const tmpAfter = new THREE.Vector3();

    function pickWorld(clientX, clientY) {
      const rect = dom.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const { origin, direction } = raycaster.ray;
      // Intersect seat plane (average seated head base ~1.1; use 0.5 for mid‑bench reference) for more intuitive zoom focus
      const targetY = 0.5;
      const denom = direction.y;
      if (Math.abs(denom) > 1e-5) {
        const t = (targetY - origin.y) / denom;
        if (t > 0) return tmpBefore.copy(origin).addScaledVector(direction, t);
      }
      return tmpBefore.set(0, 0, 0);
    }

    function onWheel(e) {
      if (e.ctrlKey) return; // allow gesture pinch zoom default
      e.preventDefault();
      const controls = controlsRef?.current;
      const before = pickWorld(e.clientX, e.clientY).clone();
      // Exponential scaling: each wheel tick multiplies zoom for smoother, deeper range
      const scale = Math.exp(-e.deltaY * zoomSpeed); // negative because wheel down = zoom out
      camera.zoom = THREE.MathUtils.clamp(camera.zoom * scale, minZoom, maxZoom);
      camera.updateProjectionMatrix();
      pickWorld(e.clientX, e.clientY).copy(tmpAfter);
      const shift = before.sub(tmpAfter);
      camera.position.add(shift);
      if (controls) {
        controls.target.add(shift);
        controls.update();
      }
    }

    dom.addEventListener('wheel', onWheel, { passive: false });
    return () => dom.removeEventListener('wheel', onWheel);
  }, [camera, gl, controlsRef, minZoom, maxZoom, zoomSpeed]);

  return null;
}
