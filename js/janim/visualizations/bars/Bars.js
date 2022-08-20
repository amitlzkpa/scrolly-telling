import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import * as utils from "../../utils/index.js";
import * as tweenFn from "../../tweenFn/index.js";

function stateToVizConfig(state) {
  let backupBarCount = 64;
  let returnBarCount = backupBarCount;

  if (
       (state)
    && (state.data)
    && (state.data.length)
    && (Array.isArray(state.data))
  ) {
    returnBarCount = Math.ceil(Math.sqrt(state.data.length));
  }

  let configVars = {
    barCount: returnBarCount
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
    this.barCount = 0;
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

    let isFirstUpdate = !stateChangeOpts.oldState
                      || typeof stateChangeOpts.oldState !== 'object'
                      || Object.keys(stateChangeOpts.oldState);
    
    if (isFirstUpdate) {
      let vizConfig = stateToVizConfig(stateChangeOpts.newState);
      this.barCount = vizConfig.barCount;
      console.log(this.barCount);
      this._scene.remove(this.vizObj);
      await this.init(this._scene);
    }

    return;

    let tweenRate = 100;
    let tweenDuration = stateChangeOpts.updateOpts.tweenDuration;
    let delay = stateChangeOpts.updateOpts.delay;

    await utils.wait(delay);

    // CONTINUE HERE: apply tween to some variable
    let tweenElapsed = 0;
    // let start = stateChangeOpts.oldState.data.length;
    let start = this.barCount;
    let end = stateChangeOpts.newState.data.length;
    let span = end - start;
    let isDecreasing = end < start;
    // let fnLabels = [
    //   "easeInSine",
    //   "easeOutSine",
    //   "easeInOutSine",
    //   "easeInCubic",
    //   "easeOutCubic",
    //   "easeInOutCubic",
    // ];
    let fnLabels = tweenFn.availableTweenLabels();
    console.log(fnLabels);
    let tweenFns = fnLabels.map(lbl => tweenFn.labelToFn(lbl));
    console.log(tweenFns);
    let us = tweenFns.map(fn => fn(0.2));
    console.log(us);
    let vs = tweenFns.map(fn => fn(0.8));
    console.log(vs);

    // console.log("start", tweenElapsed, start);
    // while(tweenElapsed <= tweenDuration) {
    //   let i = tweenElapsed / tweenDuration;
    //   let spanI = i * span;

    //   // console.log(`i: ${i.toFixed(2)} || ${tweenFns.map(fn => fn(i).toFixed(2))}`);

    //   // let c = spanI + ((isDecreasing ? 1 : -1) * start);

    //   tweenElapsed += tweenRate;
    //   await utils.wait(tweenRate);
    // }
    // console.log("done", tweenElapsed, end);

    // console.log(this.barCount);
    // this.barCount = newVizConfig.barCount;
    // console.log(this.barCount);

    await this.init(this._scene);
  }
}
