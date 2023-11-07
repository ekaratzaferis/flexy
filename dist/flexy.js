function D(n, c) {
  const o = c.getAttribute("position"), e = new n.Box3();
  e.center = new n.Vector3();
  for (let t = 0; t < o.count; t++) {
    const r = new n.Vector3();
    r.fromBufferAttribute(o, t), e.expandByPoint(r);
    const i = o[t], a = o[t + 1], s = o[t + 2];
    e.center.add(new n.Vector3(i, a, s));
  }
  return e.center.divideScalar(o.count / 3), e;
}
const S = function({
  THREE: n,
  curve: c,
  quaternion: o,
  orientation: e,
  bufferGeometry: t,
  axis: r,
  scene: i
}) {
  const a = D(n, t), s = t.attributes.position.array;
  for (let y = 0; y < s.length; y += 3) {
    const m = parseFloat(s[y]), d = parseFloat(s[y + 1]), l = parseFloat(s[y + 2]);
    if (r === "x") {
      const x = (m - a.min.x) / (a.max.x - a.min.x), w = c.getPointAt(x), f = c.getTangent(x), z = (e || new n.Vector3(0, 0, 1).applyQuaternion(o).normalize().multiplyScalar(1e6)).clone().cross(f.clone()).normalize(), u = new n.Quaternion().setFromAxisAngle(f.clone(), Math.atan2(l, d));
      z.applyQuaternion(u);
      const A = z.clone().setLength(new n.Vector3(0, d, l).length()), p = w.clone().add(A);
      s[y] = p.x, s[y + 1] = p.y, s[y + 2] = p.z;
    } else if (r === "z") {
      const x = (l - a.min.z) / (a.max.z - a.min.z), w = c.getPointAt(x), f = c.getTangent(x), z = (e || new n.Vector3(1, 0, 0).applyQuaternion(o).normalize().multiplyScalar(1e6)).clone().cross(f.clone()).normalize(), u = new n.Quaternion().setFromAxisAngle(f.clone(), Math.atan2(d, m) + Math.PI / 2);
      z.applyQuaternion(u);
      const A = z.clone().setLength(new n.Vector3(m, d, 0).length()), p = w.clone().add(A);
      s[y] = p.x, s[y + 1] = p.y, s[y + 2] = p.z;
    } else if (r === "y") {
      const x = (d - a.min.y) / (a.max.y - a.min.y), w = c.getPointAt(x), f = c.getTangent(x), z = (e.normalize().multiplyScalar(1e6) || new n.Vector3(0, 1, 0).applyQuaternion(o).normalize().multiplyScalar(1e6)).clone().cross(f.clone()).normalize(), u = new n.Quaternion().setFromAxisAngle(f.clone(), Math.atan2(m, l));
      z.applyQuaternion(u);
      const A = z.clone().setLength(new n.Vector3(m, 0, l).length()), p = w.clone().add(A);
      s[y] = p.x, s[y + 1] = p.y, s[y + 2] = p.z;
    }
  }
  t.attributes.position.needsUpdate = !0;
}, L = function({
  THREE: n,
  surface: c,
  castingRectangular: o,
  resolution: e,
  scene: t
}) {
  const r = {};
  B(n, t, o.A, o.B, "#f0f"), B(n, t, o.B, o.C, "#f0f"), B(n, t, o.C, o.D, "#f0f"), B(n, t, o.D, o.A, "#f0f");
  for (let i = 0; i <= e; i++) {
    const a = P(n, o.A, o.D, e)[i], s = P(n, o.B, o.C, e)[i];
    P(n, a, s, e).forEach((m) => {
      const l = new n.Raycaster(m, o.direction.normalize()).intersectObject(c);
      l.length > 0 && (r[C(m.x, m.y, m.z, e)] = {
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
        x: o.A.x,
        y: o.A.y,
        z: o.A.z
      },
      B: {
        x: o.B.x,
        y: o.B.y,
        z: o.B.z
      },
      C: {
        x: o.C.x,
        y: o.C.y,
        z: o.C.z
      },
      D: {
        x: o.D.x,
        y: o.D.y,
        z: o.D.z
      },
      direction: {
        x: o.direction.x,
        y: o.direction.y,
        z: o.direction.z
      }
    },
    resolution: e
  };
}, M = function({
  THREE: n,
  pointToFaceNormalMap: c,
  obj: o,
  scene: e
}) {
  const t = c.castingRectangular, r = new n.Vector3(t.A.x, t.A.y, t.A.z), i = new n.Vector3(t.B.x, t.B.y, t.B.z), a = new n.Vector3(t.C.x, t.C.y, t.C.z), s = new n.Vector3().subVectors(i, r), y = new n.Vector3().subVectors(a, r), m = new n.Vector3().crossVectors(s, y).normalize(), d = new n.Plane().setFromNormalAndCoplanarPoint(m, r), l = o.geometry.attributes.position.array;
  for (let x = 0; x < l.length; x += 3) {
    const w = parseFloat(l[x]), f = parseFloat(l[x + 1]), h = parseFloat(l[x + 2]), z = new n.Vector3(w, f, h);
    z.applyMatrix4(o.matrixWorld);
    const u = z.clone().sub(r).dot(d.normal), A = d.normal.clone().multiplyScalar(u / d.normal.lengthSq()), p = z.clone().sub(A), Q = C(p.x, p.y, p.z, c.resolution), V = c.data[Q];
    if (!V)
      throw new Error(`Cannot find face normal for posision ${w} - ${f} - ${h}`);
    const N = new n.Vector3(V.normal.x, V.normal.y, V.normal.z), b = new n.Object3D();
    b.lookAt(N);
    const F = new n.Vector3(w, f, h).applyQuaternion(b.quaternion);
    l[x] = F.x, l[x + 1] = F.y, l[x + 2] = F.z;
  }
  o.geometry.attributes.position.needsUpdate = !0;
};
function C(n, c, o, e) {
  function t(m, d) {
    return Math.round(m / d) * d;
  }
  function r(m) {
    return m === "-0.0" ? "0.0" : m;
  }
  const i = 1 / e, a = r(t(n, i).toFixed(1)), s = r(t(c, i).toFixed(1)), y = r(t(o, i).toFixed(1));
  return `${a}^${s}^${y}`;
}
function P(n, c, o, e) {
  const t = [];
  for (let r = 0; r <= e; r++) {
    const i = new n.Vector3(
      c.x + (o.x - c.x) * (r / e),
      c.y + (o.y - c.y) * (r / e),
      c.z + (o.z - c.z) * (r / e)
    );
    t.push(i);
  }
  return t;
}
function B(n, c, o = {
  x: 0,
  y: 0,
  z: 0
}, e, t) {
  const r = new n.BufferGeometry(), i = new Float32Array(2 * 3);
  i[0] = o.x, i[1] = o.y, i[2] = o.z, i[3] = e.x, i[4] = e.y, i[5] = e.z, r.setAttribute("position", new n.BufferAttribute(i, 3));
  const a = new n.LineBasicMaterial({ color: t }), s = new n.Line(r, a);
  return c.add(s), s;
}
export {
  S as bend,
  L as getPointToFaceNormalMap,
  M as wrap
};
