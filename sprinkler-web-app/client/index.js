import createStore from './src/reducers';
import {renderApp} from './src/app';
import * as ValveService from './src/service/valve';
import * as FlowService from './src/service/flow';
import startPolling from './src/service/poll';

const store = createStore();

Promise.all([
    ValveService.pollValveInfo(store),
    FlowService.pollFlowInfo(store)
]).then(() => {
    renderApp(store);
    startPolling(store);
});
