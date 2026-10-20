import * as THREE from 'three';

export function createWheelScene(){
  const host=document.querySelector('#wheel-scene');
  if(!host||matchMedia('(max-width: 780px)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.setSize(host.clientWidth,host.clientHeight,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);
  host.classList.add('has-webgl');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,host.clientWidth/host.clientHeight,.1,30);
  camera.position.set(0,0,5.4);
  const wheel=new THREE.Group();scene.add(wheel);
  const alloy=new THREE.MeshStandardMaterial({color:0xa9adb0,metalness:.9,roughness:.24});
  const darkAlloy=new THREE.MeshStandardMaterial({color:0x252a2d,metalness:.72,roughness:.31});
  const edgeMat=new THREE.MeshStandardMaterial({color:0xe4e3df,metalness:.93,roughness:.18});
  const rubber=new THREE.MeshStandardMaterial({color:0x17191a,metalness:.12,roughness:.78});
  const tire=new THREE.Mesh(new THREE.TorusGeometry(1.16,.16,16,80),rubber);wheel.add(tire);
  const rimEdge=new THREE.Mesh(new THREE.TorusGeometry(.94,.055,10,72),edgeMat);wheel.add(rimEdge);
  const innerEdge=new THREE.Mesh(new THREE.TorusGeometry(.74,.025,8,64),alloy);wheel.add(innerEdge);
  const hubDisc=new THREE.Mesh(new THREE.CylinderGeometry(.66,.66,.11,64),darkAlloy);hubDisc.rotation.x=Math.PI/2;hubDisc.position.z=-.02;wheel.add(hubDisc);
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.07,48),new THREE.MeshStandardMaterial({color:0x7f8586,metalness:.82,roughness:.43}));disc.rotation.x=Math.PI/2;disc.position.z=-.09;wheel.add(disc);
  const spokeGeometry=new THREE.BoxGeometry(.115,.77,.09);
  for(let i=0;i<10;i++){
    const angle=(i/10)*Math.PI*2;
    const spoke=new THREE.Mesh(spokeGeometry,i%2?alloy:edgeMat);
    spoke.position.set(Math.sin(angle)*.48,Math.cos(angle)*.48,.07);
    spoke.rotation.z=-angle;
    wheel.add(spoke);
  }
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.16,48),edgeMat);hub.rotation.x=Math.PI/2;hub.position.z=.1;wheel.add(hub);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.17,40),darkAlloy);cap.rotation.x=Math.PI/2;cap.position.z=.19;wheel.add(cap);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.025,12),edgeMat);bolt.rotation.x=Math.PI/2;bolt.position.set(Math.cos(a)*.16,Math.sin(a)*.16,.21);wheel.add(bolt);}
  const ambient=new THREE.HemisphereLight(0xdde5ea,0x1b1c1b,2.2);scene.add(ambient);
  const key=new THREE.DirectionalLight(0xffffff,3.3);key.position.set(-3,4,5);scene.add(key);
  const rimLight=new THREE.DirectionalLight(0xdde3e5,2.5);rimLight.position.set(3,-2,3);scene.add(rimLight);
  let targetX=-.08,targetY=.13,visible=false,frame=0,last=0;
  const pointer=e=>{const r=host.getBoundingClientRect();targetY=((e.clientX-r.left)/r.width-.5)*.3;targetX=-((e.clientY-r.top)/r.height-.5)*.25;};
  host.addEventListener('pointermove',pointer,{passive:true});
  const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(host);
  function draw(now){if(!visible)return;if(document.hidden){frame=requestAnimationFrame(draw);return;}if(now-last<40){frame=requestAnimationFrame(draw);return;}last=now;wheel.rotation.x+=(targetX-wheel.rotation.x)*.035;wheel.rotation.y+=(targetY-wheel.rotation.y)*.035;wheel.rotation.z+=.0012;renderer.render(scene,camera);frame=requestAnimationFrame(draw);}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!frame)frame=requestAnimationFrame(draw);if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}});observer.observe(host);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&visible&&!frame)frame=requestAnimationFrame(draw);});
  window.addEventListener('beforeunload',()=>{observer.disconnect();resize.disconnect();host.removeEventListener('pointermove',pointer);renderer.dispose();});
}
