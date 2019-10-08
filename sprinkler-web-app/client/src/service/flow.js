import {updateFlowInfo} from '../actions/flow';

export const fetchFlowInfo = (fromTime, toTime) => {
    let url = '/flow';
    if (fromTime && toTime) url += `?fromTime=${fromTime}&toTime=${toTime}`;
    return fetch(url, {
        method: 'get',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

export const checkFlow = () => {
    return fetch('/flow/check', {
        method: 'post',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

export const dispatchFlowInfoUpdates = (store, flowInfo) => {
    store.dispatch(updateFlowInfo(flowInfo));
};

export const pollFlowInfo = (store) => {
    const state = store.getState();
    const fromTime = state.flow.fromTime;
    const toTime = state.flow.toTime;
    console.log('Polling flow info for fromTime and toTime', fromTime, toTime);
    return fetchFlowInfo(fromTime, toTime)
        .then(res => res.json())
        .then(flowInfo => {
            dispatchFlowInfoUpdates(store, flowInfo);
        })
        .catch((ex) => {
            console.log('Failed to poll flow info');
            console.log(ex);
        })
};