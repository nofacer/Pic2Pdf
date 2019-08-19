/*jshint esversion: 6 */

const {
    app,
    BrowserWindow
} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let url;

if (process.env.NODE_ENV === 'DEV') {
    url = 'http://localhost:8080/';
} else {
    url = `file://${__dirname}/dist/index.html`;//${process.cwd() will not work after package
}

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index page of the app.
    win.loadURL(url);
    //win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// For mac os
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});