export const UPDATE_FLOW_INFO = 'UPDATE_FLOW_INFO';
export const UPDATE_FLOW_CHECK_STATE = 'UPDATE_FLOW_CHECK_STATE';
export const UPDATE_FLOW_CHECK_RESULT = 'UPDATE_FLOW_CHECK_RESULT';

export const updateFlowInfo = ({fromTime, toTime, data}) => {
    return {
        type: UPDATE_FLOW_INFO,
        fromTime,
        toTime,
        data
    }
};

export const updateFlowCheckState= (checkInProcess) => {
   return {
       type: UPDATE_FLOW_CHECK_STATE,
       checkInProcess
   }
};

export const updateFlowCheckResult = (isFlowActive) => {
    return {
        type: UPDATE_FLOW_CHECK_RESULT,
        isFlowActive
    }
};