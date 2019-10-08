export default class User {

    constructor({userId, username, products, components}) {
        this._userId = userId;
        this._username = username;
        this._products = products;
        this._components = components;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get products() {
        return this._products;
    }

    set products(value) {
        this._products = value;
    }

    get components() {
        return this._components;
    }

    set components(value) {
        this._components = value;
    }

    toJSON() {
        return {
            userId: this.userId,
            username: this.username,
            products: this.products,
            components: this.components
        }
    }

}