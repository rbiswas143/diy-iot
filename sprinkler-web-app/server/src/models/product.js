export default class Product {

    constructor({productId, productTypeId}) {
        this._productId = productId;
        this._productTypeId = productTypeId;
    }

    get productId() {
        return this._productId;
    }

    set productId(value) {
        this._productId = value;
    }

    get productTypeId() {
        return this._productTypeId;
    }

    set productTypeId(value) {
        this._productTypeId = value;
    }

    toJSON(){
        return {
            productId: this.productId,
            productTypeId: this.productTypeId
        }
    }
}