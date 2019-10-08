import React from 'react';
import {connect} from 'react-redux';
import * as FlowActions from '../actions/flow';
import * as FlowService from '../service/flow';

class ValveCheckFlowDumb extends React.Component {

    render() {
        const isFlowActive  = this.props.isFlowActive;
        const checkInProcess = this.props.checkInProcess;

        let flowStateMessage = '';
        if (isFlowActive === true) flowStateMessage += 'Water is flowing!!!';
        else if (isFlowActive === false) flowStateMessage += 'Water is not flowing :(';
        else flowStateMessage += "Don't know";

        let processMessage = '';
        if (checkInProcess === true) processMessage += 'In process';
        else processMessage += 'IDLE';

        return (
            <div>
                <h1>Check Flow</h1>
                <p><b>Flow Status:</b> {flowStateMessage}</p>
                <p><b>Process Status:</b> {processMessage}</p>
                <button onClick={() => this.props.checkFlow()} disabled={checkInProcess}>
                    Check
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isFlowActive: state.flow.isFlowActive,
        checkInProcess: state.flow.checkInProcess
    }
};

const mapDispatchToProps = dispatch => {
    return {
        checkFlow: () => {
            dispatch(FlowActions.updateFlowCheckState(true));
            FlowService.checkFlow()
                .then(res => res.json())
                .then(function ({isFlowActive}) {
                    console.log('Flow check result obtained', isFlowActive);
                    dispatch(FlowActions.updateFlowCheckResult(isFlowActive));
                })
                .catch(function (err) {
                    console.log('Failed to check flow', err);
                })
                .then(() => {
                    dispatch(FlowActions.updateFlowCheckState(false));
                });
        }
    }
};

const ValveCheckFlow = connect(
    mapStateToProps,
    mapDispatchToProps
)(ValveCheckFlowDumb);
export default ValveCheckFlow;
