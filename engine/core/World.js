import { createBox, createSkybox } from './oldFactory.js';

export class World {
    constructor() {
        this.objects = []; // Colliders / raycast targets (e.g. map geometry)
        this.entities = []; // Things that run update(delta)
        this.meshes = []; // Is this used? I think it should be just "objects"
        this.gravity = 0.005
        this.scene = new THREE.Scene(); // TODO: Obscure all THREE.js
    }

    addObject(object) {
        this.objects.push(object);
        this.scene.add(object);
        object.world = this;
    }

    addEntity(entity) {
        this.entities.push(entity);
        if (entity.world !== undefined) entity.world = this;
        this.scene.add(entity.object3D ?? entity);
        return entity;
    }

    removeObject(object) {
        this.objects.splice(this.objects.indexOf(object), 1);
    }
    createScene(worldData) {
        const boxes = worldData.boxes;
        for (const boxData of boxes) {
            let [group, box] = createBox(boxData.pos, boxData.size, boxData.materialInfo);
            this.addObject(box);
            this.scene.add(group) // Remove this, the outline should be handled some other way
        }
        if (worldData.skybox) {
            let texture = createSkybox(worldData.skybox);
            this.scene.background = texture;
        }
    }
    update(delta) {
        for (const entity of this.entities) {
            entity.update?.(delta);
        }
    }
}
