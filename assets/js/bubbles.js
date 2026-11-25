// HASAD — Chrome & Bubblegum 3D layer.
// Live morphing glossy "bubblegum" blobs and liquid-chrome shapes rendered with three.js.
import * as THREE from 'three';

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// Turns a sphere into a slowly melting liquid blob. Normals are rebuilt from the displaced surface,
// so reflections stay physically correct while the shape morphs.
function makeMorphing(material, { amp = 0.14, freq = 1.2, speed = 1, seed = 0 } = {}) {
  const uniforms = {
    uTime: { value: 0 },
    uAmp: { value: amp },
    uFreq: { value: freq },
    uSeed: { value: seed },
  };
  material.userData.uniforms = uniforms;
  material.userData.speed = speed;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uTime; uniform float uAmp; uniform float uFreq; uniform float uSeed;
        ${NOISE}
        vec3 dispP(vec3 p){
          vec3 n = normalize(p);
          float t = uTime;
          float d = snoise(n*uFreq + vec3(t*0.21+uSeed, t*0.17, -t*0.13));
          d += 0.16*snoise(n*uFreq*2.1 + vec3(-t*0.19, t*0.15+uSeed, t*0.11));
          return p + n * d * uAmp;
        }`
      )
      .replace(
        '#include <beginnormal_vertex>',
        `vec3 _n = normalize(position);
        vec3 _t = normalize(abs(_n.y) > 0.98 ? cross(_n, vec3(1.0,0.0,0.0)) : cross(_n, vec3(0.0,1.0,0.0)));
        vec3 _b = normalize(cross(_n, _t));
        float _r = length(position);
        vec3 _pd = dispP(position);
        vec3 _p1 = dispP(normalize(position + _t*0.012) * _r);
        vec3 _p2 = dispP(normalize(position + _b*0.012) * _r);
        vec3 objectNormal = normalize(cross(_p1 - _pd, _p2 - _pd));
        #ifdef USE_TANGENT
        vec3 objectTangent = vec3( tangent.xyz );
        #endif`
      )
      .replace(
        '#include <begin_vertex>',
        `vec3 transformed = _pd;
        #ifdef USE_ALPHAHASH
        vPosition = vec3( position );
        #endif`
      );
  };
  material.customProgramCacheKey = () => 'hasad-morph';
  return material;
}

function materials() {
  return {
    pink: () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xff2a8a,
        roughness: 0.18,
        metalness: 0.0,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        sheen: 0.35,
        sheenRoughness: 0.3,
        sheenColor: new THREE.Color(0xff9fcd),
        emissive: new THREE.Color(0x3a0016),
        envMapIntensity: 1.0,
      }),
    chrome: () =>
      new THREE.MeshStandardMaterial({
        color: 0xf6f6f9,
        metalness: 1,
        roughness: 0.03,
        envMapIntensity: 1.35,
      }),
    pinkChrome: () =>
      new THREE.MeshStandardMaterial({
        color: 0xff9fca,
        metalness: 1,
        roughness: 0.05,
        envMapIntensity: 1.3,
      }),
  };
}

