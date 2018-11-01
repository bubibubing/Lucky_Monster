import App from "../App";
import React, { Component } from 'react';
import Report from "./report/Report";
import CMS from './cms-view/CMS-View';
import { HashRouter, Route } from 'react-router-dom'

class Main extends Component {

    render() {
        return <HashRouter>
            <div>
            <Route exact path='/' component={App}/>
            <Route path='/report' component={Report}/>
            <Route path='/cms' component={CMS}/>
            </div>
        </HashRouter>
    }

}

export default Main;