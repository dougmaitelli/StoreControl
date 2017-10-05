#!/usr/bin/env node

var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: './release/StoreControl-win32-ia32',
  outputDirectory: './release/installer',
  authors: 'Me',
  exe: 'StoreControl.exe',
  noMsi: true
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
