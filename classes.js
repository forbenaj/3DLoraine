let directionMap = {
    'w': new THREE.Vector3(0, 0, -1),
    'a': new THREE.Vector3(-1, 0, 0),
    's': new THREE.Vector3(0, 0, 1),
    'd': new THREE.Vector3(1, 0, 0)
}
let rotationMap = {

}

class Player {
    constructor(controller, person = "firstperson") {
        this.pos = new THREE.Vector3(5, 2, 5);
        this.vel = new THREE.Vector3(0, 0, 0);
        //this.dir = new THREE.Vector3(0, -2.3, 0);
        this.dir = new THREE.Vector3(0, 0, 0);
        this.moveSpeed = 0.2;
        this.rotationSpeed = 0.05;
        this.jumpSpeed = 0.15;
        this.jumping = false;
        this.running = false;
        this.onGround = false;
        this.height = 2.5;
        this.object = new THREE.Object3D();
        this.object.position.set(0, 0, 0);
        this.controller = controller;
        this.person = person
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        if (this.person === "firstperson") {
            this.object.add(this.camera);
            this.camera.position.set(0, this.height, 0);
            currentCamera = this.camera;
        }
        this.raycaster = new THREE.Raycaster();
        //this.rayLine = this.createRayVisualization();
        //scene.add(this.rayLine);

        this.createModel()

        scene.add(this.object);
    }
    createModel() {
        let pos = new THREE.Vector3(0, 0, 0);
        let size = new THREE.Vector3(1, 2.5, 1);
        let materialInfo = [{
            type: "solid",
            color: 0xff0000
        }]
        let [group, model] = world.createBox(pos, size, materialInfo);
        model.position.set(0, size.y / 2, 0);
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
            const intersections = this.raycaster.intersectObjects(world.objects);
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
            const intersections = this.raycaster.intersectObjects(world.objects);
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
        if (this.controller.keyStates['p']) {
            pauseGame();
        }
        if (this.controller.keyStates['c']) {
            if (this.person === "firstperson") {
                this.person = "thirdperson";
                currentCamera = mainCamera;
            }
            else {
                this.person = "firstperson";
                currentCamera = this.camera;
            }
            this.controller.keyStates['c'] = false;
        }


        this.mouseControl();

        const newHeight = this.checkVerticalCollisions();
        
        this.vel.y += -world.gravity;

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



        if (this.person === "firstperson") {
            currentCamera.rotation.x = this.dir.x;
        }
        else {
            currentCamera.lookAt(player.object.position);
        }

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


function pauseGame() {
    if (paused) {
        paused = false;
    } else {
        paused = true;
    }
}


class World {
    constructor() {
        this.objects = [];
        this.meshes = [];
        this.gravity = 0.005
    }

    addObject(object) {
        this.objects.push(object);
    }

    removeObject(object) {
        this.objects.splice(this.objects.indexOf(object), 1);
    }
    createScene(worldData) {
        const boxes = worldData.boxes;
        for (let i = 0; i < boxes.length; i++) {
            const boxData = boxes[i];
            let [group, box] = this.createBox(boxData.pos, boxData.size, boxData.materialInfo);
            scene.add(group)
            scene.add(box)
        }
        if (worldData.skybox) {
            this.createSkybox(worldData.skybox);
        }
    }
    oldcreateBox(pos, size, materialInfo) {
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        let material = this.createMaterial(materialInfo);
        const box = new THREE.Mesh(geometry, material);
        box.position.x = pos.x+size.x/2;
        box.position.y = pos.y+size.y/2;
        box.position.z = pos.z+size.z/2;
        this.addObject(box);
        return box;
    }

    createBox(pos, size, materialInfo) {
        function createEdges(geometry) {
            const edgesGeometry = new THREE.EdgesGeometry(geometry);
            const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 });
            const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
            return edges;
        }
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

        let materials = this.createMaterial(materialInfo, size);
    
        const box = new THREE.Mesh(geometry, materials);
        
        box.position.x = pos.x + size.x/2;
        box.position.y = pos.y + size.y/2;
        box.position.z = pos.z + size.z/2;

        const edges1 = createEdges(geometry);
        const edges2 = createEdges(geometry.clone().translate(-0.01, 0.01, 0.01));
        const edges3 = createEdges(geometry.clone().translate(0.01, 0.01, -0.01));
        
        edges1.position.copy(box.position);
        edges2.position.copy(box.position);
        edges3.position.copy(box.position);
        
        this.addObject(box);
        
        const group = new THREE.Group();
        group.add(box);
        group.add(edges1);
        group.add(edges2);
        group.add(edges3);
        return [group, box];
    }
    createMaterial(materialInfo, size) {
        let materials = [];
        let faceSizes = [
            new THREE.Vector2(size.z, size.y), // right
            new THREE.Vector2(size.z, size.y), // left
            new THREE.Vector2(size.x, size.z), // top
            new THREE.Vector2(size.x, size.z), // bottom
            new THREE.Vector2(size.x, size.y), // front
            new THREE.Vector2(size.x, size.y) // back
        ];
        for (let i = 0; i < 6; i++) {
            let imgNum = materialInfo.length === 1 ? 0 : i;
            let material = null;
        
            if (materialInfo[imgNum].type === 'image') {
                const texture = textureLoader.load(materialInfo[imgNum].texture);

                const faceSize = faceSizes[i];

                if (materialInfo[imgNum].size !== undefined) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    let repeatX = faceSize.x / materialInfo[imgNum].size.x;
                    let repeatY = faceSize.y / materialInfo[imgNum].size.y;
                    texture.repeat.set(repeatX, repeatY);
                }
        
                if (materialInfo[imgNum].flipY !== undefined) {
                    texture.flipY = materialInfo[imgNum].texture.flipY;
                }
                if (materialInfo[imgNum].wrap !== undefined) {
                    texture.wrapS = materialInfo[imgNum].texture.wrap;
                    texture.wrapT = materialInfo[imgNum].texture.wrap;
                }
                if (materialInfo[imgNum].repeat !== undefined) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    let size = faceSizes[imgNum];
                    let repeatX = size.x / 100;
                    let repeatY = size.y / 100;
                    texture.repeat.set(repeatX, repeatY);
                }
                if (materialInfo[imgNum].offset !== undefined) {
                    texture.offset.set(materialInfo[imgNum].offset.x, materialInfo[imgNum].offset.y);
                }
                if (materialInfo[imgNum].rotation !== undefined) {
                    texture.rotation = materialInfo[imgNum].rotation;
                }
                if (materialInfo[imgNum].position !== undefined) {
                    texture.center.set(materialInfo[imgNum].position.x, materialInfo[imgNum].position.y);
                }
                if (materialInfo[imgNum].scale !== undefined) {
                    texture.repeat.set(materialInfo[imgNum].scale.x, materialInfo[imgNum].scale.y);
                }
                
        
                material = new THREE.MeshBasicMaterial({ map: texture });
        
                if (materialInfo[imgNum].texture.flipY) {
                    material.side = THREE.DoubleSide;
                }
        
            }
            else {
                material = new THREE.MeshBasicMaterial({ color: materialInfo[imgNum].color });
            }
            materials.push(material);
        }
    
        return materials;
    }
    createSkybox(skybox) {
        let textures = [];
        const directions = ["bk", "dn", "ft", "lf", "rt", "up"];
        for (let i = 1; i <= 6; i++) {
            let filename = "";
            if (skybox.mode === "name") {
                let direction = directions[i];
                filename = skybox.base_name + direction + "." + skybox.format;
            }
            else if (skybox.mode === "number") {
                filename = skybox.base_name + i + "." + skybox.format;
            }
            else if (skybox.mode === "single") {
                filename = skybox.base_name + "." + skybox.format;
            }
            textures.push(filename);
        }
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load(textures);
        scene.background = texture;
    }
    update() {
    }
}

class Controller {
    constructor() {
        this.keyStates = {};
        this.mousePos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
        this.mouseSpeed = { x: 0, y: 0 };

        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseStopHandler = this.mouseStopHandler.bind(this);
        document.addEventListener('mousemove', this.mouseMoveHandler);

        this.mouseStopTimeout = null;
        this.stopDelay = 100;
    }

    mouseMoveHandler(event) {
        if (this.mouseStopTimeout) {
            clearTimeout(this.mouseStopTimeout);
        }

        this.mouseSpeed.x = event.movementX;
        this.mouseSpeed.y = event.movementY;

        this.mousePos.x += this.mouseSpeed.x;
        this.mousePos.y += this.mouseSpeed.y;

        this.lastPos.x = this.mousePos.x;
        this.lastPos.y = this.mousePos.y;

        this.mouseStopTimeout = setTimeout(this.mouseStopHandler, this.stopDelay);
    }

    mouseStopHandler() {
        this.mouseSpeed.x = 0;
        this.mouseSpeed.y = 0;
    }

    update() {
    }
}
