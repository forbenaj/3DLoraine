import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

export class GameObject {
    constructor(name = "GameObject") {
        //this.object3D = new THREE.Object3D(); // 3D objects are components
        this.name = name;
        this.components = [];
        this.children = [];
    }

    addComponent(component) {
        component.gameObject = this;
        this.components.push(component);
        if (component.init) component.init();
    }

    removeComponent(component) {
        this.components.splice(this.components.indexOf(component), 1);
    }

    getComponent(name) {
        for (const component of this.components) {
            if (component.name === name) return component;
        }
    }

    add(child) {
        this.children.push(child);
        this.object3D.add(child.object3D);
    }

    update(delta) {
        for (const component of this.components) {
            component.update?.(delta);
        }
        for (const child of this.children) {
            child.update?.(delta);
        }
    }
}
