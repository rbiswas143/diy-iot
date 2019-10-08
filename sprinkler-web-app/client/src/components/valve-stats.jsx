import React from 'react';
import {connect} from 'react-redux';
import * as FlowActions from '../actions/flow';
import * as FlowService from '../service/flow';

class ValveStatsDumb extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fromTime: props.fromTime,
            toTime: props.toTime
        }
    }

    render() {
        const fromTime = this.state.fromTime;
        const toTime = this.state.toTime;
        const data = this.props.data;

        const totalVolume = data.reduce((sum, row) => (sum + row.volume), 0);
        const totalDuration = data.reduce((sum, row) => (sum + row.duration), 0);

        return (
            <div>
                <h1>Flow statistics</h1>
                From Time : <input type="text" value={fromTime}
                                   onChange={evt => this.setState({fromTime: evt.target.value})}/><br/>
                To Time : <input type="text" value={toTime}
                                 onChange={evt => this.setState({toTime: evt.target.value})}/><br/>
                <button onClick={() => this.props.updateFlowStats(fromTime, toTime)}>
                    Get Stats
                </button>
                <br/>
                <p>Total Duration : <b>{totalDuration} minutes</b></p>
                <p>Water Flow Volume <b>{totalVolume} litres</b></p>
                <h3>Flow Data</h3>
                <table>
                    <thead>
                    <tr>
                        <th key="created">Created</th>
                        <th key="volume">Volume (litres)</th>
                        <th key="duration">Duration (minutes)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(((row, index) => (
                        <tr key={index}>
                            <td>{row.created}</td>
                            <td>{row.volume}</td>
                            <td>{row.duration}</td>
                        </tr>
                    )))}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.flow;
};

const mapDispatchToProps = dispatch => {
    return {
        updateFlowStats: (fromTime, toTime) => {
            FlowService.fetchFlowInfo(fromTime, toTime)
                .then(resp => resp.json())
                .then(function (flowInfo) {
                    console.log('Flow stats fetched from frontend', flowInfo);
                    dispatch(FlowActions.updateFlowInfo(flowInfo));
                })
                .catch(function (err) {
                    console.log('Failed to fetch flow stats:', err);
                });
        }
    }
};

const ValveStats = connect(
    mapStateToProps,
    mapDispatchToProps
)(ValveStatsDumb);
export default ValveStats;
