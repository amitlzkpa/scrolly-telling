import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import * as threeUtils from "../threeUtils/index.js";

function get3dGrid(scObj) {
  let box3 = new THREE.Box3();
  if (scObj) {
    box3 = new THREE.Box3().setFromObject(scObj);
  }

  let vizObj = new THREE.Object3D();
  this.gridXLen = (Math.ceil(box3.max.x / this.dv) + 1) * this.dv;
  this.gridYLen = (Math.ceil(box3.max.y / this.dv) + 1) * this.dv;
  this.gridZLen = (Math.ceil(box3.max.z / this.dv) + 1) * this.dv;

  this.gridX = threeUtils.makeGrid(this.gridZLen, this.gridYLen, this.gridCol);
  this.gridX.rotation.y = Math.PI / 2;
  this.gridX.position.set(0, this.gridYLen / 2, this.gridZLen / 2);
  vizObj.add(this.gridX);

  this.gridY = threeUtils.makeGrid(this.gridXLen, this.gridZLen, this.gridCol);
  this.gridY.rotation.x = Math.PI / 2;
  this.gridY.position.set(this.gridXLen / 2, 0, this.gridZLen / 2);
  vizObj.add(this.gridY);

  this.gridZ = threeUtils.makeGrid(this.gridXLen, this.gridYLen, this.gridCol);
  this.gridZ.position.set(this.gridXLen / 2, this.gridYLen / 2, 0);
  vizObj.add(this.gridZ);

  let label, text;
  let gpX = this.gridXLen / this.dv;
  let gpY = this.gridYLen / this.dv;
  let gpZ = this.gridZLen / this.dv;

  for (let i = 0; i <= this.dv; i += 1) {
    text = i.toFixed(1);
    label = threeUtils.makeTextSprite(text);
    label.position.set(i * gpX, 0, this.gridZLen);
    vizObj.add(label);
    label = threeUtils.makeTextSprite(text);
    label.position.set(0, i * gpY, this.gridZLen);
    vizObj.add(label);
    label = threeUtils.makeTextSprite(text);
    label.position.set(this.gridXLen, 0, i * gpZ);
    vizObj.add(label);
  }

  return vizObj;
}

export default class Axes3D {
  dv = 10;

  gridX = null;
  gridY = null;
  gridZ = null;
  gridCol = "#ffffff";

  gridXLen = null;
  gridYLen = null;
  gridZLen = null;

  vizContainer = new THREE.Object3D();
  vizObj = null;

  async init() {
    await this.update();
    return this.vizContainer;
  }

  prevScObj = null;
  currScObj = null;

  async update(scObj) {
    this.currScObj = scObj;
    if (this.prevScObj === this.currScObj) return;

    if (this.vizObj) {
      this.vizContainer.remove(this.vizObj);
    }

    this.vizObj = get3dGrid.call(this, scObj);
    this.vizContainer.add(this.vizObj);
    this.prevScObj = this.currScObj;
  }
}
