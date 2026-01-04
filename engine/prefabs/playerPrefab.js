import { GameObject } from '../core/GameObject.js';
import { MeshRenderer } from '../components/MeshRenderer.js';
import { FirstPersonController } from '../components/FirstPersonController.js';
import { createCameraPrefab } from './cameraPrefab.js';
import { createBox } from '../core/oldFactory.js';
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
    let thisController = new Controller(game.currentCamera); // Is this a component? A gameobject? Something else?
    // Do we need to pass game? world?
    let thisPlayer = new GameObject("Player", game.world); //new GameObject("player");
    thisPlayer.controller = thisController;
    thisPlayer.person = "firstperson";

    let meshInfo = {
        type: "box",
        size: { x: 1, y: 2.5, z: 1 },
        materialInfo: [{
            type: "solid",
            color: 0xff0000
        }]
    }

    let thisMeshRenderer = thisPlayer.addComponent(new MeshRenderer(meshInfo));
    thisMeshRenderer.mesh.position.set(0, meshInfo.size.y / 2, 0);
    thisPlayer.object3D.add(thisMeshRenderer.mesh);
    
    let thisCamera = createCameraPrefab();
    thisPlayer.camera = thisCamera.components[0].camera;
    thisPlayer.object3D.add(thisPlayer.camera);

    let firstPersonController = thisPlayer.addComponent(new FirstPersonController());
    thisPlayer.camera.position.set(0, firstPersonController.height, 0);
    thisPlayer.pos = new THREE.Vector3(5, 2, 5);
    thisPlayer.vel = new THREE.Vector3(0, 0, 0);
    thisPlayer.rot = new THREE.Vector3(0, 0, 0);
    return thisPlayer;
}



