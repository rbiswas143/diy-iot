import winston from 'winston';
import util from 'util';
import fs from 'fs';
import config from '../config';

const logDir = config.logDir;

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const getFormatter = moduleName => options => (
    util.format('%s [%s] [%s]%s%s',
        new Date(),
        options.level.toUpperCase(),
        moduleName,
        options.message ? util.format(' %s', options.message) : '',
        options.meta && Object.keys(options.meta).length ? util.format('\n\t%s', JSON.stringify(options.meta)) : '')
);

const getModuleName = fileName => (fileName.split(util.format("%s/", config.rootDir))[1]);

export default function getLogger(fileName) {
    const moduleName = getModuleName(fileName);
    return new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                formatter: getFormatter(moduleName),
                colorize: true,
                level: 'debug'
            }), new (require('winston-daily-rotate-file'))({
                formatter: getFormatter(moduleName),
                json: false,
                filename: `${logDir}/-results.log`,
                datePattern: 'yyyy-MM-dd',
                prepend: true,
                level: config.env === 'dev' ? 'debug' : 'info'
            })
        ]
    });
};