import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * ParliamentChairBlueprint (chair-only)
 * -------------------------------------
 * Provides merged geometries for wood and fabric parts separately so that
 * we can render two InstancedMeshes (one per material) efficiently.
 */

// Materials (kept simple PBR settings)
export const WOOD_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0x8b5a2b,
  roughness: 0.4,
  metalness: 0.1,
});

export const FABRIC_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0x008080,
  roughness: 0.9,
  metalness: 0.0,
});

/**
 * createMergedChairGeometries
 * Returns { woodGeometry, fabricGeometry } where each is a BufferGeometry
 * composed of box parts positioned in local chair space around origin.
 */
export function createMergedChairGeometries() {
  const woodParts = [];
  const fabricParts = [];

  // Fabric: seat cushion (centered)
  {
    const g = new THREE.BoxGeometry(1.0, 0.2, 1.0);
    g.translate(0, 0.3, 0); // raise slightly so legs can be below
    fabricParts.push(g);
  }

  // Fabric: backrest
  {
    const g = new THREE.BoxGeometry(1.0, 1.1, 0.12);
    g.translate(0, 0.9, -0.45);
    fabricParts.push(g);
  }

  // Wood: plinth base (full base, grounded)
  {
    const baseWidth = 1.12;  // slightly wider than seat for stability
    const baseDepth = 1.0;   // align with seat depth
    const baseHeight = 0.14; // low profile plinth
    const base = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    base.translate(0, -0.3 - baseHeight / 2, 0);
    woodParts.push(base);
  }

  // Wood: solid pedestal from seat underside to base top
  {
    const pedestalWidth = 1.0;  // align roughly with seat width
    const pedestalDepth = 0.92; // slightly inset from base edges
    const seatBottomY = 0.3 - 0.2 / 2; // seat center 0.3, height 0.2
    const baseTopY = -0.3;            // top of plinth base
    const pedestalHeight = seatBottomY - baseTopY; // expected ~0.5
    const centerY = baseTopY + pedestalHeight / 2; // expected ~-0.05
    const pedestal = new THREE.BoxGeometry(pedestalWidth, pedestalHeight, pedestalDepth);
    pedestal.translate(0, centerY, 0);
    woodParts.push(pedestal);
  }

  // Wood: armrests
  {
    const left = new THREE.BoxGeometry(0.14, 0.18, 0.8);
    left.translate(-0.58, 0.6, 0);
    woodParts.push(left);

    const right = new THREE.BoxGeometry(0.14, 0.18, 0.8);
    right.translate(0.58, 0.6, 0);
    woodParts.push(right);
  }

  // Wood: head trim
  {
    const g = new THREE.BoxGeometry(1.1, 0.1, 0.15);
    g.translate(0, 1.5, -0.45);
    woodParts.push(g);
  }

  const woodGeometry = mergeGeometries(woodParts, true);
  const fabricGeometry = mergeGeometries(fabricParts, true);

  return { woodGeometry, fabricGeometry };
}
