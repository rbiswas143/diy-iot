import app from './src/app/index';
import http from 'http';
import getLogger from './src/logging';
import config from './config';

const logger = getLogger(__filename);
const httpServer = http.Server(app);

httpServer.listen(config.appPort, function () {
    logger.info('App has been started. Listening on port %d' , config.appPort);
});