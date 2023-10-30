import { flexy } from './src';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
flexy.load3(THREE);

// ----------------------------------- //
// SETUP THREEJS                       //
// ----------------------------------- //

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 25, 30);

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

// angle: Math.PI / 4,
//         axis: 'x',
//         type: 'arc',
//         arcR: 10,
//         circleR: 5,
//         ellipseA: 5,
//         ellipseB: 3,
//         sineX0: 0,
//         sineX1: 10,
//         sineAmplitude: 4

const generateArc = ({
    arcR, axes
}) => {

    let startPoint;
    let controlPoint1;
    let controlPoint2;
    let endPoint;

    if (axes === 'xy') {

        startPoint = new THREE.Vector3(arcR, 0, 0);
        controlPoint1 = new THREE.Vector3(arcR, arcR * 0.45, 0);
        controlPoint2 = new THREE.Vector3(arcR * 0.55, arcR, 0);
        endPoint = new THREE.Vector3(0, arcR, 0);

    } else if (axes === 'xz') {

        // startPoint = new THREE.Vector3(arcR, 0, 0);
        // controlPoint1 = new THREE.Vector3(arcR, arcR * 0.45, 0);
        // controlPoint2 = new THREE.Vector3(arcR * 0.55, arcR, 0);
        // endPoint = new THREE.Vector3(0, arcR, 0);

    } else if (axes === 'yz') {

        // startPoint = new THREE.Vector3(arcR, 0, 0);
        // controlPoint1 = new THREE.Vector3(arcR, arcR * 0.45, 0);
        // controlPoint2 = new THREE.Vector3(arcR * 0.55, arcR, 0);
        // endPoint = new THREE.Vector3(0, arcR, 0);

    } else {

        startPoint = new THREE.Vector3(0, arcR, 0);
        controlPoint1 = new THREE.Vector3(arcR * 0.55, arcR, 0);
        controlPoint2 = new THREE.Vector3(arcR, arcR * 0.45, 0);
        endPoint = new THREE.Vector3(arcR, 0, arcR);

    }

    return new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
};

const generateEllipticalCurve = (a, b) => {
    let startPoint = new THREE.Vector3(a, 0, 0);
    let controlPoint1 = new THREE.Vector3(a, b * 0.45, 0);
    let controlPoint2 = new THREE.Vector3(a * 0.55, b, 0);
    let endPoint = new THREE.Vector3(0, b, 0);
    const curve1 = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    startPoint = new THREE.Vector3(0, b, 0);
    controlPoint1 = new THREE.Vector3(-a * 0.45, b, 0);
    controlPoint2 = new THREE.Vector3(-a, b * 0.55, 0);
    endPoint = new THREE.Vector3(-a, 0, 0);
    const curve2 = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    startPoint = new THREE.Vector3(-a, 0, 0);
    controlPoint1 = new THREE.Vector3(-a, -b * 0.45, 0);
    controlPoint2 = new THREE.Vector3(-a * 0.55, -b, 0);
    endPoint = new THREE.Vector3(0, -b, 0);
    const curve3 = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    startPoint = new THREE.Vector3(0, -b, 0);
    controlPoint1 = new THREE.Vector3(a * 0.45, -b, 0);
    controlPoint2 = new THREE.Vector3(a, -b * 0.55, 0);
    endPoint = new THREE.Vector3(a, 0, 0);
    const curve4 = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    const final = new THREE.CurvePath();
    final.add(curve1);
    final.add(curve2);
    final.add(curve3);
    final.add(curve4);

    return final;
};

const generateSineCurve = (startingX, endingX, amplitude) => {
    const startPoint = new THREE.Vector3(startingX, 0, 0);
    const controlPoint1 = new THREE.Vector3(Math.ceil((startingX + endingX) * (1 / 3)), amplitude, 0); // Control point with an amplitude of 4
    const controlPoint2 = new THREE.Vector3(Math.ceil((startingX + endingX) * (1 / 3)), -amplitude, 0);
    const endPoint = new THREE.Vector3(endingX, 0, 0);
    return new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
};

