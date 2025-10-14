// Camera configuration constants extracted from EnhancedCameraControls
// Pure constants; no side effects.
export const POLAR_MIN = 0.45;            // ~25.8°
export const POLAR_MAX = 1.15;            // ~65.9°
export const AZIMUTH_MIN = -1.83;         // ~ -105°
export const AZIMUTH_MAX = 1.83;          // ~ +105°
export const MIN_DISTANCE = 0.5;
export const SOFT_FLOOR = 0.6;
export const SIDE_OFFSET = 0.12;
export const CLOSE_TOGGLE_DISTANCE = 5;
export const FOCUS_DISTANCE = 6;

// Camera boundaries (keep camera inside parliament chamber)
export const CAMERA_BOUNDARIES = {
  // Backstage wall (northern boundary - can't go behind teal panel)
  MAX_BACK_Z: -14,  // Teal panel front face at Z=-14m
  
  // Perimeter wall (semicircular boundary around assembly)
  PERIMETER_RADIUS: 54.5,  // Floor edge radius
  PERIMETER_CENTER: { x: 0, y: 0, z: 10 },  // Assembly center point
  
  // Vertical limits
  MIN_HEIGHT: 1.0,   // 1m above ground (safety clearance)
  MAX_HEIGHT: 20.0,  // Ceiling height (matches backstage wall)
};
