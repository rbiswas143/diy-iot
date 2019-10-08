import path from 'path';
import registerValveControllers from './valve';
import registerFlowControllers from './flow';
import registerAuthControllers from './auth';
import getLogger from '../../logging';
import auth from './../middleware/auth';

const logger = getLogger(__filename);

export default function(app){

    registerValveControllers(app);
    registerFlowControllers(app);
    registerAuthControllers(app);

    app.get('/*', auth, function (req, res) {
        logger.info("Request received for html");
        res.sendFile(path.resolve('client/dist/index.html'));
    });
};