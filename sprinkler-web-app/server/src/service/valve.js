import conn from '../db';
import getLogger from '../logging';
import Valve from '../models/valve';
import config from '../../config';

const logger = getLogger(__filename);

export default {

    getValveComponentId(user) {
        const component = user.components.find(component => (
            component.componentTypeId === config.valveComponentTypeId
        ));
        return component && component.componentId;
    },

    getValveState(component_id, callback) {
        const sql = 'select state from valve_state where component_id=?';
        const values = [component_id];
        conn.query({sql, values}, function (err, res, fields) {
            if (err) {
                logger.error("Failed to fetch the valve state", err);
                callback(err);
            }
            const state = res.length && res[0].state;
            logger.debug("Valve state fetched. State: %s", state, {res, fields});
            callback(null, state);
        });
    },

    getValveUpdateJobCompletionStatus(component_id, callback){
        const sql = 'select id, state, completion_status from valve_remote_switch_job where id=' +
            '(select max(id) from valve_remote_switch_job where component_id=?)';
        const values = [component_id];
        conn.query({sql, values}, function (err, res, fields) {
            if (err) {
                logger.error("Failed to get the jobCompletionStatus valve update job completion jobCompletionStatus", err);
                callback(err);
            }
            const jobId = res.length ? res[0].id : null;
            const jobState = res.length ? res[0].state : 0;
            let jobCompletionStatus = res.length ? res[0].completion_status : 1;
            if (jobCompletionStatus === 0) jobCompletionStatus = 1;
            else if (jobCompletionStatus !== 1) jobCompletionStatus = 0;
            logger.debug("Valve update job completion status fetched", {jobId, jobState, jobCompletionStatus, res, fields});
            callback(null, {jobId, jobState, jobCompletionStatus});
        });
    },

    getValveTimer(component_id, callback) {
        const sql = 'select enabled, start_time, end_time from valve_timer where component_id=?';
        const values = [component_id];
        conn.query({sql, values}, function (err, res, fields) {
            if (err) {
                logger.error("Failed to fetch the valve timer", err);
                callback(err);
            }
            const enabled = res.length > 0 && res[0].enabled === 1;
            const startTime = res.length ? res[0].start_time : null;
            const endTime = res.length ? res[0].end_time : null;
            logger.debug("Valve timer fetched", {res, fields});
            callback(null, enabled, startTime, endTime);
        });
    },

    getValveInfo(component_id, callback) {
        this.getValveState(component_id, (err, state) => {
            if (err) {
                logger.error('Failed to fetch valve info');
                callback(err);
            } else {
                this.getValveUpdateJobCompletionStatus(component_id, (err, {jobState, jobCompletionStatus}) =>{
                    if (err) {
                        logger.error('Failed to fetch valve info');
                        callback(err);
                    } else {
                        this.getValveTimer(component_id, (err, timerEnabled, timerStartTime, timerEndTime) =>{
                            if (err) {
                                logger.error('Failed to fetch valve info');
                                callback(err);
                            } else {
                                const valveInfo = new Valve({state, jobState, jobCompletionStatus, timerEnabled, timerStartTime, timerEndTime});
                                logger.debug("Valve info fetched successfully", valveInfo);
                                callback(null, valveInfo);
                            }
                        });
                    }
                });
            }
        });
    },

    updateValveTimer(component_id, enabled, startTime, endTime, callback){
        const sql = 'delete from valve_timer where component_id=?';
        const values = [component_id];
        conn.query({sql, values}, function (err, res, fields) {
            if (err) {
                logger.error("Failed to delete existing valve timer entries", err);
                callback(err);
            } else {
                logger.info("Deleted all timer entries for component id %d", component_id, {res, fields});
                const sql = 'insert into valve_timer (component_id, enabled, start_time, end_time) values(?, ?, ?, ?)';
                const values = [component_id, enabled, startTime, endTime];
                conn.query({sql, values}, function (err, res, fields) {
                    if (err) {
                        logger.error("Failed to add new valve timer entry", err);
                        callback(err);
                    } else {
                        logger.info("Successfully added new timer entry for component id %d", component_id, {
                            res,
                            fields
                        });
                        callback(null);
                    }
                });
            }
        });
    },

    submitValveStateUpdateRequest(component_id, state, callback) {
        const sql = 'insert into valve_remote_switch_job (component_id, state) values(?, ?)';
        const values = [component_id, state];
        conn.query({sql, values}, function (err, res, fields) {
            if (err) {
                logger.error("Failed to submit  the valve state update job", err);
                callback(err);
            } else {
                const jobId = res.insertId;
                logger.info("Valve state update job submitted successfully. JobId=%d", jobId, {res, fields});
                callback(null, jobId);
            }
        });
    }

};