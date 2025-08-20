import { World } from './World.js';

export class Game {
    constructor() {
        this.textureLoader = new THREE.TextureLoader(); // TODO: Obscure all THREE.js
        this.renderer = new THREE.WebGLRenderer(); // TODO: Obscure all THREE.js
        this.renderer.setSize(window.innerWidth, window.innerHeight); // TODO: Obscure all THREE.js
        this.currentCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // TODO: Initialize somewhere else
        this.world = new World();
        this.paused = false;
        document.body.appendChild(this.renderer.domElement);
    }
    update() {
        if (!this.paused) {
            this.renderer.render(this.world.scene, this.currentCamera);
            for (let i = 0; i < this.world.objects.length; i++) {
                this.world.objects[i].updateMatrixWorld();
            }
            this.world.update();
        }
    }
    togglePause() {
        this.paused = !this.paused;
    }
}