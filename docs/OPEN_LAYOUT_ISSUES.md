# Open Layout & Modeling Issues

Last Updated: 2025-08-31

Legend: ❌ Open • ⚠️ Constraint • ✅ Resolved (future)

| ID | Title | Status | Impact | Next Step Hint |
|----|-------|--------|--------|----------------|
| 1 | Walkway 3 (Center Aisle) Visibility | ❌ | Center aisle not consistently accessible | Review inner row generation; ensure aisle clearance logic applied to rows 1–3 |
| 2 | Parallel Seat Alignment in Walkways | ❌ | Spacing / visual precision degraded | Compare angular offsets across adjacent rows; enforce shared radial angle for seats bordering walkway |
| 3 | Slope 1 & 6 Edge Alignment | ❌ | Visual asymmetry at chamber extremes | Normalize starting/ending spoke edge angles to podium (0°) before seat placement |
| 4 | Chair Overhang on Benches | ❌ | Floating / clipping perception | Increase bench depth or shift seat pivot forward; verify bounding boxes |
| 5 | Bench Grounding Issue | ❌ | Height mismatch benches vs chairs | Extend bench geometry downward (do not lower top surface) |
| 6 | Speaker Chair Grounding | ❌ | Floating speaker chair | Lower chair Y or raise platform mesh; align bases |
| 7 | Hologram Presence Refinements | ❌ | Visual polish / readability | Future: adjust torso proportions, optional subtle animation, per-party color states |

---

## Detailed Descriptions (Original Notes)

1. **Walkway 3 (Center Aisle) Visibility**  
   - ❌ **Problem**: Only shows in rows 6, 5, 4  
   - ❌ **Missing**: Walkway 3 in rows 3, 2, 1 (inner rows)  
   - **Impact**: Center aisle not consistently accessible

2. **Parallel Seat Alignment in Walkways**  
   - ❌ **Problem**: Seats in adjacent rows not perfectly parallel  
   - ❌ **Expected**: Stick test should work - same angle through walkway  
   - **Impact**: Fan-out/spacing logic broken

3. **Slope 1 & 6 Edge Alignment**  
   - ❌ **Problem**: Starting/ending edges not parallel to podium (0-degree line)  
   - ❌ **Expected**: Inner bench endpoints should form straight line  
   - **Impact**: Visual inconsistency and asymmetry

4. **Chair Overhang on Benches**  
   - ❌ **Problem**: Seats extending beyond bench boundaries in slopes 1 & 6  
   - **Impact**: Chairs appear to float or extend beyond seating area

5. **Bench Grounding Issue**  
   - ❌ **Problem**: Benches not grounded at same level as chairs in each row  
   - ⚠️ **Constraint**: DO NOT pull benches down - extend them lower  
   - **Impact**: Height misalignment between chairs and benches

6. **Speaker Chair Grounding**  
   - ❌ **Problem**: Speaker chair floating in air instead of grounded  
   - **Expected**: Should be grounded at same level as speaker podium

7. **Hologram Presence Refinements**  
   - ❌ **Problem**: Initial neutral holograms lack party coloring / fine-tuned sizing  
   - **Future Enhancements**: per-party color, gain/lead pulse styles, optional breathing animation, crisper silhouette proportions  
   - **Impact**: Improves clarity for live election storytelling

---

## Notes
- This file will evolve as fixes are planned / implemented.
- Add implementation notes & mini diagrams (ASCII) when geometry adjustments begin.
- Keep changes small & documented inline in component files.

