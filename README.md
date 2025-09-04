## Election Timeline Visualization (Prototype)

Non‑technical summary: This app shows the Bihar Assembly seating in 3D. As you move the time slider, seat holograms recolor to show which alliance is currently winning (solid color) or only leading (lighter shade). Everything is pre‑computed locally; no live data feed yet.

Added features (prototype stage):

* Hologram occupants above each of the 243 seats (instanced meshes) now recolor by alliance as you scrub the timeline (10:00–15:00, 30‑min steps).
* Color mapping: each alliance owns pre-defined seat blocks (static). For each snapshot: first N wins seats get the solid alliance color, next M leads seats get a lighter shade, remainder neutral gray.
* LIVE state = last snapshot.
* Legend (top-right) shows per-alliance wins (W) and leads (L) counts for current snapshot.

Implementation notes (plain language):
* Current hologram coloring groups seats by hex color (one InstancedMesh per distinct shade) to avoid driver inconsistencies with per-instance vertex color buffers.
* Seat indices are zero-based internally; visible numbering (markers) is 1..243.
* Data source: `src/data/electionTimeline.json` (placeholder sample counts).

Planned improvements (next candidates):
* Smooth fade transitions between snapshots.
* Dynamic allocation or carving out block for OTHERS once distribution strategy decided.
* Accessibility: optional high-contrast / daltonism-friendly palette.
* Performance benchmarking and potential merge of color groups if palette expands.

Housekeeping already done:
* Removed deprecated `SeatStateContext` (replaced by direct prop + grouped instancing approach).
* Simplified props (`AssemblyLayout` no longer receives unused float color buffer).
* Added concise legend component `ResultsLegend.jsx`.
* Silenced noisy build warnings (removed dev logs + pinned dependency to avoid Node engine warning). Source-map missing file warning from a third-party library is non-impacting and ignored.
# Bihar Legislative Assembly 3D Visualization

A React-based 3D visualization of the Bihar Legislative Assembly using Three.js and React Three Fiber. This project represents a complete, production-ready 3D legislative chamber with 243 seats arranged in a sophisticated 5-Spoke Radial Arc layout.

## 🎯 Project Status: Layout Complete & Camera Optimized

**Current Achievement**: The 5-Spoke Radial Arc layout has been successfully implemented with perfect camera framing, professional studio environment, and Speaker's Dais integration. The assembly is now ready for high-fidelity seat model upgrades.

**Latest Checkpoint**: `bihar-assembly-checkpoint-5-spoke-fix` - Layout algorithm perfected, camera optimization complete, all 243 seats properly positioned and oriented.

## Assembly Layout: The 5-Spoke Radial Arc

The 3D visualization uses a custom semi-circular layout designed for 243 seats. This layout is structured as five distinct "spokes" or wedges of seats, separated by four wide walkways to ensure visual clarity and realism.

### Overall Structure:
- **Total Seats:** 243
- **Total Spokes:** 5 (1 Central, 4 Side)
- **Central Aisle:** A wide central aisle splits the Central Spoke and divides the chamber into Government and Opposition sides.

### Seat Distribution:
- **Central Spoke (1):** 43 seats, split into a 21-seat Opposition block and a 22-seat Government block.
- **Side Spokes (4):** 50 seats each (2 on the Opposition side, 2 on the Government side).

### Row Breakdown per Spoke:

**50-Seat Side Spoke Layout (5 Rows):**
- Row 1: 8 seats
- Row 2: 9 seats
- Row 3: 10 seats
- Row 4: 11 seats
- Row 5: 12 seats

**43-Seat Central Spoke Layout (5 Rows):**
- **Opposition Half (21 seats):** Rows of 3, 4, 4, 5, 5 seats.
- **Government Half (22 seats):** Rows of 4, 4, 5, 5, 4 seats.

## Features

- **Orthographic Camera**: Perfect framing of the entire assembly with comfortable margins
- **243-Seat Assembly**: Complete legislative chamber visualization
- **Professional Studio Environment**: High-quality lighting and shadows
- **Responsive Design**: Optimized for various screen sizes
- **Interactive Leader Detail Overlay**: Click (tap release without drag) on any seat face card to trigger a shared‑element style transition from its 3D position into a glass dialog with leader info. Dragging instead of releasing cancels the click (prevents accidental opens while orbiting). Overlay supports:
   * Shared element animation using projected screen rectangle
   * Escape key to close + backdrop click
   * Initial keyboard focus on close control (accessibility)
   * Future extensibility: constituency, dynamic stats

## Technology Stack

- React 18
- Three.js
- React Three Fiber
- React Three Drei

## 🚀 Getting Started

### Development Workflow (Recommended)
**Note**: The `npm start` command is known to hang on this system. Use the build-and-serve approach instead.

### Requirements
* Node.js 20.x (project enforces via `.nvmrc` & `engines`)
* npm 10+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project (CI treats warnings as errors):**
   ```bash
   npm run build
   ```

3. **Serve the production build (preview mode):**
   ```bash
   npx serve -s build -l 3001
   ```

4. **Open your browser** and navigate to `http://localhost:3001`

### Alternative: Quick Development Server
If you prefer to try the development server:
```bash
npm start
```
**Warning**: This may hang and require manual termination.

### Camera Presets & Close Zoom
The default view auto-applies the Gallery preset (elevated oblique). A Speaker POV preset frames from the dais. Close zoom behavior includes:
* min distance 0.5m with soft floor stabilization at 0.6m
* lateral offset when extremely close to avoid clipping hologram face cards
* dynamic toggle of dolly-to-cursor below distance 5 to prevent jitter
* double-click a seat to focus (focus distance 6m) / press `f` to re-focus / `Esc` to reset

### Scripts
```bash
npm run lint      # eslint check
npm run format    # prettier write
npm test          # jest tests (includes seat matrix count regression)
```

### Testing
A lightweight regression test asserts we always produce 243 seat matrices. Extend this with per-spoke distribution if refactors occur.

## 🏗️ Project Structure

### Core Components
- `src/components/AssemblyLayout.jsx` - **5-Spoke Radial Arc layout algorithm** with 243-seat positioning
- `src/components/ParliamentSeat.jsx` - **High-fidelity individual seat component** (desk + chair with materials)
- `src/components/StudioEnvironment.jsx` - **Professional studio lighting** with ambient, key, and rim lights
- `src/components/SpeakerDais.jsx` - **Speaker's podium and chair** positioned at assembly center

### Main Application
- `src/App.js` - **Main application** with orthographic camera setup, perfect framing, and scene composition

### Layout Algorithm Features
- **243 seats** arranged in 5 distinct spokes
- **200-degree semi-circular arc** with perfect symmetry
- **Opposition/Government split** with central aisle
- **Dynamic camera framing** with comfortable margins
- **Professional studio environment** with shadows and lighting
