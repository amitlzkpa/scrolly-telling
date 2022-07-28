import * as THREE from "https://cdn.skypack.dev/three@0.134.0/build/three.module.js";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls";

import { EffectComposer } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/shaders/FXAAShader";

import Axes3D from "./helpers/Axes3D.js";
import Bars from "./visualizations/bars/Bars.js";
import Particles from "./visualizations/particles/Particles.js";

let vizTypesAvailable = [Bars, Particles];

//-----------------------------------------------------------------------------

let preInitEvt = new CustomEvent("janim-pre-init");
let postInitEvt = new CustomEvent("janim-post-init");
let preUpdateEvt = new CustomEvent("janim-pre-update");
let postUpdateEvt = new CustomEvent("janim-post-update");
let preAddVizEvt = new CustomEvent("janim-pre-add-viz");
let postAddVizEvt = new CustomEvent("janim-post-add-viz");

//-----------------------------------------------------------------------------

/**
background color
ground
sky color
soft shadows
hard shadows
edges
selectStyle
*/

let defaultOpts = {
  clearColor: "#222222",
  debugMode: false,
  autoUpdate: true,
  addGroundPlane: false,
  addGrid: true,
  groundPlaneColor: "#2d2d2d",
};

//-----------------------------------------------------------------------------

export default class Janim {
  //-----------------------------------------------------------------------------

  activeOpts = {};

  renderer;
  scene;
  camera;
  controls;
  composer;

  vizHelpers = [];

  async init() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.activeOpts.clearColor);
    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.set(600, 600, 400);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.03;

    this.scene.add(new THREE.AmbientLight("#222222"));
    let hemisphereLight = new THREE.HemisphereLight("#ffffbb", "#080820", 1);
    hemisphereLight.position.set(20, 20, 0);
    this.scene.add(hemisphereLight);

    // HERE: get directional light proper
    let directionalLight = new THREE.DirectionalLight("#ffffff", 1);
    directionalLight.position.set(0, 40, 25);
    this.scene.add(directionalLight);

    if (this.activeOpts.debugMode) {
      this.scene.add(new THREE.AxesHelper(20));
    }

    if (this.activeOpts.addGroundPlane) {
      let groundPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(10000, 10000),
        new THREE.MeshBasicMaterial({ color: this.activeOpts.groundPlaneColor })
      );
      groundPlane.rotation.x = -Math.PI / 2;
      groundPlane.position.y = -10;
      this.scene.add(groundPlane);
    }

    if (this.activeOpts.addGrid) {
      let ax3D = new Axes3D();
      let o = await ax3D.init();
      this.scene.add(o);
      this.vizHelpers.push(ax3D);
    }

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    // let bloomPass = new UnrealBloomPass();
    // bloomPass.threshold = 0.4;
    // bloomPass.strength = 0.6;
    // bloomPass.radius = 0.01;
    // this.composer.addPass(bloomPass);

    let fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.renderToScreen = true;
    this.composer.addPass(fxaaPass);

    window.addEventListener("resize", this.onWindowResize, false);
  }

  async animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.composer.render();
  }

  //-----------------------------------------------------------------------------

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  //-----------------------------------------------------------------------------

  /**
    Initialize the this.scene
    Awaits till the instance is ready to be worked with.
    @param {object} opts - Options for inialization.
    @example
      await janim.initialize({
        clearColor: "#222222",
        debugMode: false,
        autoUpdate: true,
        addGroundPlane: false,
        addGrid: true,
        groundPlaneColor: "#2d2d2d",
      });
  */
  async initialize(opts) {
    document.dispatchEvent(preInitEvt);
    this.activeOpts = { ...defaultOpts, ...(opts || {}) };
    await this.init();
    this.animate();
    document.dispatchEvent(postInitEvt);

    // setInterval(async () => {
    //   if (this.activeOpts.autoUpdate) await updateWorld();
    // }, 400);
  }

  /**
    Update the environment
    Awaits till the update is done.

    @example
      await janim.updateWorld();

  */
  async updateWorld() {
    document.dispatchEvent(preUpdateEvt);
    this.vizs.forEach((g) => g.update(this.clientObject3Ds));
    this.vizHelpers.forEach((g) => g.update(this.clientObject3Ds));
    document.dispatchEvent(postUpdateEvt);
  }

  //-----------------------------------------------------------------------------

  /**
    Add a visualization to the environment
    Awaits till the instance is ready to be worked with.

    @param {object} opts - Options for visualization.

    @example
      let bars = await janim.addViz({
        name: "Bars",
        sharedState: {},
      });

  */
  async addViz(opts) {
    document.dispatchEvent(preAddVizEvt);
    let vizType = vizTypesAvailable.find((v) => v.name === opts.name);
    let vizInstance = new vizType();
    await this.registerVizToScene(vizInstance);

    document.dispatchEvent(postAddVizEvt);
    if (this.activeOpts.autoUpdate) await this.updateWorld();
    return vizInstance;
  }

  //-----------------------------------------------------------------------------

  vizs = [];
  clientObject3Ds = null;

  async registerVizToScene(vizInstance) {
    if (!this.clientObject3Ds) {
      this.clientObject3Ds = new THREE.Object3D();
      this.scene.add(this.clientObject3Ds);
    }

    this.vizs.push(vizInstance);
    let o = await vizInstance.init();
        this.clientObject3Ds.add(o);
  }
}
