import{S as pe,P as fe,W as me,A as ye,D as ge,a as he,O as we,c as se,b as P,B as Z,V as c,v as k,m as K,M as _,p as xe,u as ve,R as U,h as be,Q as Te,e as J,T as $,C as Ee,d as ze}from"./OrbitControls-17b67834.js";import{G as ee,D as ne,f as te}from"./fit-curve-e3b05ee8.js";import{b as oe}from"./flexy-f2d9260a.js";const i=new pe,A=new fe(75,window.innerWidth/window.innerHeight,.1,1e3);A.position.set(10,5,10);const L=new me({antialias:!0,alpha:!0});L.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(L.domElement);const Le=new ye(4210752);i.add(Le);const ae=new ge(16777215,.5);ae.position.set(1,1,1);i.add(ae);const Oe=new he(5);i.add(Oe);const Ce=new we(A,L.domElement);function X(){L.render(i,A)}Ce.addEventListener("change",function(){X()});window.addEventListener("resize",function(){const T=window.innerWidth,H=window.innerHeight;L.setSize(T,H),A.aspect=T/H,A.updateProjectionMatrix()});L.setClearColor(74565);L.setPixelRatio(window.devicePixelRatio);L.setSize(window.innerWidth,window.innerHeight);function re(T){const e=T.getPoints(1e3),B=new Ee(e),O=new ze(B,1e3,.05,8,!1),S=new se({wireframe:!0});return new P(O,S)}X();let G,F,b,ie,E,z,D,R,N;const W=[];(async function(){const T=new se({wireframe:!1}),H=function(n){return new Promise((t,r)=>{const s=new FileReader;s.onload=function(o){const y=new ee,p=new ne;p.setDecoderPath("vendor/draco/gltf/"),y.setDRACOLoader(p),y.parse(s.result,"",f=>t(f.scene.children[2].geometry))},s.onerror=function(o){r(o)},s.readAsArrayBuffer(n)})},e={curve1:{calced:!1,start:{x:-5,y:0,z:0},end:{x:5,y:0,z:0},c1:{x:-2,y:0,z:0},c2:{x:2,y:0,z:0}},curve2:{calced:!1,start:{x:-5,y:0,z:0},end:{x:5,y:0,z:0},c1:{x:-2,y:0,z:0},c2:{x:2,y:0,z:0}},model:{position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}},plane1:{rotation:0,width:15,height:10},plane2:{rotation:0,width:15,height:10},rays:{thrown:!1},other:{hidePlanes:!1,hideTextHelper:!0,selectingPoint:!1,normalRotation:0},designTransformation:{},sphereIntersection:{},oldDesignCenterData:{}},B=await async function(){const n=new ee,t=new ne;return t.setDecoderPath("vendor/draco/gltf/"),n.setDRACOLoader(t),await new Promise(r=>{n.load("./vendor/helper.gltf",function(s){r(s.scene.children[0].geometry)})})}(),O=new P(B,T);l();const S=new dat.GUI,I=S.addFolder("Props");I.open(),I.add(e.other,"hidePlanes").onChange(l),I.add(e.other,"hideTextHelper").onChange(l);const q=S.addFolder("Plane 1");q.open(),q.add(e.plane1,"width",0,20,.01).onChange(l),q.add(e.plane1,"rotation",-2*Math.PI,2*Math.PI,.01).onChange(l);const Y=S.addFolder("Plane 2 Dimensions");Y.open(),Y.add(e.plane2,"width",0,20,.01).onChange(l),Y.add(e.plane2,"rotation",-2*Math.PI,2*Math.PI,.01).onChange(l);function l(){if(G&&i.remove(G),F&&i.remove(F),E&&i.remove(E),z&&i.remove(z),O&&i.remove(O),W.length)for(const n of W)i.remove(n);if(e.other.hidePlanes===!1&&e.rays.thrown===!1){E=new P(new Z(e.plane1.width,e.plane1.height,.01,3,3,3),T),E.rotation.x=e.plane1.rotation,i.add(E),z=new P(new Z(.01,e.plane2.height,e.plane2.width,3,3,3),T),z.rotation.x=e.plane2.rotation,i.add(z);const n=10,t=e.plane1.width/(n-1);for(let o=0;o<n;o++){const y=new c(0,-1,0),p=-e.plane1.width/2+o*t,f=e.plane1.height/2+1,g=new c(p,f,0);g.applyEuler(E.rotation),y.applyEuler(E.rotation);const v=new k(y,new c(0,0,0),1,65280);v.position.copy(E.position).add(g),W.push(v),i.add(v)}const r=10,s=e.plane2.width/(r-1);for(let o=0;o<r;o++){const y=new c(0,-1,0),p=-e.plane2.width/2+o*s,f=e.plane2.height/2+1,g=new c(0,f,p);g.applyEuler(z.rotation),y.applyEuler(z.rotation);const v=new k(y,new c(0,0,0),1,16711680);v.position.copy(z.position).add(g),W.push(v),i.add(v)}}if(e.designTransformation.quaternion){b.position.set(0,0,0),b.rotation.set(0,0,0);const n=e.designTransformation.quaternion.clone(),t=e.designTransformation.point.clone();b.setRotationFromQuaternion(n);const r=t.applyQuaternion(n);b.position.set(-r.x,-r.y,-r.z)}if(e.sphereIntersection.point){D&&i.remove(D),N&&i.remove(N);const n=new K(.1,32,16),t=new _({color:"#ff0000"});D=new P(n,t);const r=e.sphereIntersection.point.clone(),s=e.sphereIntersection.normal.clone();D.position.set(r.x,r.y,0),N=new k(s,r,1,16776960),e.designTransformation.quaternion&&(D.position.set(0,0,0),N=new k(s.clone().applyQuaternion(e.designTransformation.quaternion),new c(0,0,0),1,16776960)),i.add(D),i.add(N)}if(e.oldDesignCenterData.point){R&&i.remove(R);const n=new K(.1,32,16),t=new _({color:"#00ff00"});R=new P(n,t);const r=e.oldDesignCenterData.point.clone();R.position.set(r.x,r.y,0),i.add(R)}if(e.curve1.calced){const n=new J(e.curve1.start,e.curve1.c1,e.curve1.c2,e.curve1.end);G=re(n),i.add(G)}if(e.curve2.calced){const n=new J(e.curve2.start,e.curve2.c1,e.curve2.c2,e.curve2.end);F=re(n),i.add(F)}e.curve1.calced&&e.curve2.calced&&le(),e.other.hideTextHelper===!1&&i.add(O),X()}function ce(){let n;e.sphereIntersection.normalOriginal?n=e.sphereIntersection.normalOriginal.clone():(e.sphereIntersection.normalOriginal=e.sphereIntersection.normal.clone(),n=e.sphereIntersection.normal.clone());const t=new be;t.makeRotationZ(e.other.normalRotation),n.applyMatrix4(t),e.sphereIntersection.normal=n.clone(),l()}function le(){oe({THREE:$,curve:new J(e.curve2.start,e.curve2.c1,e.curve2.c2,e.curve2.end),orientation:new c(1,0,0),bufferGeometry:O.geometry,axis:"z",preserveDimensions:!1,scene:i}),oe({THREE:$,curve:new J(e.curve1.start,e.curve1.c1,e.curve1.c2,e.curve1.end),orientation:new c(0,0,1),bufferGeometry:O.geometry,axis:"x",preserveDimensions:!1,scene:i})}function de(){const t=[],r=[],o=e.plane1.width/9,y=e.plane2.width/(10-1);for(let g=0;g<10;g++){const v=new c(0,-1,0),Q=-e.plane1.width/2+g*o,V=e.plane1.height/2+1,j=new c(Q,V,0),C=new U;C.firstHitOnly=!0,C.set(j,v);const M=C.intersectObject(b,!0);t.push([M[0].point.x,M[0].point.y])}const p=te(t,10);e.curve1.start.x=p[0][0][0],e.curve1.start.y=p[0][0][1],e.curve1.start.z=0,e.curve1.c1.x=p[0][1][0],e.curve1.c1.y=p[0][1][1],e.curve1.c1.z=0,e.curve1.c2.x=p[0][2][0],e.curve1.c2.y=p[0][2][1],e.curve1.c2.z=0,e.curve1.end.x=p[0][3][0],e.curve1.end.y=p[0][3][1],e.curve1.end.z=0,e.curve1.calced=!0;for(let g=0;g<10;g++){const v=new c(0,-1,0),Q=e.plane2.height/2+1,V=-e.plane2.width/2+g*y,j=new c(0,Q,V),C=new U;C.firstHitOnly=!0,C.set(j,v);const M=C.intersectObject(b,!0);r.push([M[0].point.y,M[0].point.z])}const f=te(r,10);e.curve2.start.x=0,e.curve2.start.y=f[0][0][0],e.curve2.start.z=f[0][0][1],e.curve2.c1.x=0,e.curve2.c1.y=f[0][1][0],e.curve2.c1.z=f[0][1][1],e.curve2.c2.x=0,e.curve2.c2.y=f[0][2][0],e.curve2.c2.z=f[0][2][1],e.curve2.end.x=0,e.curve2.end.y=f[0][3][0],e.curve2.end.z=f[0][3][1],e.curve2.calced=!0,e.rays.thrown=!0,l()}function ue(){const n=e.sphereIntersection.normal.clone(),t=new c(0,1,0),r=new c().crossVectors(n,t).normalize(),s=Math.acos(n.dot(t)),o=new Te().setFromAxisAngle(r,s);e.designTransformation.quaternion=o.clone(),e.designTransformation.point=e.sphereIntersection.point.clone(),e.designTransformation.dataJSON={position:e.designTransformation.point.clone(),normal:e.sphereIntersection.normal.clone()}}const h=document.createElement("button");h.style.position="absolute",h.style.top="10px",h.style.left="10px",h.style.border=0,h.style.background="blueviolet",h.style.color="white",h.style.padding="7px 14px",h.style.cursor="pointer",h.innerHTML="UPLOAD GTLF",h.addEventListener("click",async()=>{document.getElementById("fileInput").click()}),document.body.append(h),document.getElementById("fileInput").addEventListener("change",async function(n){const t=n.target.files[0];t&&(b&&i.remove(b),ie=await H(t),b=new P(ie,T),b.material.side=xe,i.add(b),h.style.background="green"),l()});const a=document.createElement("button");a.style.position="absolute",a.style.top="50px",a.style.left="10px",a.style.border=0,a.style.background="blueviolet",a.style.color="white",a.style.padding="7px 14px",a.style.cursor="pointer",a.innerHTML="SELECT POINT",a.addEventListener("click",n=>{e.other.selectingPoint===!0?(e.other.selectingPoint=!1,a.style.background="blueviolet",a.innerHTML="SELECT POINT",n.stopImmediatePropagation()):(a.style.background="orange",e.other.selectingPoint=!0,a.innerHTML="CLICK ON THE JEWEL",n.stopImmediatePropagation(),document.body.onclick=null,document.body.onclick=t=>{const r=new ve,s=new U;s.firstHitOnly=!0,r.x=t.clientX/window.innerWidth*2-1,r.y=-(t.clientY/window.innerHeight)*2+1,s.setFromCamera(r,A);const o=s.intersectObjects(i.children.filter(y=>y.type==="Mesh"&&y.geometry.type!=="BoxGeometry"),!0);o.length>0&&o[0].face?(e.sphereIntersection={point:o[0].point.clone(),normal:o[0].face.normal.clone()},I.add(e.other,"normalRotation",-Math.PI,Math.PI,.1).onChange(ce),l(),document.body.onclick=null,a.style.background="green",a.innerHTML="DESIGN CENTER SELECTED",e.other.selectingPoint=!1):a.innerHTML="TARGET THE STL"})}),document.body.append(a);const m=document.createElement("button");m.style.position="absolute",m.style.top="90px",m.style.left="10px",m.style.border=0,m.style.background="blueviolet",m.style.color="white",m.style.padding="7px 14px",m.style.cursor="pointer",m.innerHTML="MOVE JEWEL",m.addEventListener("click",()=>{ue(),l(),m.innerHTML="JEWEL ALIGNED WITH DESIGN",m.style.background="green"}),document.body.append(m);const d=document.createElement("button");d.style.position="absolute",d.style.top="130px",d.style.left="10px",d.style.border=0,d.style.background="blueviolet",d.style.color="white",d.style.padding="7px 14px",d.style.cursor="pointer",d.innerHTML="THROW RAYCASTERS",d.addEventListener("click",()=>{e.curve1.calced===!1&&e.curve2.calced===!1?(de(),d.innerHTML="RESET",d.style.background="green"):(e.curve1.calced=!1,e.curve2.calced=!1,l(),d.innerHTML="THROW CASTERS",d.style.background="blueviolet")}),document.body.append(d);const w=document.createElement("button");w.style.position="absolute",w.style.top="170px",w.style.left="10px",w.style.border=0,w.style.background="blueviolet",w.style.color="white",w.style.padding="7px 14px",w.style.cursor="pointer",w.innerHTML="PRINT BEND DATA",w.addEventListener("click",()=>{const n=[{flexy:!0,axis:"z",transformation:{position:{x:e.designTransformation.dataJSON.position.x,y:e.designTransformation.dataJSON.position.y,z:0},normal:{x:e.designTransformation.dataJSON.normal.x,y:e.designTransformation.dataJSON.normal.y,z:0}},curveParts:[{startPoint:{x:e.curve2.start.x,y:e.curve2.start.y,z:e.curve2.start.z},controlPoint1:{x:e.curve2.c1.x,y:e.curve2.c1.y,z:e.curve2.c1.z},controlPoint2:{x:e.curve2.c2.x,y:e.curve2.c2.y,z:e.curve2.c2.z},endPoint:{x:e.curve2.end.x,y:e.curve2.end.y,z:e.curve2.end.z}}]},{flexy:!0,axis:"x",transformation:{position:{x:e.designTransformation.dataJSON.position.x,y:e.designTransformation.dataJSON.position.y,z:e.designTransformation.dataJSON.position.z},normal:{x:e.designTransformation.dataJSON.normal.x,y:e.designTransformation.dataJSON.normal.y,z:e.designTransformation.dataJSON.normal.z}},curveParts:[{startPoint:{x:e.curve1.start.x,y:e.curve1.start.y,z:e.curve1.start.z},controlPoint1:{x:e.curve1.c1.x,y:e.curve1.c1.y,z:e.curve1.c1.z},controlPoint2:{x:e.curve1.c2.x,y:e.curve1.c2.y,z:e.curve1.c2.z},endPoint:{x:e.curve1.end.x,y:e.curve1.end.y,z:e.curve1.end.z}}]}],t=n.find(o=>o.axis==="x"),r=n.find(o=>o.axis==="z"),s=JSON.parse(JSON.stringify(n));for(let o=0;o<s.length;o++)s[o].axis==="x"&&(s[o].transformation.position.x=-t.transformation.position.x,s[o].transformation.normal.x=-t.transformation.normal.x),s[o].axis==="z"&&(s[o].transformation.position.x=-r.transformation.position.x,s[o].transformation.normal.x=-r.transformation.normal.x);console.log("DATA FOR LEFT AREA"),console.log(JSON.stringify(s)),console.log("DATA FOR RIGHT AREA"),console.log(JSON.stringify(n)),w.innerHTML="COPIED!"}),document.body.append(w);const x=document.createElement("button");x.style.position="absolute",x.style.bottom="50px",x.style.left="10px",x.style.border=0,x.style.background="blueviolet",x.style.color="white",x.style.padding="7px 14px",x.style.cursor="pointer",x.innerHTML="LOAD DATA JSON",x.addEventListener("click",()=>{const n=JSON.parse(prompt("COPY & PASTE")),t=new c(n[0].transformation.position.x,n[0].transformation.position.y,n[0].transformation.position.z);e.oldDesignCenterData.point=t,l()}),document.body.append(x);const u=document.createElement("button");u.style.position="absolute",u.style.bottom="10px",u.style.left="10px",u.style.border=0,u.style.background="blueviolet",u.style.color="white",u.style.padding="7px 14px",u.style.cursor="pointer",u.innerHTML="MIRROR TO THE OTHER SIDE",u.addEventListener("click",()=>{if(e.oldDesignCenterData.point){const n=new c(-e.oldDesignCenterData.point.x,e.oldDesignCenterData.point.y,e.oldDesignCenterData.point.z);e.oldDesignCenterData.point=n.clone(),l()}else u.innerHTML="LOAD JSON DATA FIRST",u.style.background="red",setTimeout(()=>{u.innerHTML="MIRROR TO THE OTHER SIDE",u.style.background="blueviolet"},1500)}),document.body.append(u)})();
