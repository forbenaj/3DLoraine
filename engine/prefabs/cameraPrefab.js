import { GameObject } from '../core/GameObject.js';
import { Camera } from '../components/Camera.js';

export function createCameraPrefab() {
    let cameraPrefab = new GameObject("camera");
    cameraPrefab.pos = { x: 0, y: 0, z: 0 };
    cameraPrefab.addComponent(new Camera());
    cameraPrefab.object3D.position.set(0, 0, 0);
    cameraPrefab.object3D.rotation.set(0, 0, 0);
    cameraPrefab.object3D.scale.set(1, 1, 1);
    return cameraPrefab;
}