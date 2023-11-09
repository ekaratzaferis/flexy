function L(n, c) {
  const t = c.getAttribute("position"), e = new n.Box3();
  e.center = new n.Vector3();
  for (let o = 0; o < t.count; o++) {
    const r = new n.Vector3();
    r.fromBufferAttribute(t, o), e.expandByPoint(r);
    const m = t[o], C = t[o + 1], i = t[o + 2];
    e.center.add(new n.Vector3(m, C, i));
  }
  return e.center.divideScalar(t.count / 3), e;
}
const O = function({
  THREE: n,
  curve: c,
  quaternion: t,
  orientation: e,
  bufferGeometry: o,
  axis: r,
  preserveDimensions: m = !1,
  scene: C
}) {
  const i = L(n, o), z = m ? N(c) : 0, s = o.attributes.position.array;
  for (let a = 0; a < s.length; a += 3) {
    const l = parseFloat(s[a]), d = parseFloat(s[a + 1]), A = parseFloat(s[a + 2]);
    if (r === "x") {
      let y = (l - i.min.x) / (i.max.x - i.min.x);
      const p = i.max.x - i.min.x;
      if (m && p <= z) {
        const w = p / z, f = 0.5 - w / 2, V = 0.5 + w / 2;
        y = f + y * (V - f);
      }
      const P = c.getPointAt(y), u = c.getTangent(y), h = (e || new n.Vector3(0, 0, 1).applyQuaternion(t).normalize().multiplyScalar(1e6)).clone().cross(u.clone()).normalize(), g = new n.Quaternion().setFromAxisAngle(u.clone(), Math.atan2(A, d));
      h.applyQuaternion(g);
      const B = h.clone().setLength(new n.Vector3(0, d, A).length()), x = P.clone().add(B);
      s[a] = x.x, s[a + 1] = x.y, s[a + 2] = x.z;
    } else if (r === "z") {
      let y = (A - i.min.z) / (i.max.z - i.min.z);
      const p = i.max.y - i.min.y;
      if (m && p <= z) {
        const w = p / z, f = 0.5 - w / 2, V = 0.5 + w / 2;
        y = f + y * (V - f);
      }
      const P = c.getPointAt(y), u = c.getTangent(y), h = (e || new n.Vector3(1, 0, 0).applyQuaternion(t).normalize().multiplyScalar(1e6)).clone().cross(u.clone()).normalize(), g = new n.Quaternion().setFromAxisAngle(u.clone(), Math.atan2(d, l) + Math.PI / 2);
      h.applyQuaternion(g);
      const B = h.clone().setLength(new n.Vector3(l, d, 0).length()), x = P.clone().add(B);
      s[a] = x.x, s[a + 1] = x.y, s[a + 2] = x.z;
    } else if (r === "y") {
      let y = (d - i.min.y) / (i.max.y - i.min.y);
      const p = i.max.z - i.min.z;
      if (m && p <= z) {
        const w = p / z, f = 0.5 - w / 2, V = 0.5 + w / 2;
        y = f + y * (V - f);
      }
      const P = c.getPointAt(y), u = c.getTangent(y), h = (e || new n.Vector3(1, 0, 0).applyQuaternion(t).normalize().multiplyScalar(1e6)).clone().cross(u.clone()).normalize(), g = new n.Quaternion().setFromAxisAngle(u.clone(), Math.atan2(l, A));
      h.applyQuaternion(g);
      const B = h.clone().setLength(new n.Vector3(l, 0, A).length()), x = P.clone().add(B);
      s[a] = x.x, s[a + 1] = x.y, s[a + 2] = x.z;
    }
  }
  o.attributes.position.needsUpdate = !0;
}, S = function({
  THREE: n,
  surface: c,
  castingRectangular: t,
  resolution: e,
  scene: o
}) {
  const r = {};
  for (let m = 0; m <= e; m++) {
    const C = Q(n, t.A, t.D, e)[m], i = Q(n, t.B, t.C, e)[m];
    Q(n, C, i, e).forEach((s) => {
      const l = new n.Raycaster(s, t.direction.normalize()).intersectObject(c);
      l.length > 0 && (r[b(s.x, s.y, s.z, e)] = {
        normal: {
          x: l[0].face.normal.x,
          y: l[0].face.normal.y,
          z: l[0].face.normal.z
        },
        point: {
          x: l[0].point.x,
          y: l[0].point.y,
          z: l[0].point.z
        }
      });
    });
  }
  return {
    data: r,
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
}, $ = function({
  THREE: n,
  pointToFaceNormalMap: c,
  obj: t,
  scene: e
}) {
  const o = c.castingRectangular, r = new n.Vector3(o.A.x, o.A.y, o.A.z), m = new n.Vector3(o.B.x, o.B.y, o.B.z), C = new n.Vector3(o.C.x, o.C.y, o.C.z), i = new n.Vector3().subVectors(m, r), z = new n.Vector3().subVectors(C, r), s = new n.Vector3().crossVectors(i, z).normalize(), a = new n.Plane().setFromNormalAndCoplanarPoint(s, r), l = t.geometry.attributes.position.array;
  for (let d = 0; d < l.length; d += 3) {
    const A = parseFloat(l[d]), y = parseFloat(l[d + 1]), p = parseFloat(l[d + 2]), P = new n.Vector3(A, y, p), u = t.matrixWorld.clone();
    P.applyMatrix4(u.clone());
    const F = P.clone().sub(r).dot(a.normal), h = a.normal.clone().multiplyScalar(F / a.normal.lengthSq()), g = P.clone().sub(h), B = b(g.x, g.y, g.z, c.resolution), x = c.data[B];
    if (!x)
      throw new Error(`Cannot find face normal for posision ${A} - ${y} - ${p}`);
    const w = new n.Vector3(x.normal.x, x.normal.y, x.normal.z), f = new n.Object3D();
    f.lookAt(w);
    const V = new n.Vector3(A, y, p).applyQuaternion(f.quaternion.clone());
    l[d] = V.x, l[d + 1] = V.y, l[d + 2] = V.z;
  }
  t.geometry.attributes.position.needsUpdate = !0;
};
function b(n, c, t, e) {
  function o(s, a) {
    return Math.round(s / a) * a;
  }
  function r(s) {
    return s === "-0.0" ? "0.0" : s;
  }
  const m = 1 / e, C = r(o(n, m).toFixed(1)), i = r(o(c, m).toFixed(1)), z = r(o(t, m).toFixed(1));
  return `${C}^${i}^${z}`;
}
function Q(n, c, t, e) {
  const o = [];
  for (let r = 0; r <= e; r++) {
    const m = new n.Vector3(
      c.x + (t.x - c.x) * (r / e),
      c.y + (t.y - c.y) * (r / e),
      c.z + (t.z - c.z) * (r / e)
    );
    o.push(m);
  }
  return o;
}
function N(n) {
  let t = 0, e = n.getPointAt(0);
  for (let o = 1; o <= 100; o++) {
    const r = n.getPointAt(o / 100);
    t += r.distanceTo(e), e = r;
  }
  return t;
}
export {
  O as bend,
  S as getPointToFaceNormalMap,
  $ as wrap
};
