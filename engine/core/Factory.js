import { textureLoader } from '../utils.js';

let primitives = {
    box: (size) => new THREE.BoxGeometry(size.x, size.y, size.z),
    sphere: (size) => new THREE.SphereGeometry(size.x, 32, 32),
    cylinder: (size) => new THREE.CylinderGeometry(size.x, size.y, size.z, 32),
    cone: (size) => new THREE.ConeGeometry(size.x, size.y, 32),
    plane: (size) => new THREE.PlaneGeometry(size.x, size.y),
    torus: (size) => new THREE.TorusGeometry(size.x, size.y, 32, 32),
    torusKnot: (size) => new THREE.TorusKnotGeometry(size.x, size.y, 32, 32),
    text: (size) => new THREE.TextGeometry(size.x, size.y, size.z),
    circle: (size) => new THREE.CircleGeometry(size.x, 32),
    dodecahedron: (size) => new THREE.DodecahedronGeometry(size.x, 32),
    octahedron: (size) => new THREE.OctahedronGeometry(size.x, 32),
    tetrahedron: (size) => new THREE.TetrahedronGeometry(size.x, 32)
}

export function oldcreateBox(pos, size, materialInfo) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    let material = createMaterial(materialInfo);
    const box = new THREE.Mesh(geometry, material);
    box.position.x = pos.x+size.x/2;
    box.position.y = pos.y+size.y/2;
    box.position.z = pos.z+size.z/2;
    this.addObject(box);
    return box;
}

export function createBox(meshInfo) { // This is a messy creator just to add borders. Probably should add another kind of renderer instead
    function createEdges(geometry) {
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        return edges;
    }
    let size = meshInfo.size;
    let materialInfo = meshInfo.materialInfo;
    let type = meshInfo.type;
    let geometry = primitives[type](size);

    let materials = createMaterial(materialInfo, size);

    const mesh = new THREE.Mesh(geometry, materials);
    let pos = new THREE.Vector3(0, 0, 0);
    
    mesh.position.x = pos.x + size.x/2;
    mesh.position.y = pos.y + size.y/2;
    mesh.position.z = pos.z + size.z/2;

    const edges1 = createEdges(geometry);
    const edges2 = createEdges(geometry.clone().translate(-0.01, 0.01, 0.01));
    const edges3 = createEdges(geometry.clone().translate(0.01, 0.01, -0.01));
    
    edges1.position.copy(mesh.position);
    edges2.position.copy(mesh.position);
    edges3.position.copy(mesh.position);
    
    const group = new THREE.Group();
    group.add(mesh);
    group.add(edges1);
    group.add(edges2);
    group.add(edges3);
    return [group, mesh];
}
export function createMaterial(materialInfo, size) {
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
export function createSkybox(skybox) {
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
    return texture;
}