# flexy.js — Optimization Notes

## A — Hot-path: constants computed inside the vertex loop

**A1. `referenceNormal` recomputed per vertex** (lines 75, 119, 156)
```js
// Inside the loop, every iteration:
const referenceNormal = orientation || new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion)...
```
`orientation` and `quaternion` are constant per `bend()` call. Move before the `for` loop.

**A2. `preserveDimensions` ratio constants recomputed per vertex** (lines 62-68, 106-111, 143-148)
```js
const geometryLength = geometryBB.max.x - geometryBB.min.x;
const lengthRatio = geometryLength / curveLength;
const startPointOnCurve = 0.5 - (lengthRatio / 2);
const endPointOnCurve = 0.5 + (lengthRatio / 2);
```
All four are pure functions of the bounding box. Move before the loop.

---

## B — Unnecessary object allocations in the hot path

**B1. `parseFloat()` on Float32Array** (lines 52-54, `wrap()` 289-291)
```js
const x = parseFloat(positions[i]);
```
`positions` is a `Float32Array` — reading it already returns a JS number. No-op.

**B2. `tangent.clone()` passed to `cross()` and `setFromAxisAngle()`** (lines 76, 79, 120, 123, 157, 160)
```js
referenceNormal.clone().cross(tangent.clone())
new THREE.Quaternion().setFromAxisAngle(tangent.clone(), ...)
```
Neither method mutates its argument. Both clones are wasted.

**B3. `new THREE.Vector3(0, y, z).length()` just for magnitude** (lines 85, 129, 166)
```js
orthogonal.clone().setLength(new THREE.Vector3(0, y, z).length());
```
Allocates a full Vector3 to compute a magnitude. Replace with `Math.hypot(y, z)`.

**B4. `tangentPoint.clone().add(displacement)`** (lines 95, 132, 169)
```js
const finalPosition = tangentPoint.clone().add(displacement);
```
`getPointAt()` returns a fresh Vector3 — no need to clone it again.

---

## C — Bugs in `calculateBoundingBox` (not production-visible today)

**C1.** Lines 18-22: `positionAttribute[i]` reads from a BufferAttribute object, not its `.array` → always `undefined` → center accumulates NaN. Use `vertex.x/y/z` instead.

**C2.** Line 25: `divideScalar(positionAttribute.count / 3)` divides by count-of-triangles, not count-of-vertices → center is 3× too large. Should be `divideScalar(positionAttribute.count)`.

Both bugs are harmless in production (center is only referenced in commented-out debug lines).

---

## D — `getPointToFaceNormalMap`: redundant array generation

**D1. `interpolatePoints` called N+1 times, generating full arrays** (lines 207-208)
```js
for (let i = 0; i <= resolution; i++) {
    const pStart = interpolatePoints(THREE, A, D, resolution)[i];  // O(N) array, use index i
    const pEnd   = interpolatePoints(THREE, B, C, resolution)[i];  // O(N) array, use index i
```
O(N²) wasted allocations. Pre-compute both arrays once before the loop.

**D2. `direction.normalize()` inside inner `forEach`** (line 212)
Mutates in place and runs once per grid point. Call once before the loops.

---

## Summary

| # | Location | Category | Impact |
|---|---|---|---|
| A1 | `bend()` loop | Constant hoisting | Medium |
| A2 | `bend()` loop | Constant hoisting | Low |
| B1 | `bend()` + `wrap()` | Remove `parseFloat` | Low |
| B2 | `bend()` loop | Remove 2× `tangent.clone()` | Low–Medium |
| B3 | `bend()` loop | Replace temp Vector3 with `Math.hypot` | Low–Medium |
| B4 | `bend()` loop | Remove `tangentPoint.clone()` | Low |
| C1–C2 | `calculateBoundingBox` | Fix center calc bugs | None in production |
| D1 | `getPointToFaceNormalMap` | Pre-compute interpolated arrays | **High** |
| D2 | `getPointToFaceNormalMap` | Hoist `normalize()` | Low |
