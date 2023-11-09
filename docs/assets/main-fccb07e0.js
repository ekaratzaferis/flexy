import{S as L,P as B,W as I,A as T,D as q,a as O,O as _,b as P,T as M,Q as S,B as j,M as V,c as x,d as D,C as Q,e as X,V as o,f,g as N}from"./OrbitControls-62fd452e.js";const w=new L,C=new B(75,window.innerWidth/window.innerHeight,.1,1e3);C.position.set(20,15,20);const h=new I({antialias:!0,alpha:!0});h.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(h.domElement);const U=new T(4210752);w.add(U);const E=new q(16777215,.5);E.position.set(1,1,1);w.add(E);const k=new O(5);w.add(k);const J=new _(C,h.domElement);function H(){requestAnimationFrame(H),J.update(),h.render(w,C)}window.addEventListener("resize",function(){const e=window.innerWidth,t=window.innerHeight;h.setSize(e,t),C.aspect=e/t,C.updateProjectionMatrix()});h.setClearColor(74565);h.setPixelRatio(window.devicePixelRatio);h.setSize(window.innerWidth,window.innerHeight);const K=({arcR:e,rotation:t})=>{const n=new o(0,1,0),s=new o(0,e,0).applyAxisAngle(n,t),a=new o(e*.55,e,0).applyAxisAngle(n,t),i=new o(e,e*.45,0).applyAxisAngle(n,t),c=new o(e,0,e).applyAxisAngle(n,t);return{curve:new f(s,a,i,c),rotationVector:n}},Y=({arcR:e,rotation:t})=>{const n=new o(0,1,0),s=new o(e,e/8,0).applyAxisAngle(n,t),a=new o(e/4,e/2,0).applyAxisAngle(n,t),i=new o(-e/4,e/2,0).applyAxisAngle(n,t),c=new o(-e,e/8,0).applyAxisAngle(n,t);return{curve:new f(s,a,i,c),rotationVector:n}},Z=({ellipseA:e,ellipseB:t,rotation:n})=>{const s=new o(1,0,1);let a=new o(e,0,0).applyAxisAngle(s,n),i=new o(e,t*.45,0).applyAxisAngle(s,n),c=new o(e*.55,t,0).applyAxisAngle(s,n),l=new o(0,t,0).applyAxisAngle(s,n);const u=new f(a,i,c,l);a=new o(0,t,0).applyAxisAngle(s,n),i=new o(-e*.45,t,0).applyAxisAngle(s,n),c=new o(-e,t*.55,0).applyAxisAngle(s,n),l=new o(-e,0,0).applyAxisAngle(s,n);const y=new f(a,i,c,l);a=new o(-e,0,0).applyAxisAngle(s,n),i=new o(-e,-t*.45,0).applyAxisAngle(s,n),c=new o(-e*.55,-t,0).applyAxisAngle(s,n),l=new o(0,-t,0).applyAxisAngle(s,n);const W=new f(a,i,c,l);a=new o(0,-t,0).applyAxisAngle(s,n),i=new o(e*.45,-t,0).applyAxisAngle(s,n),c=new o(e,-t*.55,0).applyAxisAngle(s,n),l=new o(e,0,0).applyAxisAngle(s,n);const z=new f(a,i,c,l),A=new N;return A.add(u),A.add(y),A.add(W),A.add(z),{curve:A,rotationVector:s.multiplyScalar(n)}},$=({sineX0:e,sineX1:t,sineAmplitude:n,rotation:s})=>{const a=new o(0,1,0),i=new o(-e,0,0).applyAxisAngle(a,s),c=new o(Math.ceil((-e+t)*(1/3)),n,0).applyAxisAngle(a,s),l=new o(Math.ceil((-e+t)*(1/3)),-n,0).applyAxisAngle(a,s),u=new o(t,0,0).applyAxisAngle(a,s);return{curve:new f(i,c,l,u),rotationVector:a}};function R({width:e,height:t,depth:n,widthSegments:s,heightSegments:a,depthSegments:i,wireframe:c}){const l=new j(e,t,n,s,a,i);let u;return c?u=new V({wireframe:!0}):(u=[],u.push(new x({color:16724787})),u.push(new x({color:16746496})),u.push(new x({color:16777011})),u.push(new x({color:3407667})),u.push(new x({color:3355647})),u.push(new x({color:8926207}))),new D(l,u)}function F(e){if(e.type==="3d_arc")return K(e);if(e.type==="arc")return Y(e);if(e.type==="ellipse")return Z(e);if(e.type==="sine")return $(e)}function G(e){const n=e.getPoints(1e3),s=new Q(n),a=new X(s,1e3,.1,8,!1),i=new V({wireframe:!0});return new D(a,i)}let m=[];function d(){for(const a of m)w.remove(a);m=[];const e=R(r.box);w.add(e),m.push(e);const{curve:t,rotationVector:n}=F(r.firstCurve),s=G(t);if(r.box.wireframe&&w.add(s),m.push(s),r.secondAxisBend){r.secondCurve.rotation+=Math.PI/2;const a=F(r.secondCurve),i=G(a.curve);r.box.wireframe&&w.add(i),m.push(i),r.secondCurve.rotation-=Math.PI/2,P({THREE:M,curve:a.curve,quaternion:new S().setFromAxisAngle(a.rotationVector,r.secondCurve.rotation),bufferGeometry:e.geometry,preserveDimensions:r.box.preserveDimensions,axis:"z",scene:w})}P({THREE:M,curve:t,quaternion:new S().setFromAxisAngle(n,r.firstCurve.rotation),bufferGeometry:e.geometry,axis:"x",preserveDimensions:r.box.preserveDimensions,scene:w})}const r={box:{width:15,height:2,depth:2,widthSegments:60,heightSegments:10,depthSegments:10,wireframe:!1,preserveDimensions:!1},firstCurve:{type:"3d_arc",rotation:0,arcR:10,ellipseA:15,ellipseB:10,sineX0:0,sineX1:10,sineAmplitude:4},secondAxisBend:!1,secondCurve:{type:"arc",rotation:0,arcR:1,ellipseA:15,ellipseB:10,sineX0:0,sineX1:10,sineAmplitude:4}},b=new dat.GUI,p=b.addFolder("Box Geometry");p.open();p.add(r.box,"wireframe").onChange(d);p.add(r.box,"width",1,30).onChange(d);p.add(r.box,"height",1,30).onChange(d);p.add(r.box,"depth",1,30).onChange(d);p.add(r.box,"widthSegments",1,60).onChange(d);p.add(r.box,"heightSegments",1,60).onChange(d);p.add(r.box,"depthSegments",1,60).onChange(d);p.add(r.box,"preserveDimensions").onChange(d);const g=b.addFolder("First Bend on axis");g.open();g.add(r.firstCurve,"type",["arc","3d_arc","ellipse","sine"]).onChange(d);g.add(r.firstCurve,"rotation",0,2*Math.PI).onChange(d);g.add(r.firstCurve,"arcR",-20,20).onChange(d);g.add(r.firstCurve,"ellipseA",3,20).onChange(d);g.add(r.firstCurve,"ellipseB",3,20).onChange(d);g.add(r.firstCurve,"sineX0",0,20).onChange(d);g.add(r.firstCurve,"sineX1",0,20).onChange(d);g.add(r.firstCurve,"sineAmplitude",0,10).onChange(d);const v=b.addFolder("Second Bend on axis");v.open();v.add(r,"secondAxisBend").onChange(d);v.add(r.secondCurve,"rotation",0,2*Math.PI).onChange(d);v.add(r.secondCurve,"arcR",-20,20).onChange(d);d();H();
