# flexy-bend

A Three.js library that bends `BufferGeometry` along Bezier curves.

## Demo

[Try the interactive demo →](https://ekaratzaferis.github.io/flexy/demo/)

## Install

```
npm install flexy-bend
```

## Usage

```js
import * as flexy from 'flexy-bend';
import * as THREE from 'three';

const R = 3;
const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(R, 0, 0),
    new THREE.Vector3(R, R * 0.55, 0),
    new THREE.Vector3(R * 0.45, R, 0),
    new THREE.Vector3(0, R, 0)
);

// A vector perpendicular to the plane the curve lies on.
// For a curve in the XY plane, this is the Z axis.
const orientation = new THREE.Vector3(0, 0, 1);

flexy.bend({
    THREE,
    curve,
    orientation,
    bufferGeometry: mesh.geometry,
    axis: 'x', // the axis the geometry is elongated along
});
```

## API

### `bend(options)`

Bends a `BufferGeometry` along a `CubicBezierCurve3`.

| Option | Type | Required | Description |
|---|---|---|---|
| `THREE` | Library | ✓ | Your THREE.js instance |
| `curve` | `CubicBezierCurve3` | ✓ | The curve to bend along |
| `bufferGeometry` | `BufferGeometry` | ✓ | The geometry to deform |
| `axis` | `'x' \| 'y' \| 'z'` | ✓ | The axis the geometry is elongated along |
| `orientation` | `Vector3` | | A vector perpendicular to the curve's plane |
| `quaternion` | `Quaternion` | | Alternative to `orientation` |
| `preserveDimensions` | `boolean` | | If `true`, the geometry keeps its original arc-length instead of stretching to fill the whole curve. Defaults to `false`. |

### `getPointToFaceNormalMap(options)`

Raycasts a uniform grid from a rectangular region onto a mesh surface, returning a hashmap from grid points to `{ normal, point }` pairs on the surface. Used as input for `wrap()`.

### `wrap(options)`

Conforms a geometry to a curved surface by looking up the face normal at each vertex's projected position and rotating the vertex to align with it.

---

## How it works

### 1. Start with a box geometry

![plot](./img/geometry.png)

### 2. Define a curve to bend along

![plot](./img/curve.png)

### 3. Normalize each vertex along the bend axis

Each coordinate on the bend axis is mapped to a parameter `t ∈ [0, 1]` on the curve. The leftmost vertices map to `t = 0`, the rightmost to `t = 1`.

### 4. Sample tangent lines at each parameter

![plot](./img/tangents.png)

### 5. Compute orthogonal vectors

For each tangent, compute a perpendicular vector (shown in purple) using the cross product with the reference normal.

![plot](./img/orthogonals.png)

### 6. Rotate to match the original cross-section angle

The orthogonal is rotated around the tangent axis by the angle `atan2(z, y)` — the angle the original vertex makes in the cross-section plane.

![plot](./img/rotation1.png)

The resulting rotated vectors:

![plot](./img/rotation2.png)

### 7. Scale to the original cross-section distance

Each rotated vector is scaled to match the original vertex's distance from the bend axis.

![plot](./img/final%20position.png)

### 8. Final result

The new vertex position is `curvePoint(t) + scaledOrthogonal`.

![plot](./img/bent%20geometry.png)

The relationship between the curve and the bent geometry:

![plot](./img/bend%20geometry%20wireframe.png)

---

## Development

```
npm run dev      # start dev server at localhost:5151
npm run build    # build the library (dist/) and demo site (docs/)
```
