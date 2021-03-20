import React from 'react';
import DarkTheme from 'react-dark-theme';
import settingsStyles from './Settings.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);

const settings = deta.Base('settings');

const Settings = () => {
    const lightTheme = {
        background: 'white',
        text: 'black',
    };

    const darkTheme = {
        background: 'black',
        text: 'white',
    };

    settings.put(lightTheme, 'light');
    settings.put(darkTheme, 'dark');

    return (
        <main className={settingsStyles.settings_main}>
            <div>
                <DarkTheme light={lightTheme} dark={darkTheme} />
                {/* <h1>settings here</h1> */}
            </div>
        </main>
    );
};

export default Settings;
