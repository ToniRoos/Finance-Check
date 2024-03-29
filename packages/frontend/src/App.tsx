import * as React from 'react';
import Main from './components/Main';
import ReactDOM from "react-dom/client";
import 'bootstrap';
import { SettingsProvider } from './stores/settingsStore';
import { ToastContainer } from 'react-toastify';
import { BankAccountStoreProvider } from "./stores/accountDataStore2";
// import { setGlobalUserDataPath } from './logic/helper';
import './styles/_custom.scss';

// const ipcRenderer = require('electron').ipcRenderer;
// ipcRenderer.on('userDataPath', async (event: any, userDataPath: string) => {

//     setGlobalUserDataPath(userDataPath);
//     console.log("User data path: " + userDataPath);

// const helloWorld = await fetch('http://localhost:8080/api/hello-world')
// console.log('helloWorld', helloWorld)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<BankAccountStoreProvider>
    <SettingsProvider>
        <ToastContainer />
        <Main />
    </SettingsProvider>
</BankAccountStoreProvider>);
// });
