/**
 * Calculates the bounding box of a BufferGeometry.
 * @param {Library} THREE The imported THREE instance.
 * @param {BufferGeometry} bufferGeometry bufferGeometry
 * @returns The calculated bounding box
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
 * Bends & positions the given geometry along on a CubicBezierCurve3 curve.
 * @param {Object} options The options object
 * @param {Library} options.THREE The THREE instance from your app.
 * @param {CubicBezierCurve3} options.curve The curve based on which we will curve the geometry
 * @param {Quaternion} options.quaternion A quaternion that indicates the overall orientation of the curve
 * @param {Vector3} [options.orientation] Instead of the orientation, directly provide the exact vector that indicates the orientation
 * @param {bufferGeometry} options.bufferGeometry The geometry that will be bent
 * @param {String} options.axis Which axis will be ajusted to the given curve
 */
export const bend = function({
    THREE, curve, quaternion, orientation, bufferGeometry, axis, scene
}) {

    // Bounding boxes of geometry //
    const geometryBB = calculateBoundingBox(THREE, bufferGeometry);
    const positions = bufferGeometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {

        const x = parseFloat(positions[i]);
        const y = parseFloat(positions[i + 1]);
        const z = parseFloat(positions[i + 2]);

        if (axis === 'x') {

            // Normalize 0..1 the x coordinate relative to the geometry's length //
            const howFarAlongInTheGeometry = (x - geometryBB.min.x) / (geometryBB.max.x - geometryBB.min.x);

            // In the given curve, get the tanget line at that point //
            const tangentPoint = curve.getPointAt(howFarAlongInTheGeometry);
            const tangent = curve.getTangent(howFarAlongInTheGeometry);

            // Find an orthogonal vector to the tangent normal //
            const referenceNormal = orientation || new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangent.clone()).normalize();

            // We calculate the rotation needed in order to rotate our tangent line in the same angle that our geometry point is rotated //
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent.clone(), Math.atan2(z, y));

            // Apply the above rotation to our orthogonal //
            orthogonal.applyQuaternion(rotationQuaternion);

            // Set the rotated orthogonal's length equal to the length of the geometry point //
            const displacement = orthogonal.clone().setLength(new THREE.Vector3(0, y, z).length());

            if (i > 0) {
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(tangent), '#fff');
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(referenceNormal), y >= geometryBB.center.y ? '#0ff' : '#F0f');
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(orthogonal), y >= geometryBB.center.y ? '#0ff' : '#F0f');
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(displacement), y >= geometryBB.center.y ? '#0ff' : '#F0f');
            }

            // Displace the original coordinates //
            const finalPosition = tangentPoint.clone().add(displacement);
            positions[i] = finalPosition.x;
            positions[i + 1] = finalPosition.y;
            positions[i + 2] = finalPosition.z;

        } else if (axis === 'z') {

            // Normalize 0..1 the z coordinate relative to the geometry's length //
            const howFarAlongInTheGeometry = (z - geometryBB.min.z) / (geometryBB.max.z - geometryBB.min.z);

            // In the given curve, get the tanget line at that point //
            const tangentPoint = curve.getPointAt(howFarAlongInTheGeometry);
            const tangent = curve.getTangent(howFarAlongInTheGeometry);

            // Find an orthogonal vector to the tangent normal //
            const referenceNormal = orientation || new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangent.clone()).normalize();

            // We calculate the rotation needed in order to rotate our tangent line in the same angle that our geometry point is rotated //
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent.clone(), Math.atan2(y, x) + Math.PI / 2);

            // Apply the above rotation to our orthogonal //
            orthogonal.applyQuaternion(rotationQuaternion);

            // Set the rotated orthogonal's length equal to the length of the geometry point //
            const displacement = orthogonal.clone().setLength(new THREE.Vector3(x, y, 0).length());

            // Displace the original coordinates //
            const finalPosition = tangentPoint.clone().add(displacement);
            positions[i] = finalPosition.x;
            positions[i + 1] = finalPosition.y;
            positions[i + 2] = finalPosition.z;

        } else if (axis === 'y') {

            // Normalize 0..1 the z coordinate relative to the geometry's length //
            const howFarAlongInTheGeometry = (y - geometryBB.min.y) / (geometryBB.max.y - geometryBB.min.y);

            // In the given curve, get the tanget line at that point //
            const tangentPoint = curve.getPointAt(howFarAlongInTheGeometry);
            const tangent = curve.getTangent(howFarAlongInTheGeometry);

            // Find an orthogonal vector to the tangent normal //
            const referenceNormal = orientation.normalize().multiplyScalar(1000000) || new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangent.clone()).normalize();

            // We calculate the rotation needed in order to rotate our tangent line in the same angle that our geometry point is rotated //
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangent.clone(), Math.atan2(x, z));

            // Apply the above rotation to our orthogonal //
            orthogonal.applyQuaternion(rotationQuaternion);

            // Set the rotated orthogonal's length equal to the length of the geometry point //
            const displacement = orthogonal.clone().setLength(new THREE.Vector3(x, 0, z).length());

            // Displace the original coordinates //
            const finalPosition = tangentPoint.clone().add(displacement);
            positions[i] = finalPosition.x;
            positions[i + 1] = finalPosition.y;
            positions[i + 2] = finalPosition.z;
        }

    }

    bufferGeometry.attributes.position.needsUpdate = true;
};

