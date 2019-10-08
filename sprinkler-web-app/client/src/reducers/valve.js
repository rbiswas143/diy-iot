import {
    UPDATE_VALVE_STATE,
    UPDATE_JOB_STATUS,
    UPDATE_VALVE_TIMER
} from '../actions/valve';

const defaultValveState = {
    state: 0,
    jobState: 0,
    jobCompletionStatus: 1,
    timerEnabled: null,
    timerStartTime: null,
    timerEndTime: null
};

export default function (state = defaultValveState, action) {
    const nextState = Object.assign({}, state);
    switch (action.type) {
        case UPDATE_VALVE_STATE:
            nextState.state = action.state === 1 ? 1 : 0;
            break;
        case UPDATE_JOB_STATUS:
            nextState.jobCompletionStatus = action.status === 0 ? 0 : 1;
            nextState.jobState = action.state === 1 ? 1 : 0;
            break;
        case UPDATE_VALVE_TIMER:
            nextState.timerEnabled = action.enabled;
            if(nextState.timerEnabled) {
                nextState.timerStartTime = action.startTime;
                nextState.timerEndTime = action.endTime;
            }else{
                nextState.startTime = nextState.endTime = null;
            }
    }
    return nextState;
};
