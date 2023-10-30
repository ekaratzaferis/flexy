let z, i;
function w(c) {
  z = c.Box3, i = c.Vector3;
}
function f(c) {
  const n = c.getAttribute("position"), l = new z();
  l.center = new i();
  for (let t = 0; t < n.count; t++) {
    const e = new i();
    e.fromBufferAttribute(n, t), l.expandByPoint(e);
    const o = n[t], r = n[t + 1], s = n[t + 2];
    l.center.add(new i(o, r, s));
  }
  return l.center.divideScalar(n.count / 3), l;
}
const h = function(c, n, l) {
  const t = f(n), e = n.attributes.position.array;
  for (let o = 0; o < e.length; o += 3) {
    const r = parseFloat(e[o]), s = parseFloat(e[o + 1]), m = parseFloat(e[o + 2]);
    if (l === "x") {
      const g = (r - t.min.x) / (t.max.x - t.min.x), a = c.getTangentAt(g).normalize(), x = c.getPointAt(g);
      let d;
      s >= t.center.y ? d = new i(-a.y, a.x, 0).normalize() : d = new i(a.y, -a.x, 0).normalize();
      let p;
      m >= t.center.z ? p = new i(0, -a.z, -a.x).normalize() : p = new i(0, a.z, a.x).normalize();
      const y = d.clone().multiplyScalar(Math.abs(s)), b = p.clone().multiplyScalar(Math.abs(m)), u = y.clone().add(b);
      e[o] = x.x + u.x, e[o + 1] = x.y + u.y, e[o + 2] = x.z + u.z;
    }
  }
  n.attributes.position.needsUpdate = !0;
}, B = {
  bend: h,
  load3: w
};
export {
  B as flexy
};
