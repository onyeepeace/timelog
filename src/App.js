import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import TimeSheet from './pages/TimeSheet';
import Report from './pages/Report';
import Projects from './pages/Projects';

function App() {
    return (
        <BrowserRouter>
            <div className='App'>
                <Navigation />
                <Switch>
                    <Route path='/' component={TimeSheet} exact />
                    <Route path='/report' component={Report} />
                    <Route path='/projects' component={Projects} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
