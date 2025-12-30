import { Component } from '../core/Component.js';

export class Camera extends Component {
    constructor() {
        super("Camera");
        this.gameObject = null;
        this.world = null;
        this.fov = 75;
        this.aspect = window.innerWidth / window.innerHeight;
        this.near = 0.1;
        this.far = 1000;
        this.camera = null
    }
    start() {
        this.camera = this.createCamera();
        this.gameObject.object3D.add(this.camera);
    }
    createCamera() {
        let camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        return camera;
    }
    update() {
        this.camera.aspect = this.aspect;
        this.camera.fov = this.fov;
        this.camera.near = this.near;
        this.camera.far = this.far;
        this.camera.position.set(this.gameObject.pos.x, this.gameObject.pos.y, this.gameObject.pos.z);
    }
}