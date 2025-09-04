// seatBlocks.cjs (CommonJS version for Node scripts)
const SEAT_BLOCKS = {
	INDIA: [
		...Array.from({ length: 50 }, (_, i) => i),
		...Array.from({ length: 50 }, (_, i) => 50 + i),
		...Array.from({ length: 21 }, (_, i) => 122 + i)
	],
	NDA: [
		...Array.from({ length: 22 }, (_, i) => 100 + i),
		...Array.from({ length: 50 }, (_, i) => 143 + i),
		...Array.from({ length: 50 }, (_, i) => 193 + i)
	],
	OTHERS: []
};

const TOTAL_SEATS = 243;

module.exports = { SEAT_BLOCKS, TOTAL_SEATS };
