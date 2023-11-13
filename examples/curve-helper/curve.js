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
    const tubeGeometry = new THREE.TubeGeometry(path, numPoints, 0.1, 8, false);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    return tubeMesh;
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
        }
    };

    redraw();

    const gui = new dat.GUI();
    const startPointFolder = gui.addFolder('Start Point');
    startPointFolder.open();
    startPointFolder.add(settings.start, 'x', -20, 20).onChange(redraw);
    startPointFolder.add(settings.start, 'y', -20, 20).onChange(redraw);
    startPointFolder.add(settings.start, 'z', -20, 20).onChange(redraw);
    const c1PointFolder = gui.addFolder('Control Point 1');
    c1PointFolder.open();
    c1PointFolder.add(settings.c1, 'x', -20, 20).onChange(redraw);
    c1PointFolder.add(settings.c1, 'y', -20, 20).onChange(redraw);
    c1PointFolder.add(settings.c1, 'z', -20, 20).onChange(redraw);
    const c2PointFolder = gui.addFolder('Control Point 2');
    c2PointFolder.open();
    c2PointFolder.add(settings.c2, 'x', -20, 20).onChange(redraw);
    c2PointFolder.add(settings.c2, 'y', -20, 20).onChange(redraw);
    c2PointFolder.add(settings.c2, 'z', -20, 20).onChange(redraw);
    const endPointFolder = gui.addFolder('End Point');
    endPointFolder.open();
    endPointFolder.add(settings.end, 'x', -20, 20).onChange(redraw);
    endPointFolder.add(settings.end, 'y', -20, 20).onChange(redraw);
    endPointFolder.add(settings.end, 'z', -20, 20).onChange(redraw);

    function redraw() {
        startPoint = new THREE.Vector3(settings.start.x, settings.start.y, settings.start.z);
        controlPoint1 = new THREE.Vector3(settings.c1.x, settings.c1.y, settings.c1.z);
        controlPoint2 = new THREE.Vector3(settings.c2.x, settings.c2.y, settings.c2.z);
        endPoint = new THREE.Vector3(settings.end.x, settings.end.y, settings.end.z);

        scene.remove(tube);
        final = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
        tube = createTubeMeshFromCurve(final);
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
    btn.addEventListener('click', () => console.log(final));
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
})();