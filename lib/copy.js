'use strict'

const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const mkdirp = require('mkdirp')
const { FileStat } = require('./Copier/FileStat')
const { FileCopier } = require('./Copier/FileCopier')
const { FolderCopier } = require('./Copier/FolderCopier')
const { fileEqual } = require('./Checksum/fileCheckSum')
const fsAccess = promisify(fs.access)

const { IsTheSameFileException } = require('./errors/IsTheSameFileException')
const { CorruptOperationException } = require('./errors/CorruptOperationException')
const { FileCopyException } = require('./errors/FileCopyException')

async function copy (fileSrc, fileDest) {
  const src = path.resolve(fileSrc)
  const dest = path.resolve(fileDest)
  if (src === dest) {
    throw new IsTheSameFileException('source and destination must not be the same')
  }
  const isDirectory = await new FileStat(fileSrc).isDirectory()
  if (isDirectory) {
    return startCopyDirectory(fileSrc, fileDest)
  }
  return startCopyFile(fileSrc, fileDest)
}

async function startCopyDirectory (fileSrc, fileDest) {
  const exist = await pathExists(fileDest)
  if (!exist) {
    await makeParentFolder(fileDest)
  }
  return new FolderCopier(fileSrc, fileDest).copy()
}

async function startCopyFile (fileSrc, fileDest) {
  const exist = await pathExists(fileDest)
  if (!exist) {
    const parentFolder = path.dirname(fileDest)
    await makeParentFolder(parentFolder)
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
  return new Promise((resolve, reject) => {
    mkdirp(dest, err => {
      if (err) {
        return reject(new Error('impossible to create folders'))
      }
      resolve()
    })
  })
}

async function safeCopy (src, dest, algorithm = 'md5') {
  const isDirectory = await new FileStat(src).isDirectory()
  if (isDirectory) {
    throw new FileCopyException('Cannot safe copy directories')
  }
  await copy(src, dest)
  const areEqual = await fileEqual(src, dest, algorithm)
  if (!areEqual) {
    throw new CorruptOperationException('Something changed the files just after operation')
  }
}

module.exports = {
  copy,
  safeCopy,
  pathExists
}
