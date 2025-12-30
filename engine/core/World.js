import { createBox, createSkybox } from './oldFactory.js';

export class World {
    constructor() {
        this.objects = [];
        this.meshes = []; // Is this used? I think it should be just "objects"
        this.gravity = 0.005
        this.scene = new THREE.Scene(); // TODO: Obscure all THREE.js
    }

    addObject(object) {
        this.objects.push(object);
        this.scene.add(object);
        object.world = this;
    }

    removeObject(object) {
        this.objects.splice(this.objects.indexOf(object), 1);
    }
    createScene(worldData) {
        const boxes = worldData.boxes;
        for (let i = 0; i < boxes.length; i++) {
            const boxData = boxes[i];
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
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].updateMatrixWorld();
        }
    }
}