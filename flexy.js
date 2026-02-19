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

        const x = positionAttribute[i];
        const y = positionAttribute[i + 1];
        const z = positionAttribute[i + 2];

        boundingBox.center.add(new THREE.Vector3(x, y, z));
    }

    boundingBox.center.divideScalar(positionAttribute.count / 3);

    return boundingBox;
}

/**
 * Bends & positions the given geometry along a CubicBezierCurve3.
 * @param {Object} options
 * @param {Library} options.THREE The THREE instance from your app.
 * @param {CubicBezierCurve3} options.curve The curve to bend the geometry along.
 * @param {Quaternion} [options.quaternion] Overall orientation of the curve as a quaternion.
 * @param {Vector3} [options.orientation] Alternatively, a vector perpendicular to the curve's plane.
 * @param {boolean} [options.preserveDimensions] If true, the geometry is not stretched to fill the full curve length. Defaults to false.
 * @param {BufferGeometry} options.bufferGeometry The geometry to bend.
 * @param {String} options.axis Which axis to bend along ('x', 'y', or 'z').
 */
export const bend = function({
    THREE, curve, quaternion, orientation, bufferGeometry, axis, preserveDimensions = false, scene
}) {

    const geometryBB = calculateBoundingBox(THREE, bufferGeometry);
    const curveLength = preserveDimensions ? getCurveLength(curve) : 0;
    const positions = bufferGeometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {

        const x = parseFloat(positions[i]);
        const y = parseFloat(positions[i + 1]);
        const z = parseFloat(positions[i + 2]);

        if (axis === 'x') {

            // Normalize x to 0..1 along the geometry's span
            let howFarAlongInTheGeometry = (x - geometryBB.min.x) / (geometryBB.max.x - geometryBB.min.x);

            // Preserve the geometry's arc-length ratio relative to the full curve
            const geometryLength = geometryBB.max.x - geometryBB.min.x;
            if (preserveDimensions && geometryLength <= curveLength) {
                const lengthRatio = geometryLength / curveLength;
                const startPointOnCurve = 0.5 - (lengthRatio / 2);
                const endPointOnCurve = 0.5 + (lengthRatio / 2);
                howFarAlongInTheGeometry = startPointOnCurve + (howFarAlongInTheGeometry * (endPointOnCurve - startPointOnCurve));
            }

            // Sample position and tangent on the curve at the normalized parameter
            const tangentPoint = curve.getPointAt(howFarAlongInTheGeometry);
            const tangent = curve.getTangent(howFarAlongInTheGeometry);

            // Compute a vector orthogonal to the tangent using the reference normal
            const referenceNormal = orientation || new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangent.clone()).normalize();

            // Rotate the orthogonal to match the angular offset of this vertex in the YZ cross-section
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent.clone(), Math.atan2(z, y));

            // Apply the rotation
            orthogonal.applyQuaternion(rotationQuaternion);

            // Scale the rotated orthogonal to the original YZ distance of the vertex
            const displacement = orthogonal.clone().setLength(new THREE.Vector3(0, y, z).length());

            if (i > 0) {
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(tangent), '#fff');
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(referenceNormal), y >= geometryBB.center.y ? '#0ff' : '#F0f');
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(orthogonal), y >= geometryBB.center.y ? '#0ff' : '#F0f');
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(displacement), y >= geometryBB.center.y ? '#0ff' : '#F0f');
            }

            // Place the vertex at the curve point plus the displaced offset
            const finalPosition = tangentPoint.clone().add(displacement);
            positions[i] = finalPosition.x;
            positions[i + 1] = finalPosition.y;
            positions[i + 2] = finalPosition.z;

        } else if (axis === 'z') {

            // Normalize z to 0..1 along the geometry's span
            let howFarAlongInTheGeometry = (z - geometryBB.min.z) / (geometryBB.max.z - geometryBB.min.z);

            // Preserve the geometry's arc-length ratio relative to the full curve
            const geometryLength = geometryBB.max.z - geometryBB.min.z;
            if (preserveDimensions && geometryLength <= curveLength) {
                const lengthRatio = geometryLength / curveLength;
                const startPointOnCurve = 0.5 - (lengthRatio / 2);
                const endPointOnCurve = 0.5 + (lengthRatio / 2);
                howFarAlongInTheGeometry = startPointOnCurve + (howFarAlongInTheGeometry * (endPointOnCurve - startPointOnCurve));
            }

            // Sample position and tangent on the curve at the normalized parameter
            const tangentPoint = curve.getPointAt(howFarAlongInTheGeometry);
            const tangent = curve.getTangent(howFarAlongInTheGeometry);

            // Compute a vector orthogonal to the tangent using the reference normal
            const referenceNormal = orientation || new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangent.clone()).normalize();

            // Rotate the orthogonal to match the angular offset of this vertex in the XY cross-section
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent.clone(), Math.atan2(y, x) + Math.PI / 2);

            // Apply the rotation
            orthogonal.applyQuaternion(rotationQuaternion);

            // Scale the rotated orthogonal to the original XY distance of the vertex
            const displacement = orthogonal.clone().setLength(new THREE.Vector3(x, y, 0).length());

            // Place the vertex at the curve point plus the displaced offset
            const finalPosition = tangentPoint.clone().add(displacement);
            positions[i] = finalPosition.x;
            positions[i + 1] = finalPosition.y;
            positions[i + 2] = finalPosition.z;

        } else if (axis === 'y') {

            // Normalize y to 0..1 along the geometry's span
            let howFarAlongInTheGeometry = (y - geometryBB.min.y) / (geometryBB.max.y - geometryBB.min.y);

            // Preserve the geometry's arc-length ratio relative to the full curve
            const geometryLength = geometryBB.max.y - geometryBB.min.y;
            if (preserveDimensions && geometryLength <= curveLength) {
                const lengthRatio = geometryLength / curveLength;
                const startPointOnCurve = 0.5 - (lengthRatio / 2);
                const endPointOnCurve = 0.5 + (lengthRatio / 2);
                howFarAlongInTheGeometry = startPointOnCurve + (howFarAlongInTheGeometry * (endPointOnCurve - startPointOnCurve));
            }

            // Sample position and tangent on the curve at the normalized parameter
            const tangentPoint = curve.getPointAt(howFarAlongInTheGeometry);
            const tangent = curve.getTangent(howFarAlongInTheGeometry);

            // Compute a vector orthogonal to the tangent using the reference normal
            const referenceNormal = orientation || new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangent.clone()).normalize();

            // Rotate the orthogonal to match the angular offset of this vertex in the XZ cross-section
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent.clone(), Math.atan2(x, z));

            // Apply the rotation
            orthogonal.applyQuaternion(rotationQuaternion);

            // Scale the rotated orthogonal to the original XZ distance of the vertex
            const displacement = orthogonal.clone().setLength(new THREE.Vector3(x, 0, z).length());

            // Place the vertex at the curve point plus the displaced offset
            const finalPosition = tangentPoint.clone().add(displacement);
            positions[i] = finalPosition.x;
            positions[i + 1] = finalPosition.y;
            positions[i + 2] = finalPosition.z;
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

    for (let i = 0; i <= resolution; i++) {
        const pStart = interpolatePoints(THREE, castingRectangular.A, castingRectangular.D, resolution)[i];
        const pEnd = interpolatePoints(THREE, castingRectangular.B, castingRectangular.C, resolution)[i];
        const pointsLine = interpolatePoints(THREE, pStart, pEnd, resolution);

        pointsLine.forEach(point => {
            const raycaster = new THREE.Raycaster(point, castingRectangular.direction.normalize());
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

    const positions = obj.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = parseFloat(positions[i]);
        const y = parseFloat(positions[i + 1]);
        const z = parseFloat(positions[i + 2]);

        const point = new THREE.Vector3(x, y, z);
        const matrixWorld = obj.matrixWorld.clone();
        point.applyMatrix4(matrixWorld.clone());

        // Project each vertex onto the casting rectangle's plane
        const dotProduct = point.clone().sub(A).dot(castingRectangularPlane.normal);
        const projection = castingRectangularPlane.normal.clone().multiplyScalar(dotProduct / castingRectangularPlane.normal.lengthSq());
        const projectedPoint = point.clone().sub(projection);

        // Look up the face normal at the projected position
        const key = hashFunction(projectedPoint.x, projectedPoint.y, projectedPoint.z, pointToFaceNormalMap.resolution);
        const coords = pointToFaceNormalMap.data[key];
        if (!coords) throw new Error(`Cannot find face normal for posision ${x} - ${y} - ${z}`);
        const faceNormal = new THREE.Vector3(coords.normal.x, coords.normal.y, coords.normal.z);

        // Orient a dummy object toward the face normal, then apply the same rotation to the vertex
        const dummyObject = new THREE.Object3D();
        dummyObject.lookAt(faceNormal);

        const modifiedPoint = new THREE.Vector3(x, y, z).applyQuaternion(dummyObject.quaternion.clone());

        positions[i] = modifiedPoint.x;
        positions[i + 1] = modifiedPoint.y;
        positions[i + 2] = modifiedPoint.z;

        if (i % 5 === 2) {
            // drawVector(THREE, scene, point.clone(), projectedPoint, '#f00');
            // drawVector(THREE, scene, point.clone(), point.clone().add(faceNormal), '#ff0');
            // drawVector(THREE, scene, point.clone(), new THREE.Vector3(coords.point.x, coords.point.y, coords.point.z), '#ff0');
        }
    }

    obj.geometry.attributes.position.needsUpdate = true;

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