// Dark studio with a bright "sky", hard horizon, white strip lights and bubblegum panels:
// the classic liquid-chrome look (black + white reflections with pink accents).
function makeEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(30, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vDir; void main(){
        float y = vDir.y;
        vec3 sky = mix(vec3(0.04,0.04,0.05), vec3(0.34,0.34,0.37), smoothstep(0.02, 0.95, y));
        vec3 ground = vec3(0.006,0.005,0.007);
        vec3 c = mix(ground, sky, smoothstep(-0.015, 0.03, y));
        c += vec3(0.9,0.25,0.55) * 0.35 * exp(-pow((y+0.06)*16.0, 2.0));
        gl_FragColor = vec4(c, 1.0);
      }`,
    })
  );
  env.add(dome);
  const strip = (hex, k, pos, scale) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k) })
    );
    m.position.set(...pos);
    m.scale.set(...scale);
    env.add(m);
  };
  strip(0xffffff, 9, [0, 12, 3], [16, 0.5, 2.4]);
  strip(0xffffff, 6, [-13, 3, 4], [0.5, 12, 1.6]);
  strip(0xffffff, 4, [13, 4, -3], [0.5, 8, 1.2]);
  strip(0xffffff, 3, [3, 5, -14], [6, 4, 0.5]);
  strip(0xffffff, 7, [-5, 10, -6], [0.6, 0.5, 14]);
  strip(0xffffff, 5, [6, 9, 6], [10, 0.5, 0.7]);
  strip(0xffffff, 3.5, [0, 3.2, 14], [12, 1.2, 0.5]);
  strip(0xff2f8f, 7, [11, -3, 8], [0.5, 6, 7]);
  strip(0xff6fb1, 4, [-10, -4, -8], [7, 0.5, 5]);
  const tex = pmrem.fromScene(env, 0.02).texture;
  pmrem.dispose();
  return tex;
}

const PRESETS = {
  // nx/ny are positions in viewport-relative units (-1..1 of the visible half-extent at z=0)
  hero: {
    desktop: [
      { kind: 'blob', mat: 'pink', r: 1.25, nx: 0.8, ny: -0.66, amp: 0.17, freq: 0.62, seed: 1.3, depth: 1.2 },
      { kind: 'blob', mat: 'chrome', r: 0.66, nx: -0.82, ny: 0.58, amp: 0.13, freq: 0.75, seed: 4.1, depth: 0.8 },
      { kind: 'torus', mat: 'chrome', r: 0.5, nx: 0.84, ny: 0.66, depth: 0.6 },
      { kind: 'blob', mat: 'pink', r: 0.26, nx: 0.5, ny: -0.88, amp: 0.05, freq: 0.9, seed: 7.7, depth: 1.6 },
      { kind: 'blob', mat: 'pink', r: 0.16, nx: -0.6, ny: -0.74, amp: 0.035, freq: 0.9, seed: 2.2, depth: 1.8 },
      { kind: 'blob', mat: 'pinkChrome', r: 0.2, nx: -0.36, ny: 0.86, amp: 0.04, freq: 0.9, seed: 5.5, depth: 1.4 },
    ],
    mobile: [
      { kind: 'blob', mat: 'pink', r: 0.82, nx: 0.62, ny: -0.82, amp: 0.13, freq: 0.62, seed: 1.3, depth: 1.2 },
      { kind: 'blob', mat: 'chrome', r: 0.42, nx: -0.86, ny: 0.5, amp: 0.1, freq: 0.75, seed: 4.1, depth: 0.8 },
      { kind: 'torus', mat: 'chrome', r: 0.27, nx: 0.86, ny: -0.3, depth: 0.6 },
      { kind: 'blob', mat: 'pink', r: 0.17, nx: -0.6, ny: -0.84, amp: 0.035, freq: 0.9, seed: 7.7, depth: 1.6 },
      { kind: 'blob', mat: 'pinkChrome', r: 0.13, nx: 0.82, ny: 0.5, amp: 0.03, freq: 0.9, seed: 5.5, depth: 1.4 },
    ],
  },
  contact: {
    desktop: [
      { kind: 'blob', mat: 'pink', r: 1.25, nx: 0.12, ny: 0.0, amp: 0.17, freq: 0.62, seed: 3.3, depth: 1 },
      { kind: 'torus', mat: 'chrome', r: 0.62, nx: -0.45, ny: 0.5, depth: 0.7 },
      { kind: 'blob', mat: 'chrome', r: 0.34, nx: 0.62, ny: -0.55, amp: 0.08, freq: 0.8, seed: 6.1, depth: 1.3 },
      { kind: 'blob', mat: 'pink', r: 0.18, nx: -0.55, ny: -0.6, amp: 0.035, freq: 0.9, seed: 8.1, depth: 1.6 },
    ],
  },
  // single objects used for pre-rendered stills
  'still-pink': { desktop: [{ kind: 'blob', mat: 'pink', r: 1.55, nx: 0, ny: 0, amp: 0.2, freq: 0.62, seed: 2.6 }] },
  'still-chrome': { desktop: [{ kind: 'blob', mat: 'chrome', r: 1.55, nx: 0, ny: 0, amp: 0.2, freq: 0.66, seed: 9.4 }] },
  'still-torus': { desktop: [{ kind: 'torus', mat: 'chrome', r: 1.45, nx: 0, ny: 0 }] },
  'still-pinkchrome': { desktop: [{ kind: 'blob', mat: 'pinkChrome', r: 1.5, nx: 0, ny: 0, amp: 0.22, freq: 0.64, seed: 5.2 }] },
  'still-drops': {
    desktop: [
      { kind: 'blob', mat: 'pink', r: 0.95, nx: -0.2, ny: 0.18, amp: 0.12, freq: 0.66, seed: 3.1 },
      { kind: 'blob', mat: 'pink', r: 0.42, nx: 0.55, ny: -0.45, amp: 0.05, freq: 0.85, seed: 6.4 },
      { kind: 'blob', mat: 'pink', r: 0.22, nx: 0.62, ny: 0.5, amp: 0.03, freq: 0.9, seed: 1.9 },
    ],
  },
};

export function mountBubbles(canvas, opts = {}) {
  const {
    preset = 'hero',
    interactive = true,
    maxDpr = 1.75,
    preserve = false,
    time = null, // fixed time for stills
    reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  } = opts;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: preserve,
    });
  } catch (e) {
    canvas.remove();
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.environment = makeEnvironment(renderer);
  scene.add(new THREE.HemisphereLight(0xffe3f0, 0x1a0010, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff69b4, 1.1);
  rim.position.set(4, -2, -3);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  const mats = materials();
  const blobGeo = new THREE.SphereGeometry(1, 160, 120);
  const smallGeo = new THREE.SphereGeometry(1, 72, 54);
  const torusGeo = new THREE.TorusGeometry(1, 0.38, 64, 160);

  const root = new THREE.Group();
  scene.add(root);

  let items = [];
  let layoutKey = '';
  const conf = PRESETS[preset] || PRESETS.hero;

  function build(list) {
    items.forEach((it) => {
      root.remove(it.mesh);
      it.mesh.material.dispose();
    });
    items = list.map((d, i) => {
      let mesh;
      if (d.kind === 'torus') {
        mesh = new THREE.Mesh(torusGeo, mats[d.mat]());
        mesh.rotation.set(0.6, 0.4, 0.2);
      } else {
        const mat = makeMorphing(mats[d.mat](), { amp: d.amp, freq: d.freq, seed: d.seed });
        mesh = new THREE.Mesh(d.r > 0.4 ? blobGeo : smallGeo, mat);
      }
      mesh.scale.setScalar(0.0001);
      root.add(mesh);
      return { d, mesh, phase: i * 1.7 + (d.seed || 0), born: performance.now() + i * 140 };
    });
  }

  let viewW = 1;
  let viewH = 1;
  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    viewW = viewH * camera.aspect;
    const mobile = camera.aspect < 0.85 && conf.mobile;
    const k = mobile ? 'mobile' : 'desktop';
    if (k !== layoutKey) {
      layoutKey = k;
      build(conf[k]);
    }
    if (!visible || reduced) render(lastT);
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (interactive) {
    window.addEventListener(
      'pointermove',
      (e) => {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true }
    );
  }

  const easeOutBack = (x) => {
    const c1 = 1.5;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };

  let lastT = 0;
  function render(now) {
    lastT = now;
    const t = time != null ? time : now / 1000;
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    const scaleK = Math.min(1, viewW / 9);
    for (const it of items) {
      const { d, mesh } = it;
      const grow = time != null || reduced ? 1 : Math.min(1, Math.max(0, (now - it.born) / 1300));
      const s = d.r * (preset === 'hero' ? Math.max(0.7, scaleK) : 1) * easeOutBack(grow);
      mesh.scale.setScalar(Math.max(0.0001, s));
      const depth = d.depth || 1;
      const floatY = Math.sin(t * 0.55 + it.phase) * 0.12 * depth;
      const floatX = Math.cos(t * 0.4 + it.phase) * 0.06 * depth;
      mesh.position.set(
        (d.nx * viewW) / 2 + floatX + pointer.x * 0.28 * depth,
        (d.ny * viewH) / 2 + floatY + pointer.y * 0.2 * depth,
        0
      );
      if (d.kind === 'torus') {
        mesh.rotation.x = 0.55 + Math.sin(t * 0.3) * 0.3 + pointer.y * 0.3;
        mesh.rotation.y = Math.sin(t * 0.25) * 0.9 + pointer.x * 0.4;
        mesh.rotation.z = t * 0.12;
      } else {
        mesh.rotation.y = t * 0.08 + it.phase;
        const u = mesh.material.userData.uniforms;
        if (u) u.uTime.value = t * (mesh.material.userData.speed || 1) + it.phase;
      }
    }
    renderer.render(scene, camera);
  }

  let visible = true;
  let raf = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    render(now);
  }
  function start() {
    if (raf || reduced || time != null) return;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      visible && !document.hidden ? start() : stop();
    },
    { rootMargin: '80px' }
  );
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : visible && start()));
  new ResizeObserver(resize).observe(canvas);
  resize();
  if (reduced || time != null) {
    items.forEach((it) => (it.born = -1e9));
    render(performance.now());
  } else start();

  return { renderer, render, stop, start };
}
