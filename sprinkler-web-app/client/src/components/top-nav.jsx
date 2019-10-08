import React from 'react';
import {logout} from '../service/auth';

export default function TopNav(props){
    return (
        <div>
            <b><a href="#">Home</a></b>&nbsp;&nbsp;&nbsp;&nbsp;
            <b><a href="#">My Devices</a></b>&nbsp;&nbsp;&nbsp;&nbsp;
            <b><a href="#" onClick={logout}>Logout</a></b>
        </div>
    );
}