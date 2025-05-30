import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ref, onMounted, onUnmounted } from "vue";
import { defineStore } from "pinia";

export const useThreeObjectStore = defineStore("threeObjectStore", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  /**
   * Constants
   */
  const WebGLRendererConfig = {
    antialias: true,
  };
  const PerspectiveCameraConfig = [70, width / height, 0.01, 10];
  const AxesHelperLength = 500;
  const threeObjects = {};
  const validObjectKeyList = [
    "scene",
    "camera",
    "renderer",
    "textureLoader",
    "controls",
  ];

  /**
   * Data
   */

  /**
   * Functions
   */
  function addThreeObject(key, value) {
    if (!validObjectKeyList.includes(key)) {
      return console.warn("검증되지 않은 키입니다.", key, validObjectKeyList);
    }

    threeObjects[key] = value;
  }

  function prepareScene() {
    const scene = new THREE.Scene();
    addThreeObject("scene", scene);
  }

  function prepareCamera() {
    const camera = new THREE.PerspectiveCamera(...PerspectiveCameraConfig);
    camera.position.z = 1;
    camera.lookAt(0, 0, 0);
    addThreeObject("camera", camera);
  }

  function prepareRenderer() {
    const renderer = new THREE.WebGLRenderer(WebGLRendererConfig);
    renderer.setSize(width, height);
    addThreeObject("renderer", renderer);
    const canvas = document.getElementById("three-map");
    canvas.appendChild(renderer.domElement);
  }

  function prepareTextureLoader() {
    const textureLoader = new THREE.TextureLoader();
    addThreeObject("textureLoader", textureLoader);
  }

  function prepareAxesHelper() {
    const axesHelper = new THREE.AxesHelper(AxesHelperLength); // 길이 5짜리 XYZ
    threeObjects.scene.add(axesHelper);
  }

  function prepareOrbitControls() {
    const controls = new OrbitControls(
      threeObjects.camera,
      threeObjects.renderer.domElement
    );
    controls.enableDamping = true; // 부드럽게 회전
    controls.dampingFactor = 0.05;
    addThreeObject("controls", controls);
  }

  function animate() {
    threeObjects.renderer.render(threeObjects.scene, threeObjects.camera);
  }

  function initialize() {
    prepareScene();
    prepareCamera();
    prepareRenderer();
    prepareTextureLoader();
    prepareAxesHelper();
    prepareOrbitControls();

    if (!threeObjects.renderer) {
      return console.warn("아직 렌더러가 준비되지 않았습니다.");
    }
    threeObjects.renderer.setAnimationLoop(animate);
  }

  function destroy() {}

  return { THREE, threeObjects, addThreeObject, initialize, destroy };
});
