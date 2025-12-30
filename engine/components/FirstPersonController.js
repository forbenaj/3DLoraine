import { Component } from '../core/Component.js';

export class FirstPersonController extends Component {
    constructor() {
        super("FirstPersonController");
        this.gameObject = null;
        this.world = null;
        this.keyStates = {};
        this.mousePos = {};
        this.mouseSpeed = {};
        this.camera = null;
    }
    start() {
        this.camera = this.gameObject.getComponent("Camera").camera;
    }
    update() {
        this.keyStates['arrowup'] = false;
        this.keyStates['arrowdown'] = false;
        this.keyStates['arrowleft'] = false;
        this.keyStates['arrowright'] = false;
        this.keyStates[' '] = false;
        this.keyStates['f'] = false;
        this.keyStates['shift'] = false;
        this.keyStates['c'] = false;

        if (this.gameObject.controller.mousePos.x !== undefined && this.gameObject.controller.mousePos.y !== undefined) {
            this.mousePos.x = this.gameObject.controller.mousePos.x;
            this.mousePos.y = this.gameObject.controller.mousePos.y;
            this.mouseSpeed.x = this.gameObject.controller.mouseSpeed.x;
            this.mouseSpeed.y = this.gameObject.controller.mouseSpeed.y;
        }
        else {
            this.mousePos.x = undefined;
            this.mousePos.y = undefined;
            this.mouseSpeed.x = undefined;
            this.mouseSpeed.y = undefined;
        }

        if (this.gameObject.controller.keyStates['arrowup']) {
            this.keyStates['arrowup'] = true;
        }
        if (this.gameObject.controller.keyStates['arrowdown']) {
            this.keyStates['arrowdown'] = true;
        }
        if (this.gameObject.controller.keyStates['arrowleft']) {
            this.keyStates['arrowleft'] = true;
        }
        if (this.gameObject.controller.keyStates['arrowright']) {
            this.keyStates['arrowright'] = true;
        }
        if (this.gameObject.controller.keyStates[' ']) {
            this.keyStates[' '] = true;
        }
        if (this.gameObject.controller.keyStates['f']) {
            this.keyStates['f'] = true;
        }
        if (this.gameObject.controller.keyStates['shift']) {
            this.keyStates['shift'] = true;
        }
        if (this.gameObject.controller.keyStates['c']) {
            this.keyStates['c'] = true;
        }
    }
}