export class Component {
    constructor(name = null) {
        this.name = name || this.constructor.name;
        this.gameObject = null;
        this.world = null;
        this.enabled = true;
    }

    init(gameObject) {
        this.gameObject = gameObject;
        this.world = gameObject.world;
        this.start();
    }

    start() {}
    update(delta) {}
    destroy() {}
    onEnable() {}
    onDisable() {}
}
