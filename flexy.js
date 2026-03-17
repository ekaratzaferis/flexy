/**
 * Calculates the bounding box of a BufferGeometry.
 * @param {Library} THREE The imported THREE instance.
 * @param {BufferGeometry} bufferGeometry
 * @returns {Box3} The calculated bounding box (with an extra `.center` Vector3 property)
 */
function calculateBoundingBox(THREE, bufferGeometry) {
    const positionAttribute = bufferGeometry.getAttribute('position');
    const boundingBox = new THREE.Box3();

    boundingBox.center = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);
        boundingBox.expandByPoint(vertex);

        // C1: use vertex (already read above) instead of positionAttribute[i] which is a BufferAttribute, not an array
        boundingBox.center.add(vertex);
    }

    // C2: divide by vertex count, not positionAttribute.count / 3 (which equals triangle count)
    boundingBox.center.divideScalar(positionAttribute.count);

    return boundingBox;
}

/**
 * Bends & positions the given geometry along a CubicBezierCurve3.
 * @param {Object} options
 * @param {Library} options.THREE The THREE instance from your app.
 * @param {CubicBezierCurve3} options.curve The curve to bend the geometry along.
 * @param {Quaternion} [options.quaternion] Overall orientation of the curve as a quaternion.
 * @param {Vector3} [options.orientation] Alternatively, a vector perpendicular to the curve's plane.
 * @param {'fit'|'preserve'|'tile'} [options.mode='fit'] How geometry length relates to curve length.
 *   - 'fit': geometry is scaled to exactly fill the curve (stretch or compress).
 *   - 'preserve': geometry keeps its world-space length; centered on the curve via orbit.
 *              t is clamped to [0,1] — geometry never exceeds the curve bounds.
 *   - 'tile': geometry keeps its world-space length; t wraps with modulo so the curve
 *              pattern repeats when the geometry is longer than the curve.
 * @param {number} [options.orbit=0] Fractional offset along the curve.
 *   In 'preserve': shifts from the centered position (0.5 = move to end, -0.5 = move to start).
 *   In 'tile': shifts the starting position (0..1 = one full curve length).
 *   Has no effect in 'fit' mode.
 * @param {BufferGeometry} options.bufferGeometry The geometry to bend.
 * @param {String} options.axis Which axis to bend along ('x', 'y', or 'z').
 */
export const bend = function({
    THREE, curve, quaternion, orientation, bufferGeometry, axis, mode = 'fit', orbit = 0, scene
}) {

    const geometryBB = calculateBoundingBox(THREE, bufferGeometry);
    const positions = bufferGeometry.attributes.position.array;

    // referenceNormal is constant across all vertices — compute once before the loop.
    // x-axis bends use (0,0,1) as the default up-vector; y and z use (1,0,0).
    const defaultNormalDir = axis === 'x' ?
        new THREE.Vector3(0, 0, 1) :
        new THREE.Vector3(1, 0, 0);
    const referenceNormal = orientation || defaultNormalDir.applyQuaternion(quaternion).normalize().multiplyScalar(1000000);

    const axisMin = geometryBB.min[axis];
    const geometryLength = geometryBB.max[axis] - axisMin;

    // curveLen is only needed for preserve/tile — skip the expensive arc-length walk for 'fit'.
    const curveLen = (mode === 'preserve' || mode === 'tile') ? getCurveLength(curve) : 0;

    // preserve: precompute the t value of the geometry's left edge so it sits centered on the curve.
    const preserveStart = mode === 'preserve' ? 0.5 - (geometryLength / curveLen) / 2 + orbit : 0;

    for (let i = 0; i < positions.length; i += 3) {

        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        // Map the vertex's position along the elongation axis to a curve parameter t.
        const axisVal = axis === 'x' ? x : axis === 'y' ? y : z;
        let t;

        if (mode === 'fit') {
            // Scale geometry to exactly fill the curve — t always spans [0, 1].
            t = (axisVal - axisMin) / geometryLength;
        } else if (mode === 'preserve') {
            // Geometry keeps its world-space length, centered on the curve.
            // Clamped to [0, 1]: geometry never bends past the curve endpoints.
            t = preserveStart + (axisVal - axisMin) / curveLen;
            t = Math.max(0, Math.min(1, t));
        } else {
            // tile: geometry keeps its world-space length; the curve pattern repeats.
            t = orbit + (axisVal - axisMin) / curveLen;
            t = ((t % 1) + 1) % 1;
        }

        if (axis === 'x') {

            const tangentPoint = curve.getPointAt(t);
            const tangent = curve.getTangent(t);
            const orthogonal = referenceNormal.clone().cross(tangent).normalize();
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent, Math.atan2(z, y));
            orthogonal.applyQuaternion(rotationQuaternion);
            const displacement = orthogonal.clone().setLength(Math.hypot(y, z));
            tangentPoint.add(displacement);
            positions[i] = tangentPoint.x;
            positions[i + 1] = tangentPoint.y;
            positions[i + 2] = tangentPoint.z;

        } else if (axis === 'z') {

            const tangentPoint = curve.getPointAt(t);
            const tangent = curve.getTangent(t);
            const orthogonal = referenceNormal.clone().cross(tangent).normalize();
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent, Math.atan2(y, x) + Math.PI / 2);
            orthogonal.applyQuaternion(rotationQuaternion);
            const displacement = orthogonal.clone().setLength(Math.hypot(x, y));
            tangentPoint.add(displacement);
            positions[i] = tangentPoint.x;
            positions[i + 1] = tangentPoint.y;
            positions[i + 2] = tangentPoint.z;

        } else if (axis === 'y') {

            const tangentPoint = curve.getPointAt(t);
            const tangent = curve.getTangent(t);
            const orthogonal = referenceNormal.clone().cross(tangent).normalize();
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent, Math.atan2(x, z));
            orthogonal.applyQuaternion(rotationQuaternion);
            const displacement = orthogonal.clone().setLength(Math.hypot(x, z));
            tangentPoint.add(displacement);
            positions[i] = tangentPoint.x;
            positions[i + 1] = tangentPoint.y;
            positions[i + 2] = tangentPoint.z;
        }
    }

    bufferGeometry.attributes.position.needsUpdate = true;
};

