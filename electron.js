const { app, BrowserWindow } = require('electron');

const userDataPath = app.getPath('userData');

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
    win.loadFile('dist/index.html');

    win.webContents.on('dom-ready', () => {
        win.webContents.send('userDataPath', userDataPath);
    });
}

app.on('ready', createWindow);
