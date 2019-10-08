import ValveService from '../../service/valve';
import getLogger from '../../logging';
import auth from './../middleware/auth';
import valve from './../middleware/valve';

const logger = getLogger(__filename);

export default function registerValveControllers(app) {

    app.get('/valve', auth, valve, (req, res) => {
        const componentId = req.query.valveId;
        logger.info("Valve info fetch requested", {componentId});

        ValveService.getValveInfo(componentId, (err, valveInfo) => {
            if (err) {
                logger.error('Valve info fetch request failed');
                throw err;
            }
            const valveInfoString = JSON.stringify(valveInfo);
            logger.info('Valve info fetch request completed', {valveInfoString});
            res.send(valveInfoString);
        });

    });

    app.post('/valve/job', auth, valve, (req, res) => {
        const componentId = req.query.valveId;
        const nextState = req.body.state;
        logger.info("Valve state update job submission requested", {componentId, nextState});

        ValveService.submitValveStateUpdateRequest(componentId, nextState, err => {
            if (err) {
                logger.error('Valve state update job submission request failed');
                throw err;
            }
            logger.info("Valve state update job has been submitted successfully");
            res.end();
        });

    });

    app.post('/valve/timer', auth, valve, (req, res) => {
        const componentId = req.query.valveId;
        const enabled = req.body.enabled;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        logger.info("Valve timer update requested", {componentId, enabled, startTime, endTime});

        ValveService.updateValveTimer(componentId, enabled, startTime, endTime, err => {
            if (err) {
                logger.error('Valve timer update request failed');
                throw err;
            }
            logger.info("Valve timer has been updated successfully");
            res.end();
        });

    });

};