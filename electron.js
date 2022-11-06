const { app, BrowserWindow } = require('electron');
const { main } = require('./packages/backend/dist')

const userDataPath = app.getPath('userData');
main({ dataPath: userDataPath })

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            nodeIntegration: true
        },
        title: "Finance Check"
    });

    // and load the index.html of the app.
    // win.webContents.openDevTools();
    win.loadFile('packages/frontend/dist/index.html');

    win.webContents.on('dom-ready', () => {
        win.webContents.send('userDataPath', userDataPath);
    });
}

app.on('ready', createWindow);
