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

## Technology Stack

- React 18
- Three.js
- React Three Fiber
- React Three Drei

## 🚀 Getting Started

### Development Workflow (Recommended)
**Note**: The `npm start` command is known to hang on this system. Use the build-and-serve approach instead.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Serve the production build:**
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
