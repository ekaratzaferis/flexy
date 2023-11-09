import{S as A,P as G,W as B,A as D,D as O,O as U,M as S,V as h,e as k,c as M,C as V,d as N}from"./OrbitControls-83b65b2c.js";import{S as j}from"./STLLoader-3528af60.js";const o=new A,u=new G(75,window.innerWidth/window.innerHeight,.1,1e3);u.position.set(20,15,20);const t=new B({antialias:!0,alpha:!0});t.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(t.domElement);const q=new D(4210752);o.add(q);const T=new O(16777215,.5);T.position.set(1,1,1);o.add(T);const J=new U(u,t.domElement);function H(){requestAnimationFrame(H),J.update(),t.render(o,u)}window.addEventListener("resize",function(){const a=window.innerWidth,c=window.innerHeight;t.setSize(a,c),u.aspect=a/c,u.updateProjectionMatrix()});t.setClearColor(74565);t.setPixelRatio(window.devicePixelRatio);t.setSize(window.innerWidth,window.innerHeight);function K(a){const y=a.getPoints(1e3),e=new V(y),i=new N(e,1e3,.1,8,!1),d=new S({wireframe:!0});return new M(i,d)}H();let b,x,z,L,v,E,f,F;(async function(){const a=new S({wireframe:!1}),c=new j,y=function(p){return new Promise((g,R)=>{const C=new FileReader;C.onload=function(P){const W=P.target.result,I=c.parse(W);g(I)},C.onerror=function(P){R(P)},C.readAsBinaryString(p)})},e={start:{x:0,y:5,z:0},end:{x:5,y:0,z:5},c1:{x:5*.55,y:5,z:0},c2:{x:5,y:5*.45,z:0}};n();const i=new dat.GUI,d=i.addFolder("Start Point");d.open(),d.add(e.start,"x",-20,20).onChange(n),d.add(e.start,"y",-20,20).onChange(n),d.add(e.start,"z",-20,20).onChange(n);const l=i.addFolder("Control Point 1");l.open(),l.add(e.c1,"x",-20,20).onChange(n),l.add(e.c1,"y",-20,20).onChange(n),l.add(e.c1,"z",-20,20).onChange(n);const w=i.addFolder("Control Point 2");w.open(),w.add(e.c2,"x",-20,20).onChange(n),w.add(e.c2,"y",-20,20).onChange(n),w.add(e.c2,"z",-20,20).onChange(n);const m=i.addFolder("End Point");m.open(),m.add(e.end,"x",-20,20).onChange(n),m.add(e.end,"y",-20,20).onChange(n),m.add(e.end,"z",-20,20).onChange(n);function n(){z=new h(e.start.x,e.start.y,e.start.z),L=new h(e.c1.x,e.c1.y,e.c1.z),v=new h(e.c2.x,e.c2.y,e.c2.z),E=new h(e.end.x,e.end.y,e.end.z),o.remove(b),x=new k(z,L,v,E),b=K(x),o.add(b)}const r=document.createElement("button");r.style.position="absolute",r.style.top=0,r.style.left=0,r.innerHTML="UPLOAD STL",r.addEventListener("click",async()=>{document.getElementById("fileInput").click()}),document.body.append(r);const s=document.createElement("button");s.style.position="absolute",s.style.bottom=0,s.style.left=0,s.innerHTML="PRINT CURVE",s.addEventListener("click",()=>console.log(x)),document.body.append(s),document.getElementById("fileInput").addEventListener("change",async function(p){const g=p.target.files[0];g&&(f&&o.remove(f),F=await y(g),f=new M(F,a),o.add(f))})})();