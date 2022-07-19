import * as THREE from "https://cdn.skypack.dev/three@0.134.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls.js";

let container, renderer, scene, camera, controls;

function init() {
  container = document.getElementById("threeContainer");
  renderer = new THREE.WebGLRenderer();
  container.appendChild(renderer.domElement);
  renderer.setSize(container.clientWidth, container.clientHeight);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / container.clientHeight,
    1,
    100000
  );
  camera.position.set(2300, 2100, 1600);
  controls = new OrbitControls(camera, renderer.domElement);
  scene.add(new THREE.AmbientLight(0x222222));
  let light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(3000, 2000, 1000);
  scene.add(light);
  scene.add(new THREE.AxesHelper(20));
  window.addEventListener("resize", onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

init();
animate();

// --------------------------------------

let R = 0.89;
let G = 0.12;
let B = 0.17;
let size = 4000;
let particleCount = 80000;

let particles = new THREE.BufferGeometry();
let pMaterial = new THREE.PointsMaterial({ size: 3, vertexColors: true });
let vertices = [];
let colors = [];

for (let p = 0; p < particleCount; p++) {
  let pRat = p / particleCount;

  let r = pRat * size;

  let phi = Math.random() * Math.PI,
    theta = Math.random() * Math.PI;
  let pX = r * Math.sin(phi) * Math.cos(theta),
    pZ = r * Math.cos(phi),
    pY = r * Math.sin(phi) * Math.sin(theta);

  vertices.push(pX, pY, pZ);
  colors.push(R, G, B);
}

let v = Float32Array.from(vertices);
particles.setAttribute("position", new THREE.BufferAttribute(v, 3));
let c = Float32Array.from(colors);
particles.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));

let particleSystem = new THREE.Points(particles, pMaterial);

scene.add(particleSystem);
