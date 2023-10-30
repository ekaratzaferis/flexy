let Box3;
let Vector3;
let THREE;

/**
 * Provide the THREE js module that are needed
 * @param {Object} THREE
 * @param {Constructor} THREE.Box3
 * @param {Constructor} THREE.Vector3
 * @param {Constructor} THREE.CatmullRomCurve3
 */
function load3(THREE3) {
    Box3 = THREE3.Box3;
    Vector3 = THREE3.Vector3;
    THREE = THREE3;
}

/**
 * Calculates the bounding box of BufferGeometry.
 * @param {*} bufferGeometry bufferGeometry
 * @returns The calculated bounding box
 */
function calculateBoundingBox(bufferGeometry) {
    const positionAttribute = bufferGeometry.getAttribute('position');
    const boundingBox = new Box3();

    boundingBox.center = new Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);
        boundingBox.expandByPoint(vertex);

        const x = positionAttribute[i];
        const y = positionAttribute[i + 1];
        const z = positionAttribute[i + 2];

        // Add the vertex position to the center
        boundingBox.center.add(new Vector3(x, y, z));
    }

    boundingBox.center.divideScalar(positionAttribute.count / 3);

    return boundingBox;
}

/**
 * Bends & positions the given geometry along on a CubicBezierCurve3 curve.
 * @param {CubicBezierCurve3} curve The curve based on which we will curve the geometry
 * @param {bufferGeometry} bufferGeometry The geometry that will be bent
 * @param {String} axis Which axis will be ajusted to the given curve
 */
const bend = function(curve, bufferGeometry, axis) {

    const bb = calculateBoundingBox(bufferGeometry);
    const positions = bufferGeometry.attributes.position.array;

    // legacy
    for (let i = 0; i < positions.length; i += 3) {

        const x = parseFloat(positions[i]);
        const y = parseFloat(positions[i + 1]);
        const z = parseFloat(positions[i + 2]);

        if (axis === 'x') {

            // Normalize 0..1 the x coordinate //
            const howFarAlongInTheGeometry = (x - bb.min.x) / (bb.max.x - bb.min.x);

            // In the given curve, get the tanget line at that point //
            const tangentNormal = curve.getTangentAt(howFarAlongInTheGeometry).normalize();
            const tangentPoint = curve.getPointAt(howFarAlongInTheGeometry);

            // Find normals that are orhogonal to our tangent normal in the y-z axis //
            let orthogonalY;
            if (y >= bb.center.y) {
                orthogonalY = new Vector3(-tangentNormal.y, tangentNormal.x, 0).normalize(); // ok
                // if (x >= bb.center.x) {
                // } else {
                //     orthogonalY = new Vector3(-tangentNormal.y, tangentNormal.x, 0).normalize();
                // }
            } else {
                orthogonalY = new Vector3(tangentNormal.y, -tangentNormal.x, 0).normalize(); // ok
                // if (x >= bb.center.x) {
                // } else {
                //     orthogonalY = new Vector3(tangentNormal.y, -tangentNormal.x, 0).normalize();
                // }
            }

            let orthogonalZ;
            if (z >= bb.center.z) {
                orthogonalZ = new Vector3(0, -tangentNormal.z, -tangentNormal.x).normalize(); // ok
            } else {
                orthogonalZ = new Vector3(0, tangentNormal.z, tangentNormal.x).normalize(); // ok
            }

            // Calculate the displacement of the point //
            const displacementY = orthogonalY.clone().multiplyScalar(Math.abs(y));
            const displacementZ = orthogonalZ.clone().multiplyScalar(Math.abs(z));
            const displacement = displacementY.clone().add(displacementZ);

            // if (i > 0) {
            //     drawVector(scene, tangentPoint, tangentPoint.clone().add(tangentNormal), '#f00');
            //     drawVector(scene, tangentPoint, tangentPoint.clone().add(orthogonalY), y >= bb.center.y ? '#f0f' : '#0f0');
            //     drawVector(scene, tangentPoint, tangentPoint.clone().add(orthogonalZ), z >= bb.center.z ? '#fff' : '#00f');
            // }

            positions[i] = tangentPoint.x + displacement.x;
            positions[i + 1] = tangentPoint.y + displacement.y;
            positions[i + 2] = tangentPoint.z + displacement.z;

        }

    }

    bufferGeometry.attributes.position.needsUpdate = true;
};

export const flexy = {
    bend,
    load3
};

function drawVector(scene, startPoint = {
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