import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

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

// Axis helper //
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

function createTubeMeshFromCurve(curve) {
    const numPoints = 1000;
    const pointsOnCurve = curve.getPoints(numPoints);
    const path = new THREE.CatmullRomCurve3(pointsOnCurve);
    const tubeGeometry = new THREE.TubeGeometry(path, numPoints, 0.01, 8, false);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    return tubeMesh;
}

function createSphere(color, x, y, z) {
    const geometry = new THREE.SphereGeometry(0.03, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);
    return sphere;
}

const spheres = {};
function createBallIndicators(settings) {

    if (spheres.start) scene.remove(spheres.start);
    if (spheres.c1) scene.remove(spheres.c1);
    if (spheres.c2) scene.remove(spheres.c2);
    if (spheres.end) scene.remove(spheres.end);

    spheres.start = createSphere(0xffff00, settings.start.x, settings.start.y, settings.start.z);
    spheres.c1 = createSphere(0xff0000, settings.c1.x, settings.c1.y, settings.c1.z);
    spheres.c2 = createSphere(0xff00ff, settings.c2.x, settings.c2.y, settings.c2.z);
    spheres.end = createSphere(0xffffff, settings.end.x, settings.end.y, settings.end.z);
}

animate();

let tube; let final; let startPoint; let controlPoint1; let controlPoint2; let endPoint; let ring; let ringG;

