'use strict'

const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const mkdirp = require('mkdirp')
const { FileCopier } = require('./Copier/FileCopier')
const { FolderCopier } = require('./Copier/FolderCopier')

const fsAccess = promisify(fs.access)
const fsStat = promisify(fs.stat)

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

async function startCopy (fileSrc, fileDest) {
  const stat = await fsStat(fileSrc)
  if (stat.isDirectory()) {
    return new FolderCopier().copy(fileSrc, fileDest)
  }
  return new FileCopier(fileSrc, fileDest).copy()
}

async function pathExists (path) {
  try {
    await fsAccess(path)
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
        return reject(new Error('impossible to create folders'))
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
