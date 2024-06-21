import{S as ce,P as ae,W as ie,A as se,D as de,a as le,O as ue,M as $,c as H,B as U,V as l,v as j,p as pe,R as V,e as R,T as X,w as ve,C as we,d as fe}from"./OrbitControls-0eeb9f96.js";import{b as Z}from"./flexy-f2d9260a.js";import{G as q,D as J,f as K}from"./fit-curve-b4464fdb.js";const n=new ce,I=new ae(75,window.innerWidth/window.innerHeight,.1,1e3);I.position.set(10,5,10);const g=new ie({antialias:!0,alpha:!0});g.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(g.domElement);const me=new se(4210752);n.add(me);const ee=new de(16777215,.5);ee.position.set(1,1,1);n.add(ee);const ye=new le(5);n.add(ye);const he=new ue(I,g.domElement);function te(){requestAnimationFrame(te),he.update(),g.render(n,I)}window.addEventListener("resize",function(){const m=window.innerWidth,A=window.innerHeight;g.setSize(m,A),I.aspect=m/A,I.updateProjectionMatrix()});g.setClearColor(74565);g.setPixelRatio(window.devicePixelRatio);g.setSize(window.innerWidth,window.innerHeight);function Q(m){const e=m.getPoints(1e3),F=new we(e),w=new fe(F,1e3,.05,8,!1),P=new $({wireframe:!0});return new H(w,P)}te();let D,S,f,_,xe,h,x;const G=[];(async function(){const m=new $({wireframe:!0}),A=function(t){return new Promise((a,u)=>{const p=new FileReader;p.onload=function(i){const s=new q,o=new J;o.setDecoderPath("vendor/draco/gltf/"),s.setDRACOLoader(o),s.parse(p.result,"",r=>a(r.scene.children[2].geometry))},p.onerror=function(i){u(i)},p.readAsArrayBuffer(t)})},e={curve1:{calced:!1,start:{x:-5,y:0,z:0},end:{x:5,y:0,z:0},c1:{x:-2,y:0,z:0},c2:{x:2,y:0,z:0}},curve2:{calced:!1,start:{x:-5,y:0,z:0},end:{x:5,y:0,z:0},c1:{x:-2,y:0,z:0},c2:{x:2,y:0,z:0}},model:{position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}},plane1:{rotation:0,width:5,height:5},plane2:{rotation:0,width:5,height:5},rays:{thrown:!1}},F=await async function(){const t=new q,a=new J;return a.setDecoderPath("vendor/draco/gltf/"),t.setDRACOLoader(a),await new Promise(u=>{t.load("helper.gltf",function(p){u(p.scene.children[0].geometry)})})}(),w=new H(F,m);n.add(w),d();const P=new dat.GUI,M=P.addFolder("Translate Model");M.open(),M.add(e.model.position,"x",-10,10,.01).onChange(d),M.add(e.model.position,"y",-10,10,.01).onChange(d),M.add(e.model.position,"z",-10,10,.01).onChange(d);const O=P.addFolder("Rotate Model");O.open(),O.add(e.model.rotation,"x",-2*Math.PI,2*Math.PI,.01).onChange(d),O.add(e.model.rotation,"y",-2*Math.PI,2*Math.PI,.01).onChange(d),O.add(e.model.rotation,"z",-2*Math.PI,2*Math.PI,.01).onChange(d);const W=P.addFolder("Plane 1");W.open(),W.add(e.plane1,"width",-10,10,.01).onChange(d),W.add(e.plane1,"rotation",-2*Math.PI,2*Math.PI,.01).onChange(d);const Y=P.addFolder("Plane 2 Dimensions");Y.open(),Y.add(e.plane2,"width",-10,10,.01).onChange(d),Y.add(e.plane2,"rotation",-2*Math.PI,2*Math.PI,.01).onChange(d);function d(){if(D&&n.remove(D),S&&n.remove(S),h&&n.remove(h),x&&n.remove(x),G.length)for(const t of G)n.remove(t);if(e.rays.thrown===!1){h=new H(new U(e.plane1.width,e.plane1.height,.01,3,3,3),m),h.rotation.x=e.plane1.rotation,n.add(h),x=new H(new U(.01,e.plane2.height,e.plane2.width,3,3,3),m),x.rotation.x=e.plane2.rotation,n.add(x);const t=10,a=e.plane1.width/(t-1);for(let i=0;i<t;i++){const s=new l(0,-1,0),o=-e.plane1.width/2+i*a,r=e.plane1.height/2+1,c=new l(o,r,0);c.applyEuler(h.rotation),s.applyEuler(h.rotation);const v=new j(s,new l(0,0,0),1,65280);v.position.copy(h.position).add(c),G.push(v),n.add(v)}const u=10,p=e.plane2.width/(u-1);for(let i=0;i<u;i++){const s=new l(0,-1,0),o=-e.plane2.width/2+i*p,r=e.plane2.height/2+1,c=new l(0,r,o);c.applyEuler(x.rotation),s.applyEuler(x.rotation);const v=new j(s,new l(0,0,0),1,16711680);v.position.copy(x.position).add(c),G.push(v),n.add(v)}}if(f&&(f.position.set(e.model.position.x,e.model.position.y,e.model.position.z),f.rotation.set(e.model.rotation.x,e.model.rotation.y,e.model.rotation.z)),e.curve1.calced){const t=new R(e.curve1.start,e.curve1.c1,e.curve1.c2,e.curve1.end);D=Q(t),n.add(D)}if(e.curve2.calced){const t=new R(e.curve2.start,e.curve2.c1,e.curve2.c2,e.curve2.end);S=Q(t),n.add(S)}e.curve1.calced&&e.curve2.calced&&(ne(),n.add(xe))}function ne(){Z({THREE:X,curve:new R(e.curve2.start,e.curve2.c1,e.curve2.c2,e.curve2.end),orientation:new l(1,0,0),bufferGeometry:w.geometry,axis:"z",preserveDimensions:!0,scene:n}),Z({THREE:X,curve:new R(e.curve1.start,e.curve1.c1,e.curve1.c2,e.curve1.end),orientation:new l(0,0,1),bufferGeometry:w.geometry,axis:"x",preserveDimensions:!0,scene:n}),e.curve2.correction=re(e.curve2),w.position.y+=e.curve2.correction}function oe(){const a=[],u=[],i=e.plane1.width/9,s=e.plane2.width/(10-1);for(let c=0;c<10;c++){const v=new l(0,-1,0),k=-e.plane1.width/2+c*i,B=e.plane1.height/2+1,N=new l(k,B,0),z=new V;z.firstHitOnly=!0,z.set(N,v);const T=z.intersectObject(f,!0);a.push([T[0].point.x,T[0].point.y])}const o=K(a,10);e.curve1.start.x=o[0][0][0],e.curve1.start.y=o[0][0][1],e.curve1.start.z=0,e.curve1.c1.x=o[0][1][0],e.curve1.c1.y=o[0][1][1],e.curve1.c1.z=0,e.curve1.c2.x=o[0][2][0],e.curve1.c2.y=o[0][2][1],e.curve1.c2.z=0,e.curve1.end.x=o[0][3][0],e.curve1.end.y=o[0][3][1],e.curve1.end.z=0,e.curve1.calced=!0;for(let c=0;c<10;c++){const v=new l(0,-1,0),k=e.plane2.height/2+1,B=-e.plane2.width/2+c*s,N=new l(0,k,B),z=new V;z.firstHitOnly=!0,z.set(N,v);const T=z.intersectObject(f,!0);u.push([T[0].point.y,T[0].point.z])}const r=K(u,10);e.curve2.start.x=0,e.curve2.start.y=r[0][0][0],e.curve2.start.z=r[0][0][1],e.curve2.c1.x=0,e.curve2.c1.y=r[0][1][0],e.curve2.c1.z=r[0][1][1],e.curve2.c2.x=0,e.curve2.c2.y=r[0][2][0],e.curve2.c2.z=r[0][2][1],e.curve2.end.x=0,e.curve2.end.y=r[0][3][0],e.curve2.end.z=r[0][3][1],e.curve2.calced=!0,e.rays.thrown=!0,d()}function re(t){const a=new R(t.start,t.c1,t.c2,t.end),u=new ve(t.start,t.end),p=100,i=a.getPoints(p);let s=0;return i.forEach(o=>{const r=u.closestPointToPoint(o,!0,new l),c=o.distanceTo(r);c>s&&(s=c)}),s}const b=document.createElement("button");b.style.position="absolute",b.style.top=0,b.style.left=0,b.innerHTML="UPLOAD MODEL",b.addEventListener("click",async()=>{document.getElementById("fileInput").click()}),document.body.append(b),document.getElementById("fileInput").addEventListener("change",async function(t){const a=t.target.files[0];a&&(f&&n.remove(f),_=await A(a),f=new H(_,m),f.material.side=pe,n.add(f))});const C=document.createElement("button");C.style.position="absolute",C.style.top="25px",C.style.left=0,C.innerHTML="RIGHT AREA ROTATION",C.addEventListener("click",async()=>{w&&w.rotateY(Math.PI/2)}),document.body.append(C);const L=document.createElement("button");L.style.position="absolute",L.style.top="50px",L.style.left=0,L.innerHTML="LEFT AREA ROTATION",L.addEventListener("click",async()=>{w&&w.rotateY(-Math.PI/2)}),document.body.append(L);const E=document.createElement("button");E.style.position="absolute",E.style.bottom=0,E.style.left=0,E.innerHTML="PRINT CURVES",E.addEventListener("click",()=>{console.log(JSON.stringify([{flexy:!0,axis:"z",curveParts:[{startPoint:{x:e.curve2.start.x,y:e.curve2.start.y,z:e.curve2.start.z},controlPoint1:{x:e.curve2.c1.x,y:e.curve2.c1.y,z:e.curve2.c1.z},controlPoint2:{x:e.curve2.c2.x,y:e.curve2.c2.y,z:e.curve2.c2.z},endPoint:{x:e.curve2.end.x,y:e.curve2.end.y,z:e.curve2.end.z}}]},{flexy:!0,axis:"x",curveParts:[{startPoint:{x:e.curve1.start.x,y:e.curve1.start.y,z:e.curve1.start.z},controlPoint1:{x:e.curve1.c1.x,y:e.curve1.c1.y,z:e.curve1.c1.z},controlPoint2:{x:e.curve1.c2.x,y:e.curve1.c2.y,z:e.curve1.c2.z},endPoint:{x:e.curve1.end.x,y:e.curve1.end.y,z:e.curve1.end.z}}]}]))}),document.body.append(E);const y=document.createElement("button");y.style.position="absolute",y.style.bottom=0,y.style.right=0,y.innerHTML="THROW RAYCASTERS",y.addEventListener("click",()=>{e.curve1.calced===!1&&e.curve2.calced===!1?(oe(),y.innerHTML="RESET"):(e.curve1.calced=!1,e.curve2.calced=!1,d(),y.innerHTML="THROW CASTERS")}),document.body.append(y)})();
