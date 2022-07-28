import * as THREE from "https://cdn.skypack.dev/three@0.134.0/build/three.module.js";

// ref: https://bocoup.com/blog/learning-three-js-with-real-world-challenges-that-have-already-been-solved
export function makeTextSprite(message, opts) {
  let parameters = opts || {};
  let fontface = parameters.fontface || "Helvetica";
  let fontsize = parameters.fontsize || 400;
  let canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 400;
  let context = canvas.getContext("2d");
  context.font = fontsize + "px " + fontface;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // text color
  context.fillStyle = "rgba(255, 255, 255, 1.0)";
  context.fillText(message, canvas.width / 2, canvas.height / 2);

  // canvas contents will be used for a texture
  let texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  let spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
  });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(6, 3, 1.0);
  return sprite;
}

//-------------------------------------

Object.assign(THREE.PlaneBufferGeometry.prototype, {
  toGrid: function () {
    let segmentsX = this.parameters.widthSegments || 1;
    let segmentsY = this.parameters.heightSegments || 1;
    let indices = [];
    for (let i = 0; i < segmentsY + 1; i++) {
      let index11 = 0;
      let index12 = 0;
      for (let j = 0; j < segmentsX; j++) {
        index11 = (segmentsX + 1) * i + j;
        index12 = index11 + 1;
        let index21 = index11;
        let index22 = index11 + (segmentsX + 1);
        indices.push(index11, index12);
        if (index22 < (segmentsX + 1) * (segmentsY + 1) - 1) {
          indices.push(index21, index22);
        }
      }
      if (index12 + segmentsX + 1 <= (segmentsX + 1) * (segmentsY + 1) - 1) {
        indices.push(index12, index12 + segmentsX + 1);
      }
    }
    this.setIndex(indices);
    return this;
  },
});

export function makeGrid(w, h, col = 0xffffff) {
  var planeGeom = new THREE.PlaneBufferGeometry(w, h, w / 10, h / 10).toGrid();
  var gridPlane = new THREE.LineSegments(
    planeGeom,
    new THREE.LineBasicMaterial({ color: col })
  );
  return gridPlane;
}
