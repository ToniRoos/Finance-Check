const { app, BrowserWindow } = require('electron');

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    win.webContents.openDevTools();
    win.loadFile('dist/index.html');
}

app.on('ready', createWindow);