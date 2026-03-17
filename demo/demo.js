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
    // Geometry
    geometryType: 'box',
    width: 20,
    height: 2,
    depth: 2,
    segments: 40,
    wireframe: false,

    // Bend
    bendEnabled: true,
    curvePlane: 'xy',
    bendMode: 'fit',
    orbit: 0,

    // Shear
    shearEnabled: false,
    shearAmplitude: 0.5,
    shearSigma: 2.0,
    shearAxis: 'z',

    // Wave
    waveEnabled: false,
    waveAmplitude: 0.3,
    waveFrequency: 2,
    waveTopOnly: false,
    waveDirection: 'x',
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

let wrapMode = false;

// ════════════════════════════════════════════════════════
// DRAW CANVAS
// ════════════════════════════════════════════════════════

const WORLD_HALF = 12;

const drawCanvas = document.getElementById('draw-canvas');
const ctx = drawCanvas.getContext('2d');
const CANVAS_SIZE = drawCanvas.width;

let isDrawing = false;
let rawPoints  = [];
let fittedSegs = null;
let activeCurve = null;

function canvasToBend2D(cx, cy) {
    const bx = (cx / CANVAS_SIZE - 0.5) * WORLD_HALF * 2;
    const by = -(cy / CANVAS_SIZE - 0.5) * WORLD_HALF * 2;
    return [bx, by];
}

function bend2DToVec3(bx, by) {
    if (state.curvePlane === 'xz') return new THREE.Vector3(bx, 0, by);
    return new THREE.Vector3(bx, by, 0);
}

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

// ════════════════════════════════════════════════════════
// PRESET CURVES
// ════════════════════════════════════════════════════════

// Build a Vector3 in the active curve plane (XY or XZ).
// x = elongation axis, y = the perpendicular axis in that plane.
function vec(x, y) {
    return state.curvePlane === 'xz'
        ? new THREE.Vector3(x, 0, y)
        : new THREE.Vector3(x, y, 0);
}

const PRESETS = {
    halfcircle() {
        const R = 8, k = R * 0.5523;
        const path = new THREE.CurvePath();
        path.add(new THREE.CubicBezierCurve3(vec(-R, 0), vec(-R, k), vec(-k, R), vec(0, R)));
        path.add(new THREE.CubicBezierCurve3(vec(0, R), vec(k, R), vec(R, k), vec(R, 0)));
        return path;
    },
    circle() {
        // Circle centered at (0, -R) so the top sits at the origin (0, 0).
        // Starts at the bottom (0, -2R), goes clockwise:
        //   bottom → left → top/origin (t=0.5) → right → bottom
        const R = 5, k = R * 0.5523;
        const path = new THREE.CurvePath();
        path.add(new THREE.CubicBezierCurve3(  // bottom → left
            vec(0, -2*R), vec(-k, -2*R), vec(-R, -R-k), vec(-R, -R)
        ));
        path.add(new THREE.CubicBezierCurve3(  // left → top (origin)
            vec(-R, -R), vec(-R, -R+k), vec(-k, 0), vec(0, 0)
        ));
        path.add(new THREE.CubicBezierCurve3(  // top (origin) → right
            vec(0, 0), vec(k, 0), vec(R, -R+k), vec(R, -R)
        ));
        path.add(new THREE.CubicBezierCurve3(  // right → bottom
            vec(R, -R), vec(R, -R-k), vec(k, -2*R), vec(0, -2*R)
        ));
        return path;
    },
    square() {
        const S = 6;
        const path = new THREE.CurvePath();
        path.add(new THREE.LineCurve3(vec(-S, -S), vec(S, -S)));
        path.add(new THREE.LineCurve3(vec(S, -S), vec(S, S)));
        path.add(new THREE.LineCurve3(vec(S, S), vec(-S, S)));
        path.add(new THREE.LineCurve3(vec(-S, S), vec(-S, -S)));
        return path;
    },
    sin() {
        const N = 80;
        const points = [];
        for (let i = 0; i <= N; i++) {
            const x = (i / N - 0.5) * 20;   // –10 → +10
            const y = Math.sin(i / N * Math.PI * 2) * 4;
            points.push(vec(x, y));
        }
        return new THREE.CatmullRomCurve3(points);
    },
};

