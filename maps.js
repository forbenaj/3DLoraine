export const first_world = {
    boxes: [
        {   // floor
            pos: { x: 0, y: -1, z: 0 },
            size: { x: 10, y: 1, z: 10 },
            materialInfo: {
                type: "color",
                color:0xacedba
            }
        },
        {   // wall west
            pos: { x: -1, y: 0, z: 0 },
            size: { x: 1, y: 5, z: 10 },
            materialInfo: {
                type: "color",
                color:0xadbaaa
            }
        },
        {   // wall east
            pos: { x: 10, y: 0, z: 0 },
            size: { x: 1, y: 5, z: 10 },
            materialInfo: {
                type: "color",
                color:0xabeced
            }
        },
        {   // wall north
            pos: { x: 0, y: 0, z: -1 },
            size: { x: 10, y: 5, z: 1 },
            materialInfo: {
                type: "color",
                color:0xfabebe
            }
        },
        {   // wall south
            pos: { x: 0, y: 0, z: 10 },
            size: { x: 10, y: 5, z: 1 },
            materialInfo: {
                type: "color",
                color:0xabebac
            }
        }
    ]
}

export const map1 = {
    boxes: [
        {   // floor
            pos: { x: 0, y: -1, z: 0 },
            size: { x: 30, y: 1, z: 30 },
            materialInfo: {
                type: "solid",
                color:0xacedba
            }
        },
        {   // wall west
            pos: { x: -1, y: 0, z: 0 },
            size: { x: 1, y: 5, z: 30 },
            materialInfo: {
                type: "solid",
                color:0xadbaaa
            }
        },
        {   // wall east
            pos: { x: 30, y: 0, z: 0 },
            size: { x: 1, y: 5, z: 30 },
            materialInfo: {
                type: "solid",
                color:0xabeced
            }
        },
        {   // wall north
            pos: { x: 0, y: 0, z: -1 },
            size: { x: 30, y: 5, z: 1 },
            materialInfo: {
                type: "solid",
                color:0xfabebe
            }
        },
        {   // wall south
            pos: { x: 0, y: 0, z: 30 },
            size: { x: 30, y: 5, z: 1 },
            materialInfo: {
                type: "solid",
                color:0xabebac
            }
        },
        {   // middle box
            pos: { x: 10, y: 0, z: 10 },
            size: { x: 10, y: 2, z: 10 },
            materialInfo: {
                type: "solid",
                color:0xdabaff
            }
        },
        {   // ceiling
            pos: { x: 0, y: 150, z: 0 },
            size: { x: 30, y: 1, z: 30 },
            materialInfo: {
                type: "solid",
                color:0xadbaaa
            }

        }
    ]
}


export const map2 = {
    skybox: {
        base_name: "textures/skybox/grid",
        format: "png",
        mode: "single"
    },
    boxes: [
        {   // floor
            pos: { x: 0, y: -1, z: 0 },
            size: { x: 150, y: 1, z: 150 },
            materialInfo: [
                {
                    type: "image",
                    texture: "textures/grass.png",
                    size: new THREE.Vector2(10, 10),
                    position: new THREE.Vector3(0, 0, 0)
                }
            ]
        },
        {   // wall west
            pos: { x: -1, y: 0, z: 0 },
            size: { x: 1, y: 15, z: 150 },
            materialInfo: [
                {
                    type: "image",
                    texture: "textures/bricks.png",
                    size: new THREE.Vector2(4, 4),
                    position: new THREE.Vector3(0, 0, 0),
                }
            ]
        },
        {   // wall east
            pos: { x: 150, y: 0, z: 0 },
            size: { x: 1, y: 15, z: 150 },
            materialInfo: [
                {
                    type: "image",
                    texture: "textures/bricks.png",
                    size: new THREE.Vector2(4, 4),
                    position: new THREE.Vector3(0, 0, 0),
                }
            ]
        },
        {   // wall north
            pos: { x: 0, y: 0, z: -1 },
            size: { x: 150, y: 15, z: 1 },
            materialInfo: [
                {
                    type: "image",
                    texture: "textures/bricks.png",
                    size: new THREE.Vector2(4, 4),
                    position: new THREE.Vector3(0, 0, 0),
                }
            ]
        },
        {   // wall south
            pos: { x: 0, y: 0, z: 150 },
            size: { x: 150, y: 15, z: 1 },
            materialInfo: [
                {
                    type: "image",
                    texture: "textures/bricks.png",
                    size: new THREE.Vector2(4, 4),
                    position: new THREE.Vector3(0, 0, 0),
                }
            ]
        },
        {   // middle box
            pos: { x: 65, y: 0, z: 65 },
            size: { x: 20, y: 30, z: 20 },
            materialInfo: [
                {
                    type: "solid",
                    color:"red"
                },
                {
                    type: "solid",
                    color:"green"
                },
                {
                    type: "solid",
                    color:"blue"
                },
                {
                    type: "solid",
                    color:"yellow"
                },
                {
                    type: "solid",
                    color:"purple"
                },
                {
                    type: "solid",
                    color:"orange"
                }
            ]
        },
        {   // ceiling
            pos: { x: 0, y: 150, z: 0 },
            size: { x: 30, y: 1, z: 30 },
            materialInfo: [
                {
                    type: "solid",
                    color:0xadbaaa
                }
            ]
        },
        {   // testcube
            pos: { x: 2, y: 2, z: 2 },
            size: { x: 1, y: 2, z: 3 },
            materialInfo: [
                {
                    type: "image",
                    texture: "textures/benaj.png",
                    size: new THREE.Vector2(1, 1),
                    position: new THREE.Vector3(0, 0, 0)
                }
            ]
        }
    ]
}
