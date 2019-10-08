import {pollValveInfo} from './valve';
import {pollFlowInfo} from './flow';

export default function startPolling(store) {

    const toPoll = [
        {
            method: pollValveInfo,
            paths: ['', '/', '/valve/timer'],
        },
        {
            method: pollFlowInfo,
            paths: ['/valve/stats'],
        }
    ];

    setInterval(() => {
        toPoll.forEach(pollData => {
            if (!pollData || pollData.paths.indexOf(location.pathname) !== -1) {
                console.log('Polling method', pollData.method);
                pollData.method(store);
            }
        });
    }, 10000)
}