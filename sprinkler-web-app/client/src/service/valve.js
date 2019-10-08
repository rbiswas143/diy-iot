import {
    updateValveState,
    updateJobStatus,
    updateValveTimer as updateValveTimerAction
} from '../actions/valve'

export const submitValveStateUpdateJob = state => {
    return fetch('/valve/job', {
        method: 'post',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({state})
    });
};

export const updateValveTimer = (enabled, startTime, endTime) => {
    return fetch('/valve/timer', {
        method: 'post',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({enabled, startTime, endTime})
    });
};

export const fetchValveInfo = () => {
    return fetch('/valve', {
        method: 'get',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

export const dispatchValveInfoUpdates = (store, valveInfo) => {
    store.dispatch(updateValveState(valveInfo.state));
    store.dispatch(updateJobStatus(valveInfo.jobState, valveInfo.jobCompletionStatus));
    store.dispatch(updateValveTimerAction(valveInfo.timerEnabled, valveInfo.timerStartTime, valveInfo.timerEndTime));
};

export const pollValveInfo = (store) => {
    console.log('Polling valve info');
    return fetchValveInfo()
        .then(res => res.json())
        .then(valveInfo => {
            dispatchValveInfoUpdates(store, valveInfo);
        })
        .catch((ex) => {
            console.log('Failed to poll valve info');
            console.log(ex);
        })
};
