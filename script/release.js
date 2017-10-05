#!/usr/bin/env node

const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

const version = require('../package').version

zipAssets().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})


function zipAsset (asset) {
  return new Promise((resolve, reject) => {
    const assetBase = path.basename(asset.path)
    const assetDirectory = path.dirname(asset.path)
    console.log(`Zipping ${assetBase} to ${asset.name}`)

    if (!fs.existsSync(asset.path)) {
      return reject(new Error(`${asset.path} does not exist`))
    }

    const zipCommand = `zip --recurse-paths --symlinks '${asset.name}' '${assetBase}'`
    const options = {cwd: assetDirectory, maxBuffer: Infinity}
    childProcess.exec(zipCommand, options, (error) => {
      if (error) {
        reject(error)
      } else {
        asset.path = path.join(assetDirectory, asset.name)
        resolve(asset)
      }
    })
  })
}

function zipAssets () {
  const outPath = path.join(__dirname, '..', 'out')

  const zipAssets = [{
    name: 'StoreControl-mac.zip',
    path: path.join(outPath, 'StoreControl-darwin-x64', 'StoreControl.app')
  }, {
    name: 'StoreControl-windows.zip',
    path: path.join(outPath, 'StoreControl-win32-ia32')
  }, {
    name: 'StoreControl-linux.zip',
    path: path.join(outPath, 'StoreControl-linux-x64')
  }]

  return Promise.all(zipAssets.map(zipAsset)).then((zipAssets) => {
    return zipAssets.concat([{
      name: 'RELEASES',
      path: path.join(outPath, 'windows-installer', 'RELEASES')
    }, {
      name: 'StoreControlSetup.exe',
      path: path.join(outPath, 'windows-installer', 'StoreControlSetup.exe')
    }, {
      name: `TaDaNaN-${version}-full.nupkg`,
      path: path.join(outPath, 'windows-installer', `StoreControl-${version}-full.nupkg`)
    }])
  })
}
