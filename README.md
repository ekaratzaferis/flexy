# flexy
A library that bends three.js box geometries along Bezier Curves

# How to install

As an es6 module

```
npm install flexy
```

or from a CDN

```
https:link_to_cdn
```

# How to use it

After you import flexy to your project, you first have to generate a Cubic Bezier Curve.

eg

```
const startPoint = new Vector3(R, 0, 0);
const controlPoint1 = new Vector3(R, R * 0.55, 0);
const controlPoint2 = new Vector3(R * 0.45, R, 0);
const endPoint = new Vector3(0, R, 0);
const curve = new CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
```

then in order to bend it in the 'y' axis

```
flexy.bend(curve, 1000, yourGeometry, 'y');
```

# Behind the scenes

Nice little diagram

# How to run the examples

```
npm i
npm run dev
```

Open your browser @ localhost:5173

# Todos

1. Given object A, object B and a normal Vector that indicates a direction, bend object B onto object A
2. Bend on all 3 axis
3. Leave better comments