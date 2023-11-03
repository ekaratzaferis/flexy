function f(n, i) {
  const r = i.getAttribute("position"), l = new n.Box3();
  l.center = new n.Vector3();
  for (let c = 0; c < r.count; c++) {
    const p = new n.Vector3();
    p.fromBufferAttribute(r, c), l.expandByPoint(p);
    const A = r[c], e = r[c + 1], t = r[c + 2];
    l.center.add(new n.Vector3(A, e, t));
  }
  return l.center.divideScalar(r.count / 3), l;
}
const Q = function({
  THREE: n,
  curve: i,
  quaternion: r,
  orientation: l,
  bufferGeometry: c,
  axis: p,
  scene: A
}) {
  const e = f(n, c), t = c.attributes.position.array;
  for (let o = 0; o < t.length; o += 3) {
    const y = parseFloat(t[o]), u = parseFloat(t[o + 1]), h = parseFloat(t[o + 2]);
    if (p === "x") {
      const s = (y - e.min.x) / (e.max.x - e.min.x), d = i.getPointAt(s), m = i.getTangentAt(s).normalize(), g = (l || new n.Vector3(0, 0, 1).applyQuaternion(r).normalize().multiplyScalar(1e6)).clone().cross(m.clone()).normalize(), x = new n.Quaternion().setFromAxisAngle(m.clone(), Math.atan2(h, u));
      g.applyQuaternion(x);
      const z = g.clone().setLength(new n.Vector3(0, u, h).length()), a = d.clone().add(z);
      t[o] = a.x, t[o + 1] = a.y, t[o + 2] = a.z;
    } else if (p === "z") {
      const s = (h - e.min.z) / (e.max.z - e.min.z), d = i.getPointAt(s), m = i.getTangentAt(s).normalize(), g = (l || new n.Vector3(1, 0, 0).applyQuaternion(r).normalize().multiplyScalar(1e6)).clone().cross(m.clone()).normalize(), x = new n.Quaternion().setFromAxisAngle(m.clone(), Math.atan2(u, y) + Math.PI / 2);
      g.applyQuaternion(x);
      const z = g.clone().setLength(new n.Vector3(y, u, 0).length()), a = d.clone().add(z);
      t[o] = a.x, t[o + 1] = a.y, t[o + 2] = a.z;
    } else if (p === "y") {
      const s = (u - e.min.y) / (e.max.y - e.min.y), d = i.getPointAt(s), m = i.getTangentAt(s).normalize(), g = (l.normalize().multiplyScalar(1e6) || new n.Vector3(0, 1, 0).applyQuaternion(r).normalize().multiplyScalar(1e6)).clone().cross(m.clone()).normalize(), x = new n.Quaternion().setFromAxisAngle(m.clone(), Math.atan2(y, h));
      g.applyQuaternion(x);
      const z = g.clone().setLength(new n.Vector3(y, 0, h).length()), a = d.clone().add(z);
      t[o] = a.x, t[o + 1] = a.y, t[o + 2] = a.z;
    }
  }
  c.attributes.position.needsUpdate = !0;
};
export {
  Q as bend
};
