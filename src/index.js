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

export const wrap = function({
    THREE, reflectionMap, obj, scene
}) {

    const A = new THREE.Vector3(reflectionMap.collisionPlane.A.x, reflectionMap.collisionPlane.A.y, reflectionMap.collisionPlane.A.z);
    const B = new THREE.Vector3(reflectionMap.collisionPlane.B.x, reflectionMap.collisionPlane.B.y, reflectionMap.collisionPlane.B.z);
    const C = new THREE.Vector3(reflectionMap.collisionPlane.C.x, reflectionMap.collisionPlane.C.y, reflectionMap.collisionPlane.C.z);

    const vector1 = new THREE.Vector3().subVectors(B, A);
    const vector2 = new THREE.Vector3().subVectors(C, A);
    const normal = new THREE.Vector3().crossVectors(vector1, vector2).normalize();
    const collisionPlane = new THREE.Plane();
    collisionPlane.setFromNormalAndCoplanarPoint(normal, A);

    // drawPlane(THREE, collisionPlane, B, scene);

    const positions = obj.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        const x = parseFloat(positions[i]);
        const y = parseFloat(positions[i + 1]);
        const z = parseFloat(positions[i + 2]);

        const point = new THREE.Vector3(x, y, z);
        point.applyMatrix4(obj.matrixWorld);

        // Step 1: Compute the dot product between the point and the normal of the plane
        const dotProduct = point.clone().sub(A).dot(collisionPlane.normal);
        // Step 2: Compute the fully projected vector of the point onto the plane normal
        const projection = collisionPlane.normal.clone().multiplyScalar(dotProduct / collisionPlane.normal.lengthSq());
        // Step 3: Subtract the projection from the original point to get its projection on the plane
        const projectedPoint = point.clone().sub(projection);

        const key = hashFunction(projectedPoint.x, projectedPoint.y, projectedPoint.z, reflectionMap.resolution);
        const coords = reflectionMap.data[key];
        if (!coords) {
            console.error('asdads');
            continue;
        }
        const faceNormal = new THREE.Vector3(coords.normal.x, coords.normal.y, coords.normal.z);

        const dummyObject = new THREE.Object3D();
        dummyObject.lookAt(faceNormal);
        const newPoint = new THREE.Vector3(x, y, z);
        const final = newPoint.clone().applyQuaternion(dummyObject.quaternion);

        if (i % 5 === 2) {
            // drawVector(THREE, scene, point.clone(), projectedPoint, '#f00');
            // drawVector(THREE, scene, point.clone(), point.clone().add(faceNormal), '#ff0');
            // drawVector(THREE, scene, point.clone(), new THREE.Vector3(coords.point.x, coords.point.y, coords.point.z), '#ff0');
        }

        positions[i] = final.x;
        positions[i + 1] = final.y;
        positions[i + 2] = final.z;
    }

    obj.geometry.attributes.position.needsUpdate = true;

};

export const getReflectionMap = function({
    THREE, surface, resolution, collisionPlane, scene
}) {

    const map = {};

    // drawVector(THREE, scene, collisionPlane.A, collisionPlane.B, '#f0f');
    // drawVector(THREE, scene, collisionPlane.B, collisionPlane.C, '#f0f');
    // drawVector(THREE, scene, collisionPlane.C, collisionPlane.D, '#f0f');
    // drawVector(THREE, scene, collisionPlane.D, collisionPlane.A, '#f0f');

    for (let i = 0; i <= resolution; i++) {
        const pStart = interpolatePoints(THREE, collisionPlane.A, collisionPlane.D, resolution)[i];
        const pEnd = interpolatePoints(THREE, collisionPlane.B, collisionPlane.C, resolution)[i];
        const pointsLine = interpolatePoints(THREE, pStart, pEnd, resolution);

        pointsLine.forEach(point => {
            const raycaster = new THREE.Raycaster(point, collisionPlane.direction.normalize());
            const intersects = raycaster.intersectObject(surface);

            // drawVector(THREE, scene, point.clone(), point.clone().add(collisionPlane.direction.clone().normalize()), '#f0f');

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
        collisionPlane: {
            A: {
                x: collisionPlane.A.x,
                y: collisionPlane.A.y,
                z: collisionPlane.A.z
            },
            B: {
                x: collisionPlane.B.x,
                y: collisionPlane.B.y,
                z: collisionPlane.B.z
            },
            C: {
                x: collisionPlane.C.x,
                y: collisionPlane.C.y,
                z: collisionPlane.C.z
            },
            D: {
                x: collisionPlane.D.x,
                y: collisionPlane.D.y,
                z: collisionPlane.D.z
            },
            direction: {
                x: collisionPlane.direction.x,
                y: collisionPlane.direction.y,
                z: collisionPlane.direction.z
            }
        },
        resolution
    };
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