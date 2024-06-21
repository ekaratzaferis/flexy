import * as THREE from 'three';
import * as flexy from '../../flexy';
import * as fitCurve from 'fit-curve';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ----------------------------------- //
// SETUP THREEJS                       //
// ----------------------------------- //

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 5, 10);

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
    const tubeGeometry = new THREE.TubeGeometry(path, numPoints, 0.05, 8, false);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    return tubeMesh;
}

animate();

let tube1; let tube2; let ring; let ringG; let area; let plane1; let plane2; const arrows = [];

(async function() {
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    // const materialBold = new THREE.MeshNormalMaterial({ wireframe: false });

    const loadGLTF = function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                const gltfLoader = new GLTFLoader();
                const dracoLoader = new DRACOLoader();

                dracoLoader.setDecoderPath('vendor/draco/gltf/');
                gltfLoader.setDRACOLoader(dracoLoader);

                gltfLoader.parse(
                    reader.result,
                    '',
                    gltf => resolve(gltf.scene.children[2].geometry)
                );
            };

            reader.onerror = function(error) {
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const settings = {
        curve1: {
            calced: false,
            start: {
                x: -5,
                y: 0,
                z: 0
            },
            end: {
                x: 5,
                y: 0,
                z: 0
            },
            c1: {
                x: -2,
                y: 0,
                z: 0
            },
            c2: {
                x: 2,
                y: 0,
                z: 0
            }
        },
        curve2: {
            calced: false,
            start: {
                x: -5,
                y: 0,
                z: 0
            },
            end: {
                x: 5,
                y: 0,
                z: 0
            },
            c1: {
                x: -2,
                y: 0,
                z: 0
            },
            c2: {
                x: 2,
                y: 0,
                z: 0
            }
        },
        model: {
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
        plane1: {
            rotation: 0,
            width: 5,
            height: 5
        },
        plane2: {
            rotation: 0,
            width: 5,
            height: 5
        },
        rays: {
            thrown: false
        }
    };

    const textHelper = await (async function() {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderPath('vendor/draco/gltf/');
        gltfLoader.setDRACOLoader(dracoLoader);

        return await new Promise(res => {
            gltfLoader.load(
                'helper.gltf',
                function(gltf) {
                    res(gltf.scene.children[0].geometry);
                }
            );
        });
    })();
    const textHelperMesh = new THREE.Mesh(textHelper, material);
    scene.add(textHelperMesh);

    redraw();

    // --------- GUI Sliders --------- //
    const gui = new dat.GUI();

    const modelPosition = gui.addFolder('Translate Model');
    modelPosition.open();
    modelPosition.add(settings.model.position, 'x', -10, 10, 0.01).onChange(redraw);
    modelPosition.add(settings.model.position, 'y', -10, 10, 0.01).onChange(redraw);
    modelPosition.add(settings.model.position, 'z', -10, 10, 0.01).onChange(redraw);
    const modelRotation = gui.addFolder('Rotate Model');
    modelRotation.open();
    modelRotation.add(settings.model.rotation, 'x', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw);
    modelRotation.add(settings.model.rotation, 'y', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw);
    modelRotation.add(settings.model.rotation, 'z', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw);

    const plane1Dimensions = gui.addFolder('Plane 1');
    plane1Dimensions.open();
    // plane1Dimensions.add(settings.plane1, 'height', -10, 10, 0.01).onChange(redraw);
    plane1Dimensions.add(settings.plane1, 'width', -10, 10, 0.01).onChange(redraw);
    plane1Dimensions.add(settings.plane1, 'rotation', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw);

    const plane2Dimensions = gui.addFolder('Plane 2 Dimensions');
    plane2Dimensions.open();
    // plane2Dimensions.add(settings.plane2, 'height', -10, 10, 0.01).onChange(redraw);
    plane2Dimensions.add(settings.plane2, 'width', -10, 10, 0.01).onChange(redraw);
    plane2Dimensions.add(settings.plane2, 'rotation', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw);

    // --------- DRAW SCENE --------- //
    function redraw() {

        if (tube1) scene.remove(tube1);
        if (tube2) scene.remove(tube2);
        if (plane1) scene.remove(plane1);
        if (plane2) scene.remove(plane2);
        if (area) scene.remove(area);
        if (arrows.length) for (const arrow of arrows) scene.remove(arrow);

        if (settings.rays.thrown === false) {

            // rotation planes //
            plane1 = new THREE.Mesh(new THREE.BoxGeometry(settings.plane1.width, settings.plane1.height, 0.01, 3, 3, 3), material);
            plane1.rotation.x = settings.plane1.rotation;
            scene.add(plane1);

            plane2 = new THREE.Mesh(new THREE.BoxGeometry(0.01, settings.plane2.height, settings.plane2.width, 3, 3, 3), material);
            plane2.rotation.x = settings.plane2.rotation;
            scene.add(plane2);

            // arrow helpers //
            const numArrows = 10; // Number of arrows needed
            const arrowSpacing = settings.plane1.width / (numArrows - 1);
            for (let i = 0; i < numArrows; i++) {

                const direction = new THREE.Vector3(0, -1, 0);

                // // Calculate the arrow's offset from the center of the box
                const offsetX = -settings.plane1.width / 2 + i * arrowSpacing;
                const offsetY = (settings.plane1.height / 2) + 1;
                const offset = new THREE.Vector3(offsetX, offsetY, 0);

                // // Apply the box's rotation to the offset
                offset.applyEuler(plane1.rotation);
                direction.applyEuler(plane1.rotation);

                const arr = new THREE.ArrowHelper(direction, new THREE.Vector3(0, 0, 0), 1, 0x00ff00);
                arr.position.copy(plane1.position).add(offset);

                arrows.push(arr);
                scene.add(arr);
            }

            const numArrows2 = 10; // Number of arrows needed
            const arrowSpacing2 = settings.plane2.width / (numArrows2 - 1);
            for (let i = 0; i < numArrows2; i++) {

                const direction = new THREE.Vector3(0, -1, 0);

                // // Calculate the arrow's offset from the center of the box
                const offsetZ = -settings.plane2.width / 2 + i * arrowSpacing2;
                const offsetY = (settings.plane2.height / 2) + 1;
                const offset = new THREE.Vector3(0, offsetY, offsetZ);

                // // Apply the box's rotation to the offset
                offset.applyEuler(plane2.rotation);
                direction.applyEuler(plane2.rotation);

                const arr = new THREE.ArrowHelper(direction, new THREE.Vector3(0, 0, 0), 1, 0xff0000);
                arr.position.copy(plane2.position).add(offset);

                arrows.push(arr);
                scene.add(arr);
            }

        }

        // jewel //
        if (ring) {
            ring.position.set(settings.model.position.x, settings.model.position.y, settings.model.position.z);
            ring.rotation.set(settings.model.rotation.x, settings.model.rotation.y, settings.model.rotation.z);
        }

        if (settings.curve1.calced) {
            const f = new THREE.CubicBezierCurve3(settings.curve1.start, settings.curve1.c1, settings.curve1.c2, settings.curve1.end);
            tube1 = createTubeMeshFromCurve(f);
            // createBallIndicators(settings.curve1);
            scene.add(tube1);
        }

        if (settings.curve2.calced) {
            const f = new THREE.CubicBezierCurve3(settings.curve2.start, settings.curve2.c1, settings.curve2.c2, settings.curve2.end);
            tube2 = createTubeMeshFromCurve(f);
            // createBallIndicators(settings.curve2);
            scene.add(tube2);
        }

        if (settings.curve1.calced && settings.curve2.calced) {
            bendArea();
            scene.add(area);
        }
    }

    function bendArea() {
        // first bend on z
        flexy.bend({
            THREE,
            curve: new THREE.CubicBezierCurve3(settings.curve2.start, settings.curve2.c1, settings.curve2.c2, settings.curve2.end),
            // orientation: settings.curve2.bendAxis === 'x' ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0),
            orientation: new THREE.Vector3(1, 0, 0),
            bufferGeometry: textHelperMesh.geometry,
            axis: 'z',
            preserveDimensions: true,
            scene
        });
        // then on x
        flexy.bend({
            THREE,
            curve: new THREE.CubicBezierCurve3(settings.curve1.start, settings.curve1.c1, settings.curve1.c2, settings.curve1.end),
            orientation: new THREE.Vector3(0, 0, 1),
            bufferGeometry: textHelperMesh.geometry,
            axis: 'x',
            preserveDimensions: true,
            scene
        });
        // y correction //
        settings.curve2.correction = curveAmplitude(settings.curve2);
        textHelperMesh.position.y += settings.curve2.correction;
    }

    function throwCaster() {
        const error = 10;
        const pointCurve1 = [];
        const pointCurve2 = [];

        const numArrows = 10; // Number of arrows needed
        const arrowSpacing = settings.plane1.width / (numArrows - 1);
        const arrowSpacing2 = settings.plane2.width / (numArrows - 1);
        for (let i = 0; i < numArrows; i++) {

            const direction = new THREE.Vector3(0, -1, 0);
            const X = -settings.plane1.width / 2 + i * arrowSpacing;
            const Y = (settings.plane1.height / 2) + 1;
            const origin = new THREE.Vector3(X, Y, 0);

            const raycaster = new THREE.Raycaster();
            raycaster.firstHitOnly = true;
            raycaster.set(origin, direction);

            const intersects = raycaster.intersectObject(ring, true);
            // const arrowHelper = new THREE.ArrowHelper(
            //     new THREE.Vector3(0, 1, 0),
            //     intersects[0].point,
            //     settings.plane1.height,
            //     0xfff
            // );
            // scene.add(arrowHelper);
            pointCurve1.push([intersects[0].point.x, intersects[0].point.y]);
        }

        const bezierCurves1 = fitCurve(pointCurve1, error);
        settings.curve1.start.x = bezierCurves1[0][0][0];
        settings.curve1.start.y = bezierCurves1[0][0][1];
        settings.curve1.start.z = 0;

        settings.curve1.c1.x = bezierCurves1[0][1][0];
        settings.curve1.c1.y = bezierCurves1[0][1][1];
        settings.curve1.c1.z = 0;

        settings.curve1.c2.x = bezierCurves1[0][2][0];
        settings.curve1.c2.y = bezierCurves1[0][2][1];
        settings.curve1.c2.z = 0;

        settings.curve1.end.x = bezierCurves1[0][3][0];
        settings.curve1.end.y = bezierCurves1[0][3][1];
        settings.curve1.end.z = 0;

        settings.curve1.calced = true;

        for (let i = 0; i < numArrows; i++) {

            const direction = new THREE.Vector3(0, -1, 0);
            const Y = (settings.plane2.height / 2) + 1;
            const Z = -settings.plane2.width / 2 + i * arrowSpacing2;
            const origin = new THREE.Vector3(0, Y, Z);

            const raycaster = new THREE.Raycaster();
            raycaster.firstHitOnly = true;
            raycaster.set(origin, direction);

            const intersects = raycaster.intersectObject(ring, true);
            // const arrowHelper = new THREE.ArrowHelper(
            //     new THREE.Vector3(0, 1, 0),
            //     intersects[0].point,
            //     settings.plane1.height,
            //     0xfff
            // );
            // scene.add(arrowHelper);
            pointCurve2.push([intersects[0].point.y, intersects[0].point.z]);
        }
        const bezierCurves2 = fitCurve(pointCurve2, error);
        settings.curve2.start.x = 0;
        settings.curve2.start.y = bezierCurves2[0][0][0];
        settings.curve2.start.z = bezierCurves2[0][0][1];

        settings.curve2.c1.x = 0;
        settings.curve2.c1.y = bezierCurves2[0][1][0];
        settings.curve2.c1.z = bezierCurves2[0][1][1];

        settings.curve2.c2.x = 0;
        settings.curve2.c2.y = bezierCurves2[0][2][0];
        settings.curve2.c2.z = bezierCurves2[0][2][1];

        settings.curve2.end.x = 0;
        settings.curve2.end.y = bezierCurves2[0][3][0];
        settings.curve2.end.z = bezierCurves2[0][3][1];

        settings.curve2.calced = true;

        settings.rays.thrown = true;
        redraw();
    }

    function curveAmplitude(data) {
        const curve = new THREE.CubicBezierCurve3(data.start, data.c1, data.c2, data.end);
        const line = new THREE.Line3(data.start, data.end);
        const numPoints = 100;
        const samplePoints = curve.getPoints(numPoints);

        let maxDistance = 0;
        samplePoints.forEach(point => {
            const closestPointOnLine = line.closestPointToPoint(point, true, new THREE.Vector3());
            const distance = point.distanceTo(closestPointOnLine);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        });

        return maxDistance;
    }

    // --------- BUTTONS --------- //
    const btnUpload = document.createElement('button');
    btnUpload.style.position = 'absolute';
    btnUpload.style.top = 0;
    btnUpload.style.left = 0;
    btnUpload.innerHTML = 'UPLOAD MODEL';
    btnUpload.addEventListener('click', async () => {
        document.getElementById('fileInput').click();
    });
    document.body.append(btnUpload);

    document.getElementById('fileInput').addEventListener('change', async function(event) {
        const file = event.target.files[0];

        if (file) {
            if (ring) scene.remove(ring);
            ringG = await loadGLTF(file);
            ring = new THREE.Mesh(ringG, material);
            ring.material.side = THREE.DoubleSide;
            scene.add(ring);
        }
    });

    const rightArea = document.createElement('button');
    rightArea.style.position = 'absolute';
    rightArea.style.top = '25px';
    rightArea.style.left = 0;
    rightArea.innerHTML = 'RIGHT AREA ROTATION';
    rightArea.addEventListener('click', async () => {
        if (textHelperMesh) textHelperMesh.rotateY(Math.PI / 2);
    });
    document.body.append(rightArea);

    const leftArea = document.createElement('button');
    leftArea.style.position = 'absolute';
    leftArea.style.top = '50px';
    leftArea.style.left = 0;
    leftArea.innerHTML = 'LEFT AREA ROTATION';
    leftArea.addEventListener('click', async () => {
        if (textHelperMesh) textHelperMesh.rotateY(-Math.PI / 2);
    });
    document.body.append(leftArea);

    const btn = document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.bottom = 0;
    btn.style.left = 0;
    btn.innerHTML = 'PRINT CURVES';
    btn.addEventListener('click', () => {
        console.log(JSON.stringify([
            {
                'flexy': true,
                'axis': 'z',
                'curveParts': [
                    {
                        'startPoint': {
                            'x': settings.curve2.start.x,
                            'y': settings.curve2.start.y,
                            'z': settings.curve2.start.z
                        },
                        'controlPoint1': {
                            'x': settings.curve2.c1.x,
                            'y': settings.curve2.c1.y,
                            'z': settings.curve2.c1.z
                        },
                        'controlPoint2': {
                            'x': settings.curve2.c2.x,
                            'y': settings.curve2.c2.y,
                            'z': settings.curve2.c2.z
                        },
                        'endPoint': {
                            'x': settings.curve2.end.x,
                            'y': settings.curve2.end.y,
                            'z': settings.curve2.end.z
                        }
                    }
                ]
            },
            {
                'flexy': true,
                'axis': 'x',
                'curveParts': [
                    {
                        'startPoint': {
                            'x': settings.curve1.start.x,
                            'y': settings.curve1.start.y,
                            'z': settings.curve1.start.z
                        },
                        'controlPoint1': {
                            'x': settings.curve1.c1.x,
                            'y': settings.curve1.c1.y,
                            'z': settings.curve1.c1.z
                        },
                        'controlPoint2': {
                            'x': settings.curve1.c2.x,
                            'y': settings.curve1.c2.y,
                            'z': settings.curve1.c2.z
                        },
                        'endPoint': {
                            'x': settings.curve1.end.x,
                            'y': settings.curve1.end.y,
                            'z': settings.curve1.end.z
                        }
                    }
                ]
            }
        ]));
    });
    document.body.append(btn);

    const btnCasters = document.createElement('button');
    btnCasters.style.position = 'absolute';
    btnCasters.style.bottom = 0;
    btnCasters.style.right = 0;
    btnCasters.innerHTML = 'THROW RAYCASTERS';
    btnCasters.addEventListener('click', () => {
        if (settings.curve1.calced === false && settings.curve2.calced === false) {
            throwCaster();
            btnCasters.innerHTML = 'RESET';
        } else {
            settings.curve1.calced = false;
            settings.curve2.calced = false;
            redraw();
            btnCasters.innerHTML = 'THROW CASTERS';
        }
    });
    document.body.append(btnCasters);
})();