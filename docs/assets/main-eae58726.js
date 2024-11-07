import{S as L,P as B,W as I,A as T,D as q,a as O,O as j,T as M,Q as S,M as w,b,B as Q,c as D,C as X,d as Y,V as s,e as x,f as _}from"./OrbitControls-17b67834.js";import{b as G}from"./flexy-f2d9260a.js";const p=new L,C=new B(75,window.innerWidth/window.innerHeight,.1,1e3);C.position.set(20,15,20);const g=new I({antialias:!0,alpha:!0});g.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(g.domElement);const N=new T(4210752);p.add(N);const E=new q(16777215,.5);E.position.set(1,1,1);p.add(E);const U=new O(5);p.add(U);const k=new j(C,g.domElement);function H(){requestAnimationFrame(H),k.update(),g.render(p,C)}window.addEventListener("resize",function(){const e=window.innerWidth,t=window.innerHeight;g.setSize(e,t),C.aspect=e/t,C.updateProjectionMatrix()});g.setClearColor(74565);g.setPixelRatio(window.devicePixelRatio);g.setSize(window.innerWidth,window.innerHeight);const J=({arcR:e,rotation:t})=>{const n=new s(0,1,0),o=new s(0,e,0).applyAxisAngle(n,t),i=new s(e*.55,e,0).applyAxisAngle(n,t),a=new s(e,e*.45,0).applyAxisAngle(n,t),c=new s(e,0,e).applyAxisAngle(n,t);return{curve:new x(c,a,i,o),rotationVector:n}},K=({arcR:e,rotation:t})=>{const n=new s(0,1,0),o=new s(e,e/8,0).applyAxisAngle(n,t),i=new s(e/4,e/2,0).applyAxisAngle(n,t),a=new s(-e/4,e/2,0).applyAxisAngle(n,t),c=new s(-e,e/8,0).applyAxisAngle(n,t);return{curve:new x(c,a,i,o),rotationVector:n}},Z=({ellipseA:e,ellipseB:t,rotation:n})=>{const o=new s(1,0,1);let i=new s(e,0,0).applyAxisAngle(o,n),a=new s(e,t*.45,0).applyAxisAngle(o,n),c=new s(e*.55,t,0).applyAxisAngle(o,n),l=new s(0,t,0).applyAxisAngle(o,n);const u=new x(l,c,a,i);i=new s(0,t,0).applyAxisAngle(o,n),a=new s(-e*.45,t,0).applyAxisAngle(o,n),c=new s(-e,t*.55,0).applyAxisAngle(o,n),l=new s(-e,0,0).applyAxisAngle(o,n);const v=new x(l,c,a,i);i=new s(-e,0,0).applyAxisAngle(o,n),a=new s(-e,-t*.45,0).applyAxisAngle(o,n),c=new s(-e*.55,-t,0).applyAxisAngle(o,n),l=new s(0,-t,0).applyAxisAngle(o,n);const z=new x(l,c,a,i);i=new s(0,-t,0).applyAxisAngle(o,n),a=new s(e*.45,-t,0).applyAxisAngle(o,n),c=new s(e,-t*.55,0).applyAxisAngle(o,n),l=new s(e,0,0).applyAxisAngle(o,n);const W=new x(l,c,a,i),m=new _;return m.add(u),m.add(v),m.add(z),m.add(W),{curve:m,rotationVector:o.multiplyScalar(n)}},$=({sineX0:e,sineX1:t,sineAmplitude:n,rotation:o})=>{const i=new s(0,1,0),a=new s(-e,0,0).applyAxisAngle(i,o),c=new s(Math.ceil((-e+t)*(1/3)),n,0).applyAxisAngle(i,o),l=new s(Math.ceil((-e+t)*(1/3)),-n,0).applyAxisAngle(i,o),u=new s(t,0,0).applyAxisAngle(i,o);return{curve:new x(u,l,c,a),rotationVector:i}};function R({width:e,height:t,depth:n,widthSegments:o,heightSegments:i,depthSegments:a,wireframe:c}){const l=new Q(e,t,n*3,o,i,a);let u;return c?u=new D({wireframe:!0}):(u=[],u.push(new w({color:16724787})),u.push(new w({color:16746496})),u.push(new w({color:16777011})),u.push(new w({color:3407667})),u.push(new w({color:3355647})),u.push(new w({color:8926207}))),new b(l,u)}function F(e){if(e.type==="3d_arc")return J(e);if(e.type==="arc")return K(e);if(e.type==="ellipse")return Z(e);if(e.type==="sine")return $(e)}function V(e){const n=e.getPoints(1e3),o=new X(n),i=new Y(o,1e3,.1,8,!1),a=new D({wireframe:!0});return new b(i,a)}let A=[];function d(){for(const l of A)p.remove(l);A=[];const e=R(r.box);p.add(e),A.push(e);const{curve:t,rotationVector:n}=F(r.firstCurve),o=V(t);if(r.box.wireframe&&p.add(o),A.push(o),r.secondAxisBend){r.secondCurve.rotation+=Math.PI/2;const l=F(r.secondCurve),u=V(l.curve);r.box.wireframe&&p.add(u),A.push(u),r.secondCurve.rotation-=Math.PI/2,G({THREE:M,curve:l.curve,quaternion:new S().setFromAxisAngle(l.rotationVector,r.secondCurve.rotation),bufferGeometry:e.geometry,preserveDimensions:r.box.preserveDimensions,axis:"z",scene:p})}const i=e.geometry.clone(),a=[];a.push(new w({color:16724787})),a.push(new w({color:16746496})),a.push(new w({color:16777011})),a.push(new w({color:3407667})),a.push(new w({color:3355647})),a.push(new w({color:8926207}));const c=new b(i,a);c.position.z+=9,p.add(c),e.geometry.rotateY(-.3),c.geometry.rotateY(-.3),G({THREE:M,curve:t,quaternion:new S().setFromAxisAngle(n,r.firstCurve.rotation),bufferGeometry:e.geometry,axis:"x",preserveDimensions:r.box.preserveDimensions,scene:p})}const r={box:{width:15,height:2,depth:2,widthSegments:60,heightSegments:10,depthSegments:10,wireframe:!1,preserveDimensions:!1},firstCurve:{type:"arc",rotation:0,arcR:10,ellipseA:15,ellipseB:10,sineX0:0,sineX1:10,sineAmplitude:4},secondAxisBend:!1,secondCurve:{type:"arc",rotation:0,arcR:1,ellipseA:15,ellipseB:10,sineX0:0,sineX1:10,sineAmplitude:4}},P=new dat.GUI,f=P.addFolder("Box Geometry");f.open();f.add(r.box,"wireframe").onChange(d);f.add(r.box,"width",1,30).onChange(d);f.add(r.box,"height",1,30).onChange(d);f.add(r.box,"depth",1,30).onChange(d);f.add(r.box,"widthSegments",1,60).onChange(d);f.add(r.box,"heightSegments",1,60).onChange(d);f.add(r.box,"depthSegments",1,60).onChange(d);f.add(r.box,"preserveDimensions").onChange(d);const h=P.addFolder("First Bend on axis");h.open();h.add(r.firstCurve,"type",["arc","3d_arc","ellipse","sine"]).onChange(d);h.add(r.firstCurve,"rotation",0,2*Math.PI).onChange(d);h.add(r.firstCurve,"arcR",-20,20).onChange(d);h.add(r.firstCurve,"ellipseA",3,20).onChange(d);h.add(r.firstCurve,"ellipseB",3,20).onChange(d);h.add(r.firstCurve,"sineX0",0,20).onChange(d);h.add(r.firstCurve,"sineX1",0,20).onChange(d);h.add(r.firstCurve,"sineAmplitude",0,10).onChange(d);const y=P.addFolder("Second Bend on axis");y.open();y.add(r,"secondAxisBend").onChange(d);y.add(r.secondCurve,"rotation",0,2*Math.PI).onChange(d);y.add(r.secondCurve,"arcR",-20,20).onChange(d);d();H();