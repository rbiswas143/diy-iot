import {combineReducers, createStore} from 'redux';
import valve from './valve';
import flow from './flow';

const appReducer = combineReducers({
    valve,
    flow
});

export default function () {
    return createStore(appReducer);
};
