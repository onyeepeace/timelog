import React from 'react';
import { ThemeContext } from '../theme-context'
import settingsStyles from './Settings.module.css';

const Settings = () => {
    const { theme, toggle, dark } = React.useContext(ThemeContext)

    return (
        <main className={settingsStyles.settings_main}>
            <div>
                <button
                    type="button"
                    onClick={toggle}
                    style={{
                        backgroundColor: theme.backgroundColor,
                        color: theme.color,
                        outline: 'none'
                    }}
                    >
                    Toggle to {!dark ? 'Dark' : 'Light'} theme
                </button>
                <p></p>
            </div>
        </main>
    );
};

export default Settings;