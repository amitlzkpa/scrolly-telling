import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";

/**
  Constructor used to create an instance of the Bars visualization.
  @return {Particles} An instance of the Bars visualization.
  @example
    let bars = await janim.addViz({
      name: "Bars",
      sharedState: {},
    });
    
 */
export default class Bars {
  constructor() {
    this.spacing = 10;
    this.offset = 5;
    this.barCount = 30;
    this.height = 100;

    this.vizObj = null;
    this._scene = null;
  }

  async init(scene) {

    // if (this.vizObj) {
    //   this._scene.remove(this.vizObj);
    // }

    this._scene = scene;
    this.vizObj = new THREE.Object3D();

    for (let i = 0; i < this.barCount; i++) {
      for (let j = 0; j < this.barCount; j++) {
        let x = Math.sin((i / this.barCount) * Math.PI);
        let y = Math.sin((j / this.barCount) * Math.PI);
        let z = Math.min(x, y);
        let h = z * this.height;

        let cylinder = new THREE.Mesh(
          new THREE.CylinderGeometry(3, 3, h, 32),
          new THREE.MeshPhongMaterial({ color: 0x0d00fd })
        );
        cylinder.position.set(
          j * this.spacing + this.offset,
          h / 2,
          i * this.spacing + this.offset
        );
        this.vizObj.add(cylinder);
      }
    }

    return this.vizObj;
  }

  async update(scObj) {
    console.log(scObj);
  }

  async updateDataState(opts) {
    console.log("updateDataState");
    console.log(opts);

    await this.update(this.vizObj);
    
    // let newBarsTotal = Math.sqrt(opts.data.length);
    // console.log("newBarsTotal", newBarsTotal);
    // let newBarCount = opts.data.length;
    // console.log("newBarCount", newBarCount);

    // this.vizObj.position.set(0, (this.size / 2) + (this.size * opts.newVal), 0);
  }
}