/**
 * Generates a point to face normal map.
 * We're mapping each point of the casting rectangular to a face normal in the surface.
 * This happens by casting rays from the rectangular shape to the surface and remembering the collision point.
 * @param {Object} options The options object
 * @param {Library} options.THREE The THREE instance from your app.
 * @param {Mesh} options.surface The surface that contains the face normals.
 * @param {Object} [options.castingRectangular] The rectangular from where the points originate.
 * @param {Vector3} [options.castingRectangular.A] A vector that indicates the top left corner
 * @param {Vector3} [options.castingRectangular.B] A vector that indicates the top right corner
 * @param {Vector3} [options.castingRectangular.C] A vector that indicates the bottom right corner
 * @param {Vector3} [options.castingRectangular.C] A vector that indicates the bottom left corner
 * @param {Vector3} [options.castingRectangular.direction] The direction that each ray should have in order to hit the surface
 * @param {Number} options.resolution How many points should we interpolate between corner A and B of the given rectangular
 */
export const getPointToFaceNormalMap = function({
    THREE, surface, castingRectangular, resolution, scene
}) {

    const map = {};

    drawVector(THREE, scene, castingRectangular.A, castingRectangular.B, '#f0f');
    drawVector(THREE, scene, castingRectangular.B, castingRectangular.C, '#f0f');
    drawVector(THREE, scene, castingRectangular.C, castingRectangular.D, '#f0f');
    drawVector(THREE, scene, castingRectangular.D, castingRectangular.A, '#f0f');

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

export const wrap = function({
    THREE, pointToFaceNormalMap, obj, scene
}) {

    // Calculate the plane that's defined by the casting rectangular shape //
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
        point.applyMatrix4(obj.matrixWorld);

        // Project each point of the obj to the casting rectangular plane //
        const dotProduct = point.clone().sub(A).dot(castingRectangularPlane.normal);
        const projection = castingRectangularPlane.normal.clone().multiplyScalar(dotProduct / castingRectangularPlane.normal.lengthSq());
        const projectedPoint = point.clone().sub(projection);

        // Find the corresponding face normal using the hashed data map //
        const key = hashFunction(projectedPoint.x, projectedPoint.y, projectedPoint.z, pointToFaceNormalMap.resolution);
        const coords = pointToFaceNormalMap.data[key];
        if (!coords) throw new Error(`Cannot find face normal for posision ${x} - ${y} - ${z}`);
        const faceNormal = new THREE.Vector3(coords.normal.x, coords.normal.y, coords.normal.z);

        // Create a dummy object and make it lookAt the face normal we just found //
        const dummyObject = new THREE.Object3D();
        dummyObject.lookAt(faceNormal);

        // Apply the same rotation that it took to make the dummy object to look at the normal, to our point //
        const modifiedPoint = new THREE.Vector3(x, y, z).applyQuaternion(dummyObject.quaternion);

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