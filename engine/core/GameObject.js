import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

export class GameObject {
    constructor(name = "GameObject", world = null) {
        this.object3D = new THREE.Object3D();
        this.name = name;
        this.components = [];
        this.children = [];
        this.world = world;
    }

    get pos() { return this.object3D.position;}
    set pos(value) {
        if (!value) return;
        if (value.isVector3) {
            this.object3D.position.copy(value);
            return;
        }
        this.object3D.position.set(value.x, value.y, value.z);
    }

    // get rot() { return this.object3D.rotation; } // FIX EULER ROTATION. Previous rotation with simple Vector3 worked correctly.
    // set rot(value) {
    //     if (!value) return;
    //     if (value.isEuler) {
    //         this.object3D.rotation.copy(value);
    //         return;
    //     }
    //     const order = value.order ?? this.object3D.rotation.order;
    //     this.object3D.rotation.set(value.x, value.y, value.z, order);
    // }

    get quat() { return this.object3D.quaternion; }
    set quat(value) {
        if (!value) return;
        if (value.isQuaternion) {
            this.object3D.quaternion.copy(value);
            return;
        }
        this.object3D.quaternion.set(value.x, value.y, value.z, value.w);
    }

    get scale() { return this.object3D.scale; }
    set scale(value) {
        if (!value) return;
        if (value.isVector3) {
            this.object3D.scale.copy(value);
            return;
        }
        this.object3D.scale.set(value.x, value.y, value.z);
    }

    addComponent(component) {
        this.components.push(component);
        component.init(this);
        return component;
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
            component.update?.(delta); // TODO: Check if it's enabled
        }
        for (const child of this.children) {
            child.update?.(delta); // TODO: Check if it's enabled
        }
    }
}
