import React from 'react';
import {connect} from 'react-redux';
import * as ValveActions from '../actions/valve';
import * as ValveService from '../service/valve';

class ValveSwitchDumb extends React.Component {

    render() {
        const state = this.props.state;
        const jobState = this.props.jobState;
        const jobCompletionStatus = this.props.jobCompletionStatus;

        const valveStateMessage = state === 1 ? 'ON' : 'OFF';
        const buttonMessage = state === 1 ? 'OFF' : 'ON';
        const buttonDisabled = jobCompletionStatus === 0;
        const cancelDisabled = jobCompletionStatus === 1 || state === jobState;

        let currentMessage = '';
        if (jobCompletionStatus === 1) currentMessage += "No jobs pending";
        else {
            currentMessage += `Trying to switch the valve ${buttonMessage}...`;
            if (state !== jobState) currentMessage += 'PENDING';
            else currentMessage += 'CANCELLING';
        }

        return (
            <div>
                <h1>Valve Interface</h1>
                <p><b>Valve State:</b> {valveStateMessage}</p>
                <p><b>Message:</b> {currentMessage}</p>
                <button onClick={() => this.props.submitValveStateUpdateJob(state === 1 ? 0 : 1)}
                        disabled={buttonDisabled}>{buttonMessage}
                </button>
                <button onClick={() => this.props.submitValveStateUpdateJob(state === 1 ? 1 : 0)}
                        disabled={cancelDisabled}>Cancel
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.valve;
};

const mapDispatchToProps = dispatch => {
    return {
        submitValveStateUpdateJob: state => {
            ValveService.submitValveStateUpdateJob(state)
                .then(function () {
                    console.log('Valve state update job submitted from frontend', state);
                    dispatch(ValveActions.updateJobStatus(state, 0));
                })
                .catch(function (err) {
                    console.log('Failed to update valve state:', err);
                });
        }
    }
};

const ValveSwitch = connect(
    mapStateToProps,
    mapDispatchToProps
)(ValveSwitchDumb);
export default ValveSwitch;
