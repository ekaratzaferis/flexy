import * as THREE from 'three';
import * as flexy from '../flexy';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fitCurve from 'fit-curve';

// ════════════════════════════════════════════════════════
// THREE.js SCENE
// ════════════════════════════════════════════════════════

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 26);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// Insert before panels so it sits behind them in stacking order
document.body.insertBefore(renderer.domElement, document.body.firstChild);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

scene.add(new THREE.GridHelper(60, 30, 0x161b22, 0x0d1117));
scene.add(new THREE.AxesHelper(4));

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.08;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
}
animate();

// ════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════

const state = {
    geometryType: 'box',
    width: 20,
    height: 2,
    depth: 2,
    segments: 40,
    preserveDimensions: true,
    orbit: 0,
    wireframe: false,
    curvePlane: 'xy',
};

const wrapState = {
    torusRadius: 5,
    tubeRadius: 1.5,
    planeW: 16,
    planeH: 16,
    resolution: 24,
    showSourcePlane: true,
    showWrappedPlane: true,
};

// ════════════════════════════════════════════════════════
// DRAW CANVAS
// ════════════════════════════════════════════════════════

// World units that the canvas maps to — canvas (0,0) = world (-WORLD_HALF, +WORLD_HALF)
const WORLD_HALF = 12;

const drawCanvas = document.getElementById('draw-canvas');
const ctx = drawCanvas.getContext('2d');
const CANVAS_SIZE = drawCanvas.width; // 236, matches HTML attribute

let isDrawing = false;
let rawPoints  = [];     // [[px, py], …] canvas pixel coords while drawing
let fittedSegs = null;   // fit-curve output [[p0,cp1,cp2,p3], …] after release
let activeCurve = null;  // THREE curve currently being used (null = use default)

// ── Coordinate helpers ────────────────────────────────

// Canvas pixel → 2D "bend-space" coordinates
function canvasToBend2D(cx, cy) {
    const bx = (cx / CANVAS_SIZE - 0.5) * WORLD_HALF * 2;
    const by = -(cy / CANVAS_SIZE - 0.5) * WORLD_HALF * 2; // flip Y (screen ↓ = world ↑)
    return [bx, by];
}

// 2D bend-space → THREE.Vector3 depending on which plane is selected
function bend2DToVec3(bx, by) {
    if (state.curvePlane === 'xz') return new THREE.Vector3(bx, 0, by);
    return new THREE.Vector3(bx, by, 0); // 'xy'
}

// ── Build THREE curve from fit-curve output ───────────

function buildCurveFromFitted(segs) {
    const toVec = ([cx, cy]) => bend2DToVec3(...canvasToBend2D(cx, cy));

    if (segs.length === 1) {
        const [p0, cp1, cp2, p3] = segs[0];
        return new THREE.CubicBezierCurve3(toVec(p0), toVec(cp1), toVec(cp2), toVec(p3));
    }

    const path = new THREE.CurvePath();
    for (const [p0, cp1, cp2, p3] of segs) {
        path.add(new THREE.CubicBezierCurve3(toVec(p0), toVec(cp1), toVec(cp2), toVec(p3)));
    }
    return path;
}

// ── Default curve (shown until user draws) ────────────

function getDefaultCurve() {
    if (state.curvePlane === 'xz') {
        return new THREE.CubicBezierCurve3(
            new THREE.Vector3(-10, 0,  0),
            new THREE.Vector3( -5, 0,  8),
            new THREE.Vector3(  5, 0,  8),
            new THREE.Vector3( 10, 0,  0)
        );
    }
    return new THREE.CubicBezierCurve3(
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3( -5, 8, 0),
        new THREE.Vector3(  5, 8, 0),
        new THREE.Vector3( 10, 0, 0)
    );
}

// ── Canvas rendering ──────────────────────────────────

