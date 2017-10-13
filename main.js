if(require('electron-squirrel-startup')) return;

const electron = require('electron')
const {dialog} = require('electron')

// Module to control application life.
const app = electron.app

const debug = /--debug/.test(process.argv[2])

function checkForUpdates() {
  const GhReleases = require('electron-gh-releases')

  let options = {
    repo: 'dougmaitelli/StoreControl',
    currentVersion: app.getVersion()
  }

  const updater = new GhReleases(options)

  // Check for updates
  // `status` returns true if there is a new update available
  updater.check((err, status) => {
    if (!err && status) {
      // Download the update
      updater.download();
    }
  });

  // When an update has been downloaded
  updater.on('update-downloaded', (info) => {
    dialog.showMessageBox({
    			type: 'question',
    			buttons: ['Install and Relaunch', 'Later'],
    			defaultId: 0,
    			message: 'A new version (' + info[2] + ') of ' + app.getName() + ' has been downloaded'
    		}, response => {
    			if (response === 0) {
            // Restart the app and install the update
    				updater.install();
    			}
    });
  });

  updater.on('error', (err) => {
    dialog.showMessageBox({message: JSON.stringify(err), buttons: ["OK"]});
  });
}

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768, frame: false});

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  if (debug) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    checkForUpdates();
  }

  mainWindow.maximize();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
