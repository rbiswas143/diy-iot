import mysql from 'mysql';
import config from '../config';
import getLogger from './logging';

const logger = getLogger(__filename);

const conn = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
});

conn.connect(() => {
    logger.info("Database connection established");
});

export default conn;