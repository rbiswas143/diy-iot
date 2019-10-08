export default class Component {

    constructor({componentId, componentTypeId, productId}) {
        this._componentId = componentId;
        this._componentTypeId = componentTypeId;
        this._productId = productId;
    }

    get componentId() {
        return this._componentId;
    }

    set componentId(value) {
        this._componentId = value;
    }

    get componentTypeId() {
        return this._componentTypeId;
    }

    set componentTypeId(value) {
        this._componentTypeId = value;
    }

    get productId() {
        return this._productId;
    }

    set productId(value) {
        this._productId = value;
    }

    toJSON(){
        return {
            componentId: this.componentId,
            componentTypeId: this.componentTypeId,
            productId: this.productId
        }
    }
}