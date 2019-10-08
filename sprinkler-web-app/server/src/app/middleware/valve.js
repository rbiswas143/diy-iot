import ValveService from '../../service/valve';
import getLogger from '../../logging';

const logger = getLogger(__filename);

export default function valveMiddleware(req, res, next) {
    const valveId = ValveService.getValveComponentId(req.session.user);
    logger.info("Valve Id fetched: %s", valveId);
    if (valveId) {
        req.query.valveId = valveId;
        next();
    } else {
        res.sendStatus(401);
    }
}