/**
 * Generates a point-to-face-normal map by raycasting from a rectangular region onto a surface mesh.
 * Each grid point on the rectangle is mapped to the face normal and intersection point on the surface.
 * @param {Object} options
 * @param {Library} options.THREE The THREE instance from your app.
 * @param {Mesh} options.surface The target mesh with face normals.
 * @param {Object} options.castingRectangular The rectangle from which rays are cast.
 * @param {Vector3} options.castingRectangular.A Top-left corner.
 * @param {Vector3} options.castingRectangular.B Top-right corner.
 * @param {Vector3} options.castingRectangular.C Bottom-right corner.
 * @param {Vector3} options.castingRectangular.D Bottom-left corner.
 * @param {Vector3} options.castingRectangular.direction Ray direction toward the surface.
 * @param {Number} options.resolution Number of grid divisions along each side.
 */
export const getPointToFaceNormalMap = function({
    THREE, surface, castingRectangular, resolution, scene
}) {

    const map = {};

    // drawVector(THREE, scene, castingRectangular.A, castingRectangular.B, '#f0f');
    // drawVector(THREE, scene, castingRectangular.B, castingRectangular.C, '#f0f');
    // drawVector(THREE, scene, castingRectangular.C, castingRectangular.D, '#f0f');
    // drawVector(THREE, scene, castingRectangular.D, castingRectangular.A, '#f0f');

    // D2: normalize direction once — it's constant across all grid points
    castingRectangular.direction.normalize();

    // D1: pre-compute boundary columns — previously these full arrays were regenerated on every outer iteration
    const colStarts = interpolatePoints(THREE, castingRectangular.A, castingRectangular.D, resolution);
    const colEnds = interpolatePoints(THREE, castingRectangular.B, castingRectangular.C, resolution);

    for (let i = 0; i <= resolution; i++) {
        const pointsLine = interpolatePoints(THREE, colStarts[i], colEnds[i], resolution);

        pointsLine.forEach(point => {
            const raycaster = new THREE.Raycaster(point, castingRectangular.direction);
            const intersects = raycaster.intersectObject(surface);

            // drawVector(THREE, scene, point.clone(), point.clone().add(castingRectangular.direction.clone().normalize()), '#f0f');

            if (intersects.length > 0) {
                map[hashFunction(point.x, point.y, point.z, resolution)] = {
                    normal: {
                        x: intersects[0].face.normal.x,
                        y: intersects[0].face.normal.y,
                        z: intersects[0].face.normal.z
                    },
                    point: {
                        x: intersects[0].point.x,
                        y: intersects[0].point.y,
                        z: intersects[0].point.z
                    }
                };

                // drawVector(THREE, scene, point.clone(), intersects[0].point, '#00f');
                // drawVector(THREE, scene, intersects[0].point, intersects[0].point.clone().add(intersects[0].face.normal), '#0f0');
            }
        });
    }

    return {
        data: map,
        castingRectangular: {
            A: {
                x: castingRectangular.A.x,
                y: castingRectangular.A.y,
                z: castingRectangular.A.z
            },
            B: {
                x: castingRectangular.B.x,
                y: castingRectangular.B.y,
                z: castingRectangular.B.z
            },
            C: {
                x: castingRectangular.C.x,
                y: castingRectangular.C.y,
                z: castingRectangular.C.z
            },
            D: {
                x: castingRectangular.D.x,
                y: castingRectangular.D.y,
                z: castingRectangular.D.z
            },
            direction: {
                x: castingRectangular.direction.x,
                y: castingRectangular.direction.y,
                z: castingRectangular.direction.z
            }
        },
        resolution
    };
};

