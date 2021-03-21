import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import TimeSheet from './pages/TimeSheet';
import Report from './pages/Report';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import { ThemeContext } from './theme-context'

function App() {
    const { theme, toggle, dark } = React.useContext(ThemeContext)
    document.documentElement.style.backgroundColor = theme.backgroundColor
    document.documentElement.style.color = theme.color
    return (
        <BrowserRouter>
            <div className='App'>
                <Navigation />
                <Switch>
                    <Route path='/' component={TimeSheet} exact />
                    <Route path='/report' component={Report} />
                    <Route path='/projects' component={Projects} />
                    <Route path='/settings' component={Settings} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