(async function() {
    const material = new THREE.MeshNormalMaterial({ wireframe: false });

    const loader = new STLLoader();
    const loadSTL = function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                const stlData = e.target.result;
                const geometry = loader.parse(stlData);
                resolve(geometry);
            };

            reader.onerror = function(error) {
                reject(error);
            };

            // Read the STL file as binary data
            reader.readAsBinaryString(file);
        });
    };

    const settings = {
        start: {
            x: 0,
            y: 5,
            z: 0
        },
        end: {
            x: 5,
            y: 0,
            z: 5
        },
        c1: {
            x: 5 * 0.55,
            y: 5,
            z: 0
        },
        c2: {
            x: 5,
            y: 5 * 0.45,
            z: 0
        },
        stl: {
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        currentControl: 'stl position / rotation',
        step: 0.25
    };

    redraw();

    const gui = new dat.GUI();
    gui.addFolder('QA / WS / ED - UJ / IK / OL');
    const keyboard = gui.addFolder('Keyboard Controls');
    keyboard.open();
    keyboard.add(settings, 'currentControl', [
        'stl position / rotation',
        'start / end points',
        'control points'
    ]).listen();
    keyboard.add(settings, 'step').onFinishChange(value => {
        settings.step = Number(value);
    }).listen();

    const stlPosition = gui.addFolder('Translate STL');
    stlPosition.open();
    stlPosition.add(settings.stl.position, 'x', -10, 10, settings.step).onChange(redraw).listen();
    stlPosition.add(settings.stl.position, 'y', -10, 10, settings.step).onChange(redraw).listen();
    stlPosition.add(settings.stl.position, 'z', -10, 10, settings.step).onChange(redraw).listen();
    const stlRotation = gui.addFolder('Rotate STL');
    stlRotation.open();
    stlRotation.add(settings.stl.rotation, 'x', -2 * Math.PI, 2 * Math.PI, settings.step).onChange(redraw).listen();
    stlRotation.add(settings.stl.rotation, 'y', -2 * Math.PI, 2 * Math.PI, settings.step).onChange(redraw).listen();
    stlRotation.add(settings.stl.rotation, 'z', -2 * Math.PI, 2 * Math.PI, settings.step).onChange(redraw).listen();

    const startPointFolder = gui.addFolder('Start Point');
    startPointFolder.open();
    startPointFolder.add(settings.start, 'x', -20, 20, settings.step).onChange(redraw).listen();
    startPointFolder.add(settings.start, 'y', -20, 20, settings.step).onChange(redraw).listen();
    startPointFolder.add(settings.start, 'z', -20, 20, settings.step).onChange(redraw).listen();
    const c1PointFolder = gui.addFolder('Control Point 1');
    c1PointFolder.open();
    c1PointFolder.add(settings.c1, 'x', -20, 20, settings.step).onChange(redraw).listen();
    c1PointFolder.add(settings.c1, 'y', -20, 20, settings.step).onChange(redraw).listen();
    c1PointFolder.add(settings.c1, 'z', -20, 20, settings.step).onChange(redraw).listen();
    const c2PointFolder = gui.addFolder('Control Point 2');
    c2PointFolder.open();
    c2PointFolder.add(settings.c2, 'x', -20, 20, settings.step).onChange(redraw).listen();
    c2PointFolder.add(settings.c2, 'y', -20, 20, settings.step).onChange(redraw).listen();
    c2PointFolder.add(settings.c2, 'z', -20, 20, settings.step).onChange(redraw).listen();
    const endPointFolder = gui.addFolder('End Point');
    endPointFolder.open();
    endPointFolder.add(settings.end, 'x', -20, 20, settings.step).onChange(redraw).listen();
    endPointFolder.add(settings.end, 'y', -20, 20, settings.step).onChange(redraw).listen();
    endPointFolder.add(settings.end, 'z', -20, 20, settings.step).onChange(redraw).listen();

    function redraw() {

        if (ring) {
            ring.position.set(settings.stl.position.x, settings.stl.position.y, settings.stl.position.z);
            ring.rotation.set(settings.stl.rotation.x, settings.stl.rotation.y, settings.stl.rotation.z);
        }

        startPoint = new THREE.Vector3(settings.start.x, settings.start.y, settings.start.z);
        controlPoint1 = new THREE.Vector3(settings.c1.x, settings.c1.y, settings.c1.z);
        controlPoint2 = new THREE.Vector3(settings.c2.x, settings.c2.y, settings.c2.z);
        endPoint = new THREE.Vector3(settings.end.x, settings.end.y, settings.end.z);

        scene.remove(tube);
        final = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
        tube = createTubeMeshFromCurve(final);
        createBallIndicators(settings);
        scene.add(tube);
    }

    const btnUpload = document.createElement('button');
    btnUpload.style.position = 'absolute';
    btnUpload.style.top = 0;
    btnUpload.style.left = 0;
    btnUpload.innerHTML = 'UPLOAD STL';
    btnUpload.addEventListener('click', async () => {
        document.getElementById('fileInput').click();
    });
    document.body.append(btnUpload);

    const btn = document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.bottom = 0;
    btn.style.left = 0;
    btn.innerHTML = 'PRINT CURVE';
    btn.addEventListener('click', () => {
        console.log(JSON.stringify({
            'startPoint': {
                'x': settings.start.x,
                'y': settings.start.y,
                'z': settings.start.z
            },
            'controlPoint1': {
                'x': settings.c1.x,
                'y': settings.c1.y,
                'z': settings.c1.z
            },
            'controlPoint2': {
                'x': settings.c2.x,
                'y': settings.c2.y,
                'z': settings.c2.z
            },
            'endPoint': {
                'x': settings.end.x,
                'y': settings.end.y,
                'z': settings.end.z
            }
        }, null, 4));
    });
    document.body.append(btn);

    document.getElementById('fileInput').addEventListener('change', async function(event) {
        const file = event.target.files[0];

        if (file) {
            if (ring) scene.remove(ring);

            ringG = await loadSTL(file);
            ring = new THREE.Mesh(ringG, material);
            scene.add(ring);
        }
    });

    document.body.addEventListener('keydown', e => {

        settings.step = Number(settings.step);

        if (e.key === ' ') {
            if (settings.currentControl === 'stl position / rotation') {
                settings.currentControl = 'start / end points';
            } else if (settings.currentControl === 'start / end points') {
                settings.currentControl = 'control points';
            } else {
                settings.currentControl = 'stl position / rotation';
            }
        }

        if (e.key === 'm') {
            if (settings.step === 0.25) {
                settings.step = 0.1;
            } else if (settings.step === 0.1) {
                settings.step = 0.01;
            } else {
                settings.step = 0.25;
            }
        }

        if (settings.currentControl === 'stl position / rotation') {

            if (e.key === 'q') settings.stl.position.x += settings.step;
            if (e.key === 'a') settings.stl.position.x -= settings.step;

            if (e.key === 'w') settings.stl.position.y += settings.step;
            if (e.key === 's') settings.stl.position.y -= settings.step;

            if (e.key === 'e') settings.stl.position.z += settings.step;
            if (e.key === 'd') settings.stl.position.z -= settings.step;

            if (e.key === 'u') settings.stl.rotation.x += settings.step;
            if (e.key === 'j') settings.stl.rotation.x -= settings.step;

            if (e.key === 'i') settings.stl.rotation.y += settings.step;
            if (e.key === 'k') settings.stl.rotation.y -= settings.step;

            if (e.key === 'o') settings.stl.rotation.z += settings.step;
            if (e.key === 'l') settings.stl.rotation.z -= settings.step;

        }

        if (settings.currentControl === 'start / end points') {

            if (e.key === 'q') settings.start.x += settings.step;
            if (e.key === 'a') settings.start.x -= settings.step;

            if (e.key === 'w') settings.start.y += settings.step;
            if (e.key === 's') settings.start.y -= settings.step;

            if (e.key === 'e') settings.start.z += settings.step;
            if (e.key === 'd') settings.start.z -= settings.step;

            if (e.key === 'u') settings.end.x += settings.step;
            if (e.key === 'j') settings.end.x -= settings.step;

            if (e.key === 'i') settings.end.y += settings.step;
            if (e.key === 'k') settings.end.y -= settings.step;

            if (e.key === 'o') settings.end.z += settings.step;
            if (e.key === 'l') settings.end.z -= settings.step;

        }

        if (settings.currentControl === 'control points') {

            if (e.key === 'q') settings.c1.x += settings.step;
            if (e.key === 'a') settings.c1.x -= settings.step;

            if (e.key === 'w') settings.c1.y += settings.step;
            if (e.key === 's') settings.c1.y -= settings.step;

            if (e.key === 'e') settings.c1.z += settings.step;
            if (e.key === 'd') settings.c1.z -= settings.step;

            if (e.key === 'u') settings.c2.x += settings.step;
            if (e.key === 'j') settings.c2.x -= settings.step;

            if (e.key === 'i') settings.c2.y += settings.step;
            if (e.key === 'k') settings.c2.y -= settings.step;

            if (e.key === 'o') settings.c2.z += settings.step;
            if (e.key === 'l') settings.c2.z -= settings.step;

        }

        redraw();
    });
})();