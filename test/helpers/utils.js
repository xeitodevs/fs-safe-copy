'use strict'

const rimraf = require('rimraf')
const os = require('os')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)
const access = promisify(fs.access)

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

function exists (path) {
  return access(path)
}

class Temporizer {
  constructor (maxTime) {
    this._maxTime = maxTime
    this._startTime = null
    this._endTime = null
  }

  startCount () {
    this._startTime = new Date()
  }

  endCount () {
    this._endTime = new Date()
  }

  getDuration () {
    return this._endTime.getTime() - this._startTime.getTime()
  }

  isPassing () {
    return this.getDuration() <= this._maxTime
  }

  getMessage () {
    return `Operation was expected to run in ${this._maxTime}, but it ran for ${this.getDuration()}`
  }
}

module.exports = {
  removeDirectory,
  exists,
  createDirectory,
  createTestFile,
  getTestDirectory,
  Temporizer
}
