import * as flexy from '..';
import * as THREE from 'three';
import mapJSON from '../../map.json';
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

animate();

(async function() {
    const loader = new STLLoader();
    const material = new THREE.MeshNormalMaterial({ wireframe: false });
    const loadSTL = async function(name) {
        return new Promise(res => {
            loader.load(name, res);
        });
    };

    const designG = await loadSTL('topDesign.stl');
    const design = new THREE.Mesh(designG, material);
    design.position.y = -2;
    design.position.x = 10;
    design.rotateY(Math.PI / 2);
    design.rotateX(1);
    design.scale.x = 0.6;
    design.scale.y = 0.6;
    design.scale.z = 0.6;
    design.geometry.attributes.position.needsUpdate = true;
    scene.add(design);

    const ringG = await loadSTL('unprocessed.stl');
    const ring = new THREE.Mesh(ringG, material);
    scene.add(ring);

    // const pointToFaceMap = flexy.getPointToFaceNormalMap({
    //     THREE,
    //     surface: ring,
    //     resolution: 100,
    //     castingRectangular: {
    //         A: new THREE.Vector3(7, 1, 4),
    //         B: new THREE.Vector3(7, 1, -4),
    //         C: new THREE.Vector3(11, -5, -4),
    //         D: new THREE.Vector3(11, -5, 4),
    //         direction: new THREE.Vector3(-6, -6, 0).normalize(),
    //     },
    //     scene
    // });
    // console.log(JSON.stringify(pointToFaceMap.data))

    const pointToFaceMap = {
        data: mapJSON,
        resolution: 100,
        castingRectangular: {
            A: new THREE.Vector3(7, 1, 4),
            B: new THREE.Vector3(7, 1, -4),
            C: new THREE.Vector3(11, -5, -4),
            D: new THREE.Vector3(11, -5, 4),
            direction: new THREE.Vector3(-6, -6, 0).normalize()
        }
    };

    flexy.wrap({
        THREE,
        pointToFaceNormalMap: pointToFaceMap,
        obj: design,
        scene
    });

    // design.rotateY(-Math.PI / 2);
    // design.rotateX(0);
    // design.rotateZ(-0.5);
    // design.position.y = -2.6;
    // design.position.x = 7;

    // design.position.y = 0;
    // design.position.x = 0;
    // design.rotateY(0);
    // design.rotateX(0);
    // design.rotateZ(0);

    const designProps = {
        scale: 0.6
    };
    const gui = new dat.GUI();
    const shapeFolder = gui.addFolder('Design');
    shapeFolder.open();
    shapeFolder.add(designProps, 'scale', 0.2, 1.2).onChange(() => {
        design.scale.x = designProps.scale;
        design.scale.y = designProps.scale;
        design.scale.z = designProps.scale;
        flexy.wrap({
            THREE,
            pointToFaceNormalMap: pointToFaceMap,
            obj: design,
            scene
        });
    });
})();