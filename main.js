import { Game } from './engine/core/Game.js';
import { World } from './engine/core/World.js';
import { createPlayerPrefab } from './engine/prefabs/playerPrefab.js';
//import { map2 } from './maps.js';

async function loadData(filename) {
    const response = await fetch(`./assets/${filename}`);
    const data = await response.json();
    return data;
}

let map2 = await loadData('maps/map2.json'); // This may not work in github pages. Test, and if it doesn't, use a .js file

// TODO: Obscure all instances of THREE.js when posible in the whole engine. Users mostly should not interact with THREE.js directly.


// GAME
let game = new Game();

// WORLD
let world = new World();
game.world = world;

// GAMEOBJECTS

// CAMERA
const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // TODO: Turn into a GameObject/Component
mainCamera.position.set(1, 8, 1);
game.currentCamera = mainCamera;


// PLAYER
let player = createPlayerPrefab(game);


// LIGHT
const ambientLight = new THREE.AmbientLight(0x404040, 2); // TODO: Turn into a GameObject

game.world.add(player, { updatable: true, collider: false });
game.world.scene.add(ambientLight);
game.world.createScene(map2); // Maybe this should happen in the Game class?


// UPDATE
game.currentCamera = player.camera;
game.start();


// window.addEventListener('beforeunload', function (e) {
//     const message = 'Are you sure you want to leave?';

//     e.returnValue = message; 

//     return message;
// });
