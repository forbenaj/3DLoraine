import { Component } from '../core/Component.js';

export class PhysicsBody extends Component {
    constructor() {
        super("PhysicsBody");
        this.gameObject = null;
        this.world = null;
        this.vel = { x: 0, y: 0, z: 0 };
    }

    update(delta) {
        this.gameObject.pos.x += this.velocity.x * delta;
        this.gameObject.pos.y += this.velocity.y * delta;
        this.gameObject.pos.z += this.velocity.z * delta;
    }
}