import * as THREE from "https://cdn.skypack.dev/three@0.134.0/build/three.module.js";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls";

import { EffectComposer } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/shaders/FXAAShader";

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
  containerId: "janimContainer",
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
  container;
  scene;
  camera;
  controls;
  composer;

  vizHelpers = [];

  async init() {
    this.container = document.getElementById(this.activeOpts.containerId);
    if (!this.container) {
      let cont = document.createElement("div");
      document.body.appendChild(cont);
      cont.id = this.activeOpts.containerId;
      cont.style.width = window.innerWidth + "px";
      cont.style.height = window.innerHeight + "px";
      this.container = cont;
    }
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(this.activeOpts.clearColor);
    this.container.innerHTML = "";
    this.container.appendChild( this.renderer.domElement );
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.set(2100, 1200, 1800);
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
    this.onWindowResize();
    this.linkToHTMLEvents();
  }

  async animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.composer.render();
  }

  //-----------------------------------------------------------------------------

  linkToHTMLEvents = () => {
    document.addEventListener("janim-reset", async (e) => {
      await this.initialize(this.activeOpts);
    });
  }

  onWindowResize = () => {
    // this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    // this.composer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  //-----------------------------------------------------------------------------

  /**
    Initialize the this.scene
    Awaits till the instance is ready to be worked with.
    @param {object} opts - Options for inialization.
    @example
      await janim.initialize({
        containerId: "janimContainer",
        autoUpdate: true,
        clearColor: "#222222",
        addGroundPlane: true,
        addGrid: true,
        groundPlaneColor: "#dedede",
        debugMode: true,
      });
  */
  async initialize(opts) {
    this.activeOpts = { ...defaultOpts, ...(opts || {}) };
    this.vizs = [];
    this.clientObject3Ds = null;
    await this.init();
    this.animate();

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
    this.vizs.forEach((g) => g.update(this.clientObject3Ds));
    this.vizHelpers.forEach((g) => g.update(this.clientObject3Ds));
  }

  /**
    Reset the environment
    Awaits till the instance is ready to be worked with.

    @param {object} opts - Options for inialization.

    @example
      await janim.reset();

  */
  async reset() {
    await this.initialize(this.activeOpts);
    await this.updateWorld();
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
    // let vizType = vizTypesAvailable.find((v) => v.name === opts.name);
    // let vizInstance = new vizType();
    // await this.registerVizToScene(vizInstance);

    // if (this.activeOpts.autoUpdate) await this.updateWorld();
    // return vizInstance;
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
    if (typeof vizInstance.init === "function") {
      let o = await vizInstance.init(this.scene);
      if (o) {
        this.clientObject3Ds.add(o);
      }
    }
  }
}
