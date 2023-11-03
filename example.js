import * as flexy from './src';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----------------------------------- //
// SETUP THREEJS                       //
// ----------------------------------- //

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 15, 20);

// Create a renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Axes helper //
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Instantiate OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update the controls
    renderer.render(scene, camera);
}

// Resize //
window.addEventListener('resize', function() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
});

renderer.setClearColor(0x012345);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// ----------------------------------- //
// Generators                          //
// ----------------------------------- //

const generate3dArc = ({
    arcR, rotation
}) => {
    const rotationVector = new THREE.Vector3(0, 1, 0);
    const startPoint = new THREE.Vector3(0, arcR, 0).applyAxisAngle(rotationVector, rotation);
    const controlPoint1 = new THREE.Vector3(arcR * 0.55, arcR, 0).applyAxisAngle(rotationVector, rotation);
    const controlPoint2 = new THREE.Vector3(arcR, arcR * 0.45, 0).applyAxisAngle(rotationVector, rotation);
    const endPoint = new THREE.Vector3(arcR, 0, arcR).applyAxisAngle(rotationVector, rotation);
    const final = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
    return {
        curve: final,
        rotationVector
    };
};

const generateArc = ({
    arcR, rotation
}) => {
    const rotationVector = new THREE.Vector3(0, 1, 0);
    const startPoint = new THREE.Vector3(arcR, arcR / 8, 0).applyAxisAngle(rotationVector, rotation);
    const controlPoint1 = new THREE.Vector3(arcR / 4, arcR / 2, 0).applyAxisAngle(rotationVector, rotation);
    const controlPoint2 = new THREE.Vector3(-arcR / 4, arcR / 2, 0).applyAxisAngle(rotationVector, rotation);
    const endPoint = new THREE.Vector3(-arcR, arcR / 8, 0).applyAxisAngle(rotationVector, rotation);
    const final = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
    return {
        curve: final,
        rotationVector
    };
};

const generateEllipticalCurve = ({
    ellipseA, ellipseB, rotation
}) => {
    const rotationVector = new THREE.Vector3(1, 0, 1);
    let startPoint = new THREE.Vector3(ellipseA, 0, 0).applyAxisAngle(rotationVector, rotation);
    let controlPoint1 = new THREE.Vector3(ellipseA, ellipseB * 0.45, 0).applyAxisAngle(rotationVector, rotation);
    let controlPoint2 = new THREE.Vector3(ellipseA * 0.55, ellipseB, 0).applyAxisAngle(rotationVector, rotation);
    let endPoint = new THREE.Vector3(0, ellipseB, 0).applyAxisAngle(rotationVector, rotation);
    const curve1 = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    startPoint = new THREE.Vector3(0, ellipseB, 0).applyAxisAngle(rotationVector, rotation);
    controlPoint1 = new THREE.Vector3(-ellipseA * 0.45, ellipseB, 0).applyAxisAngle(rotationVector, rotation);
    controlPoint2 = new THREE.Vector3(-ellipseA, ellipseB * 0.55, 0).applyAxisAngle(rotationVector, rotation);
    endPoint = new THREE.Vector3(-ellipseA, 0, 0).applyAxisAngle(rotationVector, rotation);
    const curve2 = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    startPoint = new THREE.Vector3(-ellipseA, 0, 0).applyAxisAngle(rotationVector, rotation);
    controlPoint1 = new THREE.Vector3(-ellipseA, -ellipseB * 0.45, 0).applyAxisAngle(rotationVector, rotation);
    controlPoint2 = new THREE.Vector3(-ellipseA * 0.55, -ellipseB, 0).applyAxisAngle(rotationVector, rotation);
    endPoint = new THREE.Vector3(0, -ellipseB, 0).applyAxisAngle(rotationVector, rotation);
    const curve3 = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    startPoint = new THREE.Vector3(0, -ellipseB, 0).applyAxisAngle(rotationVector, rotation);
    controlPoint1 = new THREE.Vector3(ellipseA * 0.45, -ellipseB, 0).applyAxisAngle(rotationVector, rotation);
    controlPoint2 = new THREE.Vector3(ellipseA, -ellipseB * 0.55, 0).applyAxisAngle(rotationVector, rotation);
    endPoint = new THREE.Vector3(ellipseA, 0, 0).applyAxisAngle(rotationVector, rotation);
    const curve4 = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    const final = new THREE.CurvePath();
    final.add(curve1);
    final.add(curve2);
    final.add(curve3);
    final.add(curve4);

    return {
        curve: final,
        rotationVector: rotationVector.multiplyScalar(rotation)
    };
};

const generateSineCurve = ({
    sineX0, sineX1, sineAmplitude, rotation
}) => {
    const rotationVector = new THREE.Vector3(0, 1, 0);
    const startPoint = new THREE.Vector3(-sineX0, 0, 0).applyAxisAngle(rotationVector, rotation);
    const controlPoint1 = new THREE.Vector3(Math.ceil((-sineX0 + sineX1) * (1 / 3)), sineAmplitude, 0).applyAxisAngle(rotationVector, rotation);
    const controlPoint2 = new THREE.Vector3(Math.ceil((-sineX0 + sineX1) * (1 / 3)), -sineAmplitude, 0).applyAxisAngle(rotationVector, rotation);
    const endPoint = new THREE.Vector3(sineX1, 0, 0).applyAxisAngle(rotationVector, rotation);
    const final = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    return {
        curve: final,
        rotationVector
    };
};

