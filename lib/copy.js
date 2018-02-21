'use strict'

const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const mkdirp = require('mkdirp')

const access = promisify(fs.access)
const copyFile = promisify(fs.copyFile)

const { IsTheSameFileException } = require('./errors/IsTheSameFileException')

async function copy (fileSrc, fileDest) {
  const src = path.resolve(fileSrc)
  const dest = path.resolve(fileDest)
  if (src === dest) {
    throw new IsTheSameFileException('source and destination must not be the same')
  }
  const exist = await pathExists(dest)
  if (!exist) {
    await makeParentFolder(dest)
  }
  return startCopy(fileSrc, fileDest)
}

function startCopy (fileSrc, fileDest) {
  return copyFile(fileSrc, fileDest)
}

async function pathExists (path) {
  try {
    await access(path)
    return true
  } catch (err) {
    return false
  }
}

function makeParentFolder (dest) {
  const parentFolder = path.dirname(dest)
  return new Promise((resolve, reject) => {
    mkdirp(parentFolder, err => {
      if (err) {
        return reject(new Error('impossible create folders'))
      }
      resolve()
    })
  })
}

module.exports = {
  copy,
  safeCopy: () => {
    // check sum file
  },
  pathExists
}
