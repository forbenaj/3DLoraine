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
        this.running = false;
        this.rafId = null;
        this.lastTimeMs = 0;
        this.tick = this.tick.bind(this);
        document.body.appendChild(this.renderer.domElement);
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTimeMs = performance.now();
        this.rafId = requestAnimationFrame(this.tick);
    }

    stop() {
        if (!this.running) return;
        this.running = false;
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }

    tick(nowMs) {
        if (!this.running) return;

        const deltaSec = Math.min((nowMs - this.lastTimeMs) * 0.001, 0.1);
        this.lastTimeMs = nowMs;

        if (!this.paused) this.update(deltaSec);
        this.render();

        this.rafId = requestAnimationFrame(this.tick);
    }

    update(deltaSec) {
        this.world.update(deltaSec);
    }
    render() {
        this.renderer.render(this.world.scene, this.currentCamera);
    }
    togglePause() {
        this.paused = !this.paused;
    }
}
