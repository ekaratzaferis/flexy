import{S as pe,P as me,W as fe,A as ye,D as ge,a as he,O as ve,c as se,b as C,B as U,V as l,v as J,m as K,M as $,p as we,u as xe,R as X,h as be,Q as Te,e as F,T as _,C as Ee,d as Le}from"./OrbitControls-17b67834.js";import{G as ee,D as ne,f as te}from"./fit-curve-e3b05ee8.js";import{b as oe}from"./flexy-f2d9260a.js";const i=new pe,I=new me(75,window.innerWidth/window.innerHeight,.1,1e3);I.position.set(10,5,10);const O=new fe({antialias:!0,alpha:!0});O.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(O.domElement);const ze=new ye(4210752);i.add(ze);const ae=new ge(16777215,.5);ae.position.set(1,1,1);i.add(ae);const Oe=new he(5);i.add(Oe);const Ae=new ve(I,O.domElement);function Z(){O.render(i,I)}Ae.addEventListener("change",function(){Z()});window.addEventListener("resize",function(){const T=window.innerWidth,P=window.innerHeight;O.setSize(T,P),I.aspect=T/P,I.updateProjectionMatrix()});O.setClearColor(74565);O.setPixelRatio(window.devicePixelRatio);O.setSize(window.innerWidth,window.innerHeight);function re(T){const e=T.getPoints(1e3),j=new Ee(e),A=new Le(j,1e3,.05,8,!1),H=new se({wireframe:!0});return new C(A,H)}Z();let B,W,b,ie,L,z,S,k,G;const q=[];(async function(){const T=new se({wireframe:!1}),P=function(n){return new Promise((t,r)=>{const s=new FileReader;s.onload=function(o){const g=new ee,f=new ne;f.setDecoderPath("vendor/draco/gltf/"),g.setDRACOLoader(f),g.parse(s.result,"",c=>{console.log(c.scene.children);const d=c.scene.children.find(y=>y.name==="jewel");if(d)t(d.geometry);else{const y=prompt(`Select object from GLTF: ${c.scene.children.reduce((E,R)=>E+(E?", ":"")+R.name,"")}`);t(c.scene.children.find(E=>E.name===y).geometry)}})},s.onerror=function(o){r(o)},s.readAsArrayBuffer(n)})},e={curve1:{calced:!1,start:{x:-5,y:0,z:0},end:{x:5,y:0,z:0},c1:{x:-2,y:0,z:0},c2:{x:2,y:0,z:0}},curve2:{calced:!1,start:{x:-5,y:0,z:0},end:{x:5,y:0,z:0},c1:{x:-2,y:0,z:0},c2:{x:2,y:0,z:0}},model:{position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}},plane1:{rotation:0,width:15,height:10},plane2:{rotation:0,width:15,height:10},rays:{thrown:!1},other:{hidePlanes:!1,hideTextHelper:!0,selectingPoint:!1,normalRotation:0},designTransformation:{},sphereIntersection:{},oldDesignCenterData:{}},j=await async function(){const n=new ee,t=new ne;return t.setDecoderPath("vendor/draco/gltf/"),n.setDRACOLoader(t),await new Promise(r=>{n.load("./vendor/helper.gltf",function(s){r(s.scene.children[0].geometry)})})}(),A=new C(j,T);u();const H=new dat.GUI,M=H.addFolder("Props");M.open(),M.add(e.other,"hidePlanes").onChange(u),M.add(e.other,"hideTextHelper").onChange(u);const Y=H.addFolder("Plane 1");Y.open(),Y.add(e.plane1,"width",0,20,.01).onChange(u),Y.add(e.plane1,"rotation",-2*Math.PI,2*Math.PI,.01).onChange(u);const Q=H.addFolder("Plane 2 Dimensions");Q.open(),Q.add(e.plane2,"width",0,20,.01).onChange(u),Q.add(e.plane2,"rotation",-2*Math.PI,2*Math.PI,.01).onChange(u);function u(){if(B&&i.remove(B),W&&i.remove(W),L&&i.remove(L),z&&i.remove(z),A&&i.remove(A),q.length)for(const n of q)i.remove(n);if(e.other.hidePlanes===!1&&e.rays.thrown===!1){L=new C(new U(e.plane1.width,e.plane1.height,.01,3,3,3),T),L.rotation.x=e.plane1.rotation,i.add(L),z=new C(new U(.01,e.plane2.height,e.plane2.width,3,3,3),T),z.rotation.x=e.plane2.rotation,i.add(z);const n=10,t=e.plane1.width/(n-1);for(let o=0;o<n;o++){const g=new l(0,-1,0),f=-e.plane1.width/2+o*t,c=e.plane1.height/2+1,d=new l(f,c,0);d.applyEuler(L.rotation),g.applyEuler(L.rotation);const y=new J(g,new l(0,0,0),1,65280);y.position.copy(L.position).add(d),q.push(y),i.add(y)}const r=10,s=e.plane2.width/(r-1);for(let o=0;o<r;o++){const g=new l(0,-1,0),f=-e.plane2.width/2+o*s,c=e.plane2.height/2+1,d=new l(0,c,f);d.applyEuler(z.rotation),g.applyEuler(z.rotation);const y=new J(g,new l(0,0,0),1,16711680);y.position.copy(z.position).add(d),q.push(y),i.add(y)}}if(e.designTransformation.quaternion){b.position.set(0,0,0),b.rotation.set(0,0,0);const n=e.designTransformation.quaternion.clone(),t=e.designTransformation.point.clone();b.setRotationFromQuaternion(n);const r=t.applyQuaternion(n);b.position.set(-r.x,-r.y,-r.z)}if(e.sphereIntersection.point){S&&i.remove(S),G&&i.remove(G);const n=new K(.1,32,16),t=new $({color:"#ff0000"});S=new C(n,t);const r=e.sphereIntersection.point.clone(),s=e.sphereIntersection.normal.clone();S.position.set(r.x,r.y,0),G=new J(s,r,1,16776960),e.designTransformation.quaternion&&(S.position.set(0,0,0),G=new J(s.clone().applyQuaternion(e.designTransformation.quaternion),new l(0,0,0),1,16776960)),i.add(S),i.add(G)}if(e.oldDesignCenterData.point){k&&i.remove(k);const n=new K(.1,32,16),t=new $({color:"#00ff00"});k=new C(n,t);const r=e.oldDesignCenterData.point.clone();k.position.set(r.x,r.y,0),i.add(k)}if(e.curve1.calced){const n=new F(e.curve1.start,e.curve1.c1,e.curve1.c2,e.curve1.end);B=re(n),e.curve1.curveLength=n.getLength(),i.add(B)}if(e.curve2.calced){const n=new F(e.curve2.start,e.curve2.c1,e.curve2.c2,e.curve2.end);W=re(n),e.curve2.curveLength=n.getLength(),i.add(W)}e.curve1.calced&&e.curve2.calced&&le(),e.other.hideTextHelper===!1&&i.add(A),Z()}function ce(){let n;e.sphereIntersection.normalOriginal?n=e.sphereIntersection.normalOriginal.clone():(e.sphereIntersection.normalOriginal=e.sphereIntersection.normal.clone(),n=e.sphereIntersection.normal.clone());const t=new be;t.makeRotationZ(e.other.normalRotation),n.applyMatrix4(t),e.sphereIntersection.normal=n.clone(),u()}function le(){oe({THREE:_,curve:new F(e.curve2.start,e.curve2.c1,e.curve2.c2,e.curve2.end),orientation:new l(1,0,0),bufferGeometry:A.geometry,axis:"z",preserveDimensions:!1,scene:i}),oe({THREE:_,curve:new F(e.curve1.start,e.curve1.c1,e.curve1.c2,e.curve1.end),orientation:new l(0,0,1),bufferGeometry:A.geometry,axis:"x",preserveDimensions:!1,scene:i})}function de(){const t=[],r=[],o=e.plane1.width/9,g=e.plane2.width/(10-1);for(let d=0;d<10;d++){const y=new l(0,-1,0),E=-e.plane1.width/2+d*o,R=e.plane1.height/2+1,V=new l(E,R,0),D=new X;D.firstHitOnly=!0,D.set(V,y);const N=D.intersectObject(b,!0);t.push([N[0].point.x,N[0].point.y])}const f=te(t,10);e.curve1.start.x=f[0][0][0],e.curve1.start.y=f[0][0][1],e.curve1.start.z=0,e.curve1.c1.x=f[0][1][0],e.curve1.c1.y=f[0][1][1],e.curve1.c1.z=0,e.curve1.c2.x=f[0][2][0],e.curve1.c2.y=f[0][2][1],e.curve1.c2.z=0,e.curve1.end.x=f[0][3][0],e.curve1.end.y=f[0][3][1],e.curve1.end.z=0,e.curve1.calced=!0;for(let d=0;d<10;d++){const y=new l(0,-1,0),E=e.plane2.height/2+1,R=-e.plane2.width/2+d*g,V=new l(0,E,R),D=new X;D.firstHitOnly=!0,D.set(V,y);const N=D.intersectObject(b,!0);r.push([N[0].point.y,N[0].point.z])}const c=te(r,10);e.curve2.start.x=0,e.curve2.start.y=c[0][0][0],e.curve2.start.z=c[0][0][1],e.curve2.c1.x=0,e.curve2.c1.y=c[0][1][0],e.curve2.c1.z=c[0][1][1],e.curve2.c2.x=0,e.curve2.c2.y=c[0][2][0],e.curve2.c2.z=c[0][2][1],e.curve2.end.x=0,e.curve2.end.y=c[0][3][0],e.curve2.end.z=c[0][3][1],e.curve2.calced=!0,e.rays.thrown=!0,u()}function ue(){const n=e.sphereIntersection.normal.clone(),t=new l(0,1,0),r=new l().crossVectors(n,t).normalize(),s=Math.acos(n.dot(t)),o=new Te().setFromAxisAngle(r,s);e.designTransformation.quaternion=o.clone(),e.designTransformation.point=e.sphereIntersection.point.clone(),e.designTransformation.dataJSON={position:e.designTransformation.point.clone(),normal:e.sphereIntersection.normal.clone()}}const v=document.createElement("button");v.style.position="absolute",v.style.top="10px",v.style.left="10px",v.style.border=0,v.style.background="blueviolet",v.style.color="white",v.style.padding="7px 14px",v.style.cursor="pointer",v.innerHTML="UPLOAD GTLF",v.addEventListener("click",async()=>{document.getElementById("fileInput").click()}),document.body.append(v),document.getElementById("fileInput").addEventListener("change",async function(n){const t=n.target.files[0];t&&(b&&i.remove(b),ie=await P(t),b=new C(ie,T),b.material.side=we,i.add(b),v.style.background="green"),u()});const a=document.createElement("button");a.style.position="absolute",a.style.top="50px",a.style.left="10px",a.style.border=0,a.style.background="blueviolet",a.style.color="white",a.style.padding="7px 14px",a.style.cursor="pointer",a.innerHTML="SELECT POINT",a.addEventListener("click",n=>{e.other.selectingPoint===!0?(e.other.selectingPoint=!1,a.style.background="blueviolet",a.innerHTML="SELECT POINT",n.stopImmediatePropagation()):(a.style.background="orange",e.other.selectingPoint=!0,a.innerHTML="CLICK ON THE JEWEL",n.stopImmediatePropagation(),document.body.onclick=null,document.body.onclick=t=>{const r=new xe,s=new X;s.firstHitOnly=!0,r.x=t.clientX/window.innerWidth*2-1,r.y=-(t.clientY/window.innerHeight)*2+1,s.setFromCamera(r,I);const o=s.intersectObjects(i.children.filter(g=>g.type==="Mesh"&&g.geometry.type!=="BoxGeometry"&&g.geometry.type!=="SphereGeometry"),!0);o.length>0&&o[0].face?(e.sphereIntersection={point:o[0].point.clone(),normal:o[0].face.normal.clone()},e.sphereIntersection.point.z=0,e.sphereIntersection.normal.z=0,e.sphereIntersection.normal.normalize(),M.add(e.other,"normalRotation",-Math.PI,Math.PI,.1).onChange(ce),u(),document.body.onclick=null,a.style.background="green",a.innerHTML="DESIGN CENTER SELECTED",e.other.selectingPoint=!1):a.innerHTML="TARGET THE STL"})}),document.body.append(a);const h=document.createElement("button");h.style.position="absolute",h.style.top="90px",h.style.left="10px",h.style.border=0,h.style.background="blueviolet",h.style.color="white",h.style.padding="7px 14px",h.style.cursor="pointer",h.innerHTML="MOVE JEWEL",h.addEventListener("click",()=>{ue(),u(),h.innerHTML="JEWEL ALIGNED WITH DESIGN",h.style.background="green"}),document.body.append(h);const p=document.createElement("button");p.style.position="absolute",p.style.top="130px",p.style.left="10px",p.style.border=0,p.style.background="blueviolet",p.style.color="white",p.style.padding="7px 14px",p.style.cursor="pointer",p.innerHTML="THROW RAYCASTERS",p.addEventListener("click",()=>{e.curve1.calced===!1&&e.curve2.calced===!1?(de(),p.innerHTML="RESET",p.style.background="green"):(e.curve1.calced=!1,e.curve2.calced=!1,u(),p.innerHTML="THROW CASTERS",p.style.background="blueviolet")}),document.body.append(p);const w=document.createElement("button");w.style.position="absolute",w.style.top="170px",w.style.left="10px",w.style.border=0,w.style.background="blueviolet",w.style.color="white",w.style.padding="7px 14px",w.style.cursor="pointer",w.innerHTML="PRINT BEND DATA",w.addEventListener("click",()=>{const n=[{flexy:!0,axis:"z",transformation:{position:{x:e.designTransformation.dataJSON.position.x,y:e.designTransformation.dataJSON.position.y,z:0},normal:{x:e.designTransformation.dataJSON.normal.x,y:e.designTransformation.dataJSON.normal.y,z:0}},curveParts:[{startPoint:{x:e.curve2.start.x,y:e.curve2.start.y,z:e.curve2.start.z},controlPoint1:{x:e.curve2.c1.x,y:e.curve2.c1.y,z:e.curve2.c1.z},controlPoint2:{x:e.curve2.c2.x,y:e.curve2.c2.y,z:e.curve2.c2.z},endPoint:{x:e.curve2.end.x,y:e.curve2.end.y,z:e.curve2.end.z}}]},{flexy:!0,axis:"x",transformation:{position:{x:e.designTransformation.dataJSON.position.x,y:e.designTransformation.dataJSON.position.y,z:0},normal:{x:e.designTransformation.dataJSON.normal.x,y:e.designTransformation.dataJSON.normal.y,z:0}},curveParts:[{startPoint:{x:e.curve1.start.x,y:e.curve1.start.y,z:e.curve1.start.z},controlPoint1:{x:e.curve1.c1.x,y:e.curve1.c1.y,z:e.curve1.c1.z},controlPoint2:{x:e.curve1.c2.x,y:e.curve1.c2.y,z:e.curve1.c2.z},endPoint:{x:e.curve1.end.x,y:e.curve1.end.y,z:e.curve1.end.z}}]}],t=n.find(o=>o.axis==="x"),r=n.find(o=>o.axis==="z"),s=JSON.parse(JSON.stringify(n));for(let o=0;o<s.length;o++)s[o].axis==="x"&&(s[o].transformation.position.x=-t.transformation.position.x,s[o].transformation.normal.x=-t.transformation.normal.x),s[o].axis==="z"&&(s[o].transformation.position.x=-r.transformation.position.x,s[o].transformation.normal.x=-r.transformation.normal.x);console.log("BEND DATA FOR LEFT AREA"),console.log(JSON.stringify(s)),console.log("DIMENSION DATA FOR LEFT AREA"),console.log(JSON.stringify({boundingBox:{dimX:e.curve1.curveLength,dimZ:e.curve2.curveLength,type:"square"},inscribedShape:{}})),console.log("BEND DATA FOR RIGHT AREA"),console.log(JSON.stringify(n)),console.log("DIMENSION DATA FOR RIGHT AREA"),console.log(JSON.stringify({boundingBox:{dimX:e.curve1.curveLength,dimZ:e.curve2.curveLength,type:"square"},inscribedShape:{}})),w.innerHTML="COPIED!"}),document.body.append(w);const x=document.createElement("button");x.style.position="absolute",x.style.bottom="50px",x.style.left="10px",x.style.border=0,x.style.background="blueviolet",x.style.color="white",x.style.padding="7px 14px",x.style.cursor="pointer",x.innerHTML="LOAD DATA JSON",x.addEventListener("click",()=>{const n=JSON.parse(prompt("COPY & PASTE")),t=new l(n[0].transformation.position.x,n[0].transformation.position.y,n[0].transformation.position.z);e.oldDesignCenterData.point=t,u()}),document.body.append(x);const m=document.createElement("button");m.style.position="absolute",m.style.bottom="10px",m.style.left="10px",m.style.border=0,m.style.background="blueviolet",m.style.color="white",m.style.padding="7px 14px",m.style.cursor="pointer",m.innerHTML="MIRROR TO THE OTHER SIDE",m.addEventListener("click",()=>{if(e.oldDesignCenterData.point){const n=new l(-e.oldDesignCenterData.point.x,e.oldDesignCenterData.point.y,e.oldDesignCenterData.point.z);e.oldDesignCenterData.point=n.clone(),u()}else m.innerHTML="LOAD JSON DATA FIRST",m.style.background="red",setTimeout(()=>{m.innerHTML="MIRROR TO THE OTHER SIDE",m.style.background="blueviolet"},1500)}),document.body.append(m)})();