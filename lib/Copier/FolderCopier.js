'use strict'
const path = require('path')
const fs = require('fs')
const { FileCopier } = require('./FileCopier')
const { TaskQueue } = require('./TaskQueue')
const { promisify } = require('util')
const readDir = promisify(fs.readdir)
const { RecursiveCopyException } = require('../errors/RecursiveCopyException')

class FolderCopier {
  constructor (src, dest) {
    this.src = src
    this.dest = dest
  }

  async copy () {
    if (this.isDestinationSubFolderOfSource()) {
      const msg = `cannot copy '${this.src}' to a subdirectory of itself, '${this.dest}'.`
      throw new RecursiveCopyException(msg)
    }
    await this.copyDir()
  }

  isDestinationSubFolderOfSource () {
    const sourceDirectoryName = path.dirname(this.src)
    const pathSeparator = path.sep
    const destinationBaseFolder = this.dest.split(`${sourceDirectoryName}${pathSeparator}`).pop()
    if (!destinationBaseFolder) {
      return false
    }
    const destBasename = destinationBaseFolder.split(pathSeparator).shift()
    if (!destBasename) {
      return false
    }
    const sourceBasename = path.basename(this.src)
    const areTheSame = this.src === this.dest
    const isIncluded = this.dest.includes(this.src)
    return !areTheSame && isIncluded && destBasename === sourceBasename
  }

  async copyDir () {
    const items = await readDir(this.src)
    this.copyDirItems(items)
  }

  copyDirItems (items) {
    const parallelTasks = 2
    const taskQueue = new TaskQueue({ parallelTasks })
    items.forEach(item => {
      const src = path.join(this.src, item)
      const dest = path.join(this.dest, item)
      const fileCopier = new FileCopier(src, dest)
      taskQueue.pushTask(fileCopier.copy.bind(fileCopier))
    })
  }
}

module.exports = {
  FolderCopier
}
