import * as React from 'react';
import Main from './components/Main';
import * as ReactDom from 'react-dom';
import 'bootstrap';
import { DataAccountProvider } from './stores/accountDataStore';
import { SettingsProvider } from './stores/settingsStore';
require('./styles/_custom.scss');

ReactDom.render(<DataAccountProvider>
    <SettingsProvider>
        <Main />
    </SettingsProvider>
</DataAccountProvider>, document.getElementById('root'));

