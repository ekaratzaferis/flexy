function F(n, r) {
  const t = r.getAttribute("position"), s = new n.Box3();
  s.center = new n.Vector3();
  for (let e = 0; e < t.count; e++) {
    const o = new n.Vector3();
    o.fromBufferAttribute(t, e), s.expandByPoint(o), s.center.add(o);
  }
  return s.center.divideScalar(t.count), s;
}
const D = function({
  THREE: n,
  curve: r,
  quaternion: t,
  orientation: s,
  bufferGeometry: e,
  axis: o,
  preserveDimensions: p = !1,
  scene: V
}) {
  const z = F(n, e), A = p ? S(r) : 0, c = e.attributes.position.array, h = o === "x" ? new n.Vector3(0, 0, 1) : new n.Vector3(1, 0, 0), y = s || h.applyQuaternion(t).normalize().multiplyScalar(1e6), m = z.min[o], d = z.max[o] - m, w = p && d <= A, g = w ? 0.5 - d / A / 2 : 0, C = w ? d / A : 1;
  for (let i = 0; i < c.length; i += 3) {
    const P = c[i], B = c[i + 1], u = c[i + 2];
    if (o === "x") {
      let l = (P - m) / d;
      w && (l = g + l * C);
      const a = r.getPointAt(l), f = r.getTangent(l), x = y.clone().cross(f).normalize(), M = new n.Quaternion().setFromAxisAngle(f, Math.atan2(u, B));
      x.applyQuaternion(M);
      const Q = x.clone().setLength(Math.hypot(B, u));
      a.add(Q), c[i] = a.x, c[i + 1] = a.y, c[i + 2] = a.z;
    } else if (o === "z") {
      let l = (u - m) / d;
      w && (l = g + l * C);
      const a = r.getPointAt(l), f = r.getTangent(l), x = y.clone().cross(f).normalize(), M = new n.Quaternion().setFromAxisAngle(f, Math.atan2(B, P) + Math.PI / 2);
      x.applyQuaternion(M);
      const Q = x.clone().setLength(Math.hypot(P, B));
      a.add(Q), c[i] = a.x, c[i + 1] = a.y, c[i + 2] = a.z;
    } else if (o === "y") {
      let l = (B - m) / d;
      w && (l = g + l * C);
      const a = r.getPointAt(l), f = r.getTangent(l), x = y.clone().cross(f).normalize(), M = new n.Quaternion().setFromAxisAngle(f, Math.atan2(P, u));
      x.applyQuaternion(M);
      const Q = x.clone().setLength(Math.hypot(P, u));
      a.add(Q), c[i] = a.x, c[i + 1] = a.y, c[i + 2] = a.z;
    }
  }
  e.attributes.position.needsUpdate = !0;
}, N = function({
  THREE: n,
  surface: r,
  castingRectangular: t,
  resolution: s,
  scene: e
}) {
  const o = {};
  t.direction.normalize();
  const p = b(n, t.A, t.D, s), V = b(n, t.B, t.C, s);
  for (let z = 0; z <= s; z++)
    b(n, p[z], V[z], s).forEach((c) => {
      const y = new n.Raycaster(c, t.direction).intersectObject(r);
      y.length > 0 && (o[L(c.x, c.y, c.z, s)] = {
        normal: {
          x: y[0].face.normal.x,
          y: y[0].face.normal.y,
          z: y[0].face.normal.z
        },
        point: {
          x: y[0].point.x,
          y: y[0].point.y,
          z: y[0].point.z
        }
      });
    });
  return {
    data: o,
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
    resolution: s
  };
}, W = function({
  THREE: n,
  pointToFaceNormalMap: r,
  obj: t,
  scene: s
}) {
  const e = r.castingRectangular, o = new n.Vector3(e.A.x, e.A.y, e.A.z), p = new n.Vector3(e.B.x, e.B.y, e.B.z), V = new n.Vector3(e.C.x, e.C.y, e.C.z), z = new n.Vector3().subVectors(p, o), A = new n.Vector3().subVectors(V, o), c = new n.Vector3().crossVectors(z, A).normalize(), h = new n.Plane().setFromNormalAndCoplanarPoint(c, o), y = t.matrixWorld.clone().invert(), m = t.geometry.attributes.position.array;
  for (let d = 0; d < m.length; d += 3) {
    const w = m[d], g = m[d + 1], C = m[d + 2], i = new n.Vector3(w, g, C).applyMatrix4(t.matrixWorld), P = i.clone().sub(o).dot(h.normal), B = h.normal.clone().multiplyScalar(P / h.normal.lengthSq()), u = i.clone().sub(B), l = L(u.x, u.y, u.z, r.resolution), a = r.data[l], f = a ? a.point.y : 0, x = new n.Vector3(u.x, f, u.z);
    x.applyMatrix4(y), m[d] = x.x, m[d + 1] = x.y, m[d + 2] = x.z;
  }
  t.geometry.attributes.position.needsUpdate = !0;
};
function L(n, r, t, s) {
  function e(c, h) {
    return Math.round(c / h) * h;
  }
  function o(c) {
    return c === "-0.0" ? "0.0" : c;
  }
  const p = 1 / s, V = o(e(n, p).toFixed(1)), z = o(e(r, p).toFixed(1)), A = o(e(t, p).toFixed(1));
  return `${V}^${z}^${A}`;
}
function b(n, r, t, s) {
  const e = [];
  for (let o = 0; o <= s; o++) {
    const p = new n.Vector3(
      r.x + (t.x - r.x) * (o / s),
      r.y + (t.y - r.y) * (o / s),
      r.z + (t.z - r.z) * (o / s)
    );
    e.push(p);
  }
  return e;
}
function S(n) {
  let t = 0, s = n.getPointAt(0);
  for (let e = 1; e <= 100; e++) {
    const o = n.getPointAt(e / 100);
    t += o.distanceTo(s), s = o;
  }
  return t;
}
export {
  D as bend,
  N as getPointToFaceNormalMap,
  W as wrap
};
