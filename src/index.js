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
            const tangentNormal = curve.getTangentAt(howFarAlongInTheGeometry).normalize();

            // Find an orthogonal vector to the tangent normal //
            const referenceNormal = orientation || new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangentNormal.clone()).normalize();

            // We calculate the rotation needed in order to rotate our tangent line in the same angle that our geometry point is rotated //
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangentNormal.clone(), Math.atan2(z, y));

            // Apply the above rotation to our orthogonal //
            orthogonal.applyQuaternion(rotationQuaternion);

            // Set the rotated orthogonal's length equal to the length of the geometry point //
            const displacement = orthogonal.clone().setLength(new THREE.Vector3(0, y, z).length());

            if (i > 0) {
                // drawVector(THREE, scene, tangentPoint, tangentPoint.clone().add(tangentNormal), '#fff');
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
            const tangentNormal = curve.getTangentAt(howFarAlongInTheGeometry).normalize();

            // Find an orthogonal vector to the tangent normal //
            const referenceNormal = orientation || new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangentNormal.clone()).normalize();

            // We calculate the rotation needed in order to rotate our tangent line in the same angle that our geometry point is rotated //
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangentNormal.clone(), Math.atan2(y, x) + Math.PI / 2);

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
            const tangentNormal = curve.getTangentAt(howFarAlongInTheGeometry).normalize();

            // Find an orthogonal vector to the tangent normal //
            const referenceNormal = orientation.normalize().multiplyScalar(1000000) || new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion).normalize().multiplyScalar(1000000);
            const orthogonal = referenceNormal.clone().cross(tangentNormal.clone()).normalize();

            // We calculate the rotation needed in order to rotate our tangent line in the same angle that our geometry point is rotated //
            const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(tangentNormal.clone(), Math.atan2(x, z));

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