function drawBackground() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = '#0a0d12';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Minor grid
    const step = CANVAS_SIZE / 6;
    ctx.strokeStyle = '#161b22';
    ctx.lineWidth = 1;
    for (let x = step; x < CANVAS_SIZE; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_SIZE); ctx.stroke();
    }
    for (let y = step; y < CANVAS_SIZE; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_SIZE, y); ctx.stroke();
    }

    // Center axes
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(CANVAS_SIZE / 2, 0); ctx.lineTo(CANVAS_SIZE / 2, CANVAS_SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, CANVAS_SIZE / 2); ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE / 2); ctx.stroke();
}

function redrawCanvas() {
    drawBackground();

    if (!fittedSegs) {
        // Placeholder
        ctx.fillStyle = '#21262d';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('draw a curve here', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 9);
        ctx.fillText('left  →  right', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 9);
        return;
    }

    // Raw drawn path (faint underlay)
    if (rawPoints.length > 1) {
        ctx.strokeStyle = 'rgba(88, 166, 255, 0.16)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rawPoints[0][0], rawPoints[0][1]);
        for (const [x, y] of rawPoints) ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Fitted bezier (glowing)
    ctx.shadowColor = 'rgba(0, 229, 255, 0.45)';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fittedSegs[0][0][0], fittedSegs[0][0][1]);
    for (const [, cp1, cp2, p3] of fittedSegs) {
        ctx.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], p3[0], p3[1]);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Endpoint dots
    const start = fittedSegs[0][0];
    const end   = fittedSegs[fittedSegs.length - 1][3];
    for (const [px, py] of [start, end]) {
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ── Mouse / touch events ──────────────────────────────

function getCanvasPos(e) {
    const rect = drawCanvas.getBoundingClientRect();
    const sx = CANVAS_SIZE / rect.width;
    const sy = CANVAS_SIZE / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return [(src.clientX - rect.left) * sx, (src.clientY - rect.top) * sy];
}

drawCanvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDrawing = true;
    rawPoints = [getCanvasPos(e)];
    fittedSegs = null;
    drawBackground();
});

drawCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const p = getCanvasPos(e);
    const last = rawPoints[rawPoints.length - 1];
    const dx = p[0] - last[0], dy = p[1] - last[1];
    if (dx * dx + dy * dy < 25) return; // require ≥ 5 px movement

    rawPoints.push(p);

    // Live preview
    drawBackground();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rawPoints[0][0], rawPoints[0][1]);
    for (const [x, y] of rawPoints) ctx.lineTo(x, y);
    ctx.stroke();
});

function finalizeDraw() {
    if (!isDrawing) return;
    isDrawing = false;

    if (rawPoints.length < 4) {
        rawPoints = [];
        redrawCanvas();
        return;
    }

    fittedSegs  = fitCurve(rawPoints, 8);
    activeCurve = buildCurveFromFitted(fittedSegs);
    redrawCanvas();
    update();
}

drawCanvas.addEventListener('mouseup',    finalizeDraw);
drawCanvas.addEventListener('mouseleave', finalizeDraw);

// Clear
document.getElementById('clear-btn').addEventListener('click', () => {
    rawPoints   = [];
    fittedSegs  = null;
    activeCurve = null;
    redrawCanvas();
    update();
});

// Plane tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.curvePlane = btn.dataset.plane;
        // Remap existing drawn curve to the new plane
        if (fittedSegs) activeCurve = buildCurveFromFitted(fittedSegs);
        update();
    });
});

// ════════════════════════════════════════════════════════
// GEOMETRY FACTORY
// ════════════════════════════════════════════════════════

function buildGeometry() {
    const { geometryType: type, width, height, depth, segments } = state;

    switch (type) {
        case 'box':
            return new THREE.BoxGeometry(width, height, depth, segments, 4, 4);

        case 'plane':
            // Flat sheet in XY plane; width along X (bend axis), height along Y
            return new THREE.PlaneGeometry(width, height, segments, 4);

        case 'cylinder': {
            // Default cylinder is upright (height along Y).
            // Rotate 90° around Z so height aligns with X (the bend axis).
            const geo = new THREE.CylinderGeometry(height / 2, height / 2, width, 16, segments);
            geo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
            return geo;
        }

        default:
            return new THREE.BoxGeometry(width, height, depth, segments, 4, 4);
    }
}

