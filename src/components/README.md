# Parliament Seat Component

## Overview
A high-quality 3D component representing a single parliament seat with desk and chair, designed as a "prefab" or "blueprint" for the entire assembly. **Completely rebuilt from scratch** with proper separation, four chair legs, correct rotation, logical positioning, wooden armrests, headrest trim, and now includes a realistic carpet floor environment.

## Architecture Overview

### Component Structure
- **AssemblyHall**: Main container component responsible for environment, lighting, and floor
- **ParliamentSeat**: Individual seat component (desk + chair) - completely isolated
- **ParliamentSeatTest**: Test scene for isolated component inspection

### Separation of Concerns
- **AssemblyHall**: Scene management, lighting, floor, camera control
- **ParliamentSeat**: Pure 3D model with no scene dependencies
- **Clean Integration**: ParliamentSeat is imported and placed within AssemblyHall

## Component Structure

### Materials (Color Palette)
- **Wood Material**: Warm, medium-brown wood (0x8B5A2B)
  - Roughness: 0.4 (semi-gloss, slightly reflective)
  - Metalness: 0.1 (subtle, realistic sheen)
  
- **Fabric Material**: Deep teal green (0x008080)
  - Roughness: 0.9 (matte and non-reflective like fabric)
  - Metalness: 0.0 (fabric is not metallic)
  
- **Screen Material**: Dark, near-black (0x111111)
  - Roughness: 0.2 (smooth, screen-like reflection)
  - Metalness: 0.0

### Task 1: Desk Unit (Complete Isolation)
- **Desktop**: 2.5 × 0.1 × 1.2 (width × height × depth)
  - Position: (0, 0, 0) relative to deskGroup
  - Material: Brown Wood Material
  
- **Side Panels/Legs**: Two panels, 0.1 × 1.0 × 1.0
  - Left Leg: Position at (-1.2, -0.55, 0)
  - Right Leg: Position at (1.2, -0.55, 0)
  - Material: Brown Wood Material
  
- **Black Screen**: 0.8 × 0.4 × 0.1
  - Position: (0, 0.25, 0) on top of desktop
  - Material: Black Screen Material

### Task 2: Chair Unit (Complete Isolation with 4 Legs)
- **Seat Cushion**: 1.0 × 0.2 × 1.0
  - Position: (0, 0, 0) relative to chairGroup
  - Material: Green Fabric Material
  
- **Backrest**: 1.0 × 1.2 × 0.1
  - Position: (0, 0.7, -0.45) at back of cushion
  - Material: Green Fabric Material
  
- **Four Legs**: Each 0.1 × 0.8 × 0.1
  - Front Left: (-0.45, -0.5, 0.45)
  - Front Right: (0.45, -0.5, 0.45)
  - Back Left: (-0.45, -0.5, -0.45)
  - Back Right: (0.45, -0.5, -0.45)
  - Material: Brown Wood Material for all legs

- **Armrests**: Two wooden armrests, each 0.15 × 0.4 × 0.8
  - Right Armrest: Position at (0.575, 0.3, 0)
  - Left Armrest: Position at (-0.575, 0.3, 0)
  - Material: Brown Wood Material (same as legs and desk)

- **Headrest/Top Trim**: 1.1 × 0.1 × 0.15
  - Position: (0, 1.35, -0.45) on top of backrest
  - Material: Brown Wood Material (same as legs, desk, and armrests)

### Task 3: Environment (Realistic Floor)
- **Carpet Floor**: 100 × 100 plane geometry (larger for future assembly)
  - Base Color: Deep teal/green (0x004D40)
  - Pattern: Professional checkered carpet with subtle woven texture
  - Material Properties: Roughness 0.9, Metalness 0.0 (matte carpet)
  - Texture Repeat: 50×50 for professional appearance
  - Position: y = -0.9 (below chair legs for realistic grounding)

## Layout & Positioning

### Key Features:
1. **Complete Separation**: Desk and chair are completely isolated objects
2. **Four Chair Legs**: Chair has proper four distinct wooden legs
3. **Correct Rotation**: Chair rotated 180° (Math.PI) to face the desk
4. **Logical Positioning**: Chair positioned at (0, -0.3, 1.5) behind desk
5. **Wooden Armrests**: Two armrests positioned on either side of seat
6. **Headrest Trim**: Wooden trim piece on top of backrest
7. **Realistic Floor**: Professional checkered carpet with subtle woven pattern
8. **No Merging**: Components are visually and spatially distinct
9. **Clean Architecture**: AssemblyHall manages scene, ParliamentSeat is pure model

### Final Assembly:
- **Desk Group**: Positioned at (0, 0, 0)
- **Chair Group**: Positioned at (0, -0.3, 1.5) with 180° rotation
- **Floor**: Positioned at y = -0.9 for realistic grounding
- **Overall Unit**: Centered at world origin (0, 0, 0)

## Usage

### Basic Import
```jsx
import ParliamentSeat from './components/ParliamentSeat';

// Use in your scene
<ParliamentSeat />
```

### Assembly Hall Integration
```jsx
import AssemblyHall from './components/AssemblyHall';

// Use with view modes
<AssemblyHall viewMode="top" />     // Top-down view
<AssemblyHall viewMode="speaker" />  // Speaker's perspective
```

### Test Mode
Click the "Test Parliament Seat" button in the main app to view the component in isolation for inspection.

## Features
- **Distinct Objects**: Desk and chair are completely separate, not merged
- **Four Chair Legs**: Proper wooden legs at each corner
- **Wooden Armrests**: Two armrests for comfort and realism
- **Headrest Trim**: Wooden trim piece for professional finish
- **Correct Orientation**: Chair faces the desk (180° rotation)
- **Logical Layout**: Chair positioned behind desk with proper spacing
- **High-quality Materials**: Realistic wood, fabric, and screen textures
- **Modular Design**: Easy to duplicate and position in assembly layout
- **Realistic Environment**: Professional checkered carpet with subtle woven pattern
- **Clean Architecture**: Separation between scene management and 3D models
- **Professional Lighting**: Ambient and directional lighting with shadows
- **Camera Control**: Automatic positioning for different view modes

## Success Criteria ✅
- **Desk and chair are two clearly separate objects** - No merging or intersection
- **Chair has four visible brown wooden legs** - One at each corner
- **Chair seat and backrest are same green fabric color** - Consistent material
- **Chair has two wooden armrests** - One on each side
- **Chair has wooden headrest trim** - Professional finish on backrest
- **Chair is rotated 180° and positioned behind desk** - Logical furniture arrangement
- **Top-down view shows proper separation** - Chair behind desk, not inside or in front
- **Realistic carpet floor** - Professional checkered carpet with subtle woven pattern
- **Proper grounding** - Chair sits squarely on floor, not inside it
- **Clean code architecture** - AssemblyHall manages scene, ParliamentSeat is pure model
- **Professional lighting** - Ambient and directional lights with proper shadows
- **Ready for mass production** - Can be duplicated throughout assembly hall
