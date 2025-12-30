import { Component } from '../core/Component.js';

export class Object3D extends Component {
    constructor() {
        super("Object3D");
        this.gameObject = null;
        this.world = null;
    }
    start() {
        this.gameObject.object3D = new THREE.Object3D();
    }
}