export class Controller {
    constructor(camera) {
        this.keyStates = {};
        this.mousePos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
        this.mouseSpeed = { x: 0, y: 0 };
        this.camera = camera; // TODO: Remove this from here

        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseStopHandler = this.mouseStopHandler.bind(this);
        document.addEventListener('mousemove', this.mouseMoveHandler);

        this.mouseStopTimeout = null;
        this.stopDelay = 100;

        this.setupListeners();
    }

    setupListeners() {
        document.addEventListener('keydown', (event) => {
            this.keyStates[event.key.toLowerCase()] = true;
            if (event.key.toLowerCase() === 'p') {
                game.togglePause();
            }
        });
        document.addEventListener('keyup', (event) => {
            this.keyStates[event.key.toLowerCase()] = false;
        });
        document.addEventListener('mousemove', (event) => {
            this.mousePos.x = event.clientX;
            this.mousePos.y = event.clientY;
        });
        document.addEventListener('mousewheel', (event) => {
            this.camera.fov += event.deltaY * 0.05;
            this.camera.updateProjectionMatrix();
        });
        function requestPointerLock() {
            const element = document.body;
            if (element.requestPointerLock) {
                element.requestPointerLock();
            } else if (element.mozRequestPointerLock) {
                element.mozRequestPointerLock();
            } else if (element.webkitRequestPointerLock) {
                element.webkitRequestPointerLock();
            }
        }

        document.body.addEventListener('click', requestPointerLock);
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
