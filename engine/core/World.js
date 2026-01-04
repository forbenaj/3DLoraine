import { createBox, createSkybox } from './oldFactory.js';

export class World {
    constructor() {
        this.gameObjects = [];
        this.updatables = [];
        this.colliders = [];
        // No me gusta mucho el tema de updatables y colliders. Les pondria de otra forma, quizas una lista de platforms
        // No me gusta que sean dos listas además de gameObjects, es raro

        this.gravity = 0.005;
        this.scene = new THREE.Scene(); // TODO: Obscure all THREE.js
    }

    add(item, { updatable = undefined, collider = undefined, addToScene = true } = {}) {
        if (!item) return item;

        const object3D = item.object3D ?? item;

        this.gameObjects.push(item);
        if (addToScene && object3D?.isObject3D) this.scene.add(object3D); // TODO: Obscure all THREE.js

        item.world = this;
        if (object3D) object3D.world = this;

        if (this.shouldUpdate(item, updatable)) this.updatables.push(item);

        if (this.shouldCollide(item, object3D, collider) && object3D) {
            this.colliders.push(object3D);
        }

        return item;
    }

    shouldUpdate(item, updatableOverride) {
        if (updatableOverride !== undefined) return updatableOverride;
        return typeof item.update === 'function';
    }

    shouldCollide(item, object3D, colliderOverride) {
        if (colliderOverride !== undefined) return colliderOverride;

        const colliderComponent =
            typeof item?.getComponent === 'function' ? item.getComponent('Collider') : null;
        if (colliderComponent) return colliderComponent.enabled !== false;

        if (item?.collider !== undefined) return item.collider;
        if (object3D?.userData?.collider !== undefined) return object3D.userData.collider;

        // Default collider heuristic: only objects that Raycaster can intersect.
        return object3D?.isObject3D === true && typeof object3D.raycast === 'function';
    }

    removeFromList(list, item) {
        const index = list.indexOf(item);
        if (index !== -1) list.splice(index, 1);
    }

    remove(item) {
        this.removeFromList(this.gameObjects, item);
        this.removeFromList(this.updatables, item);

        const object3D = item?.object3D ?? item;
        if (object3D) this.removeFromList(this.colliders, object3D);

        const sceneObject3D = object3D?.isObject3D ? object3D : null;
        if (sceneObject3D && sceneObject3D.parent === this.scene) this.scene.remove(sceneObject3D);
    }

    getRaycastTargets() {
        return this.colliders;
    }

    createScene(worldData) {
        const boxes = worldData.boxes ?? [];
        for (const boxData of boxes) {
            let [group, box] = createBox(boxData.pos, boxData.size, boxData.materialInfo);
            this.add(box, { collider: boxData.collider, updatable: false, addToScene: false });
            this.scene.add(group) // Remove this, the outline should be handled some other way
        }
        if (worldData.skybox) {
            let texture = createSkybox(worldData.skybox);
            this.scene.background = texture;
        }
    }
    update(delta) {
        for (const updatable of this.updatables) {
            updatable.update?.(delta);
        }
    }
}
