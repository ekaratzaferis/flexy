import * as THREE from 'three';
import fitCurve from 'fit-curve';
import * as flexy from '../../flexy';
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

function render() {
    renderer.render(scene, camera);
}

controls.addEventListener('change', function() {
    render();
});

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

render();

let tube1; let tube2; let ring; let ringG; let plane1; let plane2; let sphere; let oldDesignCenter; let sphereHelper; const arrows = [];

(async function() {
    const material = new THREE.MeshNormalMaterial({ wireframe: false });
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
                    gltf => {
                        resolve(gltf.scene.children.find(c => c.name === 'jewel').geometry);
                        // resolve(gltf.scene.children[2].geometry);
                    }
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
            width: 15,
            height: 10
        },
        plane2: {
            rotation: 0,
            width: 15,
            height: 10
        },
        rays: {
            thrown: false
        },
        other: {
            hidePlanes: false,
            hideTextHelper: true,
            selectingPoint: false,
            normalRotation: 0
        },
        designTransformation: {},
        sphereIntersection: {},
        oldDesignCenterData: {}
    };

    const textHelper = await (async function() {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderPath('vendor/draco/gltf/');
        gltfLoader.setDRACOLoader(dracoLoader);

        return await new Promise(res => {
            gltfLoader.load(
                './vendor/helper.gltf',
                function(gltf) {
                    res(gltf.scene.children[0].geometry);
                }
            );
        });
    })();
    const textHelperMesh = new THREE.Mesh(textHelper, material);

    redraw();

    // --------- GUI Sliders --------- //
    const gui = new dat.GUI();

    const otherSettings = gui.addFolder('Props');
    otherSettings.open();
    otherSettings.add(settings.other, 'hidePlanes').onChange(redraw);
    otherSettings.add(settings.other, 'hideTextHelper').onChange(redraw);

    // const modelPosition = gui.addFolder('Translate Jewel');
    // modelPosition.open();
    // modelPosition.add(settings.model.position, 'x', -10, 10, 0.01).onChange(redraw).listen();
    // modelPosition.add(settings.model.position, 'y', -10, 10, 0.01).onChange(redraw).listen();
    // modelPosition.add(settings.model.position, 'z', -10, 10, 0.01).onChange(redraw).listen();
    // const modelRotation = gui.addFolder('Rotate Jewel');
    // modelRotation.open();
    // modelRotation.add(settings.model.rotation, 'x', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw).listen();
    // modelRotation.add(settings.model.rotation, 'y', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw).listen();
    // modelRotation.add(settings.model.rotation, 'z', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw).listen();

    const plane1Dimensions = gui.addFolder('Plane 1');
    plane1Dimensions.open();
    plane1Dimensions.add(settings.plane1, 'width', 0, 20, 0.01).onChange(redraw);
    plane1Dimensions.add(settings.plane1, 'rotation', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw);

    const plane2Dimensions = gui.addFolder('Plane 2 Dimensions');
    plane2Dimensions.open();
    plane2Dimensions.add(settings.plane2, 'width', 0, 20, 0.01).onChange(redraw);
    plane2Dimensions.add(settings.plane2, 'rotation', -2 * Math.PI, 2 * Math.PI, 0.01).onChange(redraw);

    // --------- DRAW SCENE --------- //
    function redraw() {

        if (tube1) scene.remove(tube1);
        if (tube2) scene.remove(tube2);
        if (plane1) scene.remove(plane1);
        if (plane2) scene.remove(plane2);
        if (textHelperMesh) scene.remove(textHelperMesh);
        if (arrows.length) for (const arrow of arrows) scene.remove(arrow);

        if (settings.other.hidePlanes === false && settings.rays.thrown === false) {

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

        // moves rings
        if (settings.designTransformation.quaternion) {
            ring.position.set(0, 0, 0);
            ring.rotation.set(0, 0, 0);
            const q = settings.designTransformation.quaternion.clone();
            const p = settings.designTransformation.point.clone();
            ring.setRotationFromQuaternion(q);
            const pointWithQuaterntion = p.applyQuaternion(q);
            ring.position.set(-pointWithQuaterntion.x, -pointWithQuaterntion.y, -pointWithQuaterntion.z);
        }

        // draws sphere
        if (settings.sphereIntersection.point) {
            if (sphere) scene.remove(sphere);
            if (sphereHelper) scene.remove(sphereHelper);

            const geometry = new THREE.SphereGeometry(0.1, 32, 16);
            const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
            sphere = new THREE.Mesh(geometry, material);

            const point = settings.sphereIntersection.point.clone();
            const normal = settings.sphereIntersection.normal.clone();
            sphere.position.set(point.x, point.y, 0);
            sphereHelper = new THREE.ArrowHelper(normal, point, 1, 0xffff00);

            if (settings.designTransformation.quaternion) {
                sphere.position.set(0, 0, 0);
                sphereHelper = new THREE.ArrowHelper(normal.clone().applyQuaternion(settings.designTransformation.quaternion), new THREE.Vector3(0, 0, 0), 1, 0xffff00);
            }

            scene.add(sphere);
            scene.add(sphereHelper);
        }

        // draws old center
        if (settings.oldDesignCenterData.point) {
            if (oldDesignCenter) scene.remove(oldDesignCenter);

            const geometry = new THREE.SphereGeometry(0.1, 32, 16);
            const material = new THREE.MeshBasicMaterial({ color: '#00ff00' });
            oldDesignCenter = new THREE.Mesh(geometry, material);

            const point = settings.oldDesignCenterData.point.clone();
            oldDesignCenter.position.set(point.x, point.y, 0);

            scene.add(oldDesignCenter);
        }

        // draws curves
        if (settings.curve1.calced) {
            const f = new THREE.CubicBezierCurve3(settings.curve1.start, settings.curve1.c1, settings.curve1.c2, settings.curve1.end);
            tube1 = createTubeMeshFromCurve(f);
            scene.add(tube1);
        }
        if (settings.curve2.calced) {
            const f = new THREE.CubicBezierCurve3(settings.curve2.start, settings.curve2.c1, settings.curve2.c2, settings.curve2.end);
            tube2 = createTubeMeshFromCurve(f);
            scene.add(tube2);
        }

        // bends text geometry //
        if (settings.curve1.calced && settings.curve2.calced) {
            bendArea();
        }
        if (settings.other.hideTextHelper === false) {
            scene.add(textHelperMesh);
        }

        render();
    }

    function updateIntersectionNormal() {
        let normal;
        if (settings.sphereIntersection.normalOriginal) {
            normal = settings.sphereIntersection.normalOriginal.clone();
        } else {
            settings.sphereIntersection.normalOriginal = settings.sphereIntersection.normal.clone();
            normal = settings.sphereIntersection.normal.clone();
        }
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationZ(settings.other.normalRotation);
        normal.applyMatrix4(rotationMatrix);
        settings.sphereIntersection.normal = normal.clone();
        redraw();
    }

    function bendArea() {
        // first bend on z
        flexy.bend({
            THREE,
            curve: new THREE.CubicBezierCurve3(settings.curve2.start, settings.curve2.c1, settings.curve2.c2, settings.curve2.end),
            orientation: new THREE.Vector3(1, 0, 0),
            bufferGeometry: textHelperMesh.geometry,
            axis: 'z',
            preserveDimensions: false,
            scene
        });
        // then on x
        flexy.bend({
            THREE,
            curve: new THREE.CubicBezierCurve3(settings.curve1.start, settings.curve1.c1, settings.curve1.c2, settings.curve1.end),
            orientation: new THREE.Vector3(0, 0, 1),
            bufferGeometry: textHelperMesh.geometry,
            axis: 'x',
            preserveDimensions: false,
            scene
        });
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

    function calculationTransformations() {

        const normal = settings.sphereIntersection.normal.clone();
        const yAxis = new THREE.Vector3(0, 1, 0);
        const rotationAxis = new THREE.Vector3().crossVectors(normal, yAxis).normalize();
        const angle = Math.acos(normal.dot(yAxis));
        const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);

        settings.designTransformation.quaternion = quaternion.clone();
        settings.designTransformation.point = settings.sphereIntersection.point.clone();

        settings.designTransformation.dataJSON = {
            position: settings.designTransformation.point.clone(),
            normal: settings.sphereIntersection.normal.clone()
        };
    }

    // --------- BUTTONS --------- //
    const btnUpload = document.createElement('button');
    btnUpload.style.position = 'absolute';
    btnUpload.style.top = '10px';
    btnUpload.style.left = '10px';
    btnUpload.style.border = 0;
    btnUpload.style.background = 'blueviolet';
    btnUpload.style.color = 'white';
    btnUpload.style.padding = '7px 14px';
    btnUpload.style.cursor = 'pointer';
    btnUpload.innerHTML = 'UPLOAD GTLF';
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
            btnUpload.style.background = 'green';
        }
        redraw();
    });

    const btnSelectPoint = document.createElement('button');
    btnSelectPoint.style.position = 'absolute';
    btnSelectPoint.style.top = '50px';
    btnSelectPoint.style.left = '10px';
    btnSelectPoint.style.border = 0;
    btnSelectPoint.style.background = 'blueviolet';
    btnSelectPoint.style.color = 'white';
    btnSelectPoint.style.padding = '7px 14px';
    btnSelectPoint.style.cursor = 'pointer';
    btnSelectPoint.innerHTML = 'SELECT POINT';
    btnSelectPoint.addEventListener('click', event => {
        if (settings.other.selectingPoint === true) {
            settings.other.selectingPoint = false;
            btnSelectPoint.style.background = 'blueviolet';
            btnSelectPoint.innerHTML = 'SELECT POINT';
            event.stopImmediatePropagation();
        } else {
            btnSelectPoint.style.background = 'orange';
            settings.other.selectingPoint = true;

            btnSelectPoint.innerHTML = 'CLICK ON THE JEWEL';
            event.stopImmediatePropagation();

            document.body.onclick = null;
            document.body.onclick = event => {
                const mouse = new THREE.Vector2();
                const raycaster = new THREE.Raycaster();
                raycaster.firstHitOnly = true;

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);

                // only target the ring //
                const intersects = raycaster.intersectObjects(scene.children.filter(c => c.type === 'Mesh' && c.geometry.type !== 'BoxGeometry' && c.geometry.type !== 'SphereGeometry'), true); // Recursive

                if (intersects.length > 0 && intersects[0].face) {
                    settings.sphereIntersection = {
                        point: intersects[0].point.clone(),
                        normal: intersects[0].face.normal.clone()
                    };
                    otherSettings.add(settings.other, 'normalRotation', -Math.PI, Math.PI, 0.1).onChange(updateIntersectionNormal);
                    redraw();
                    document.body.onclick = null;
                    btnSelectPoint.style.background = 'green';
                    btnSelectPoint.innerHTML = 'DESIGN CENTER SELECTED';
                    settings.other.selectingPoint = false;
                } else {
                    btnSelectPoint.innerHTML = 'TARGET THE STL';
                }
            };
        }
    });
    document.body.append(btnSelectPoint);

    const btnMove = document.createElement('button');
    btnMove.style.position = 'absolute';
    btnMove.style.top = '90px';
    btnMove.style.left = '10px';
    btnMove.style.border = 0;
    btnMove.style.background = 'blueviolet';
    btnMove.style.color = 'white';
    btnMove.style.padding = '7px 14px';
    btnMove.style.cursor = 'pointer';
    btnMove.innerHTML = 'MOVE JEWEL';
    btnMove.addEventListener('click', () => {
        calculationTransformations();
        redraw();
        btnMove.innerHTML = 'JEWEL ALIGNED WITH DESIGN';
        btnMove.style.background = 'green';
    });
    document.body.append(btnMove);

    const btnCasters = document.createElement('button');
    btnCasters.style.position = 'absolute';
    btnCasters.style.top = '130px';
    btnCasters.style.left = '10px';
    btnCasters.style.border = 0;
    btnCasters.style.background = 'blueviolet';
    btnCasters.style.color = 'white';
    btnCasters.style.padding = '7px 14px';
    btnCasters.style.cursor = 'pointer';
    btnCasters.innerHTML = 'THROW RAYCASTERS';
    btnCasters.addEventListener('click', () => {
        if (settings.curve1.calced === false && settings.curve2.calced === false) {
            throwCaster();
            btnCasters.innerHTML = 'RESET';
            btnCasters.style.background = 'green';
        } else {
            settings.curve1.calced = false;
            settings.curve2.calced = false;
            redraw();
            btnCasters.innerHTML = 'THROW CASTERS';
            btnCasters.style.background = 'blueviolet';
        }
    });
    document.body.append(btnCasters);

    const btn = document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.top = '170px';
    btn.style.left = '10px';
    btn.style.border = 0;
    btn.style.background = 'blueviolet';
    btn.style.color = 'white';
    btn.style.padding = '7px 14px';
    btn.style.cursor = 'pointer';
    btn.innerHTML = 'PRINT BEND DATA';
    btn.addEventListener('click', () => {
        const rightArea = [
            {
                'flexy': true,
                'axis': 'z',
                'transformation': {
                    'position': {
                        'x': settings.designTransformation.dataJSON.position.x,
                        'y': settings.designTransformation.dataJSON.position.y,
                        'z': 0
                    },
                    'normal': {
                        'x': settings.designTransformation.dataJSON.normal.x,
                        'y': settings.designTransformation.dataJSON.normal.y,
                        'z': 0
                    }
                },
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
                'transformation': {
                    'position': {
                        'x': settings.designTransformation.dataJSON.position.x,
                        'y': settings.designTransformation.dataJSON.position.y,
                        'z': settings.designTransformation.dataJSON.position.z
                    },
                    'normal': {
                        'x': settings.designTransformation.dataJSON.normal.x,
                        'y': settings.designTransformation.dataJSON.normal.y,
                        'z': settings.designTransformation.dataJSON.normal.z
                    }
                },
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
        ];
        const xAxisBend = rightArea.find(b => b.axis === 'x');
        const zAxisBend = rightArea.find(b => b.axis === 'z');

        const leftArea = JSON.parse(JSON.stringify(rightArea));

        for (let i = 0; i < leftArea.length; i++) {
            if (leftArea[i].axis === 'x') {
                leftArea[i].transformation.position.x = -xAxisBend.transformation.position.x;
                leftArea[i].transformation.normal.x = -xAxisBend.transformation.normal.x;
            }
            if (leftArea[i].axis === 'z') {
                leftArea[i].transformation.position.x = -zAxisBend.transformation.position.x;
                leftArea[i].transformation.normal.x = -zAxisBend.transformation.normal.x;
            }
        }

        console.log('DATA FOR LEFT AREA');
        console.log(JSON.stringify(leftArea));
        console.log('DATA FOR RIGHT AREA');
        console.log(JSON.stringify(rightArea));
        btn.innerHTML = 'COPIED!';
    });
    document.body.append(btn);

    const loadExistingData = document.createElement('button');
    loadExistingData.style.position = 'absolute';
    loadExistingData.style.bottom = '50px';
    loadExistingData.style.left = '10px';
    loadExistingData.style.border = 0;
    loadExistingData.style.background = 'blueviolet';
    loadExistingData.style.color = 'white';
    loadExistingData.style.padding = '7px 14px';
    loadExistingData.style.cursor = 'pointer';
    loadExistingData.innerHTML = 'LOAD DATA JSON';
    loadExistingData.addEventListener('click', () => {
        const data = JSON.parse(prompt('COPY & PASTE'));
        const designCenter = new THREE.Vector3(data[0].transformation.position.x, data[0].transformation.position.y, data[0].transformation.position.z);
        settings.oldDesignCenterData.point = designCenter;
        redraw();
    });
    document.body.append(loadExistingData);

    const mirrorOldCenter = document.createElement('button');
    mirrorOldCenter.style.position = 'absolute';
    mirrorOldCenter.style.bottom = '10px';
    mirrorOldCenter.style.left = '10px';
    mirrorOldCenter.style.border = 0;
    mirrorOldCenter.style.background = 'blueviolet';
    mirrorOldCenter.style.color = 'white';
    mirrorOldCenter.style.padding = '7px 14px';
    mirrorOldCenter.style.cursor = 'pointer';
    mirrorOldCenter.innerHTML = 'MIRROR TO THE OTHER SIDE';
    mirrorOldCenter.addEventListener('click', () => {
        if (settings.oldDesignCenterData.point) {
            const newPoint = new THREE.Vector3(-settings.oldDesignCenterData.point.x, settings.oldDesignCenterData.point.y, settings.oldDesignCenterData.point.z);
            settings.oldDesignCenterData.point = newPoint.clone();
            redraw();
        } else {
            mirrorOldCenter.innerHTML = 'LOAD JSON DATA FIRST';
            mirrorOldCenter.style.background = 'red';
            setTimeout(() => {
                mirrorOldCenter.innerHTML = 'MIRROR TO THE OTHER SIDE';
                mirrorOldCenter.style.background = 'blueviolet';
            }, 1500);
        }
    });
    document.body.append(mirrorOldCenter);
})();