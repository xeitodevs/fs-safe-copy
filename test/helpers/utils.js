'use strict'

const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)
function remove (directoryPath) {
  return new Promise((resolve, reject) => {
    rimraf(directoryPath, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

function checkDirectoryPath (directoryPath) {
  if (typeof directoryPath !== 'string') {
    throw new Error('directory path not valid')
  }
}

function emptyDirectory (directoryPath) {
  checkDirectoryPath(directoryPath)
  return remove(path.join(directoryPath, '*'))
}

function removeDirectory (directoryPath) {
  checkDirectoryPath(directoryPath)
  return remove(path.join(directoryPath))
}

function createDirectory (directoryPath) {
  checkDirectoryPath(directoryPath)
  return mkdir(path.join(directoryPath))
}

module.exports = {
  removeDirectory,
  emptyDirectory,
  createDirectory
}