function createExampleMesh({
    width, height, depth, widthSegments, heightSegments, depthSegments, wireframe
}) {
    const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
    const material = new THREE.MeshNormalMaterial({ wireframe });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createExampleCurve(options) {
    if (options.type === 'arc') {
        return generateArc(options);
    } else if (options.type === 'circle') {
        return generateEllipticalCurve(options);
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
    toBeCleaned.push(toBeCleaned);

    if (settings.firstAxisBend.x) {

        // 2. create curve
        const curve = createExampleCurve(settings.firstCurve);
        const tube = createTubeMeshFromCurve(curve);
        scene.add(tube);
        toBeCleaned.push(tube);

        // 3. bend geometry
        flexy.bend(curve, mesh.geometry, 'x');

    }
}

// ----------------------------------- //
// DAT GUI                             //
// ----------------------------------- //

const settings = {
    box: {
        width: 10,
        height: 3,
        depth: 3,
        widthSegments: 10,
        heightSegments: 10,
        depthSegments: 10,
        wireframe: true
    },
    firstAxisBend: {
        x: true,
        y: false,
        z: false
    },
    firstCurve: {
        type: 'arc',
        arcR: 10,
        circleR: 5,
        ellipseA: 5,
        ellipseB: 3,
        sineX0: 0,
        sineX1: 10,
        sineAmplitude: 4
    },
    secondAxisBend: {
        x: false,
        y: false,
        z: false
    },
    secondCurve: {
        type: 'arc',
        arcR: 10,
        circleR: 5,
        ellipseA: 5,
        ellipseB: 3,
        sineX0: 0,
        sineX1: 10,
        sineAmplitude: 4
    }
};

const gui = new dat.GUI();
const shapeFolder = gui.addFolder('Box Geometry');
shapeFolder.open();
shapeFolder.add(settings.box, 'width', 1, 30).onChange(updateGeometry);
shapeFolder.add(settings.box, 'height', 1, 30).onChange(updateGeometry);
shapeFolder.add(settings.box, 'depth', 1, 30).onChange(updateGeometry);
shapeFolder.add(settings.box, 'widthSegments', 1, 60).onChange(updateGeometry);
shapeFolder.add(settings.box, 'heightSegments', 1, 60).onChange(updateGeometry);
shapeFolder.add(settings.box, 'depthSegments', 1, 60).onChange(updateGeometry);

const firstBend = gui.addFolder('First Bend on axis');
firstBend.open();
firstBend.add(settings.firstAxisBend, 'x').onChange(updateGeometry);
firstBend.add(settings.firstAxisBend, 'y').onChange(updateGeometry);
firstBend.add(settings.firstAxisBend, 'z').onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'type', [
    'arc',
    'circle',
    'ellipse',
    'sine'
]).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'arcR', 3, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'circleR', 3, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'ellipseA', 3, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'ellipseB', 3, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'sineX0', 0, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'sineX1', 0, 20).onChange(updateGeometry);
firstBend.add(settings.firstCurve, 'sineAmplitude', 0, 10).onChange(updateGeometry);

const secondBend = gui.addFolder('Second Bend on axis');
secondBend.add(settings.secondAxisBend, 'x').onChange(updateGeometry);
secondBend.add(settings.secondAxisBend, 'y').onChange(updateGeometry);
secondBend.add(settings.secondAxisBend, 'z').onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'type', [
    'arc',
    'circle',
    'ellipse',
    'sine'
]).onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'arcR', 3, 20).onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'circleR', 3, 20).onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'ellipseA', 3, 20).onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'ellipseB', 3, 20).onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'sineX0', 0, 20).onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'sineX1', 0, 20).onChange(updateGeometry);
secondBend.add(settings.secondCurve, 'sineAmplitude', 0, 10).onChange(updateGeometry);

updateGeometry();
animate();