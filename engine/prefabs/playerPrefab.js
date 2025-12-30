import { GameObject } from '../core/GameObject.js';
import { MeshRenderer } from '../components/MeshRenderer.js';
import { createCameraPrefab } from './cameraPrefab.js';
import { createBox } from '../core/oldFactory.js';


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

export function createPlayerPrefab() {
    let playerPrefab = new GameObject("player");
    let cameraPrefab = createCameraPrefab();
    playerPrefab.add(cameraPrefab);

    let meshInfo = {
        type: "box",
        size: { x: 1, y: 2.5, z: 1 },
        materialInfo: [{
            type: "solid",
            color: 0xff0000
        }]
    }

    let meshRenderer = playerPrefab.addComponent(new MeshRenderer(meshInfo));
    meshRenderer.mesh = createModel();
    return playerPrefab;
}


