import { directionMap, rotationMap } from '../utils.js';
import { createBox, createMaterial, createSkybox } from '../core/Factory.js';
import { createCameraPrefab } from './cameraPrefab.js';

export class Player {
    constructor(controller, person = "firstperson", world) {
        this.components = [];
        this.children = [];
        this.pos = new THREE.Vector3(5, 2, 5);
        this.vel = new THREE.Vector3(0, 0, 0);
        //this.dir = new THREE.Vector3(0, -2.3, 0);
        this.dir = new THREE.Vector3(0, 0, 0); // Change for rot
        this.moveSpeed = 0.2;
        this.rotationSpeed = 0.05;
        this.jumpSpeed = 0.15;
        this.jumping = false;
        this.running = false;
        this.onGround = false;
        this.height = 2.5;
        this.controller = controller;
        this.person = person
        this.raycaster = new THREE.Raycaster();
        this.world = world;
        //this.rayLine = this.createRayVisualization();
        //scene.add(this.rayLine);


        // Create model
        this.createModel()
        this.cameraPrefab = createCameraPrefab();
        this.camera = this.cameraPrefab.components[0].camera;
        this.object.add(this.camera);
        this.camera.position.set(0, this.height, 0);

    }

    // These methods mirror GameObject, until we officially move all the logic to playerPrefab

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
        //this.object3D.add(child.object3D);
    }

    update(delta) {
        for (const component of this.components) {
            component.update?.(delta); // TODO: Check if it's enabled
        }
        for (const child of this.children) {
            child.update?.(delta); // TODO: Check if it's enabled
        }
    }

    // End of the mirrored methods

    createModel() {
        this.object = new THREE.Object3D();
        this.object.position.set(0, 0, 0);
        let meshInfo = {
            type: "box",
            size: { x: 1, y: 2.5, z: 1 },
            materialInfo: [{
                type: "solid",
                color: 0xff0000
            }]
        }
        let [group, model] = createBox(meshInfo);
        model.position.set(0, meshInfo.size.y / 2, 0);
        this.object.add(model);
        return model;
    }


    createRayVisualization() {
        const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -100)]);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        let rayLine = new THREE.Line(geometry, material);
        return rayLine;
    }

    handleHorizontalCollision(intersection, moveDirection) {
        const normal = intersection.face.normal;
        
        const dot = moveDirection.dot(normal);
        const slide = new THREE.Vector3();
        slide.copy(moveDirection);
        slide.sub(normal.multiplyScalar(dot));
        
        const impactAngle = Math.abs(dot);
        const slideFactor = 2 - impactAngle;
        slide.multiplyScalar(slideFactor * this.moveSpeed);
        
        return slide;
    }
    checkVerticalCollisions() {
        const directions = [
            new THREE.Vector3(0, -1, 0)//,
            //new THREE.Vector3(0, 1, 0)
        ];
        const origin = this.pos.clone();
        const collisionDistance = 1;
        
        for (let direction of directions) {
            this.raycaster.set(origin, direction);
            const intersections = this.raycaster.intersectObjects(this.world.objects);
            if (intersections.length > 0 && intersections[0].distance <= collisionDistance ) {
                const newHeight = intersections[0].point.y;
                return newHeight;
            }
        }
    }

    checkHorizontalCollisions(deltaX, deltaZ) {
        const directions = [
            new THREE.Vector3(deltaX, 0, deltaZ).normalize()
        ];
        const origin = this.pos.clone();
        const collisionDistance = 1;
        
        for (let direction of directions) {
            this.raycaster.set(origin, direction);
            const intersections = this.raycaster.intersectObjects(this.world.objects);
            if (intersections.length > 0 && intersections[0].distance < collisionDistance) {
                const slideVector = this.handleHorizontalCollision(intersections[0], direction);
                return {
                    x: slideVector.x,
                    z: slideVector.z
                };
            }
        }
        
        return { x: deltaX, z: deltaZ };
    }

    update() {
        this.controller.update()
        this.vel.x = 0;
        this.vel.z = 0;

        if (this.controller.keyStates['arrowup']) {
            this.dir.x += this.rotationSpeed;
        }
        if (this.controller.keyStates['arrowdown']) {
            this.dir.x -= this.rotationSpeed;
        }
        if (this.controller.keyStates['arrowleft']) {
            this.dir.y += this.rotationSpeed;
        }
        if (this.controller.keyStates['arrowright']) {
            this.dir.y -= this.rotationSpeed;
        }

        for (let key in directionMap) {
            if (this.controller.keyStates[key]) {
                this.vel.x += this.moveSpeed * directionMap[key].x;
                this.vel.z += this.moveSpeed * directionMap[key].z;
            }
        }

        if (this.controller.keyStates[' ']) {
            if (!this.jumping) {
                this.onGround = false;
                //this.controller.keyStates['f'] = false;
                this.vel.y = +this.jumpSpeed;
                this.jumping = true;
            }
        }
        if (this.controller.keyStates['f']) {
            //this.controller.keyStates['f'] = false;
            this.vel.y +=0.01;
            //this.jumping = true;
        }
        if (this.controller.keyStates['shift']) {
            this.moveSpeed = 0.5;
            this.running = true;
        }
        else if (this.running) {
            this.moveSpeed = 0.1;
            this.running = true;
        }
        if (this.controller.keyStates['c']) {
            if (this.person === "firstperson") {
                this.person = "thirdperson";
            }
            else {
                this.person = "firstperson";
            }
            this.controller.keyStates['c'] = false;
        }


        this.mouseControl();

        const newHeight = this.checkVerticalCollisions();
        
        this.vel.y += -this.world.gravity;

        const deltaX = this.vel.z * Math.sin(this.dir.y) + this.vel.x * Math.cos(this.dir.y);
        const deltaZ = this.vel.z * Math.cos(this.dir.y) + this.vel.x * -Math.sin(this.dir.y);

        const horizontalMovement = this.checkHorizontalCollisions(deltaX, deltaZ);

        this.pos.x += horizontalMovement.x;
        this.pos.z += horizontalMovement.z;
        this.pos.y += this.vel.y;

        this.object.position.x = this.pos.x;
        this.object.position.y = this.pos.y;
        this.object.position.z = this.pos.z;
        this.object.rotation.y = this.dir.y;




        if (this.pos.y <= newHeight) {
            this.onGround = true;
            this.pos.y = newHeight;
            //this.pos.y = 0;
            this.vel.y = 0;
            this.jumping = false;
        }

        //this.updateRay();

    }
    updateRay() {
        let velVector = new THREE.Vector3(this.vel.x, 0, this.vel.z).normalize();
        
        let rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(this.dir.y);
    
        let rayDirection = velVector.applyMatrix4(rotationMatrix);
    
        this.raycaster.ray.set(this.pos, rayDirection);
    
        let point = this.raycaster.ray.origin.clone().add(rayDirection.multiplyScalar(100));
    
        this.rayLine.geometry.setFromPoints([this.pos, point]);
    }
    mouseControl() {
        if (this.controller.mousePos.x !== undefined && this.controller.mousePos.y !== undefined) {
            this.dir.x -= this.controller.mouseSpeed.y * 0.001;
            this.dir.y -= this.controller.mouseSpeed.x * 0.001;
        }
    }
}