import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";

/**
  Constructor used to create an instance of the Cube visualization.
  @return {Cube} An instance of the Cube visualization.
  @example
    let bars = await janim.addViz({
      name: "Cube",
      sharedState: {},
    });
    
 */
export default class Cube {
  constructor() {
    this.size = 120;

    this.vizObj = null;
    this._scene = null;
  }

  async init(scene) {
    this._scene = scene;
    this.vizObj = new THREE.Object3D();

    let cube = new THREE.Mesh(
      new THREE.BoxGeometry(this.size, this.size, this.size),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    this.vizObj.add(cube);
    this.vizObj.position.set(0, this.size / 2, 0);

    return this.vizObj;
  }

  async update(scObj) {}

  async updateDataState(opts) {
    this.vizObj.position.set(0, (this.size / 2) + (this.size * opts.newVal), 0);
  }
}
