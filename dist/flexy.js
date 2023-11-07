function C(n, o) {
  const e = o.getAttribute("position"), t = new n.Box3();
  t.center = new n.Vector3();
  for (let r = 0; r < e.count; r++) {
    const a = new n.Vector3();
    a.fromBufferAttribute(e, r), t.expandByPoint(a);
    const u = e[r], m = e[r + 1], s = e[r + 2];
    t.center.add(new n.Vector3(u, m, s));
  }
  return t.center.divideScalar(e.count / 3), t;
}
const P = function({
  THREE: n,
  curve: o,
  quaternion: e,
  orientation: t,
  bufferGeometry: r,
  axis: a,
  scene: u
}) {
  const m = C(n, r), s = r.attributes.position.array;
  for (let l = 0; l < s.length; l += 3) {
    const i = parseFloat(s[l]), y = parseFloat(s[l + 1]), c = parseFloat(s[l + 2]);
    if (a === "x") {
      const d = (i - m.min.x) / (m.max.x - m.min.x), w = o.getPointAt(d), z = o.getTangent(d), g = (t || new n.Vector3(0, 0, 1).applyQuaternion(e).normalize().multiplyScalar(1e6)).clone().cross(z.clone()).normalize(), h = new n.Quaternion().setFromAxisAngle(z.clone(), Math.atan2(c, y));
      g.applyQuaternion(h);
      const p = g.clone().setLength(new n.Vector3(0, y, c).length()), x = w.clone().add(p);
      s[l] = x.x, s[l + 1] = x.y, s[l + 2] = x.z;
    } else if (a === "z") {
      const d = (c - m.min.z) / (m.max.z - m.min.z), w = o.getPointAt(d), z = o.getTangent(d), g = (t || new n.Vector3(1, 0, 0).applyQuaternion(e).normalize().multiplyScalar(1e6)).clone().cross(z.clone()).normalize(), h = new n.Quaternion().setFromAxisAngle(z.clone(), Math.atan2(y, i) + Math.PI / 2);
      g.applyQuaternion(h);
      const p = g.clone().setLength(new n.Vector3(i, y, 0).length()), x = w.clone().add(p);
      s[l] = x.x, s[l + 1] = x.y, s[l + 2] = x.z;
    } else if (a === "y") {
      const d = (y - m.min.y) / (m.max.y - m.min.y), w = o.getPointAt(d), z = o.getTangent(d), g = (t.normalize().multiplyScalar(1e6) || new n.Vector3(0, 1, 0).applyQuaternion(e).normalize().multiplyScalar(1e6)).clone().cross(z.clone()).normalize(), h = new n.Quaternion().setFromAxisAngle(z.clone(), Math.atan2(i, c));
      g.applyQuaternion(h);
      const p = g.clone().setLength(new n.Vector3(i, 0, c).length()), x = w.clone().add(p);
      s[l] = x.x, s[l + 1] = x.y, s[l + 2] = x.z;
    }
  }
  r.attributes.position.needsUpdate = !0;
}, S = function({
  THREE: n,
  reflectionMap: o,
  obj: e,
  scene: t
}) {
  const r = new n.Vector3(o.collisionPlane.A.x, o.collisionPlane.A.y, o.collisionPlane.A.z), a = new n.Vector3(o.collisionPlane.B.x, o.collisionPlane.B.y, o.collisionPlane.B.z), u = new n.Vector3(o.collisionPlane.C.x, o.collisionPlane.C.y, o.collisionPlane.C.z), m = new n.Vector3().subVectors(a, r), s = new n.Vector3().subVectors(u, r), l = new n.Vector3().crossVectors(m, s).normalize(), i = new n.Plane();
  i.setFromNormalAndCoplanarPoint(l, r);
  const y = e.geometry.attributes.position.array;
  for (let c = 0; c < y.length; c += 3) {
    const d = parseFloat(y[c]), w = parseFloat(y[c + 1]), z = parseFloat(y[c + 2]), A = new n.Vector3(d, w, z);
    A.applyMatrix4(e.matrixWorld);
    const g = A.clone().sub(r).dot(i.normal), h = i.normal.clone().multiplyScalar(g / i.normal.lengthSq()), p = A.clone().sub(h), x = Q(p.x, p.y, p.z, o.resolution), f = o.data[x];
    if (!f) {
      console.error("asdads");
      continue;
    }
    const b = new n.Vector3(f.normal.x, f.normal.y, f.normal.z), F = new n.Object3D();
    F.lookAt(b);
    const V = new n.Vector3(d, w, z).clone().applyQuaternion(F.quaternion);
    y[c] = V.x, y[c + 1] = V.y, y[c + 2] = V.z;
  }
  e.geometry.attributes.position.needsUpdate = !0;
}, D = function({
  THREE: n,
  surface: o,
  resolution: e,
  collisionPlane: t,
  scene: r
}) {
  const a = {};
  for (let u = 0; u <= e; u++) {
    const m = B(n, t.A, t.D, e)[u], s = B(n, t.B, t.C, e)[u];
    B(n, m, s, e).forEach((i) => {
      const c = new n.Raycaster(i, t.direction.normalize()).intersectObject(o);
      c.length > 0 && (a[Q(i.x, i.y, i.z, e)] = {
        normal: {
          x: c[0].face.normal.x,
          y: c[0].face.normal.y,
          z: c[0].face.normal.z
        },
        point: {
          x: c[0].point.x,
          y: c[0].point.y,
          z: c[0].point.z
        }
      });
    });
  }
  return {
    data: a,
    collisionPlane: {
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
};
function Q(n, o, e, t) {
  function r(i, y) {
    return Math.round(i / y) * y;
  }
  function a(i) {
    return i === "-0.0" ? "0.0" : i;
  }
  const u = 1 / t, m = a(r(n, u).toFixed(1)), s = a(r(o, u).toFixed(1)), l = a(r(e, u).toFixed(1));
  return `${m}^${s}^${l}`;
}
function B(n, o, e, t) {
  const r = [];
  for (let a = 0; a <= t; a++) {
    const u = new n.Vector3(
      o.x + (e.x - o.x) * (a / t),
      o.y + (e.y - o.y) * (a / t),
      o.z + (e.z - o.z) * (a / t)
    );
    r.push(u);
  }
  return r;
}
export {
  P as bend,
  D as getReflectionMap,
  S as wrap
};
