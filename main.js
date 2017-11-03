const {app, BrowserWindow, dialog} = require('electron');
const {autoUpdater} = require('electron-updater');

const debug = /--debug/.test(process.argv[2]);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768, backgroundColor: '#dcdfe5', frame: false});
  mainWindow.maximize();

  // And load the index.html of the app.
  if (!debug) {
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  } else {
    mainWindow.loadURL('http://localhost:8080/');
  }

  if (debug) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    autoUpdater.checkForUpdates();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

autoUpdater.on('update-downloaded', info => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    message: 'A new version (' + info.version + ') of ' + app.getName() + ' has been downloaded',
    details: info.releaseNotes
  }, response => {
    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
