const electron = require('electron');
const app = electron.app
const { Menu, Tray } = require('electron');
const { ipcMain } = require('electron');
let { screen } = require('electron');
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const fs = require('fs');
let mainWindow

function createWindow() {
    let factor = screen.getPrimaryDisplay().scaleFactor;
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 860 / 1,
        height: 520 / 1,
        frame: false,
        resizable: false,
        show: false,
        skipTaskbar: true,
        transparent: true, // off animations  // off white background
        fullscreenable: false,
      //  alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.setAlwaysOnTop(true, "dock");
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    mainWindow.on('closed', function () {
        fs.unlinkSync(`${__dirname}\\created.txt`)
        mainWindow = null
    });
    mainWindow.on('session-end', function () {
        fs.unlinkSync(`${__dirname}\\created.txt`)
        mainWindow = null
    });
}
app.allowRendererProcessReuse = true;
app.on('ready', function() {
    

    let created = fs.existsSync(__dirname + `\\created.txt`);
    if (created == true) {
        fs.writeFileSync(__dirname + `\\created.txt`, `was a try to launch 2nd window.`)
        app.quit()
    }
    else {
        createWindow();
        fs.writeFileSync(__dirname + `\\created.txt`, mainWindow.process);
    }
})
 


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