// ════════════════════════════════════════════════════════
// SCENE UPDATE — BEND
// ════════════════════════════════════════════════════════

let sceneObjects = [];

function clearDynamic() {
    for (const obj of sceneObjects) scene.remove(obj);
    sceneObjects = [];
}

// The orientation vector is perpendicular to the curve's plane
function getOrientation() {
    return state.curvePlane === 'xz'
        ? new THREE.Vector3(0, 1, 0)   // Y ⊥ XZ plane
        : new THREE.Vector3(0, 0, 1);  // Z ⊥ XY plane
}

function update() {
    clearDynamic();

    const curve    = activeCurve || getDefaultCurve();
    const geometry = buildGeometry();
    const mat      = state.wireframe
        ? new THREE.MeshNormalMaterial({ wireframe: true })
        : new THREE.MeshNormalMaterial();

    flexy.bend({
        THREE,
        curve,
        orientation: getOrientation(),
        bufferGeometry: geometry,
        axis: 'x',
        preserveDimensions: state.preserveDimensions,
        orbit: state.orbit,
    });

    const mesh = new THREE.Mesh(geometry, mat);
    scene.add(mesh);
    sceneObjects.push(mesh);

    // Thin tube showing the curve path
    const pts  = curve.getPoints(200);
    const path = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
        new THREE.TubeGeometry(path, 200, 0.07, 8, false),
        new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 })
    );
    scene.add(tube);
    sceneObjects.push(tube);
}

// ════════════════════════════════════════════════════════
// SCENE UPDATE — WRAP
// ════════════════════════════════════════════════════════

function updateWrap() {
    clearDynamic();

    const { torusRadius, tubeRadius, planeW, planeH, resolution, showSourcePlane, showWrappedPlane } = wrapState;

    // ── Torus ──────────────────────────────────────────
    const torusMesh = new THREE.Mesh(
        new THREE.TorusGeometry(torusRadius, tubeRadius, 32, 100),
        new THREE.MeshNormalMaterial()
    );
    torusMesh.rotation.x = Math.PI / 2;
    scene.add(torusMesh);
    torusMesh.updateMatrixWorld(true);
    sceneObjects.push(torusMesh);

    // ── Casting rectangle (corners must match plane bounds exactly) ──
    const castingRectangular = {
        A: new THREE.Vector3(-planeW / 2, 20,  planeH / 2),
        B: new THREE.Vector3( planeW / 2, 20,  planeH / 2),
        C: new THREE.Vector3( planeW / 2, 20, -planeH / 2),
        D: new THREE.Vector3(-planeW / 2, 20, -planeH / 2),
        direction: new THREE.Vector3(0, -1, 0),
    };

    const map = flexy.getPointToFaceNormalMap({ THREE, surface: torusMesh, castingRectangular, resolution });

    // ── Source plane (display only) ────────────────────
    if (showSourcePlane) {
        const srcMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(planeW, planeH, resolution, resolution),
            new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.4 })
        );
        srcMesh.rotation.x = Math.PI / 2;
        srcMesh.position.y = 20;
        scene.add(srcMesh);
        sceneObjects.push(srcMesh);
    }

    // ── Wrap target ────────────────────────────────────
    const wrapTarget = new THREE.Mesh(
        new THREE.PlaneGeometry(planeW, planeH, resolution, resolution),
        new THREE.MeshNormalMaterial()
    );
    wrapTarget.rotation.x = Math.PI / 2;
    wrapTarget.position.y = 20;
    scene.add(wrapTarget);
    wrapTarget.updateMatrixWorld(true);
    sceneObjects.push(wrapTarget);

    flexy.wrap({ THREE, pointToFaceNormalMap: map, obj: wrapTarget });
    wrapTarget.geometry.computeVertexNormals();
    // PlaneGeometry + rotation.x = PI/2 maps local +Z → world -Y, so computed
    // normals point downward. Negate them so the top face is visible.
    const normals = wrapTarget.geometry.attributes.normal.array;
    for (let i = 0; i < normals.length; i++) normals[i] *= -1;
    wrapTarget.geometry.attributes.normal.needsUpdate = true;

    // Lift the result +3 so it sits just above the donut surface like a draped sheet.
    // The wrap already set vertex Y values to the intersection height (or 0 for misses),
    // so shifting the mesh up cleanly separates it from the torus for inspection.
    wrapTarget.position.y += 3;
    wrapTarget.visible = showWrappedPlane;
}

