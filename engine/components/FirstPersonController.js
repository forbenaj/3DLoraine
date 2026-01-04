import { Component } from '../core/Component.js';
import { directionMap, rotationMap } from '../utils.js';

export class FirstPersonController extends Component {
    constructor() {
        super("FirstPersonController");
        this.gameObject = null;
        this.world = null;
        this.keyStates = {};
        this.mousePos = {};
        this.mouseSpeed = {};
        

        //this.gameObject.rot = new THREE.Vector3(0, -2.3, 0);
        //this.gameObject.rot = new THREE.Vector3(0, 0, 0); // Change for rot
        this.moveSpeed = 0.2;
        this.rotationSpeed = 0.05;
        this.jumpSpeed = 0.15;
        this.jumping = false;
        this.running = false;
        this.onGround = false;
        this.height = 2.5;
        this.raycaster = new THREE.Raycaster();
    }
    start() {
        this.controller = this.gameObject.controller;
        this.person = this.gameObject.person;
        this.gameObject.vel = new THREE.Vector3(0, 0, 0);
        this.gameObject.rot = new THREE.Vector3(0, 0, 0);
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
        const origin = this.gameObject.pos.clone();
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
        const origin = this.gameObject.pos.clone();
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
        this.controller.update() // Currently does nothing
        this.gameObject.vel.x = 0;
        this.gameObject.vel.z = 0;

        if (this.controller.keyStates['arrowup']) {
            this.gameObject.rot.x += this.rotationSpeed;
        }
        if (this.controller.keyStates['arrowdown']) {
            this.gameObject.rot.x -= this.rotationSpeed;
        }
        if (this.controller.keyStates['arrowleft']) {
            this.gameObject.rot.y += this.rotationSpeed;
        }
        if (this.controller.keyStates['arrowright']) {
            this.gameObject.rot.y -= this.rotationSpeed;
        }

        for (let key in directionMap) {
            if (this.controller.keyStates[key]) {
                this.gameObject.vel.x += this.moveSpeed * directionMap[key].x;
                this.gameObject.vel.z += this.moveSpeed * directionMap[key].z;
            }
        }

        if (this.controller.keyStates[' ']) {
            if (!this.jumping) {
                this.onGround = false;
                //this.controller.keyStates['f'] = false;
                this.gameObject.vel.y = +this.jumpSpeed;
                this.jumping = true;
            }
        }
        if (this.controller.keyStates['f']) {
            //this.controller.keyStates['f'] = false;
            this.gameObject.vel.y +=0.01;
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
        this.gameObject.rot.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.gameObject.rot.x)); // This clamps, do

        const newHeight = this.checkVerticalCollisions();
        
        this.gameObject.vel.y += -this.world.gravity;

        const deltaX = this.gameObject.vel.z * Math.sin(this.gameObject.rot.y) + this.gameObject.vel.x * Math.cos(this.gameObject.rot.y);
        const deltaZ = this.gameObject.vel.z * Math.cos(this.gameObject.rot.y) + this.gameObject.vel.x * -Math.sin(this.gameObject.rot.y);

        const horizontalMovement = this.checkHorizontalCollisions(deltaX, deltaZ);

        this.gameObject.pos.x += horizontalMovement.x;
        this.gameObject.pos.z += horizontalMovement.z;
        this.gameObject.pos.y += this.gameObject.vel.y;

        this.gameObject.object3D.position.x = this.gameObject.pos.x;
        this.gameObject.object3D.position.y = this.gameObject.pos.y;
        this.gameObject.object3D.position.z = this.gameObject.pos.z;
        this.gameObject.object3D.rotation.y = this.gameObject.rot.y;
        if (this.gameObject.camera) this.gameObject.camera.rotation.x = this.gameObject.rot.x; // UNderstand this




        if (this.gameObject.pos.y <= newHeight) {
            this.onGround = true;
            this.gameObject.pos.y = newHeight;
            //this.gameObject.pos.y = 0;
            this.gameObject.vel.y = 0;
            this.jumping = false;
        }

        //this.updateRay();
    }
    updateRay() {
        let velVector = new THREE.Vector3(this.gameObject.vel.x, 0, this.gameObject.vel.z).normalize();
        
        let rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(this.gameObject.rot.y);
    
        let rayDirection = velVector.applyMatrix4(rotationMatrix);
    
        this.raycaster.ray.set(this.gameObject.pos, rayDirection);
    
        let point = this.raycaster.ray.origin.clone().add(rayDirection.multiplyScalar(100));
    
        this.rayLine.geometry.setFromPoints([this.gameObject.pos, point]);
    }
    mouseControl() {
        if (this.controller.mousePos.x !== undefined && this.controller.mousePos.y !== undefined) {
            this.gameObject.rot.x -= this.controller.mouseSpeed.y * 0.001;
            this.gameObject.rot.y -= this.controller.mouseSpeed.x * 0.001;
        }
    }
}