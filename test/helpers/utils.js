'use strict'

const rimraf = require('rimraf')
const os = require('os')
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

function createTestFile (path, data) {
  const stream = fs.createWriteStream(path)
  stream.write(data)
  stream.end()
}

function getTestDirectory () {
  return path.join(os.tmpdir(), `fs.copy-${Date.now()}`)
}

module.exports = {
  removeDirectory,
  emptyDirectory,
  createDirectory,
  createTestFile,
  getTestDirectory
}