// ════════════════════════════════════════════════════════
// MODE TOGGLE
// ════════════════════════════════════════════════════════

let currentMode = 'bend';

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.mode === currentMode) return;
        currentMode = btn.dataset.mode;
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.dataset.mode = currentMode;
        if (currentMode === 'wrap') {
            updateWrap();
        } else {
            update();
        }
    });
});

// ════════════════════════════════════════════════════════
// UI BINDINGS — BEND
// ════════════════════════════════════════════════════════

// Geometry selector
document.querySelectorAll('.geo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.geo-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.geometryType = btn.dataset.geo;
        // Depth is only meaningful for Box
        document.getElementById('row-depth').style.display =
            state.geometryType === 'box' ? '' : 'none';
        update();
    });
});

// Sliders
function bindSlider(sliderId, valId, stateKey, decimals) {
    const slider = document.getElementById(sliderId);
    const valEl  = document.getElementById(valId);
    slider.addEventListener('input', () => {
        state[stateKey] = parseFloat(slider.value);
        valEl.textContent = parseFloat(slider.value).toFixed(decimals);
        update();
    });
}

bindSlider('sl-width',    'val-width',    'width',    1);
bindSlider('sl-height',   'val-height',   'height',   1);
bindSlider('sl-depth',    'val-depth',    'depth',    1);
bindSlider('sl-segments', 'val-segments', 'segments', 0);
bindSlider('sl-orbit',    'val-orbit',    'orbit',    2);

// Toggles
document.getElementById('tog-preserve').addEventListener('change', (e) => {
    state.preserveDimensions = e.target.checked;
    document.getElementById('row-orbit').style.opacity = e.target.checked ? '' : '0.35';
    document.getElementById('sl-orbit').disabled = !e.target.checked;
    update();
});

document.getElementById('tog-wireframe').addEventListener('change', (e) => {
    state.wireframe = e.target.checked;
    update();
});

// ════════════════════════════════════════════════════════
// UI BINDINGS — WRAP
// ════════════════════════════════════════════════════════

function bindWrapSlider(sliderId, valId, stateKey, decimals) {
    const slider = document.getElementById(sliderId);
    const valEl  = document.getElementById(valId);
    slider.addEventListener('input', () => {
        wrapState[stateKey] = parseFloat(slider.value);
        valEl.textContent = parseFloat(slider.value).toFixed(decimals);
        updateWrap();
    });
}

bindWrapSlider('sl-torus-radius', 'val-torus-radius', 'torusRadius', 1);
bindWrapSlider('sl-tube-radius',  'val-tube-radius',  'tubeRadius',  1);
bindWrapSlider('sl-wrap-w',       'val-wrap-w',       'planeW',      0);
bindWrapSlider('sl-wrap-h',       'val-wrap-h',       'planeH',      0);
bindWrapSlider('sl-wrap-res',     'val-wrap-res',     'resolution',  0);

document.getElementById('tog-source-plane').addEventListener('change', (e) => {
    wrapState.showSourcePlane = e.target.checked;
    updateWrap();
});

document.getElementById('tog-wrap-plane').addEventListener('change', (e) => {
    wrapState.showWrappedPlane = e.target.checked;
    updateWrap();
});

// ════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════

redrawCanvas();
update();
