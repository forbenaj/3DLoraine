import { Component } from '../core/Component.js';
import { createBox } from '../core/Factory.js';

export class MeshRenderer extends Component {
    constructor(meshInfo) {
        super("MeshRenderer");
        this.meshInfo = meshInfo;
        this.mesh = null;
    }
    start() {
        this.mesh = this.createModel();
    }
    createModel() {
        let [group, model] = createBox(this.meshInfo);
        return model;
    }
    
}
