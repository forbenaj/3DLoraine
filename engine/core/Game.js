import { World } from './World.js';
import { Controller } from './Controller.js';

const { TextureLoader, WebGLRenderer, PerspectiveCamera } = globalThis.THREE;

export class Game {
    constructor() {
        this.textureLoader = new TextureLoader();
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.currentCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // TODO: Initialize somewhere else
        this.world = new World();
        this.controller = new Controller(this.currentCamera); // Is this a component? A gameobject? Something else? Do we need to pass currentCamera?
        this.paused = false;
        this.lastTime = performance.now();
        document.body.appendChild(this.renderer.domElement);
        //this.animate = this.animate.bind(this);
        //requestAnimationFrame(this.animate);
    }
    animate(now) {
        requestAnimationFrame(this.animate);
        const delta = now - this.lastTime / 1000;
        this.lastTime = now;

        this.update(delta);
        this.render();
    }
    update(delta) {
        if (!this.paused) {
            this.world.update(delta);
        }
    }
    render() {
        this.renderer.render(this.world.scene, this.currentCamera);
    }
    togglePause() {
        this.paused = !this.paused;
    }
}
