import { GameObject } from '../core/GameObject.js';
import { MeshRenderer } from '../components/MeshRenderer.js';
import { FirstPersonController } from '../components/FirstPersonController.js';
import { createCameraPrefab } from './cameraPrefab.js';
import { createBox } from '../core/oldFactory.js';
import { Player } from './Player.js';
import { Controller } from '../core/Controller.js';


function createModel() {
    let pos = { x: 0, y: 0, z: 0 };
    let size = { x: 1, y: 2.5, z: 1 };
    let materialInfo = [{
        type: "solid",
        color: 0xff0000
    }]
    let [group, model] = createBox(pos, size, materialInfo);
    model.position.set(0, size.y / 2, 0);
    return model;
}

export function createPlayerPrefab(game) {
    let controller = new Controller(game.currentCamera); // Is this a component? A gameobject? Something else?

    // Do we need to pass controller? game world? Can't we just pass game?
    let playerPrefab = new GameObject("Player", game.world); //new GameObject("player");
    playerPrefab.controller = controller;
    playerPrefab.person = "firstperson";

    let meshInfo = {
        type: "box",
        size: { x: 1, y: 2.5, z: 1 },
        materialInfo: [{
            type: "solid",
            color: 0xff0000
        }]
    }

    let meshRenderer = playerPrefab.addComponent(new MeshRenderer(meshInfo));
    meshRenderer.mesh.position.set(0, meshInfo.size.y / 2, 0);
    playerPrefab.object3D.add(meshRenderer.mesh);
    
    let cameraPrefab = createCameraPrefab();
    playerPrefab.camera = cameraPrefab.components[0].camera;
    playerPrefab.object3D.add(playerPrefab.camera);

    let firstPersonController = playerPrefab.addComponent(new FirstPersonController());
    playerPrefab.camera.position.set(0, firstPersonController.height, 0);
    playerPrefab.pos = new THREE.Vector3(5, 2, 5);
    playerPrefab.vel = new THREE.Vector3(0, 0, 0);
    playerPrefab.rot = new THREE.Vector3(0, 0, 0);
    return playerPrefab;
}


