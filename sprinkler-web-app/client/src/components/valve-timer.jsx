import React from 'react';
import {connect} from 'react-redux';
import * as ValveActions from '../actions/valve';
import * as ValveService from '../service/valve';

class ValveTimerDumb extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timerEnabled: props.timerEnabled,
            timerStartTime: props.timerStartTime || '',
            timerEndTime: props.timerEndTime || ''
        }
    }

    updateTimerStartEndTimes(prop, val) {
        this.setState({
            [prop]: val
        });
    }

    updateTimerEnabled() {
        this.setState({
            timerEnabled: !this.state.timerEnabled
        });
    }

    render() {
        let timerEnabled = this.state.timerEnabled;
        let timerStartTime = this.state.timerStartTime;
        let timerEndTime = this.state.timerEndTime;
        return (
            <div>
                <h2>Valve Timer</h2>
                Enabled : <input type="checkbox" checked={timerEnabled}
                                 onClick={evt => this.setState({timerEnabled: !timerEnabled})}/><br/>
                Start Time : <input type="text" value={timerStartTime} disabled={!timerEnabled}
                                    onChange={evt => this.setState({timerStartTime: evt.target.value})}/><br/>
                End Time : <input type="text" value={timerEndTime} disabled={!timerEnabled}
                                  onChange={evt => this.setState({timerEndTime: evt.target.value})}/><br/>
                <button onClick={() => this.props.updateValveTimer(timerEnabled, timerStartTime, timerEndTime)}>
                    Update
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
        updateValveTimer: (enabled, startTime, endTime) => {
            ValveService.updateValveTimer(enabled, startTime, endTime)
                .then(function () {
                    console.log('Valve timer update request submitted from frontend', {enabled, startTime, endTime});
                    dispatch(ValveActions.updateValveTimer(enabled, startTime, endTime));
                })
                .catch(function (err) {
                    console.log('Failed to update valve timer:', err);
                });
        }
    }
};

const ValveTimer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ValveTimerDumb);
export default ValveTimer;
