// alliances.cjs (CommonJS version for Node scripts)
const ALLIANCES = [
	{ id: 'NDA', name: 'NDA', color: '#FFB347' },
	{ id: 'INDIA', name: 'INDIA Bloc', color: '#2ECC40' },
	{ id: 'OTHERS', name: 'Others', color: '#B39DFF' }
];

const UNDECLARED_COLOR = '#777777';

function lighterShade(hex, factor = 0.35) {
	const h = hex.replace('#', '');
	const r = parseInt(h.substring(0, 2), 16);
	const g = parseInt(h.substring(2, 4), 16);
	const b = parseInt(h.substring(4, 6), 16);
	const nr = Math.round(r + (255 - r) * factor);
	const ng = Math.round(g + (255 - g) * factor);
	const nb = Math.round(b + (255 - b) * factor);
	return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

module.exports = { ALLIANCES, UNDECLARED_COLOR, lighterShade };