/**
 * Wraps an object's geometry onto a curved surface using a pre-built point-to-face-normal map.
 * @param {Object} options
 * @param {Library} options.THREE The THREE instance from your app.
 * @param {Object} options.pointToFaceNormalMap Output from getPointToFaceNormalMap.
 * @param {Object3D} options.obj The object whose geometry will be wrapped.
 */
export const wrap = function({
    THREE, pointToFaceNormalMap, obj, scene
}) {

    // Build the plane defined by the casting rectangle
    const rect = pointToFaceNormalMap.castingRectangular;
    const A = new THREE.Vector3(rect.A.x, rect.A.y, rect.A.z);
    const B = new THREE.Vector3(rect.B.x, rect.B.y, rect.B.z);
    const C = new THREE.Vector3(rect.C.x, rect.C.y, rect.C.z);

    const vector1 = new THREE.Vector3().subVectors(B, A);
    const vector2 = new THREE.Vector3().subVectors(C, A);
    const normal = new THREE.Vector3().crossVectors(vector1, vector2).normalize();
    const castingRectangularPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, A);

    // drawPlane(THREE, castingRectangularPlane, B, scene);

    // Precompute inverse world matrix once — converts world-space intersection
    // points back into the object's local space.
    const matrixWorldInverse = obj.matrixWorld.clone().invert();

    const positions = obj.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        // Transform local vertex to world space
        const point = new THREE.Vector3(x, y, z).applyMatrix4(obj.matrixWorld);

        // Project each vertex perpendicularly onto the casting rectangle's plane
        const dotProduct = point.clone().sub(A).dot(castingRectangularPlane.normal);
        const projection = castingRectangularPlane.normal.clone().multiplyScalar(dotProduct / castingRectangularPlane.normal.lengthSq());
        const projectedPoint = point.clone().sub(projection);

        // Look up the recorded intersection point at the projected position
        const key = hashFunction(projectedPoint.x, projectedPoint.y, projectedPoint.z, pointToFaceNormalMap.resolution);
        const coords = pointToFaceNormalMap.data[key];

        // Vertex descends along the ray direction:
        //   hit  → stop at the surface intersection Y
        //   miss → reach the floor (y = 0)
        const targetY = coords ? coords.point.y : 0;

        // Reconstruct the new world-space position: same XZ as the projected
        // point, but displaced to targetY, then convert back to local space.
        const newWorldPos = new THREE.Vector3(projectedPoint.x, targetY, projectedPoint.z);
        newWorldPos.applyMatrix4(matrixWorldInverse);

        positions[i] = newWorldPos.x;
        positions[i + 1] = newWorldPos.y;
        positions[i + 2] = newWorldPos.z;
    }

    obj.geometry.attributes.position.needsUpdate = true;

};

/**
 * Applies a Gaussian shear deformation to a geometry along a given elongation axis.
 * The shear intensity follows a bell curve centered at the midpoint of the geometry.
 * @param {Object} options
 * @param {Library} options.THREE The THREE instance from your app.
 * @param {BufferGeometry} options.bufferGeometry The geometry to deform.
 * @param {String} [options.axis='x'] The elongation axis ('x'|'y'|'z').
 * @param {String} [options.shearAxis='z'] The displacement axis ('x'|'y'|'z') — must differ from axis.
 * @param {Number} options.amplitude Maximum displacement at the center.
 * @param {Number} [options.sigma] Gaussian spread in world units; defaults to geometryLength / 4.
 */
export const shear = function({
    THREE, bufferGeometry, axis = 'x', shearAxis = 'z', amplitude, sigma
}) {
    const bb = calculateBoundingBox(THREE, bufferGeometry);
    const axisCenter = (bb.max[axis] + bb.min[axis]) / 2;
    const halfExtent = (bb.max[shearAxis] - bb.min[shearAxis]) / 2;
    const geometryLength = bb.max[axis] - bb.min[axis];
    const s = sigma !== undefined ? sigma : geometryLength / 4;

    const positions = bufferGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        const axisVal = axis === 'x' ? x : axis === 'y' ? y : z;
        const shearVal = shearAxis === 'x' ? x : shearAxis === 'y' ? y : z;

        const dx = axisVal - axisCenter;
        const G = Math.exp(-(dx * dx) / (2 * s * s));
        const displacement = halfExtent !== 0 ? amplitude * G * (shearVal / halfExtent) : 0;

        if (shearAxis === 'x') {
            positions[i] += displacement;
        } else if (shearAxis === 'y') {
            positions[i + 1] += displacement;
        } else {
            positions[i + 2] += displacement;
        }
    }

    bufferGeometry.attributes.position.needsUpdate = true;
};

