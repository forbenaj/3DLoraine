import { World } from './engine/World.js';
import { Controller } from './engine/Controller.js';
import { Player } from './engine/Player.js';
import { map2 } from './maps.js';
import { pauseGame } from './engine/utils.js';

const scene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let currentCamera = mainCamera;

let paused = false;

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

mainCamera.position.set(1, 8, 1);

let world = new World(scene);
let controller = new Controller();
let player = new Player(controller, "firstperson", world);
scene.add(player.object);

world.createScene(map2);

function update() {
    if (!paused) {
        requestAnimationFrame(update);
        renderer.render(scene, currentCamera);
        for (let i = 0; i < world.objects.length; i++) {
            world.objects[i].updateMatrixWorld();
        }
        world.update();
        player.update();
    }
    if (player.person === "firstperson") {
        currentCamera = player.camera;
        currentCamera.rotation.x = player.dir.x;
    }
    else {
        currentCamera = mainCamera;
        currentCamera.lookAt(player.object.position);
    }
}

update();

document.addEventListener('keydown', (event) => {
    controller.keyStates[event.key.toLowerCase()] = true;
    if (event.key.toLowerCase() === 'p') {
        pauseGame();
    }
});

document.addEventListener('keyup', (event) => {
    controller.keyStates[event.key.toLowerCase()] = false;
});

document.addEventListener('mousemove', (event) => {
    controller.mousePos.x = event.clientX;
    controller.mousePos.y = event.clientY;
});

document.addEventListener('mousewheel', (event) => {
    // Change camera FOV
    currentCamera.fov += event.deltaY * 0.05;
    currentCamera.updateProjectionMatrix();
});

function requestPointerLock() {
    const element = document.body;
    if (element.requestPointerLock) {
        element.requestPointerLock();
    } else if (element.mozRequestPointerLock) {
        element.mozRequestPointerLock();
    } else if (element.webkitRequestPointerLock) {
        element.webkitRequestPointerLock();
    }
}

document.body.addEventListener('click', requestPointerLock);

// window.addEventListener('beforeunload', function (e) {
//     const message = 'Are you sure you want to leave?';

//     e.returnValue = message; 

//     return message;
// });