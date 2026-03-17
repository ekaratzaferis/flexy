function Q(o, r) {
  const t = r.getAttribute("position"), e = new o.Box3();
  e.center = new o.Vector3();
  for (let s = 0; s < t.count; s++) {
    const n = new o.Vector3();
    n.fromBufferAttribute(t, s), e.expandByPoint(n), e.center.add(n);
  }
  return e.center.divideScalar(t.count), e;
}
const D = function({
  THREE: o,
  curve: r,
  quaternion: t,
  orientation: e,
  bufferGeometry: s,
  axis: n,
  mode: i = "fit",
  orbit: m = 0,
  scene: p
}) {
  const f = Q(o, s), c = s.attributes.position.array, l = n === "x" ? new o.Vector3(0, 0, 1) : new o.Vector3(1, 0, 0), a = e || l.applyQuaternion(t).normalize().multiplyScalar(1e6), x = f.min[n], u = f.max[n] - x, g = i === "preserve" || i === "tile" ? F(r) : 0, M = i === "preserve" ? 0.5 - u / g / 2 + m : 0;
  for (let y = 0; y < c.length; y += 3) {
    const w = c[y], V = c[y + 1], A = c[y + 2], B = n === "x" ? w : n === "y" ? V : A;
    let z;
    if (i === "fit" ? z = (B - x) / u : i === "preserve" ? (z = M + (B - x) / g, z = Math.max(0, Math.min(1, z))) : (z = m + (B - x) / g, z = (z % 1 + 1) % 1), n === "x") {
      const d = r.getPointAt(z), P = r.getTangent(z), h = a.clone().cross(P).normalize(), C = new o.Quaternion().setFromAxisAngle(P, Math.atan2(A, V));
      h.applyQuaternion(C);
      const b = h.clone().setLength(Math.hypot(V, A));
      d.add(b), c[y] = d.x, c[y + 1] = d.y, c[y + 2] = d.z;
    } else if (n === "z") {
      const d = r.getPointAt(z), P = r.getTangent(z), h = a.clone().cross(P).normalize(), C = new o.Quaternion().setFromAxisAngle(P, Math.atan2(V, w) + Math.PI / 2);
      h.applyQuaternion(C);
      const b = h.clone().setLength(Math.hypot(w, V));
      d.add(b), c[y] = d.x, c[y + 1] = d.y, c[y + 2] = d.z;
    } else if (n === "y") {
      const d = r.getPointAt(z), P = r.getTangent(z), h = a.clone().cross(P).normalize(), C = new o.Quaternion().setFromAxisAngle(P, Math.atan2(w, A));
      h.applyQuaternion(C);
      const b = h.clone().setLength(Math.hypot(w, A));
      d.add(b), c[y] = d.x, c[y + 1] = d.y, c[y + 2] = d.z;
    }
  }
  s.attributes.position.needsUpdate = !0;
}, S = function({
  THREE: o,
  surface: r,
  castingRectangular: t,
  resolution: e,
  scene: s
}) {
  const n = {};
  t.direction.normalize();
  const i = L(o, t.A, t.D, e), m = L(o, t.B, t.C, e);
  for (let p = 0; p <= e; p++)
    L(o, i[p], m[p], e).forEach((c) => {
      const a = new o.Raycaster(c, t.direction).intersectObject(r);
      a.length > 0 && (n[v(c.x, c.y, c.z, e)] = {
        normal: {
          x: a[0].face.normal.x,
          y: a[0].face.normal.y,
          z: a[0].face.normal.z
        },
        point: {
          x: a[0].point.x,
          y: a[0].point.y,
          z: a[0].point.z
        }
      });
    });
  return {
    data: n,
    castingRectangular: {
      A: {
        x: t.A.x,
        y: t.A.y,
        z: t.A.z
      },
      B: {
        x: t.B.x,
        y: t.B.y,
        z: t.B.z
      },
      C: {
        x: t.C.x,
        y: t.C.y,
        z: t.C.z
      },
      D: {
        x: t.D.x,
        y: t.D.y,
        z: t.D.z
      },
      direction: {
        x: t.direction.x,
        y: t.direction.y,
        z: t.direction.z
      }
    },
    resolution: e
  };
}, N = function({
  THREE: o,
  pointToFaceNormalMap: r,
  obj: t,
  scene: e
}) {
  const s = r.castingRectangular, n = new o.Vector3(s.A.x, s.A.y, s.A.z), i = new o.Vector3(s.B.x, s.B.y, s.B.z), m = new o.Vector3(s.C.x, s.C.y, s.C.z), p = new o.Vector3().subVectors(i, n), f = new o.Vector3().subVectors(m, n), c = new o.Vector3().crossVectors(p, f).normalize(), l = new o.Plane().setFromNormalAndCoplanarPoint(c, n), a = t.matrixWorld.clone().invert(), x = t.geometry.attributes.position.array;
  for (let u = 0; u < x.length; u += 3) {
    const g = x[u], M = x[u + 1], y = x[u + 2], w = new o.Vector3(g, M, y).applyMatrix4(t.matrixWorld), V = w.clone().sub(n).dot(l.normal), A = l.normal.clone().multiplyScalar(V / l.normal.lengthSq()), B = w.clone().sub(A), z = v(B.x, B.y, B.z, r.resolution), d = r.data[z], P = d ? d.point.y : 0, h = new o.Vector3(B.x, P, B.z);
    h.applyMatrix4(a), x[u] = h.x, x[u + 1] = h.y, x[u + 2] = h.z;
  }
  t.geometry.attributes.position.needsUpdate = !0;
}, U = function({
  THREE: o,
  bufferGeometry: r,
  axis: t = "x",
  shearAxis: e = "z",
  amplitude: s,
  sigma: n
}) {
  const i = Q(o, r), m = (i.max[t] + i.min[t]) / 2, p = (i.max[e] - i.min[e]) / 2, f = i.max[t] - i.min[t], c = n !== void 0 ? n : f / 4, l = r.attributes.position.array;
  for (let a = 0; a < l.length; a += 3) {
    const x = l[a], u = l[a + 1], g = l[a + 2], M = t === "x" ? x : t === "y" ? u : g, y = e === "x" ? x : e === "y" ? u : g, w = M - m, V = Math.exp(-(w * w) / (2 * c * c)), A = p !== 0 ? s * V * (y / p) : 0;
    e === "x" ? l[a] += A : e === "y" ? l[a + 1] += A : l[a + 2] += A;
  }
  r.attributes.position.needsUpdate = !0;
}, W = function({
  THREE: o,
  bufferGeometry: r,
  axis: t = "y",
  predicate: e,
  fn: s
}) {
  const n = r.attributes.position.array;
  for (let i = 0; i < n.length; i += 3) {
    const m = n[i], p = n[i + 1], f = n[i + 2];
    if (!e(m, p, f))
      continue;
    let c, l;
    t === "x" ? (c = p, l = f) : t === "y" ? (c = m, l = f) : (c = m, l = p);
    const a = s(c, l);
    t === "x" ? n[i] += a : t === "y" ? n[i + 1] += a : n[i + 2] += a;
  }
  r.attributes.position.needsUpdate = !0;
};
function v(o, r, t, e) {
  function s(c, l) {
    return Math.round(c / l) * l;
  }
  function n(c) {
    return c === "-0.0" ? "0.0" : c;
  }
  const i = 1 / e, m = n(s(o, i).toFixed(1)), p = n(s(r, i).toFixed(1)), f = n(s(t, i).toFixed(1));
  return `${m}^${p}^${f}`;
}
function L(o, r, t, e) {
  const s = [];
  for (let n = 0; n <= e; n++) {
    const i = new o.Vector3(
      r.x + (t.x - r.x) * (n / e),
      r.y + (t.y - r.y) * (n / e),
      r.z + (t.z - r.z) * (n / e)
    );
    s.push(i);
  }
  return s;
}
function F(o) {
  let t = 0, e = o.getPointAt(0);
  for (let s = 1; s <= 100; s++) {
    const n = o.getPointAt(s / 100);
    t += n.distanceTo(e), e = n;
  }
  return t;
}
export {
  D as bend,
  S as getPointToFaceNormalMap,
  U as shear,
  W as wave,
  N as wrap
};