let activePreset = null;

function applyPreset(name) {
    activePreset = name;
    activeCurve  = PRESETS[name]();
    fittedSegs   = null;
    rawPoints    = [];
    redrawCanvas();
    document.querySelectorAll('.preset-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.preset === name);
    });
    update();
}

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (activePreset === btn.dataset.preset) {
            // Click again to deselect → fall back to default curve
            activePreset = null;
            activeCurve  = null;
            btn.classList.remove('active');
            update();
        } else {
            applyPreset(btn.dataset.preset);
        }
    });
});

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

    const step = CANVAS_SIZE / 6;
    ctx.strokeStyle = '#161b22';
    ctx.lineWidth = 1;
    for (let x = step; x < CANVAS_SIZE; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_SIZE); ctx.stroke();
    }
    for (let y = step; y < CANVAS_SIZE; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_SIZE, y); ctx.stroke();
    }

    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(CANVAS_SIZE / 2, 0); ctx.lineTo(CANVAS_SIZE / 2, CANVAS_SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, CANVAS_SIZE / 2); ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE / 2); ctx.stroke();
}

function redrawCanvas() {
    drawBackground();

    if (!fittedSegs) {
        ctx.fillStyle = '#21262d';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('draw a curve here', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 9);
        ctx.fillText('left  →  right', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 9);
        return;
    }

    if (rawPoints.length > 1) {
        ctx.strokeStyle = 'rgba(88, 166, 255, 0.16)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rawPoints[0][0], rawPoints[0][1]);
        for (const [x, y] of rawPoints) ctx.lineTo(x, y);
        ctx.stroke();
    }

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
    if (dx * dx + dy * dy < 25) return;

    rawPoints.push(p);

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
    // Drawing clears any active preset
    activePreset = null;
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    redrawCanvas();
    update();
}

drawCanvas.addEventListener('mouseup',    finalizeDraw);
drawCanvas.addEventListener('mouseleave', finalizeDraw);

document.getElementById('clear-btn').addEventListener('click', () => {
    rawPoints   = [];
    fittedSegs  = null;
    activeCurve = null;
    redrawCanvas();
    update();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.curvePlane = btn.dataset.plane;
        if (activePreset) {
            activeCurve = PRESETS[activePreset]();
        } else if (fittedSegs) {
            activeCurve = buildCurveFromFitted(fittedSegs);
        }
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
            return new THREE.BoxGeometry(width, height, depth, segments, 4, segments);

        case 'plane':
            return new THREE.PlaneGeometry(width, height, segments, 4);

        case 'cylinder': {
            const geo = new THREE.CylinderGeometry(height / 2, height / 2, width, 16, segments);
            geo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
            return geo;
        }

        default:
            return new THREE.BoxGeometry(width, height, depth, segments, 4, 4);
    }
}

// ════════════════════════════════════════════════════════
// SCENE UPDATE — MAIN (bend + shear + wave, stackable)
// ════════════════════════════════════════════════════════

let sceneObjects = [];

function clearDynamic() {
    for (const obj of sceneObjects) scene.remove(obj);
    sceneObjects = [];
}

// Box face material groups (THREE.BoxGeometry order):
//   0 = +X (right end cap)   → lavender
//   1 = -X (left end cap)    → lavender
//   2 = +Y (top face)        → sky blue
//   3 = -Y (bottom face)     → pink
//   4 = +Z (front face)      → green
//   5 = -Z (back face)       → orange
const BOX_FACE_COLORS = [0xa29bfe, 0xa29bfe, 0x4fc3f7, 0xf06292, 0x81c784, 0xffb74d];

function buildMaterial() {
    if (state.wireframe) {
        return new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    }
    if (state.geometryType === 'box') {
        return BOX_FACE_COLORS.map(c => new THREE.MeshBasicMaterial({ color: c }));
    }
    return new THREE.MeshNormalMaterial();
}

function getOrientation() {
    return state.curvePlane === 'xz'
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(0, 0, 1);
}

