import React from 'react';
import { NavLink } from 'react-router-dom'

const activeStyle = {
    fontWeight: 'bold',
    color: 'red'
};

export default function LeftPanel(props){
    return (
        <div>
            <ul>
                <li><NavLink exact activeStyle={activeStyle} to='/'>My Valve</NavLink></li>
                <li><NavLink activeStyle={activeStyle} to='/valve/timer'>Valve Timer</NavLink></li>
                <li><NavLink activeStyle={activeStyle} to='/valve/water'>Check Water</NavLink></li>
                <li><NavLink activeStyle={activeStyle} to='/valve/stats'>Water Flow Statistics</NavLink></li>
            </ul>
        </div>
    );
}