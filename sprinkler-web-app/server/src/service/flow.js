import conn from '../db';
import getLogger from '../logging';
import Flow from '../models/flow';
import ValveService from '../service/valve';
import moment from 'moment';
import config from '../../config';

const logger = getLogger(__filename);

export default {

    getFlowSensorComponentId(user) {
        const component = user.components.find(component => (
            component.componentTypeId === config.flowSensorComponentTypeId
        ));
        return component && component.componentId;
    },

    getFlowInfo(component_id, fromTime, toTime, callback) {
        if (!fromTime || !toTime) {
            fromTime = moment().format('YYYY-MM-DD');
            toTime = moment().add(1, 'day').format('YYYY-MM-DD');
        }
        const sql = 'select flow_volume, flow_duration, created from flow_rate where component_id=?' +
            ' and created >= ? and created <= ?';
        const values = [component_id, fromTime, toTime];
        conn.query({sql, values}, function (err, res, fields) {
            if (err) {
                logger.error("Failed to fetch the flow info", err);
                callback(err);
            }
            const data = !res.length ? [] : res.map(row => ({
                volume: row.flow_volume,
                duration: row.flow_duration,
                created: row.created
            }));
            const flowInfo = new Flow({fromTime, toTime, data});
            logger.debug("Flow info fetched", {flowInfo, res, fields});
            callback(null, flowInfo);
        });
    },

    checkFlow(valveId, flowId, callback) {
        ValveService.getValveUpdateJobCompletionStatus(valveId, (err, {jobState}) => {
            if (err) {
                logger.error('Failed to check flow');
                callback(err);
            } else {
                const toggleValve = jobState === 0;
                ((_callback) => {
                    if (toggleValve) {
                        ValveService.submitValveStateUpdateRequest(valveId, 1, _callback);
                    } else {
                        logger.info('Job is already submitted to switch valve on');
                        _callback(null);
                    }
                })((err, newJobId) => {
                    if (err) {
                        logger.error('Failed to check flow');
                        callback(err);
                    } else {
                        const fromTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logger.debug('Flow check start time: %s', fromTime);
                        setTimeout(() => {
                            const toTime = moment().format('YYYY-MM-DD HH:mm:ss');
                            logger.debug('Flow check end time: %s', toTime);
                            this.getFlowInfo(flowId, fromTime, toTime, (err, flowInfo) => {
                                if (err) {
                                    logger.error('Failed to check flow');
                                    callback(err);
                                } else {
                                    const totalVolume = flowInfo.data.reduce((sum, row) => (sum + row.volume), 0);
                                    logger.debug('Flow check total volume: %d', totalVolume);
                                    ((_callback) => {
                                        if (toggleValve) {
                                            ValveService.getValveUpdateJobCompletionStatus(valveId, (err, {jobId}) => {
                                                if (jobId === newJobId) {
                                                    logger.info('Need to close the valve');
                                                    ValveService.submitValveStateUpdateRequest(valveId, 0, err => {
                                                        if (err) {
                                                            logger.error('Failed to check flow');
                                                            _callback(err);
                                                        } else {
                                                            logger.info("Job submitted successfully to close the valve");
                                                            _callback(null);
                                                        }
                                                    });
                                                } else {
                                                    logger.info('A new job %d has been scheduled after the job scheduled by this process %d. ' +
                                                        'No need to close the valve.', jobId, newJobId);
                                                    _callback(null);
                                                }
                                            });
                                        } else {
                                            logger.info('Job was not submitted to open the valve. No need to close it');
                                            _callback(null);
                                        }
                                    })(err => {
                                        if (err) {
                                            logger.error('Failed to check flow');
                                            callback(err);
                                        } else {
                                            const isFlowActive = totalVolume >= 1;
                                            logger.debug('Flow check isFlowActive: %s', isFlowActive);
                                            callback(null, isFlowActive);
                                        }
                                    });
                                }
                            });
                        }, 20000);
                    }
                });
            }
        });
    }
};