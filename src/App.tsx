import * as React from 'react';
import Main from './components/Main';
import * as ReactDom from 'react-dom';
import 'bootstrap';
import { DataAccountProvider } from './stores/accountDataStore';
import { SettingsProvider } from './stores/settingsStore';
import { ToastContainer } from 'react-toastify';
import { setGlobalUserDataPath } from './logic/helper';
require('./styles/_custom.scss');

const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('userDataPath', (event: any, userDataPath: string) => {

    setGlobalUserDataPath(userDataPath);
    console.log("User data path: " + userDataPath);

    ReactDom.render(<DataAccountProvider>
        <SettingsProvider>
            <ToastContainer />
            <Main />
        </SettingsProvider>
    </DataAccountProvider>, document.getElementById('root'));
});
