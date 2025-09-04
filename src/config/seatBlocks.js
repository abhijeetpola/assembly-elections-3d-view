// seatBlocks.js
// Centralized seat index allocation for alliances.
// CRITICAL: Must stay in sync with push order in AssemblyLayout (documented there).
// Current push order:
//   S1(50) -> S2(50) -> C-R(22) -> C-L(21) -> S5(50) -> S6(50) = 243
// Strategy (2025 prototype):
//   INDIA  : S1, S2, C-L (total 50 + 50 + 21 = 121 seats)
//   NDA    : C-R, S5, S6 (22 + 50 + 50 = 122 seats)
//   OTHERS : (none yet; will allocate later if needed)
// SAFEGUARD: If seat counts change or ordering is refactored, update BOTH this
// file and the explanatory block comment in AssemblyLayout.
export const SEAT_BLOCKS = {
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

export const TOTAL_SEATS = 243;
