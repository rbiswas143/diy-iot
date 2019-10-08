let privateConfig = {};
try {
    privateConfig = require('./config.private');
} catch (ex) {
}
import publicConfig from './config.public';

export default Object.assign({}, publicConfig, privateConfig);