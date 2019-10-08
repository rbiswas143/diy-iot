import {
    UPDATE_FLOW_INFO,
    UPDATE_FLOW_CHECK_RESULT,
    UPDATE_FLOW_CHECK_STATE
} from "../actions/flow";

const defaultFlowInfo = {
    date: new Date(),
    data: [],
    checkInProcess: false,
    isFlowActive: null
};

export default function (state = defaultFlowInfo, action) {
    let nextState = Object.assign({}, state);
    nextState.data = Object.assign([], state.data);
    switch (action.type) {
        case UPDATE_FLOW_INFO:
            nextState.fromTime = action.fromTime;
            nextState.toTime = action.toTime;
            nextState.data = action.data;
            break;
        case UPDATE_FLOW_CHECK_STATE:
            nextState.checkInProcess = action.checkInProcess === true;
            break;
        case UPDATE_FLOW_CHECK_RESULT:
            nextState.isFlowActive = action.isFlowActive;
            break;
    }
    return nextState;
};
