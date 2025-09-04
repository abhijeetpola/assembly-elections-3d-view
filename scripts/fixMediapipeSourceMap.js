// fixMediapipeSourceMap.js
// Purpose: Silence CRA build warning about missing vision_bundle_mjs.js.map from @mediapipe/tasks-vision.
// We create a minimal placeholder source map file if it does not exist.
// Safe: does not affect runtime behavior.

const fs = require('fs');
const path = require('path');

const pkgDir = path.join(__dirname, '..', 'node_modules', '@mediapipe', 'tasks-vision');
// Actual files shipped: vision_bundle.mjs + vision_bundle.mjs.map
// CRA warning expects: vision_bundle_mjs.js + vision_bundle_mjs.js.map (with underscore + .js)
// We fabricate the expected pair if missing by copying/aliasing the real ones.
const expectedJs = path.join(pkgDir, 'vision_bundle_mjs.js');
const expectedMap = path.join(pkgDir, 'vision_bundle_mjs.js.map');
const realJs = path.join(pkgDir, 'vision_bundle.mjs');
const realMap = path.join(pkgDir, 'vision_bundle.mjs.map');

try {
  if (fs.existsSync(pkgDir)) {
    // Create expected JS wrapper if missing (simple re-export)
    if (!fs.existsSync(expectedJs) && fs.existsSync(realJs)) {
      const contents = `// Auto-generated shim to satisfy CRA source map expectation.\n`+
        `export * from './vision_bundle.mjs';\n`;
      fs.writeFileSync(expectedJs, contents, 'utf8');
    }
    // Provide map: prefer copying real map if exists, else stub
    if (!fs.existsSync(expectedMap)) {
      if (fs.existsSync(realMap)) {
        fs.copyFileSync(realMap, expectedMap);
      } else {
        const stub = { version: 3, file: 'vision_bundle_mjs.js', sources: ['stub://vision_bundle_mjs.js'], names: [], mappings: '' };
        fs.writeFileSync(expectedMap, JSON.stringify(stub), 'utf8');
      }
      // eslint-disable-next-line no-console
      console.log('[postinstall] Added Mediapipe shim + map to silence warning');
    }
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.log('[postinstall] Skipped Mediapipe source map fix:', e.message);
}
