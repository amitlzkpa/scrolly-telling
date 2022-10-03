import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";

function getCol(pRat) {
  return new THREE.Color(0.7 - pRat, 0.2 - pRat, 0.6);
}
function getPointInBetweenByT(a, b, t = 0.5) {
  let pp = new THREE.Vector3(Math.abs(b.x - a.x) * t, Math.abs(b.y - a.y) * t, Math.abs(b.z - a.z) * t);
  return pp;
}

/**
  Constructor used to create an instance of the ScrollYBox visualization.
  @return {ScrollYBox} An instance of the ScrollYBox.
  @example
    let ScrollYBox = await janim.addViz({
      name: "ScrollYBox",
      sharedState: {},
    });

 */
export default class ScrollYBox {
  // --------------------------------------

  ptA = new THREE.Vector3(0, -300, 0);
  ptB = new THREE.Vector3(0, 300, 0);
  box;

  // --------------------------------------

  vizObj = null;
  scene = null;

  // --------------------------------------

  init = async function (scene) {
    this.scene = scene;
    this.vizObj = new THREE.Object3D();
    this.box = new THREE.Mesh(
      new THREE.BoxGeometry(40, 40, 40),
      new THREE.MeshPhongMaterial({ color: 0x0d00fd })
    );
    this.vizObj.add(this.box);
    return this.vizObj;
  };

  // --------------------------------------

  update = async function (scObj) {};

  // --------------------------------------


  updateDataState = async function(stateChangeOpts) {
    let yPosNormalized = stateChangeOpts.newState.yPosNormalized;
    let p = getPointInBetweenByT(this.ptA, this.ptB, yPosNormalized);
    this.box.position.set(p.x, p.y, p.z);
    let c = getCol(yPosNormalized);
    this.box.material.color = c;
  }
}
