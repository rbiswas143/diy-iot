import path from 'path';

export default {
    env: 'dev',
    appPort: 3000,
    logDir: 'log',
    rootDir: path.resolve(__dirname, '../'),
    dbHost: '',
    dbUser: '',
    dbPassword: '',
    dbName: 'sprinkler',
    socketClientUpdateInterval: 5000,
    valveComponentTypeId: 1,
    flowSensorComponentTypeId: 2,
}