function update() {
    clearDynamic();

    const geometry = buildGeometry();
    const mat = buildMaterial();

    // Deformations applied in order: wave → shear → bend
    // This order keeps each effect in the original-geometry coordinate space.

    if (state.waveEnabled) {
        const topThreshold = state.waveTopOnly ? state.height / 2 - 0.05 : -Infinity;
        flexy.wave({
            THREE,
            bufferGeometry: geometry,
            axis: 'y',
            predicate: (x, y, z) => y >= topThreshold,
            // Normalize the chosen axis to [-1, 1] relative to bar half-extent, then
            // multiply by πN. sin(±1 * π * N) = 0 for any integer N, so both ends
            // always have equal displacement → seam is invisible when bent into a ring.
            fn: (x, z) => {
                const v = state.waveDirection === 'x'
                    ? x / (state.width / 2)
                    : z / (state.depth / 2);
                return Math.sin(v * Math.PI * state.waveFrequency) * state.waveAmplitude;
            },
        });
    }

    if (state.shearEnabled) {
        flexy.shear({
            THREE,
            bufferGeometry: geometry,
            axis: 'x',
            shearAxis: state.shearAxis,
            amplitude: state.shearAmplitude,
            sigma: state.shearSigma,
        });
    }

    if (state.bendEnabled) {
        const curve = activeCurve || getDefaultCurve();

        flexy.bend({
            THREE,
            curve,
            orientation: getOrientation(),
            bufferGeometry: geometry,
            axis: 'x',
            mode: state.bendMode,
            orbit: state.orbit,
        });

        // Draw curve tube
        const pts = curve.getPoints(200);
        const curvePath = new THREE.CatmullRomCurve3(pts);
        const tube = new THREE.Mesh(
            new THREE.TubeGeometry(curvePath, 200, 0.07, 8, false),
            new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 })
        );
        scene.add(tube);
        sceneObjects.push(tube);
    }

    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, mat);
    scene.add(mesh);
    sceneObjects.push(mesh);
}

// ════════════════════════════════════════════════════════
// SCENE UPDATE — WRAP
// ════════════════════════════════════════════════════════

function updateWrap() {
    clearDynamic();

    const { torusRadius, tubeRadius, planeW, planeH, resolution, showSourcePlane, showWrappedPlane } = wrapState;

    const torusMesh = new THREE.Mesh(
        new THREE.TorusGeometry(torusRadius, tubeRadius, 32, 100),
        new THREE.MeshNormalMaterial()
    );
    torusMesh.rotation.x = Math.PI / 2;
    scene.add(torusMesh);
    torusMesh.updateMatrixWorld(true);
    sceneObjects.push(torusMesh);

    const castingRectangular = {
        A: new THREE.Vector3(-planeW / 2, 20,  planeH / 2),
        B: new THREE.Vector3( planeW / 2, 20,  planeH / 2),
        C: new THREE.Vector3( planeW / 2, 20, -planeH / 2),
        D: new THREE.Vector3(-planeW / 2, 20, -planeH / 2),
        direction: new THREE.Vector3(0, -1, 0),
    };

    const map = flexy.getPointToFaceNormalMap({ THREE, surface: torusMesh, castingRectangular, resolution });

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
    const normals = wrapTarget.geometry.attributes.normal.array;
    for (let i = 0; i < normals.length; i++) normals[i] *= -1;
    wrapTarget.geometry.attributes.normal.needsUpdate = true;

    wrapTarget.position.y += 3;
    wrapTarget.visible = showWrappedPlane;
}

// ════════════════════════════════════════════════════════
// SYNC UI — show/hide sections based on state
// ════════════════════════════════════════════════════════

const drawPanel    = document.getElementById('draw-panel');
const secGeometry  = document.getElementById('sec-geometry');
const secBend      = document.getElementById('sec-bend');
const secShear     = document.getElementById('sec-shear');
const secWave      = document.getElementById('sec-wave');
const secOptions   = document.getElementById('sec-options');
const secWrapTorus = document.getElementById('sec-wrap-torus');
const secWrapPlane = document.getElementById('sec-wrap-plane');
const secWrapOpts  = document.getElementById('sec-wrap-options');
const wrapModeBtn  = document.getElementById('wrap-mode-btn');

