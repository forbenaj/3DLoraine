const scene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();

let currentCamera = mainCamera;

let paused = false;

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

mainCamera.position.set(1, 8, 1);

world = new World();
controller = new Controller();
player = new Player(controller, person="firstperson");

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
}

update();

document.addEventListener('keydown', (event) => {
    controller.keyStates[event.key.toLowerCase()] = true;
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