import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let camera, scene, renderer, controls;
let lightBulbModel;
let vk2SceneModel;
let barrelModel;

init();

function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = function () {
    const box = new THREE.Box3().setFromObject(scene);
    const boxCenter = box.getCenter(new THREE.Vector3());
    const boxSize = box.getSize(new THREE.Vector3());
  
    controls.target.copy(boxCenter);
    camera.position.set(
      boxCenter.x + boxSize.x,
      boxCenter.y + boxSize.y,
      boxCenter.z + boxSize.z
    );
    controls.update();

    render();
    animate();
  };
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  scene = new THREE.Scene();
  const rgbeLoader = new RGBELoader(loadingManager);
  rgbeLoader.setPath('./assets/').load('qwantani_sunset_2k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    const loader = new GLTFLoader(loadingManager).setPath('./assets/');
    loader.load('VK2Scene.glb', function (gltf) {
      vk2SceneModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(vk2SceneModel);
      const boxCenter = box.getCenter(new THREE.Vector3());
      const boxSize = box.getSize(new THREE.Vector3());
      vk2SceneModel.position.sub(boxCenter);
      scene.add(vk2SceneModel);
      controls.target.copy(boxCenter);
      camera.position.set(
        boxCenter.x + boxSize.x,
        boxCenter.y + boxSize.y,
        boxCenter.z + boxSize.z
      );
      controls.update();
    });
    loader.load('lightBulbModel/lightbulb_led_2k.gltf', function (gltf) {
      lightBulbModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(lightBulbModel);
      const boxCenter = box.getCenter(new THREE.Vector3());
      const boxSize = box.getSize(new THREE.Vector3());
      lightBulbModel.position.sub(boxCenter);
      lightBulbModel.position.x += 25;
      lightBulbModel.position.y += 5; 
      lightBulbModel.scale.set(150, 150, 150);
      scene.add(lightBulbModel);
      controls.target.copy(boxCenter);
      camera.position.set(
        boxCenter.x + boxSize.x,
        boxCenter.y + boxSize.y,
        boxCenter.z + boxSize.z
      );
      controls.update();
    });
    // barell
    loader.load('barrel.glb', function (gltf) {
      barrelModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(barrelModel);
      const boxCenter = box.getCenter(new THREE.Vector3());
      const boxSize = box.getSize(new THREE.Vector3());
      barrelModel.position.sub(boxCenter);
      barrelModel.position.x += -45;
      barrelModel.position.y += -4;
      barrelModel.position.z += 20;
      barrelModel.scale.set(10, 10, 10);
      scene.add(barrelModel);
      controls.target.copy(boxCenter);
      camera.position.set(
        boxCenter.x + boxSize.x,
        boxCenter.y + boxSize.y,
        boxCenter.z + boxSize.z
      );
      controls.update();
    });
  });
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  window.addEventListener('resize', onWindowResize);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}
function animate() {
  requestAnimationFrame(animate);
  if (lightBulbModel) {
    lightBulbModel.rotation.y += 0.01;
  }
  render();
}
function render() {
  renderer.render(scene, camera);
}