function syncUI() {
    const mainSections = [secGeometry, secBend, secShear, secWave, secOptions];
    const wrapSections = [secWrapTorus, secWrapPlane, secWrapOpts];

    if (wrapMode) {
        drawPanel.hidden = true;
        mainSections.forEach(s => { s.hidden = true; });
        wrapSections.forEach(s => { s.hidden = false; });
        wrapModeBtn.classList.add('active');
    } else {
        drawPanel.hidden = !state.bendEnabled;
        secGeometry.hidden = false;
        secBend.hidden   = !state.bendEnabled;
        secShear.hidden  = !state.shearEnabled;
        secWave.hidden   = !state.waveEnabled;
        secOptions.hidden = false;
        wrapSections.forEach(s => { s.hidden = true; });
        wrapModeBtn.classList.remove('active');
    }

    // Toggle button active states (only in main mode)
    document.querySelectorAll('[data-toggle]').forEach(btn => {
        const key = btn.dataset.toggle + 'Enabled';
        btn.classList.toggle('active', !wrapMode && state[key]);
        btn.disabled = wrapMode;
        btn.style.opacity = wrapMode ? '0.3' : '';
    });

    // Face color legend: only meaningful for box geometry without wireframe
    const faceLegend = document.getElementById('face-legend');
    if (faceLegend) {
        faceLegend.hidden = wrapMode || state.geometryType !== 'box' || state.wireframe;
    }
}

// ════════════════════════════════════════════════════════
// MODE TOGGLE HANDLERS
// ════════════════════════════════════════════════════════

document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.toggle + 'Enabled';
        state[key] = !state[key];
        syncUI();
        update();
    });
});

wrapModeBtn.addEventListener('click', () => {
    wrapMode = !wrapMode;
    syncUI();
    if (wrapMode) {
        updateWrap();
    } else {
        update();
    }
});

// ════════════════════════════════════════════════════════
// UI BINDINGS — GEOMETRY
// ════════════════════════════════════════════════════════

document.querySelectorAll('.geo-btn[data-geo]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.geo-btn[data-geo]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.geometryType = btn.dataset.geo;
        document.getElementById('row-depth').style.display =
            state.geometryType === 'box' ? '' : 'none';
        syncUI();
        update();
    });
});

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

// ════════════════════════════════════════════════════════
// UI BINDINGS — BEND
// ════════════════════════════════════════════════════════

bindSlider('sl-orbit', 'val-orbit', 'orbit', 2);

document.querySelectorAll('[data-bend-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-bend-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.bendMode = btn.dataset.bendMode;
        // orbit is meaningless in fit mode — gray it out
        const orbitRow = document.getElementById('row-orbit');
        const orbitSlider = document.getElementById('sl-orbit');
        orbitRow.style.opacity  = state.bendMode === 'fit' ? '0.35' : '';
        orbitSlider.disabled    = state.bendMode === 'fit';
        update();
    });
});

document.getElementById('tog-wireframe').addEventListener('change', (e) => {
    state.wireframe = e.target.checked;
    syncUI();
    update();
});

// ════════════════════════════════════════════════════════
// UI BINDINGS — SHEAR
// ════════════════════════════════════════════════════════

bindSlider('sl-shear-amp',   'val-shear-amp',   'shearAmplitude', 2);
bindSlider('sl-shear-sigma', 'val-shear-sigma', 'shearSigma',     1);

document.querySelectorAll('[data-shear-axis]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-shear-axis]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.shearAxis = btn.dataset.shearAxis;
        update();
    });
});

// ════════════════════════════════════════════════════════
// UI BINDINGS — WAVE
// ════════════════════════════════════════════════════════

bindSlider('sl-wave-amp',  'val-wave-amp',  'waveAmplitude', 2);
bindSlider('sl-wave-freq', 'val-wave-freq', 'waveFrequency', 0);

document.getElementById('tog-wave-top').addEventListener('change', (e) => {
    state.waveTopOnly = e.target.checked;
    update();
});

document.querySelectorAll('[data-wave-dir]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-wave-dir]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.waveDirection = btn.dataset.waveDir;
        update();
    });
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
syncUI();
update();
