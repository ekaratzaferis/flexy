import{L as $,F as ee,g as O,h as V,V as R,i as k,j as te,S as ne,P as oe,W as re,A as ae,D as se,O as ie,M as Y,e as ce,c as Z,C as le,d as de}from"./OrbitControls-83b65b2c.js";class ue extends ${constructor(d){super(d)}load(d,L,n,f){const g=this,u=new ee(this.manager);u.setPath(this.path),u.setResponseType("arraybuffer"),u.setRequestHeader(this.requestHeader),u.setWithCredentials(this.withCredentials),u.load(d,function(C){try{L(g.parse(C))}catch(h){f?f(h):console.error(h),g.manager.itemError(d)}},n,f)}parse(d){function L(t){const e=new DataView(t),o=32/8*3+32/8*3*3+16/8,r=e.getUint32(80,!0);if(80+32/8+r*o===e.byteLength)return!0;const c=[115,111,108,105,100];for(let l=0;l<5;l++)if(n(c,e,l))return!1;return!0}function n(t,e,o){for(let r=0,s=t.length;r<s;r++)if(t[r]!==e.getUint8(o+r))return!1;return!0}function f(t){const e=new DataView(t),o=e.getUint32(80,!0);let r,s,c,l=!1,w,z,A,p,i;for(let a=0;a<80-10;a++)e.getUint32(a,!1)==1129270351&&e.getUint8(a+4)==82&&e.getUint8(a+5)==61&&(l=!0,w=new Float32Array(o*3*3),z=e.getUint8(a+6)/255,A=e.getUint8(a+7)/255,p=e.getUint8(a+8)/255,i=e.getUint8(a+9)/255);const B=84,U=12*4+2,m=new O,v=new Float32Array(o*3*3),E=new Float32Array(o*3*3);for(let a=0;a<o;a++){const F=B+a*U,H=e.getFloat32(F,!0),M=e.getFloat32(F+4,!0),Q=e.getFloat32(F+8,!0);if(l){const y=e.getUint16(F+48,!0);y&32768?(r=z,s=A,c=p):(r=(y&31)/31,s=(y>>5&31)/31,c=(y>>10&31)/31)}for(let y=1;y<=3;y++){const I=F+y*12,x=a*3*3+(y-1)*3;v[x]=e.getFloat32(I,!0),v[x+1]=e.getFloat32(I+4,!0),v[x+2]=e.getFloat32(I+8,!0),E[x]=H,E[x+1]=M,E[x+2]=Q,l&&(w[x]=r,w[x+1]=s,w[x+2]=c)}}return m.setAttribute("position",new V(v,3)),m.setAttribute("normal",new V(E,3)),l&&(m.setAttribute("color",new V(w,3)),m.hasColors=!0,m.alpha=i),m}function g(t){const e=new O,o=/solid([\s\S]*?)endsolid/g,r=/facet([\s\S]*?)endfacet/g;let s=0;const c=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,l=new RegExp("vertex"+c+c+c,"g"),w=new RegExp("normal"+c+c+c,"g"),z=[],A=[],p=new R;let i,B=0,U=0,m=0;for(;(i=o.exec(t))!==null;){U=m;const v=i[0];for(;(i=r.exec(v))!==null;){let F=0,H=0;const M=i[0];for(;(i=w.exec(M))!==null;)p.x=parseFloat(i[1]),p.y=parseFloat(i[2]),p.z=parseFloat(i[3]),H++;for(;(i=l.exec(M))!==null;)z.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3])),A.push(p.x,p.y,p.z),F++,m++;H!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+s),F!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+s),s++}const E=U,a=m-U;e.addGroup(E,a,B),B++}return e.setAttribute("position",new k(z,3)),e.setAttribute("normal",new k(A,3)),e}function u(t){return typeof t!="string"?te.decodeText(new Uint8Array(t)):t}function C(t){if(typeof t=="string"){const e=new Uint8Array(t.length);for(let o=0;o<t.length;o++)e[o]=t.charCodeAt(o)&255;return e.buffer||e}else return t}const h=C(d);return L(h)?f(h):g(u(d))}}const S=new ne,T=new oe(75,window.innerWidth/window.innerHeight,.1,1e3);T.position.set(20,15,20);const b=new re({antialias:!0,alpha:!0});b.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(b.domElement);const fe=new ae(4210752);S.add(fe);const J=new se(16777215,.5);J.position.set(1,1,1);S.add(J);const ge=new ie(T,b.domElement);function K(){requestAnimationFrame(K),ge.update(),b.render(S,T)}window.addEventListener("resize",function(){const P=window.innerWidth,d=window.innerHeight;b.setSize(P,d),T.aspect=P/d,T.updateProjectionMatrix()});b.setClearColor(74565);b.setPixelRatio(window.devicePixelRatio);b.setSize(window.innerWidth,window.innerHeight);function we(P){const L=P.getPoints(1e3),n=new le(L),f=new de(n,1e3,.1,8,!1),g=new Y({wireframe:!0});return new Z(f,g)}K();let G,W,N,_,j,q,D,X;(async function(){const P=new Y({wireframe:!1}),d=new ue,L=function(r){return new Promise((s,c)=>{const l=new FileReader;l.onload=function(w){const z=w.target.result,A=d.parse(z);s(A)},l.onerror=function(w){c(w)},l.readAsBinaryString(r)})},n={start:{x:0,y:5,z:0},end:{x:5,y:0,z:5},c1:{x:5*.55,y:5,z:0},c2:{x:5,y:5*.45,z:0}};t();const f=new dat.GUI,g=f.addFolder("Start Point");g.open(),g.add(n.start,"x",-20,20).onChange(t),g.add(n.start,"y",-20,20).onChange(t),g.add(n.start,"z",-20,20).onChange(t);const u=f.addFolder("Control Point 1");u.open(),u.add(n.c1,"x",-20,20).onChange(t),u.add(n.c1,"y",-20,20).onChange(t),u.add(n.c1,"z",-20,20).onChange(t);const C=f.addFolder("Control Point 2");C.open(),C.add(n.c2,"x",-20,20).onChange(t),C.add(n.c2,"y",-20,20).onChange(t),C.add(n.c2,"z",-20,20).onChange(t);const h=f.addFolder("End Point");h.open(),h.add(n.end,"x",-20,20).onChange(t),h.add(n.end,"y",-20,20).onChange(t),h.add(n.end,"z",-20,20).onChange(t);function t(){N=new R(n.start.x,n.start.y,n.start.z),_=new R(n.c1.x,n.c1.y,n.c1.z),j=new R(n.c2.x,n.c2.y,n.c2.z),q=new R(n.end.x,n.end.y,n.end.z),S.remove(G),W=new ce(N,_,j,q),G=we(W),S.add(G)}const e=document.createElement("button");e.style.position="absolute",e.style.top=0,e.style.left=0,e.innerHTML="UPLOAD STL",e.addEventListener("click",async()=>{document.getElementById("fileInput").click()}),document.body.append(e);const o=document.createElement("button");o.style.position="absolute",o.style.bottom=0,o.style.left=0,o.innerHTML="PRINT CURVE",o.addEventListener("click",()=>console.log(W)),document.body.append(o),document.getElementById("fileInput").addEventListener("change",async function(r){const s=r.target.files[0];s&&(D&&S.remove(D),X=await L(s),D=new Z(X,P),S.add(D))})})();
