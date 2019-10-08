import FlowService from '../../service/flow';
import getLogger from '../../logging';

const logger = getLogger(__filename);

export default function flowMiddleware(req, res, next) {
    const flowSensorId = FlowService.getFlowSensorComponentId(req.session.user);
    logger.info("Flow Sensor Id fetched: %s", flowSensorId);
    if (flowSensorId) {
        req.query.flowSensorId = flowSensorId;
        next();
    } else {
        res.sendStatus(401);
    }
}