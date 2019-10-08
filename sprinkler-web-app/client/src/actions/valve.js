export const UPDATE_VALVE_STATE = 'UPDATE_VALVE_STATE';
export const UPDATE_JOB_STATUS = 'UPDATE_JOB_STATUS';
export const UPDATE_VALVE_TIMER = 'UPDATE_VALVE_TIMER';

export const updateValveState = state => {
	return {
		type: UPDATE_VALVE_STATE,
        state
	}
};

export const updateJobStatus = (state, status) => {
    return {
        type: UPDATE_JOB_STATUS,
        state,
        status
    }
};

export const updateValveTimer = (enabled, startTime, endTime) => {
    return {
        type: UPDATE_VALVE_TIMER,
        enabled,
        startTime,
        endTime
    }
};
