import { createBox, createSkybox } from './Factory.js';

export class World {
    constructor() {
        this.objects = [];
        this.meshes = [];
        this.gravity = 0.005
        this.scene = new THREE.Scene();
    }

    addObject(object) {
        this.objects.push(object);
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
            this.scene.add(group)
            this.scene.add(box)
        }
        if (worldData.skybox) {
            let texture = createSkybox(worldData.skybox);
            this.scene.background = texture;
        }
    }
    update() {
    }
}