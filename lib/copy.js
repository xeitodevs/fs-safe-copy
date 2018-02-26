'use strict'

const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const mkdirp = require('mkdirp')
const { FileCopier } = require('./Copier/FileCopier')
const { FolderCopier } = require('./Copier/FolderCopier')
const { fileEqual } = require('./Checksum/fileCheckSum')
const fsAccess = promisify(fs.access)
const fsStat = promisify(fs.stat)

const { IsTheSameFileException } = require('./errors/IsTheSameFileException')
const { CorruptOperationException } = require('./errors/CorruptOperationException')
const { FileCopyException } = require('./errors/FileCopyException')

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

async function safeCopy (src, dest, algo = 'md5') {
  const stat = await fsStat(src)
  if (stat.isDirectory()) {
    throw new FileCopyException('Cannot safe copy directories')
  }
  await copy(src, dest)
  const areEqual = await fileEqual(src, dest, algo)
  if (!areEqual) {
    throw new CorruptOperationException('Something changed the files just after operation')
  }
}

module.exports = {
  copy,
  safeCopy,
  pathExists
}
