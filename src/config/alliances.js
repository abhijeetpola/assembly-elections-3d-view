// alliances.js
// ---------------------------------------------------------------------------
// Alliance + color configuration (POC assumptions for Bihar 2025 style demo)
// NOTE (Non-tech PM friendly): These colors are placeholders; they can be
// adjusted later. We treat each alliance as a single color block.
// ---------------------------------------------------------------------------

// Brighter, higher-luminance palette for clear visibility of small holograms
export const ALLIANCES = [
  { id: 'NDA', name: 'NDA', color: '#FFB347' },       // Light saffron
  { id: 'INDIA', name: 'INDIA Bloc', color: '#2ECC40' }, // Bright green
  { id: 'OTHERS', name: 'Others', color: '#B39DFF' }   // Soft lavender
];

export const UNDECLARED_COLOR = '#777777'; // Neutral gray (brightened for visibility)

// Lighter lead shade helper (simple linear blend to white)
export function lighterShade(hex, factor = 0.35) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const nr = Math.round(r + (255 - r) * factor);
  const ng = Math.round(g + (255 - g) * factor);
  const nb = Math.round(b + (255 - b) * factor);
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}