function createExampleMesh({
    width, height, depth, widthSegments, heightSegments, depthSegments, wireframe
}) {
    const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
    let material;
    if (wireframe) {
        material = new THREE.MeshNormalMaterial({ wireframe: true });
    } else {
        material = [];
        material.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
        material.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
        material.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
        material.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
        material.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
        material.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
    }
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createExampleCurve(options) {
    if (options.type === '3d_arc') {
        return generate3dArc(options);
    } else if (options.type === 'arc') {
        return generateArc(options);
    } else if (options.type === 'ellipse') {
        return generateEllipticalCurve(options);
    } else if (options.type === 'sine') {
        return generateSineCurve(options);
    }
}

function createTubeMeshFromCurve(curve) {
    const numPoints = 1000;
    const pointsOnCurve = curve.getPoints(numPoints);
    const path = new THREE.CatmullRomCurve3(pointsOnCurve);
    const tubeGeometry = new THREE.TubeGeometry(path, numPoints, 0.1, 8, false);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    return tubeMesh;
}

// ----------------------------------- //
// ON UI UPDATE                        //
// ----------------------------------- //

let toBeCleaned = [];
function updateGeometry() {

    // clean scene //
    for (const obj of toBeCleaned) scene.remove(obj);
    toBeCleaned = [];

    const mesh = createExampleMesh(settings.box);
    scene.add(mesh);
    toBeCleaned.push(mesh);

    const { curve, rotationVector } = createExampleCurve(settings.firstCurve);
    const tube = createTubeMeshFromCurve(curve);
    if (settings.box.wireframe) scene.add(tube);
    toBeCleaned.push(tube);

    flexy.bend({
        THREE,
        curve,
        quaternion: new THREE.Quaternion().setFromAxisAngle(rotationVector, settings.firstCurve.rotation),
        // orientation: new THREE.Vector3(0, 0, 1),
        bufferGeometry: mesh.geometry,
        axis: 'x',
        scene
    });
    // mesh.visible = false;

    if (settings.secondAxisBend) {

        settings.secondCurve.rotation += Math.PI / 2;
        const curve2 = createExampleCurve(settings.secondCurve);
        const tube2 = createTubeMeshFromCurve(curve2.curve);
        if (settings.box.wireframe) scene.add(tube2);
        toBeCleaned.push(tube2);
        settings.secondCurve.rotation -= Math.PI / 2;

        flexy.bend({
            THREE,
            curve: curve2.curve,
            quaternion: new THREE.Quaternion().setFromAxisAngle(curve2.rotationVector, settings.secondCurve.rotation),
            // orientation: new THREE.Vector3(1, 0, 0),
            bufferGeometry: mesh.geometry,
            axis: 'z',
            scene
        });

    }
}

// ----------------------------------- //
// DAT GUI                             //
// ----------------------------------- //

const settings = {
    box: {
        width: 15,
        height: 2,
        depth: 2,
        widthSegments: 60,
        heightSegments: 10,
        depthSegments: 10,
        wireframe: false
    },
    firstCurve: {
        type: '3d_arc',
        rotation: 0,
        arcR: 10,
        ellipseA: 15,
        ellipseB: 10,
        sineX0: 0,
        sineX1: 10,
        sineAmplitude: 4
    },
    secondAxisBend: false,
    secondCurve: {
        type: 'arc',
        rotation: 0,
        arcR: 10,
        ellipseA: 15,
        ellipseB: 10,
        sineX0: 0,
        sineX1: 10,
        sineAmplitude: 4
    }
};

const gui = new dat.GUI();
const shapeFolder = gui.addFolder('Box Geometry');
shapeFolder.open();
shapeFolder.add(settings.box, 'wireframe').onChange(updateGeometry);
shapeFolder.add(settings.box, 'width', 1, 30).onChange(updateGeometry);
shapeFolder.add(settings.box, 'height', 1, 30).onChange(updateGeometry);
shapeFolder.add(settings.box, 'depth', 1, 30).onChange(updateGeometry);
shapeFolder.add(settings.box, 'widthSegments', 1, 60).onChange(updateGeometry);
shapeFolder.add(settings.box, 'heightSegments', 1, 60).onChange(updateGeometry);
shapeFolder.add(settings.box, 'depthSegments', 1, 60).onChange(updateGeometry);

const firstBend = gui.addFolder('First Bend on axis');
firstBend.open();
firstBend.add(settings.firstCurve, 'type', [
    'arc',
    '3d_arc',
    'ellipse',
    'sine'
]).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'rotation', 0, 2 * Math.PI).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'arcR', -20, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'ellipseA', 3, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'ellipseB', 3, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'sineX0', 0, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'sineX1', 0, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'sineAmplitude', 0, 10).onChange(updateGeometry);

const secondBend = gui.addFolder('Second Bend on axis');
secondBend.open();
secondBend.add(settings, 'secondAxisBend').onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'rotation', 0, 2 * Math.PI).onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'arcR', -20, 20).onChange(updateGeometry);

updateGeometry();
animate();