export let directionMap = {
    'w': new THREE.Vector3(0, 0, -1),
    'a': new THREE.Vector3(-1, 0, 0),
    's': new THREE.Vector3(0, 0, 1),
    'd': new THREE.Vector3(1, 0, 0)
}
export let rotationMap = {

}


export function pauseGame() {
    if (paused) {
        paused = false;
    } else {
        paused = true;
    }
}

export const textureLoader = new THREE.TextureLoader();