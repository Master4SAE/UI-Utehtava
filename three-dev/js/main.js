import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let container, camera, scene, renderer, cube, object, objec;



init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 2000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({color:  0x00ff00,});

  const controls = new OrbitControls( camera, renderer.domElement );

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  objec = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 1,4,5 ), material );
	objec.position.set( -2, 1, 1 );

  object = new THREE.Mesh( new THREE.SphereGeometry( 2, 1, 1 ), material );
	object.position.set( 2, -1, 1 );
	scene.add( object );

  camera.position.set(5, 5, 5);
  controls.update();

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  camera.lookAt(axesHelper.position);

  const light = new THREE.DirectionalLight( 'white' );
  scene.add( light );

  const ambientLight = new THREE.AmbientLight( 0xcccccc, 1.5 );
	scene.add( ambientLight );
  const pointLight = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );
	camera.add( pointLight );
  const helper = new THREE.DirectionalLightHelper( light, 20 );
  scene.add( helper );
  scene.add( camera );
  scene.add(objec);
}

function animate() {
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.001;
  object.rotation.x += 0.1;
  object.rotation.y += 0.1;
  objec.rotation.x += 0.1;
  objec.rotation.y += 0.1;

  renderer.render(scene, camera);
}

window.addEventListener('resize', resize, false);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}