/**
 * Applies an arbitrary scalar displacement to vertices selected by a predicate.
 * @param {Object} options
 * @param {Library} options.THREE The THREE instance from your app.
 * @param {BufferGeometry} options.bufferGeometry The geometry to deform.
 * @param {String} [options.axis='y'] The displacement axis ('x'|'y'|'z').
 * @param {Function} options.predicate (x, y, z) => boolean — which vertices to affect.
 * @param {Function} options.fn (u, v) => number — displacement amount.
 *   axis='y' → fn(x, z), axis='x' → fn(y, z), axis='z' → fn(x, y)
 */
export const wave = function({
    THREE, bufferGeometry, axis = 'y', predicate, fn
}) {
    const positions = bufferGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        if (!predicate(x, y, z)) continue;

        let u;
        let v;
        if (axis === 'x') {
            u = y;
            v = z;
        } else if (axis === 'y') {
            u = x;
            v = z;
        } else {
            u = x;
            v = y;
        }

        const displacement = fn(u, v);

        if (axis === 'x') {
            positions[i] += displacement;
        } else if (axis === 'y') {
            positions[i + 1] += displacement;
        } else {
            positions[i + 2] += displacement;
        }
    }

    bufferGeometry.attributes.position.needsUpdate = true;
};

// ── Utilities ────────────────────────────────────────────────────────────────

function hashFunction(x, y, z, resolution) {

    function roundToNearest(value, step) {
        return Math.round(value / step) * step;
    }

    function removeNegativeZero(n) {
        if (n === '-0.0') return '0.0';
        else return n;
    }

    const step = 1 / resolution;
    const roundedX = removeNegativeZero(roundToNearest(x, step).toFixed(1));
    const roundedY = removeNegativeZero(roundToNearest(y, step).toFixed(1));
    const roundedZ = removeNegativeZero(roundToNearest(z, step).toFixed(1));
    return `${roundedX}^${roundedY}^${roundedZ}`;
}

function interpolatePoints(THREE, p1, p2, divisions) {
    const points = [];
    for (let i = 0; i <= divisions; i++) {
        const point = new THREE.Vector3(
            p1.x + (p2.x - p1.x) * (i / divisions),
            p1.y + (p2.y - p1.y) * (i / divisions),
            p1.z + (p2.z - p1.z) * (i / divisions)
        );
        points.push(point);
    }
    return points;
}

function getCurveLength(curve) {
    const steps = 100; // more steps = more accurate length estimate
    let curveLength = 0;
    let lastPoint = curve.getPointAt(0);

    for (let i = 1; i <= steps; i++) {
        const point = curve.getPointAt(i / steps);
        curveLength += point.distanceTo(lastPoint);
        lastPoint = point;
    }

    return curveLength;
}

// ── Debug helpers (kept for development use) ─────────────────────────────────

// eslint-disable-next-line no-unused-vars
function drawVector(THREE, scene, startPoint = {
    x: 0,
    y: 0,
    z: 0
}, endPoint, color) {
    // Create a geometry for the vector line
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(2 * 3); // Two points, each with x, y, and z coordinates

    // Set the positions of the two points
    positions[0] = startPoint.x;
    positions[1] = startPoint.y;
    positions[2] = startPoint.z;
    positions[3] = endPoint.x;
    positions[4] = endPoint.y;
    positions[5] = endPoint.z;

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create a material with the specified color
    const material = new THREE.LineBasicMaterial({ color: color });

    // Create the line using the geometry and material
    const line = new THREE.Line(geometry, material);

    // Add the line to the scene
    scene.add(line);

    return line; // Return the line object in case you want to manipulate it later
}

// eslint-disable-next-line no-unused-vars
function drawPlane(THREE, plane, coplanarPoint, scene) {
    const size = 40; // The size of the plane that will be visible

    // Create a PlaneGeometry
    const planeGeometry = new THREE.PlaneGeometry(size, size);

    // Create a mesh with a basic material
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // Align the geometry with the plane normal
    // The plane's normal and constant (coplanar point) are used to position and orient the mesh
    plane.coplanarPoint(coplanarPoint);
    const focalPoint = new THREE.Vector3().addVectors(coplanarPoint, plane.normal);
    planeMesh.lookAt(focalPoint);

    // Position the mesh to lie on the coplanar point
    planeMesh.position.copy(coplanarPoint);

    // Add the mesh to the scene
    scene.add(planeMesh);
}