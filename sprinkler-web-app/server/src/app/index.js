import express from 'express';
import registerControllers from './controllers/index';
import registerMiddleware from './middleware';
import getLogger from '../logging';

const logger = getLogger(__filename);

const app = express();
app.disable('view cache');
logger.info("Express app has been initialized");

registerMiddleware(app);
logger.info("Middleware have been registered");

registerControllers(app);
logger.info("Controllers have been registered");

export default app;