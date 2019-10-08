export default class Valve {

    constructor({state, jobState, jobCompletionStatus, timerEnabled, timerStartTime, timerEndTime}) {
        this._state = state;
        this._jobState = jobState;
        this._jobCompletionStatus = jobCompletionStatus;
        this._timerEnabled = timerEnabled;
        this._timerStartTime = timerStartTime;
        this._timerEndTime = timerEndTime;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get jobState() {
        return this._jobState;
    }

    set jobState(value) {
        this._jobState = value;
    }

    get jobCompletionStatus() {
        return this._jobCompletionStatus;
    }

    set jobCompletionStatus(value) {
        this._jobCompletionStatus = value;
    }

    get timerEnabled() {
        return this._timerEnabled;
    }

    set timerEnabled(value) {
        this._timerEnabled = value;
    }

    get timerStartTime() {
        return this._timerStartTime;
    }

    set timerStartTime(value) {
        this._timerStartTime = value;
    }

    get timerEndTime() {
        return this._timerEndTime;
    }

    set timerEndTime(value) {
        this._timerEndTime = value;
    }

    toJSON() {
        return {
            state: this.state,
            jobState: this.jobState,
            jobCompletionStatus: this.jobCompletionStatus,
            timerEnabled: this.timerEnabled,
            timerStartTime : this.timerStartTime,
            timerEndTime: this.timerEndTime
        }
    }

}