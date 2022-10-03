import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";

function getCol(pRat) {
  return new THREE.Color(1.7 - pRat, 1.2 - pRat, 0);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getPointInBetweenByT(a, b, t = 0.5) {
  let pp = new THREE.Vector3((a.x + b.x) * t, (a.y + b.y) * t, (a.z + b.z) * t);
  return pp;
}

/**
  Constructor used to create an instance of the Particles visualization.
  @return {Particles} An instance of the Particles.
  @example
    let particles = await janim.addViz({
      name: "Particles",
      sharedState: {},
    });

 */
export default class Particles {
  // --------------------------------------
  shape = [
    new THREE.Vector3(-300, 0, -300),
    new THREE.Vector3(300, 0, -300),
    new THREE.Vector3(300, 0, 300),
    new THREE.Vector3(-300, 0, 300),
    new THREE.Vector3(-300, 600, -300),
    new THREE.Vector3(300, 600, -300),
    new THREE.Vector3(300, 600, 300),
    new THREE.Vector3(-300, 600, 300),
  ];
  t = 0.42;

  size = 600;
  focus = new THREE.Vector3(0, 400, 0);

  particleCount = 10000;
  jump = this.size / 20;

  particles = null;
  originalPos = [];
  outwardVecs = [];
  prev = new THREE.Vector3();

  // --------------------------------------

  vizObj = null;
  scene = null;

  // --------------------------------------

  init = async function (scene) {
    this.scene = scene;
    this.vizObj = new THREE.Object3D();

    this.particles = new THREE.Geometry();
    let pMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: THREE.VertexColors,
    });

    for (let p = 0; p < this.particleCount; p++) {
      let i = getRandomInt(this.shape.length);
      let pP = this.prev.clone();
      let rP = this.shape[i].clone();
      let np = getPointInBetweenByT(pP, rP, this.t);
      let particle = new THREE.Vector3(np.x, np.y, np.z);
      this.prev = np;

      let pRat = particle.distanceTo(this.focus) / this.size;

      this.particles.vertices.push(particle);
      let col = getCol(pRat);
      this.particles.colors.push(col);

      this.originalPos.push(particle.clone());
      this.outwardVecs.push(
        particle
          .clone()
          .normalize()
          .multiplyScalar(this.jump * Math.random())
      );
    }

    let particleSystem = new THREE.Points(this.particles, pMaterial);

    this.vizObj.add(particleSystem);

    return this.vizObj;
  };

  // --------------------------------------

  update = async function (scObj) {};

  // --------------------------------------
}
