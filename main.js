import { Game } from './engine/Game.js';
import { World } from './engine/World.js';
import { Controller } from './engine/Controller.js';
import { Player } from './engine/Player.js';
//import { map2 } from './maps.js';

async function loadData(filename) {
    const response = await fetch(`./assets/${filename}`);
    const data = await response.json();
    return data;
}

let map2 = await loadData('maps/map2.json'); // This may not work in github pages. Test, and if it doesn't, use a .js file

// TODO: Obscure THRRE.js

// CAMERA
const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // TODO: Turn into a GameObject
let currentCamera = mainCamera;
mainCamera.position.set(1, 8, 1);

// GAME
let game = new Game();
game.currentCamera = mainCamera;

// WORLD
let world = new World();
game.world = world;

// CONTROLLER
let controller = new Controller(game.currentCamera);

const ambientLight = new THREE.AmbientLight(0x404040, 2); // TODO: Turn into a GameObject

// PLAYER
let player = new Player(controller, "firstperson", game.world); // TODO: Turn into a GameObject

game.world.scene.add(player.object); // Should scene be obscured? (Gpt says: yes)
game.world.scene.add(ambientLight);
game.world.createScene(map2);

// UPDATE
function update() {
    game.update();
    player.update(); // TODO: Move somewhere else
    if (player.person === "firstperson") {
        game.currentCamera = player.camera;
        game.currentCamera.rotation.x = player.dir.x;
    }
    else {
        game.currentCamera = mainCamera;
        game.currentCamera.lookAt(player.object.position);
    }
    requestAnimationFrame(update);
}

update();


// window.addEventListener('beforeunload', function (e) {
//     const message = 'Are you sure you want to leave?';

//     e.returnValue = message; 

//     return message;
// });