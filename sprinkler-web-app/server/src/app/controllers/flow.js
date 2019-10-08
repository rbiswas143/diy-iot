import FlowService from '../../service/flow';
import getLogger from '../../logging';
import auth from './../middleware/auth';
import flow from './../middleware/flow';
import valve from './../middleware/valve';

const logger = getLogger(__filename);

export default function registerValveControllers(app) {

    app.get('/flow', auth, flow, (req, res) => {
        const componentId = req.query.flowSensorId;
        const [fromTime, toTime] = [req.query.fromTime, req.query.toTime];
        logger.info("Flow info fetch requested", {component_id: componentId, fromTime, toTime});
        FlowService.getFlowInfo(componentId, fromTime, toTime, (err, flowInfo) => {
            if (err) {
                logger.error('Flow info fetch request failed');
                throw err;
            }
            const flowInfoString = JSON.stringify(flowInfo);
            logger.info('Flow info fetch request completed', {flowInfoString});
            res.send(flowInfoString);
        });
    });

    app.post('/flow/check', auth, flow, valve, (req, res) => {
        const valveId = req.query.valveId;
        const flowSensorId = req.query.flowSensorId;
        logger.info("Flow check requested", {flowId: flowSensorId, valveId});
        FlowService.checkFlow(valveId, flowSensorId, (err, isFlowActive) => {
            if (err) {
                logger.error('Flow check request failed');
                throw err;
            }
            logger.info('Flow check request completed. isFlowActive=%s', isFlowActive);
            res.send({isFlowActive});
        });
    });

};