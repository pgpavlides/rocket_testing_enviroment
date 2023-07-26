import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import * as GUI from 'lil-gui';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const loader = new GLTFLoader();

let gltfModel = null;

let gui = new GUI.GUI();



//========================================= MODEL 1 ROCKET ==============================================


loader.load(
  "/Rocketv2.glb", // path to your gltf file
  function (gltf) {
    gltfModel = gltf.scene;
    scene.add(gltf.scene);

    gltfModel.position.x = 5;  // Change these values
    gltfModel.position.y = -2;  // to move the rocket 

let rocketFolder = gui.addFolder('Rocket');
rocketFolder.close();

let positionFolder = rocketFolder.addFolder('Position');
positionFolder.open();
positionFolder.add(gltfModel.position, 'x', -10, 10, 0.01);
positionFolder.add(gltfModel.position, 'y', -10, 10, 0.01);
positionFolder.add(gltfModel.position, 'z', -10, 10, 0.01);

let scaleFolder = rocketFolder.addFolder('Scale');
scaleFolder.open();
let unifiedScale = { value: 1 };

let changeScale = scaleFolder.add(unifiedScale, 'value', 0.1, 5, 0.01);
changeScale.onChange(function (value) {
  gltfModel.scale.set(value, value, value);
});


    //ANIMATIOn

    let tl = gsap.timeline({ repeat: -1, yoyo: true });
    gsap.to(gltfModel.rotation, { y: "+=" + Math.PI * 2, duration: 22, ease: "none", repeat: -1 });
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

//========================================= MODEL 2 ==============================================

let secondModel = null;

loader.load(
  "/Logo_B.glb", // path to your gltf file
  function (gltf) {
    secondModel = gltf.scene;
    scene.add(gltf.scene);

    let delayCounter = 0;
    secondModel.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.scale.set(0, 0, 0); // set initial scale to 0
            gsap.to(child.scale, {
                x: 1, 
                y: 1,
                z: 1,
                delay: delayCounter, // apply delay
                duration: 2, // duration of the animation in seconds
                ease: "power3.inOut",
            });
            delayCounter += 0.2; // increment delay counter by 0.5 seconds
        }
    });

    secondModel.rotation.x = Math.PI / 2 ;
    secondModel.rotation.y = 0;
    secondModel.rotation.z = 0;


    secondModel.position.x = -1;  // Change these values
    secondModel.position.y = 0;  // to move the new model 

    let modelFolder = gui.addFolder('LOGO');
    modelFolder.close();

    let positionFolder = modelFolder.addFolder('Position');
    positionFolder.open();
    positionFolder.add(secondModel.position, 'x', -10, 10, 0.01);
    positionFolder.add(secondModel.position, 'y', -10, 10, 0.01);
    positionFolder.add(secondModel.position, 'z', -10, 10, 0.01);

    let rotateFolder = modelFolder.addFolder('Rotation');
    rotateFolder.open();
    rotateFolder.add(secondModel.rotation, 'x', -10, 10, 0.0001);
    rotateFolder.add(secondModel.rotation, 'y', -10, 10, 0.0001);
    rotateFolder.add(secondModel.rotation, 'z', -10, 10, 0.0001);

    let scaleFolder = modelFolder.addFolder('Scale');
    scaleFolder.open();
    let unifiedScale = { value: 1 };

    let changeScale = scaleFolder.add(unifiedScale, 'value', 0.1, 5, 0.01);
    changeScale.onChange(function (value) {
      secondModel.scale.set(value, value, value);
    });

    // You can add more animations as required
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

//====================================================Smoke Particles==================================================

const createSmoke = () => {
  let p=getParticle();
  dropParticle(p)
}

const particleArray = [];

class Particle {
  constructor(){
    var scale = 20 + Math.random() * 20;
    var nLines = 5 + Math.floor(Math.random() * 5);
    var nRows = 5 + Math.floor(Math.random() * 5);
    this.geometry = new THREE.SphereGeometry(scale, nLines, nRows).toNonIndexed();
    this.material = new THREE.MeshLambertMaterial({
      color: "grey",
      transparent: true,

    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);


  }
}

const getParticle = () => {
  let p;
  if(particleArray.length) {
    p = particleArray.pop();
  }
  else {
    p = new Particle();
  }
  return p;
}

const particleProperties = {
  s: 0.2,
  scaleFactor: 0.010,
  opacity: 1,
  posX: 5, // new property for the X position
  posY: 0,  // new property for the Y position
  posZ: 0   // new property for the Z position
};

let particleFolder = gui.addFolder('Particle');
particleFolder.close();

particleFolder.add(particleProperties, 's', 0.1, 1, 0.01);
particleFolder.add(particleProperties, 'scaleFactor', 0.001, 0.1, 0.001);
particleFolder.add(particleProperties, 'opacity', 0, 1, 0.01);
let positionFolder = particleFolder.addFolder('Position');
positionFolder.open();
positionFolder.add(particleProperties, 'posX', -10, 10, 0.01);
positionFolder.add(particleProperties, 'posY', -10, 10, 0.01);
positionFolder.add(particleProperties, 'posZ', -10, 10, 0.01);


const dropParticle = (p) => {
  scene.add(p.mesh);
  p.mesh.position.y = particleProperties.posY;
  p.mesh.position.x = particleProperties.posX;
  p.mesh.position.z = particleProperties.posZ;
  p.mesh.material.opacity = particleProperties.opacity;
  let s = particleProperties.s + Math.random() * 0.2;
  p.mesh.scale.set(s * 0.006, s * 0.006, s * 0.006);
  gsap.to(p.mesh.scale, {
    x: s * particleProperties.scaleFactor,
    y: s * particleProperties.scaleFactor,
    z: s * particleProperties.scaleFactor,
    ease: "power3.inOut",
  });
  gsap.to(p.mesh.position, {
    duration: 1,
    y: -3,
    ease: "none",  
    onComplete: recycleParticle,
    onCompleteParams : [p] 
  })
  gsap.to(p.mesh, {
    duration: 1,
    // opacity: 0,
    ease: "none",   
  })
}

const recycleParticle=(p)=> {

  p.mesh.rotation.x = Math.random() * Math.PI * 2;
  p.mesh.rotation.y = Math.random() * Math.PI * 2;
  p.mesh.rotation.z = Math.random() * Math.PI * 2;
  particleArray.push(p);
}





/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
scene.add(ambientLight);

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0x1fb8b2, 0x0000ff, 0.6);
scene.add(hemisphereLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
directionalLight.position.set(0, 0, 5);
scene.add(directionalLight);

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 3, 10);
scene.add(pointLight);


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );

// camera.position.z = 5;

// scene.add(camera);

const aspect = sizes.width / sizes.height;

// Make sure that these values are in a correct ratio for your specific scene
const frustumSize = 8;

const camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 10000);
camera.position.z = 500;

scene.add(camera);

// Assuming you've defined your camera earlier
let initialCameraPosition = new THREE.Vector3();
initialCameraPosition.copy(camera.position);  // Store the initial camera position

let resetCameraButton = document.getElementById('resetCameraButton');

resetCameraButton.addEventListener('click', function() {
  camera.position.copy(initialCameraPosition);  // Reset the camera position
});

// Store the initial state


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enabled = true;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2 - 0.1;
controls.minDistance = 0;
controls.maxDistance = 15;
controls.enablePan = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 2.0;

const initialControlsState = controls.saveState();


resetCameraButton.addEventListener('click', function() {
  // Reset the camera position
  camera.position.copy(initialCameraPosition);
  
  // Reset the controls
  controls.reset();
});



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));








/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  

  // pointLight.position.x = Math.sin(elapsedTime) * 4;
  // pointLight.position.y = Math.sin(elapsedTime) * 4;
  // pointLight.position.z = Math.sin(elapsedTime) * 4;


  createSmoke();
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
