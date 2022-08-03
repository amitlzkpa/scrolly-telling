import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import * as utils from "../../utils/index.js";

function stateToVizConfig(state) {
  let sides = 8;
  let backupBarCount = 64;

  if (
       (!state)
    || (!state.data)
    || (!state.data.length)
    || (!Array.isArray(state.data))
  ) {
    sides = backupBarCount;
  } else {
    sides = Math.floor(Math.sqrt(state.data.length))
  }

  let configVars = {
    barCount: sides
  };
  return configVars;
}

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
    // console.log(scObj);
  }

  sharedDataset = {};

  async updateDataState(stateChangeOpts) {

    console.log("oldState", stateChangeOpts.oldState);
    console.log("newState", stateChangeOpts.newState);
    console.log("updateOpts", stateChangeOpts.updateOpts);

    // let newVizConfig = stateToVizConfig(stateChangeOpts.newState);
    // console.log(newVizConfig);

    let tweenRate = 100;
    let tweenDuration = stateChangeOpts.updateOpts.tweenDuration;
    let delay = stateChangeOpts.updateOpts.delay;

    await utils.wait(delay);

    // CONTINUE HERE: check timetweening between start, end vals based on tweenDuration and tweenRate
    let tweenElapsed = 0;
    // let start = stateChangeOpts.oldState.data.length;
    let start = this.barCount;
    let end = stateChangeOpts.newState.data.length;
    let span = end - start;
    let isDecreasing = end < start;
    console.log("start", tweenElapsed, start);
    while(tweenElapsed <= tweenDuration) {
      let i = tweenElapsed / tweenDuration;
      let spanI = i * span;

      let c = spanI + ((isDecreasing ? 1 : -1) * start);

      tweenElapsed += tweenRate;
      console.log(i.toFixed(2), c);
      await utils.wait(tweenRate);
    }
    console.log("done", tweenElapsed, end);

    // console.log(this.barCount);
    // this.barCount = newVizConfig.barCount;
    // console.log(this.barCount);

    await this.init(this._scene);
  }
}
