export class Controller {
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
