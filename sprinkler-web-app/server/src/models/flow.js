export default class Flow {

    constructor({fromTime, toTime, data}) {
        this._fromTime = fromTime;
        this._toTime = toTime;
        this._data = data;
    }

    get fromTime() {
        return this._fromTime;
    }

    set fromTime(value) {
        this._fromTime = value;
    }

    get toTime() {
        return this._toTime;
    }

    set toTime(value) {
        this._toTime = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    toJSON() {
        return {
            fromTime: this.fromTime,
            toTime: this.toTime,
            data: this.data
        }
    }

}