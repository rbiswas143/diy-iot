import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import ValveSwitch from './components/valve-switch';
import ValveTimer from './components/valve-timer';
import ValveCheckFlow from './components/valve-check-flow';
import ValveStats from './components/valve-stats';
import TopNav from './components/top-nav';
import LeftPanel from './components/left-panel';

import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';

class App extends React.Component {
    render() {
        return (
            <div>
                <TopNav/>
                <LeftPanel/>
                <Switch>
                    <Route exact path="/" component={ValveSwitch} />
                    <Route path="/valve/timer" component={ValveTimer} />
                    <Route path="/valve/water" component={ValveCheckFlow} />
                    <Route path="/valve/stats" component={ValveStats} />
                </Switch>
            </div>
        );
    }
}


export const renderApp = (store) => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>,
        document.getElementById('sprinkler')
    );

};
